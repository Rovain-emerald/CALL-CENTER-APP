import cron from 'node-cron';
import { RESEARCH_TARGETS, SCHEDULE }  from '../config';
import { runResearchCycle }            from '../agent';
import { generateReport }              from '../tools/generateReport';
import { logger, logBanner }           from './logger';
import { wasRecentlySearched }         from '../database/queries';

// ── Target Rotation ───────────────────────────────────────────────────────────

let targetIndex = 0;

function nextTarget(): { location: string; category: string } {
  // Shuffle targets occasionally to improve coverage variety
  if (targetIndex === 0 && RESEARCH_TARGETS.length > 1) {
    // Fisher-Yates shuffle a copy so we don't mutate the original
    const shuffled = [...RESEARCH_TARGETS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    RESEARCH_TARGETS.splice(0, RESEARCH_TARGETS.length, ...shuffled);
  }

  const target = RESEARCH_TARGETS[targetIndex % RESEARCH_TARGETS.length];
  targetIndex++;
  return target;
}

// ── Cycle Runner ──────────────────────────────────────────────────────────────

let isCycleRunning = false;

export async function runNextCycle(): Promise<void> {
  if (isCycleRunning) {
    logger.warn('⏳ Cycle already running — skipping this tick');
    return;
  }

  isCycleRunning = true;

  try {
    const target = nextTarget();

    // Skip if we searched this combination recently
    if (wasRecentlySearched(target.location, target.category, 24)) {
      logger.info(`⏭️  Skipping "${target.category}" in "${target.location}" (searched in last 24h)`);
      // Try next target
      const alt = nextTarget();
      if (!wasRecentlySearched(alt.location, alt.category, 24)) {
        await runResearchCycle(alt.location, alt.category);
      }
      return;
    }

    await runResearchCycle(target.location, target.category);
  } catch (err) {
    logger.error('Scheduled cycle failed', { error: err instanceof Error ? err.message : err });
  } finally {
    isCycleRunning = false;
  }
}

// ── Start 24/7 Scheduler ──────────────────────────────────────────────────────

export function startScheduler(): void {
  logBanner('🤖 Lead Research Agent — Starting 24/7 Scheduler');
  logger.info(`Research schedule: ${SCHEDULE.RESEARCH_CRON}`);
  logger.info(`Targets loaded: ${RESEARCH_TARGETS.length} location/category pairs`);

  // ── Research cycle (every 4 hours by default) ─────────────────────────────
  const researchJob = cron.schedule(SCHEDULE.RESEARCH_CRON, async () => {
    logBanner('🔍 Scheduled Research Cycle');
    await runNextCycle();
  });

  // ── Daily report (6am every day) ─────────────────────────────────────────
  cron.schedule(SCHEDULE.DAILY_REPORT_CRON, () => {
    logBanner('📊 Daily Lead Report');
    try {
      const report = generateReport();
      logger.info('\n' + report.report_text);
    } catch (err) {
      logger.error('Daily report failed', { error: err });
    }
  });

  // ── Weekly full summary (Sunday 8am) ─────────────────────────────────────
  cron.schedule(SCHEDULE.WEEKLY_REPORT_CRON, () => {
    logBanner('📈 Weekly Summary');
    try {
      const today    = generateReport();
      logger.info('This week\'s performance:\n' + today.report_text);
    } catch (err) {
      logger.error('Weekly report failed', { error: err });
    }
  });

  // ── Kick off immediately on start ─────────────────────────────────────────
  logger.info('🚀 Running first cycle immediately…');
  setImmediate(() => runNextCycle());

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received — shutting down gracefully…');
    researchJob.stop();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received — shutting down gracefully…');
    researchJob.stop();
    process.exit(0);
  });

  logger.info('✅ Scheduler running. Press Ctrl+C to stop.');
}
