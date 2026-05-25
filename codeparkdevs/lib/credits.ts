export const CREDIT_COSTS = {
  IMAGE_GEN: 5,       // per image
  VIDEO_GEN: 20,      // per video
  TEXT_GEN: 2,        // per text generation
  AGENT_RUN: 10,      // per agent run
  POST_SCHEDULED: 1,  // per scheduled post
  VOICE_GEN: 3,       // per voice generation
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

// Returns updated credit balance or throws if insufficient
export async function deductCredits(
  supabaseServiceClient: any,
  userId: string,
  action: CreditAction,
  metadata?: Record<string, unknown>
): Promise<number> {
  const cost = CREDIT_COSTS[action];

  // Get current balance
  const { data: user, error: userError } = await supabaseServiceClient
    .from("users")
    .select("credits, plan")
    .eq("id", userId)
    .single();

  if (userError || !user) throw new Error("User not found");

  // Agency plan = unlimited credits
  if (user.plan === "agency") return user.credits;

  if (user.credits < cost) throw new Error(`Insufficient credits. Need ${cost}, have ${user.credits}.`);

  const newBalance = user.credits - cost;

  // Atomic update
  const { error: updateError } = await supabaseServiceClient
    .from("users")
    .update({ credits: newBalance })
    .eq("id", userId);

  if (updateError) throw new Error("Failed to deduct credits");

  // Log transaction
  await supabaseServiceClient.from("credit_transactions").insert({
    user_id: userId,
    action: action.toLowerCase(),
    amount: -cost,
    balance_after: newBalance,
    metadata: metadata ?? {},
  });

  return newBalance;
}
