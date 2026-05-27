import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

const uuidSchema = z.string().uuid();

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  persona: z.string().max(500).optional(),
  tone: z
    .enum(["professional", "casual", "friendly", "authoritative"])
    .optional(),
  goals: z.string().max(1000).optional(),
  instructions: z.string().max(2000).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success)
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("agents")
      .select("*, agent_runs(*)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !data)
      return NextResponse.json(
        { data: null, error: "Agent not found" },
        { status: 404 }
      );

    return NextResponse.json({ data, error: null });
  } catch (e) {
    console.error("[agents/[id] GET]", e);
    return NextResponse.json(
      { data: null, error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success)
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 });

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

    // Reject empty update
    if (Object.keys(parsed.data).length === 0)
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("agents")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error || !data)
      return NextResponse.json(
        { data: null, error: "Agent not found" },
        { status: 404 }
      );

    return NextResponse.json({ data, error: null });
  } catch (e) {
    console.error("[agents/[id] PATCH]", e);
    return NextResponse.json(
      { data: null, error: "Failed to update agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success)
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const supabase = await createServiceClient();

    // Verify ownership before delete
    const { data: existing } = await supabase
      .from("agents")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (!existing)
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );

    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error)
      return NextResponse.json(
        { error: "Failed to delete agent" },
        { status: 500 }
      );

    return NextResponse.json({ data: { success: true }, error: null });
  } catch (e) {
    console.error("[agents/[id] DELETE]", e);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
