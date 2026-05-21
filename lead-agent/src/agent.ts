import Anthropic from '@anthropic-ai/sdk';
import { AGENT_CONFIG }            from './config';
import { logger }                  from './utils/logger';
import { toolDefinitions, handleToolCall } from './tools';
import { saveSearchHistory, startSession, endSession } from './database/queries';

const client = new Anthropic();

// ── System Prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an autonomous lead research agent for Veritas Call Center, which sells web development and business automation services to small businesses in South Africa.

Your mission: Systematically find businesses that lack websites or need automation help — so the call center can contact them as potential clients.

## Your research process for each cycle

1. **Check stats first** — Call get_search_stats to see what's been searched recently and avoid duplicates.

2. **Search for businesses** — Use search_businesses with the provided location and category.

3. **Check websites** — For each business, examine the 'website' field:
   - If it has a website URL → skip check_website (the work is done)
   - If website is null/empty → call check_website to confirm and try domain guessing

4. **Score every no-website lead** — Call score_lead for each business without a website.

5. **Save qualified leads** — For leads scoring 40 or above, call save_lead.

6. **Summarise concisely** — End with 2-3 sentences: how many searched, how many saved, top findings.

## Prioritisation rules

- 🔥 HOT (65-100): No website + service business + good reviews + phone number
- 🌡️ WARM (40-64): No website + any solid active business
- ❄️ COLD (<40): Has website OR very low activity

## Efficiency tips

- Process businesses in batches — don't call check_website if search results already show a website URL
- Call score_lead and save_lead in the same iteration where possible
- Stop when all businesses are processed (don't loop unnecessarily)

## Context about the services to pitch

- **Website development**: Custom websites starting from R5,000
- **Booking automation**: Online appointment scheduling
- **Quote automation**: Auto-reply to customer enquiries
- **CRM integration**: Track leads and follow-ups
- **Online ordering**: For restaurants and takeaways

The ideal lead is an active local business with 4+ stars, 10+ reviews, a phone number, and NO website.`;

// ── Cycle Result ──────────────────────────────────────────────────────────────

export interface CycleResult {
  location: string;
  category: string;
  businesses_found: number;
  leads_saved: number;
  hot_leads: number;
  summary: string;
  duration_secs: number;
}

// ── Main Agentic Loop ─────────────────────────────────────────────────────────

export async function runResearchCycle(
  location: string,
  category: string
): Promise<CycleResult> {
  const startTime  = Date.now();
  const sessionId  = startSession(location, category);

  logger.info(`🔍 Starting research cycle: "${category}" in "${location}"`);

  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content:
        `Research "${category}" businesses in "${location}". ` +
        `Find businesses without websites that would benefit from web development and automation services. ` +
        `Save all leads scoring ${AGENT_CONFIG.MIN_LEAD_SCORE} or above.`,
    },
  ];

  let businessesFound = 0;
  let leadsSaved      = 0;
  let hotLeads        = 0;
  let summary         = 'Research cycle completed.';
  let iterations      = 0;
  let errorMsg: string | undefined;

  try {
    while (iterations < AGENT_CONFIG.MAX_ITERATIONS) {
      iterations++;

      // Call Claude ───────────────────────────────────────────────────────────
      const response = await client.messages.create({
        model:      AGENT_CONFIG.MODEL,
        max_tokens: AGENT_CONFIG.MAX_TOKENS,
        thinking:   { type: 'adaptive' },
        output_config: { effort: 'high' },
        system:     SYSTEM_PROMPT,
        tools:      toolDefinitions,
        messages,
      });

      logger.debug(`Iteration ${iterations}: stop_reason=${response.stop_reason}, blocks=${response.content.length}`);

      // ── End turn: agent finished ──────────────────────────────────────────
      if (response.stop_reason === 'end_turn') {
        // Extract the final text summary
        for (const block of response.content) {
          if (block.type === 'text' && block.text.trim().length > 0) {
            summary = block.text.trim();
          }
        }
        logger.info(`✅ Agent finished after ${iterations} iterations`);
        break;
      }

      // ── Tool use: execute tools and feed results back ─────────────────────
      if (response.stop_reason === 'tool_use') {
        messages.push({ role: 'assistant', content: response.content });

        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of response.content) {
          if (block.type !== 'tool_use') continue;

          logger.debug(`  → Tool: ${block.name}`, { input: block.input });

          let result: unknown;
          let isError = false;

          try {
            result = await handleToolCall(block.name, block.input as Record<string, unknown>);

            // Track aggregate stats
            if (block.name === 'search_businesses') {
              const sr = result as { count: number };
              businessesFound += sr.count ?? 0;
            }
            if (block.name === 'save_lead') {
              const sr = result as { success: boolean };
              if (sr.success) {
                leadsSaved++;
                // Peek at input to detect priority
                const inp = block.input as Record<string, unknown>;
                if (inp.priority === 'hot') hotLeads++;
              }
            }
          } catch (err) {
            isError = true;
            result  = { error: err instanceof Error ? err.message : String(err) };
            logger.warn(`Tool error: ${block.name}`, { error: result });
          }

          toolResults.push({
            type:        'tool_result',
            tool_use_id: block.id,
            content:     JSON.stringify(result),
            is_error:    isError,
          });
        }

        messages.push({ role: 'user', content: toolResults });
        continue;
      }

      // ── Unexpected stop reason ────────────────────────────────────────────
      logger.warn(`Unexpected stop_reason: ${response.stop_reason}`);
      break;
    }

    if (iterations >= AGENT_CONFIG.MAX_ITERATIONS) {
      logger.warn(`Hit max iterations (${AGENT_CONFIG.MAX_ITERATIONS}) — cycle truncated`);
    }

  } catch (err) {
    errorMsg = err instanceof Error ? err.message : String(err);
    logger.error('Research cycle failed', { error: errorMsg, location, category });
    summary = `Cycle failed: ${errorMsg}`;
  }

  // ── Finalise ──────────────────────────────────────────────────────────────
  const durationSecs = Math.round((Date.now() - startTime) / 1000);

  endSession(sessionId, businessesFound, leadsSaved, errorMsg);

  saveSearchHistory({
    location,
    category,
    results_found: businessesFound,
    leads_saved:   leadsSaved,
    cycle_summary: summary.slice(0, 500),
  });

  logger.info(
    `📋 Cycle done in ${durationSecs}s | Found: ${businessesFound} | Saved: ${leadsSaved} | 🔥 Hot: ${hotLeads}`
  );

  return {
    location,
    category,
    businesses_found: businessesFound,
    leads_saved:      leadsSaved,
    hot_leads:        hotLeads,
    summary,
    duration_secs:    durationSecs,
  };
}
