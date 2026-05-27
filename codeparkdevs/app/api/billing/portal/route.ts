import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const supabase = await createServiceClient();
    const { data: user } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single();

    if (!user?.stripe_customer_id)
      return NextResponse.json(
        { error: "No billing account found. Please subscribe to a plan first." },
        { status: 404 }
      );

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ data: { url: session.url }, error: null });
  } catch (e) {
    console.error("[billing/portal]", e);
    return NextResponse.json(
      { data: null, error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
