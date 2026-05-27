import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazy singleton — only initializes if env vars are set
let ratelimit: Ratelimit | null = null;

function getRatelimit() {
  if (!ratelimit && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(20, "10 s"),
      analytics: true,
    });
  }
  return ratelimit;
}

export async function rateLimit(identifier: string): Promise<{ success: boolean; remaining: number; reset: number }> {
  const rl = getRatelimit();
  if (!rl) return { success: true, remaining: 999, reset: 0 }; // dev fallback
  const result = await rl.limit(identifier);
  return { success: result.success, remaining: result.remaining, reset: result.reset };
}

// Specific limiters
export const LIMITS = {
  AI_GENERATION: (userId: string) => `gen:${userId}`,
  AGENT_RUN: (userId: string) => `agent:${userId}`,
  AUTH: (ip: string) => `auth:${ip}`,
  API: (userId: string) => `api:${userId}`,
};
