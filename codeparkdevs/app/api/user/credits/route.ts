import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const supabase = await createServiceClient();
    const [{ data: user }, { data: history }] = await Promise.all([
      supabase
        .from("users")
        .select("credits, plan, trial_ends_at")
        .eq("id", userId)
        .single(),
      supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    return NextResponse.json({
      data: {
        credits: user?.credits ?? 0,
        plan: user?.plan ?? "free",
        trialEndsAt: user?.trial_ends_at ?? null,
        history: history ?? [],
      },
      error: null,
    });
  } catch (e) {
    console.error("[user/credits]", e);
    return NextResponse.json(
      { data: null, error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
