import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

const updateSchema = z.object({
  theme: z.enum(["dark", "light", "system"]).optional(),
  sidebar_collapsed: z.boolean().optional(),
  accent_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .optional(),
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

    // Try to fetch existing user
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (existingUser && !fetchError) {
      return NextResponse.json({ data: existingUser, error: null });
    }

    // User not found — create them from Clerk data
    const clerkUser = await currentUser();
    const trialEndsAt = new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email:
          clerkUser?.emailAddresses?.[0]?.emailAddress ?? null,
        name:
          clerkUser?.fullName ??
          `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() ||
          null,
        avatar_url: clerkUser?.imageUrl ?? null,
        credits: 50,
        plan: "free",
        trial_ends_at: trialEndsAt,
        theme: "dark",
        sidebar_collapsed: false,
        accent_color: "#C8A882",
      })
      .select()
      .single();

    if (createError) throw createError;
    return NextResponse.json({ data: newUser, error: null }, { status: 201 });
  } catch (e) {
    console.error("[user GET]", e);
    return NextResponse.json(
      { data: null, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );

    if (Object.keys(parsed.data).length === 0)
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("users")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error || !data)
      return NextResponse.json(
        { data: null, error: "User not found" },
        { status: 404 }
      );

    return NextResponse.json({ data, error: null });
  } catch (e) {
    console.error("[user PATCH]", e);
    return NextResponse.json(
      { data: null, error: "Failed to update user" },
      { status: 500 }
    );
  }
}
