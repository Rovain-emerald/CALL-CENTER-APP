import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import { deductCredits } from "@/lib/credits";

const schema = z.object({
  prompt: z.string().min(3).max(1000),
  model: z.enum(["flux-pro", "sdxl", "flux-dev"]).default("flux-pro"),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3"]).default("1:1"),
});

const MODEL_MAP: Record<string, string> = {
  "flux-pro": "black-forest-labs/flux-pro",
  "flux-dev": "black-forest-labs/flux-dev",
  sdxl: "stability-ai/sdxl:39ed52f2319f9b0d685ab5c5ebaf00e8e4d7f4d7b5f4a5e9d1a0e8a4c9b2e3f",
};

const CREDIT_COST = 5;

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limit
    const rl = await rateLimit(LIMITS.AI_GENERATION(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );

    const { prompt, model, aspectRatio } = parsed.data;

    // Check credits
    const supabase = await createServiceClient();
    const { data: user } = await supabase
      .from("users")
      .select("credits, plan")
      .eq("id", userId)
      .single();

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.plan !== "agency" && user.credits < CREDIT_COST) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          creditsNeeded: CREDIT_COST,
          creditsHave: user.credits,
        },
        { status: 402 }
      );
    }

    // Dimension map
    const dimensionMap: Record<string, [number, number]> = {
      "1:1": [1024, 1024],
      "16:9": [1344, 768],
      "9:16": [768, 1344],
      "4:3": [1024, 768],
    };
    const [width, height] = dimensionMap[aspectRatio];

    // Generate image
    const output = (await replicate.run(
      MODEL_MAP[model] as `${string}/${string}`,
      {
        input: { prompt, width, height, num_outputs: 1 },
      }
    )) as string[];

    const imageUrl = Array.isArray(output) ? output[0] : output;

    // Deduct credits
    const newBalance = await deductCredits(supabase, userId, "IMAGE_GEN", {
      model,
      prompt: prompt.slice(0, 100),
    });

    // Save generation record
    const { data: generation } = await supabase
      .from("generations")
      .insert({
        user_id: userId,
        type: "image",
        prompt,
        result_url: imageUrl,
        model,
        credits_used: CREDIT_COST,
        metadata: { aspectRatio, model },
      })
      .select()
      .single();

    return NextResponse.json({
      data: {
        imageUrl,
        generationId: generation?.id,
        creditsUsed: CREDIT_COST,
        creditsRemaining: newBalance,
      },
      error: null,
    });
  } catch (e) {
    console.error("[generate/image]", e);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
