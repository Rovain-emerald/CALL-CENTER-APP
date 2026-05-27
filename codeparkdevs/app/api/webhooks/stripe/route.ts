import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

const PLAN_CREDITS: Record<string, number> = {
  starter: 500,
  pro: 2000,
  agency: 999999,
  free: 50,
};

// Map Stripe price IDs to plan names (set these in env)
function getPlanFromPriceId(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.STRIPE_PRICE_STARTER ?? ""]: "starter",
    [process.env.STRIPE_PRICE_PRO ?? ""]: "pro",
    [process.env.STRIPE_PRICE_AGENCY ?? ""]: "agency",
  };
  return map[priceId] ?? "free";
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("[webhooks/stripe] Signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        if (!userId) break;

        // Attach Stripe customer ID to user
        await supabase
          .from("users")
          .update({ stripe_customer_id: customerId })
          .eq("id", userId);

        // If subscription checkout, subscription.updated will handle plan
        // But handle one-time credit top-ups here if needed
        if (session.mode === "payment") {
          const credits = Number(session.metadata?.credits ?? 0);
          if (credits > 0) {
            const { data: user } = await supabase
              .from("users")
              .select("credits")
              .eq("id", userId)
              .single();

            const newBalance = (user?.credits ?? 0) + credits;
            await supabase
              .from("users")
              .update({ credits: newBalance })
              .eq("id", userId);

            await supabase.from("credit_transactions").insert({
              user_id: userId,
              action: "purchase",
              amount: credits,
              balance_after: newBalance,
              metadata: { sessionId: session.id },
            });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price?.id ?? "";
        const plan = getPlanFromPriceId(priceId);
        const credits = PLAN_CREDITS[plan] ?? 50;
        const status = subscription.status;

        // Find user by stripe_customer_id
        const { data: user } = await supabase
          .from("users")
          .select("id, credits, plan")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!user) {
          console.warn("[webhooks/stripe] No user found for customer:", customerId);
          break;
        }

        // Only grant credits if plan is upgrading or new
        const isUpgrade =
          PLAN_CREDITS[plan] > PLAN_CREDITS[user.plan ?? "free"];

        await supabase
          .from("users")
          .update({
            plan,
            credits: isUpgrade ? credits : user.credits,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        // Upsert subscription record
        await supabase.from("subscriptions").upsert(
          {
            user_id: user.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            plan,
            status,
            current_period_start: new Date(
              ((subscription as unknown as Record<string, number>).current_period_start ?? 0) * 1000
            ).toISOString(),
            current_period_end: new Date(
              ((subscription as unknown as Record<string, number>).current_period_end ?? 0) * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "stripe_subscription_id" }
        );

        if (isUpgrade) {
          await supabase.from("credit_transactions").insert({
            user_id: user.id,
            action: "plan_upgrade",
            amount: credits - user.credits,
            balance_after: credits,
            metadata: { plan, subscriptionId: subscription.id },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!user) break;

        // Revert to free plan
        await supabase
          .from("users")
          .update({
            plan: "free",
            credits: PLAN_CREDITS.free,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        await supabase.from("credit_transactions").insert({
          user_id: user.id,
          action: "plan_downgrade",
          amount: 0,
          balance_after: PLAN_CREDITS.free,
          metadata: { plan: "free", subscriptionId: subscription.id },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const invoiceAny = invoice as unknown as Record<string, unknown>;
        const subscriptionId =
          typeof invoiceAny.subscription === "string"
            ? invoiceAny.subscription
            : (invoiceAny.subscription as { id?: string } | null)?.id ?? null;

        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (!user) break;

        // Mark subscription as past_due
        if (subscriptionId) {
          await supabase
            .from("subscriptions")
            .update({
              status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);
        }

        console.warn(
          `[webhooks/stripe] Payment failed for user ${user.id}, invoice ${invoice.id}`
        );
        break;
      }

      default:
        // Unhandled event type — not an error
        break;
    }
  } catch (err) {
    console.error("[webhooks/stripe] Handler error:", err);
    // Return 200 to prevent Stripe from retrying — log the error for investigation
    return NextResponse.json({ received: true, handlerError: true });
  }

  return NextResponse.json({ received: true });
}
