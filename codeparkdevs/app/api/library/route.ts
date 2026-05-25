import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

const VALID_TYPES = [
  "image",
  "video",
  "document",
  "brand_asset",
  "code",
  "audio",
] as const;

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  type: z.enum(VALID_TYPES).optional(),
  search: z.string().max(200).optional(),
});

const createSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(VALID_TYPES),
  file_url: z.string().url(),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
  metadata: z.record(z.unknown()).optional().default({}),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    // Parse query params
    const { searchParams } = new URL(req.url);
    const queryParsed = listQuerySchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      type: searchParams.get("type") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });

    if (!queryParsed.success)
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryParsed.error.flatten() },
        { status: 400 }
      );

    const { page, limit, type, search } = queryParsed.data;
    const offset = (page - 1) * limit;

    const supabase = await createServiceClient();
    let query = supabase
      .from("library_items")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (type) query = query.eq("type", type);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      data: {
        items: data ?? [],
        pagination: {
          page,
          limit,
          total: count ?? 0,
          totalPages: Math.ceil((count ?? 0) / limit),
          hasNextPage: offset + limit < (count ?? 0),
        },
      },
      error: null,
    });
  } catch (e) {
    console.error("[library GET]", e);
    return NextResponse.json(
      { data: null, error: "Failed to fetch library" },
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
      .from("library_items")
      .insert({
        ...parsed.data,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (e) {
    console.error("[library POST]", e);
    return NextResponse.json(
      { data: null, error: "Failed to create library item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Missing item ID" },
        { status: 400 }
      );

    const idParsed = z.string().uuid().safeParse(id);
    if (!idParsed.success)
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });

    const supabase = await createServiceClient();
    const { error } = await supabase
      .from("library_items")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ data: { success: true }, error: null });
  } catch (e) {
    console.error("[library DELETE]", e);
    return NextResponse.json(
      { data: null, error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
