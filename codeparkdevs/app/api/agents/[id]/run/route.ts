import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit, LIMITS } from "@/lib/rate-limit";
import { deductCredits } from "@/lib/credits";

const uuidSchema = z.string().uuid();
const bodySchema = z.object({
  input: z.string().min(1).max(2000),
});

const CREDIT_COST = 10;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildAgentSystemPrompt(agent: {
  name: string;
  persona: string;
  tone: string;
  goals: string;
  instructions: string;
}): string {
  const parts: string[] = [
    `You are ${agent.name}, an AI agent.`,
  ];

  if (agent.persona) {
    parts.push(`\nPersona: ${agent.persona}`);
  }

  if (agent.tone) {
    const toneMap: Record<string, string> = {
      professional: "Maintain a professional, polished tone.",
      casual: "Use a conversational, approachable tone.",
      friendly: "Be warm, friendly, and encouraging.",
      authoritative: "Speak with authority and confidence.",
    };
    parts.push(`\nTone: ${toneMap[agent.tone] ?? agent.tone}`);
  }

  if (agent.goals) {
    parts.push(`\nGoals:\n${agent.goals}`);
  }

  if (agent.instructions) {
    parts.push(`\nInstructions:\n${agent.instructions}`);
  }

  return parts.join("\n");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    // Rate limit
    const rl = await rateLimit(LIMITS.AGENT_RUN(userId));
    if (!rl.success)
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)),
        },
      });

    // Validate agent ID
    const { id } = await params;
    const idParsed = uuidSchema.safeParse(id);
    if (!idParsed.success)
      return new Response(JSON.stringify({ error: "Invalid agent ID" }), {
        status: 400,
      });

    // Validate body
    const body = await req.json();
    const bodyParsed = bodySchema.safeParse(body);
    if (!bodyParsed.success)
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: bodyParsed.error.flatten(),
        }),
        { status: 400 }
      );

    const { input } = bodyParsed.data;

    // Fetch agent (owned by user)
    const supabase = await createServiceClient();
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (agentError || !agent)
      return new Response(JSON.stringify({ error: "Agent not found" }), {
        status: 404,
      });

    if (agent.status === "inactive")
      return new Response(
        JSON.stringify({ error: "Agent is inactive" }),
        { status: 400 }
      );

    // Deduct credits
    let newBalance: number;
    try {
      newBalance = await deductCredits(supabase, userId, "AGENT_RUN", {
        agentId: id,
        agentName: agent.name,
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

    const systemPrompt = buildAgentSystemPrompt(agent);

    // Stream GPT-4o with agent persona
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      max_tokens: 2000,
    });

    let fullOutput = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              fullOutput += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          // Save agent_run record
          const { data: runRecord } = await supabase
            .from("agent_runs")
            .insert({
              agent_id: id,
              user_id: userId,
              input,
              output: fullOutput,
              credits_used: CREDIT_COST,
              status: "completed",
            })
            .select()
            .single();

          // Increment runs_count on agent
          await supabase.rpc("increment_agent_runs", { agent_id: id });

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                runId: runRecord?.id,
                creditsUsed: CREDIT_COST,
                creditsRemaining: newBalance,
              })}\n\n`
            )
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          // Attempt to log failed run
          await supabase.from("agent_runs").insert({
            agent_id: id,
            user_id: userId,
            input,
            output: fullOutput,
            credits_used: CREDIT_COST,
            status: "failed",
          });
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
    console.error("[agents/[id]/run]", e);
    return new Response(JSON.stringify({ error: "Agent run failed" }), {
      status: 500,
    });
  }
}
