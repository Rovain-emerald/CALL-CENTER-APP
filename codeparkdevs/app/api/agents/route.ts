import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  persona: z.string().max(500).default(""),
  tone: z
    .enum(["professional", "casual", "friendly", "authoritative"])
    .default("professional"),
  goals: z.string().max(1000).default(""),
  instructions: z.string().max(2000).default(""),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (e) {
    console.error("[agents GET]", e);
    return NextResponse.json(
      { data: null, error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("agents")
      .insert({ ...parsed.data, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (e) {
    console.error("[agents POST]", e);
    return NextResponse.json(
      { data: null, error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
