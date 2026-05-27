import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { z } from "zod";
import { rateLimit, LIMITS } from "@/lib/rate-limit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

const schema = z.object({
  plan: z.enum(["starter", "pro", "agency"]),
});

const PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "",
  pro: process.env.STRIPE_PRICE_PRO ?? "",
  agency: process.env.STRIPE_PRICE_AGENCY ?? "",
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = await rateLimit(LIMITS.API(userId));
    if (!rl.success)
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );

    const { plan } = parsed.data;
    const priceId = PRICE_MAP[plan];

    if (!priceId)
      return NextResponse.json(
        { error: `Price not configured for plan: ${plan}` },
        { status: 500 }
      );

    // Check for existing Stripe customer ID
    const supabase = await createServiceClient();
    const { data: user } = await supabase
      .from("users")
      .select("stripe_customer_id, email")
      .eq("id", userId)
      .single();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        plan,
      },
      subscription_data: {
        metadata: {
          userId,
          plan,
        },
      },
      success_url: `${appUrl}/settings?billing=success&plan=${plan}`,
      cancel_url: `${appUrl}/settings?billing=cancelled`,
      allow_promotion_codes: true,
    };

    // Re-use existing customer if available
    if (user?.stripe_customer_id) {
      sessionParams.customer = user.stripe_customer_id;
    } else if (user?.email) {
      sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      data: { url: session.url, sessionId: session.id },
      error: null,
    });
  } catch (e) {
    console.error("[billing/checkout]", e);
    return NextResponse.json(
      { data: null, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
