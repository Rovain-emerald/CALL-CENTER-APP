import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import { deductCredits } from "@/lib/credits";

const schema = z.object({
  prompt: z.string().min(3).max(2000),
  type: z.enum(["blog", "caption", "ad_copy", "script", "email"]),
  tone: z
    .enum(["professional", "casual", "funny", "formal"])
    .default("professional"),
});

const CREDIT_COST = 2;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildSystemPrompt(
  type: string,
  tone: string
): string {
  const toneDesc: Record<string, string> = {
    professional: "Use professional, polished language.",
    casual: "Use conversational, approachable language.",
    funny: "Use witty, humorous language with light-hearted tone.",
    formal: "Use formal, structured language suitable for official contexts.",
  };

  const typeInstructions: Record<string, string> = {
    blog: `You are an expert blog writer. Write well-structured, SEO-friendly blog posts with a clear intro, body sections with headers, and a strong conclusion. Use markdown formatting.`,
    caption: `You are a social media expert. Write engaging, concise captions that drive engagement. Include relevant emojis and hashtag suggestions at the end. Keep it punchy and shareable.`,
    ad_copy: `You are a direct-response copywriter. Write compelling ad copy with a strong hook, clear value proposition, and a persuasive call-to-action. Focus on benefits over features.`,
    script: `You are a professional scriptwriter. Write compelling scripts with clear scene directions, natural dialogue, and strong narrative flow. Format as a proper script with speaker labels.`,
    email: `You are an email marketing expert. Write compelling emails with a strong subject line suggestion, engaging opening, clear body, and persuasive call-to-action. Use proper email structure.`,
  };

  return `${typeInstructions[type]}\n\nTone: ${toneDesc[tone]}\n\nYou are creating content for Codeparkdevs, a creative AI platform. Be creative, on-brand, and deliver high-quality output.`;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    // Rate limit
    const rl = await rateLimit(LIMITS.AI_GENERATION(userId));
    if (!rl.success)
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rl.reset - Date.now()) / 1000)
          ),
        },
      });

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: parsed.error.flatten(),
        }),
        { status: 400 }
      );

    const { prompt, type, tone } = parsed.data;

    // Check and deduct credits (throws on insufficient)
    const supabase = await createServiceClient();
    let newBalance: number;
    try {
      newBalance = await deductCredits(supabase, userId, "TEXT_GEN", {
        type,
        tone,
        prompt: prompt.slice(0, 100),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Credit error";
      if (message.includes("Insufficient")) {
        return new Response(
          JSON.stringify({ error: message, creditsNeeded: CREDIT_COST }),
          { status: 402 }
        );
      }
      throw err;
    }

    const systemPrompt = buildSystemPrompt(type, tone);

    // Capture full text for DB save
    let fullText = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              fullText += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          // Save generation to DB after stream completes
          await supabase.from("generations").insert({
            user_id: userId,
            type: "text",
            prompt,
            result_url: null,
            model: "gpt-4o",
            credits_used: CREDIT_COST,
            metadata: { contentType: type, tone, output: fullText.slice(0, 2000) },
          });

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, creditsUsed: CREDIT_COST, creditsRemaining: newBalance })}\n\n`
            )
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Credits-Used": String(CREDIT_COST),
        "X-Credits-Remaining": String(newBalance!),
      },
    });
  } catch (e) {
    console.error("[generate/text]", e);
    return new Response(JSON.stringify({ error: "Generation failed" }), {
      status: 500,
    });
  }
}
