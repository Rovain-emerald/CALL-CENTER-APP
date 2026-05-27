import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import { deductCredits } from "@/lib/credits";

const CREDIT_COST_PER_PLATFORM = 1;

const scheduleSchema = z.object({
  content: z.string().min(1).max(2200),
  platforms: z
    .array(
      z.enum([
        "instagram",
        "facebook",
        "twitter",
        "linkedin",
        "tiktok",
        "youtube",
        "pinterest",
      ])
    )
    .min(1)
    .max(7),
  scheduledAt: z.string().datetime(),
  mediaUrls: z.array(z.string().url()).max(10).optional(),
  approved: z.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const pageRaw = Number(searchParams.get("page") ?? "1");
    const limitRaw = Math.min(Number(searchParams.get("limit") ?? "20"), 50);
    const page = isNaN(pageRaw) || pageRaw < 1 ? 1 : pageRaw;
    const limit = isNaN(limitRaw) || limitRaw < 1 ? 20 : limitRaw;
    const offset = (page - 1) * limit;

    const supabase = await createServiceClient();
    let query = supabase
      .from("scheduled_posts")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("scheduled_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (statusFilter) query = query.eq("status", statusFilter);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      data: {
        posts: data ?? [],
        pagination: {
          page,
          limit,
          total: count ?? 0,
          totalPages: Math.ceil((count ?? 0) / limit),
        },
      },
      error: null,
    });
  } catch (e) {
    console.error("[content/schedule GET]", e);
    return NextResponse.json(
      { data: null, error: "Failed to fetch scheduled posts" },
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
    const parsed = scheduleSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );

    const { content, platforms, scheduledAt, mediaUrls, approved } =
      parsed.data;

    // Validate scheduledAt is in the future
    if (new Date(scheduledAt) <= new Date())
      return NextResponse.json(
        { error: "scheduledAt must be in the future" },
        { status: 400 }
      );

    const totalCredits = platforms.length * CREDIT_COST_PER_PLATFORM;

    // Deduct credits (1 per platform)
    const supabase = await createServiceClient();
    let newBalance: number;
    try {
      newBalance = await deductCredits(
        supabase,
        userId,
        "POST_SCHEDULED",
        {
          platforms,
          platformCount: platforms.length,
          creditsDeducted: totalCredits,
        }
      );
      // deductCredits deducts CREDIT_COSTS.POST_SCHEDULED (1) once;
      // for multiple platforms, deduct the remaining platforms individually
      for (let i = 1; i < platforms.length; i++) {
        newBalance = await deductCredits(supabase, userId, "POST_SCHEDULED", {
          platforms,
          platformIndex: i,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Credit error";
      if (message.includes("Insufficient")) {
        return NextResponse.json(
          { error: message, creditsNeeded: totalCredits },
          { status: 402 }
        );
      }
      throw err;
    }

    const { data: post, error: insertError } = await supabase
      .from("scheduled_posts")
      .insert({
        user_id: userId,
        content,
        platforms,
        scheduled_at: scheduledAt,
        media_urls: mediaUrls ?? [],
        approved,
        status: "pending",
        credits_used: totalCredits,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(
      {
        data: {
          post,
          creditsUsed: totalCredits,
          creditsRemaining: newBalance!,
        },
        error: null,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("[content/schedule POST]", e);
    return NextResponse.json(
      { data: null, error: "Failed to schedule post" },
      { status: 500 }
    );
  }
}
