import 'dotenv/config';
import { getDb, closeDb }          from './database/init';
import { logger, logBanner }        from './utils/logger';
import { startScheduler, runNextCycle } from './utils/scheduler';
import { runResearchCycle }         from './agent';
import { generateReport }           from './tools/generateReport';
import { getLeads, countLeads }     from './database/queries';

// ── Ensure DB is initialised before anything runs ────────────────────────────
getDb();

// ── CLI argument parsing ──────────────────────────────────────────────────────
const args = process.argv.slice(2);

function printHelp() {
  console.log(`
🤖 Lead Research Agent — CLI

Usage:
  npm start                         Start 24/7 scheduler (default)
  npm run cycle                     Run one research cycle now
  npm run cycle -- -l "Cape Town, South Africa" -c plumber
                                    Run cycle for specific location/category
  npm run report                    Show today's lead report
  npm run leads                     List latest leads
  npm run status                    Show database stats

Options for --cycle:
  -l, --location <location>         Location to search
  -c, --category <category>         Business category to search

Environment:
  ANTHROPIC_API_KEY     (required) Claude API key
  GOOGLE_PLACES_API_KEY (optional) Enables real business data; runs in mock mode without it
  MIN_LEAD_SCORE        (default: 40) Minimum score to save a lead
  RESEARCH_CRON         (default: "0 */4 * * *") Cron expression for research cycles
`);
}

async function main() {
  // ── --help ──────────────────────────────────────────────────────────────────
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  // ── --cycle: run a single research cycle ───────────────────────────────────
  if (args.includes('--cycle')) {
    logBanner('🔍 Single Research Cycle');

    // Parse optional location/category flags
    const locIdx = args.findIndex(a => a === '-l' || a === '--location');
    const catIdx = args.findIndex(a => a === '-c' || a === '--category');

    if (locIdx !== -1 && catIdx !== -1) {
      const location = args[locIdx + 1];
      const category = args[catIdx + 1];

      if (!location || !category) {
        logger.error('Provide both --location and --category');
        process.exit(1);
      }

      const result = await runResearchCycle(location, category);
      console.log('\n' + '─'.repeat(50));
      console.log(`✅ Done — ${result.leads_saved} leads saved (${result.hot_leads} hot)`);
      console.log('─'.repeat(50));
    } else {
      // No location/category specified — use next in rotation
      await runNextCycle();
    }

    closeDb();
    return;
  }

  // ── --report: show today's report ─────────────────────────────────────────
  if (args.includes('--report')) {
    const dateArg = args[args.indexOf('--report') + 1];
    const date    = dateArg && !dateArg.startsWith('-') ? dateArg : undefined;
    const report  = generateReport(date);
    console.log('\n' + report.report_text);
    closeDb();
    return;
  }

  // ── --leads: list latest leads ─────────────────────────────────────────────
  if (args.includes('--leads')) {
    logBanner('📋 Latest Leads');
    const priorityArg = args[args.indexOf('--leads') + 1];
    const priority    = (['hot', 'warm', 'cold'].includes(priorityArg))
      ? priorityArg as 'hot' | 'warm' | 'cold'
      : undefined;

    const leads = getLeads({ limit: 20, priority });

    if (leads.length === 0) {
      console.log('No leads found yet. Run a research cycle first.');
    } else {
      console.log(`\nShowing ${leads.length} lead(s)${priority ? ` (${priority} only)` : ''}:\n`);
      leads.forEach((l, i) => {
        const icon = l.priority === 'hot' ? '🔥' : l.priority === 'warm' ? '🌡️' : '❄️';
        console.log(`${i + 1}. ${icon} [${l.priority?.toUpperCase()} ${l.score}/100] ${l.business_name}`);
        if (l.city)             console.log(`   📍 ${l.city}`);
        if (l.phone)            console.log(`   📞 ${l.phone}`);
        if (l.automation_needs) console.log(`   🔧 ${l.automation_needs}`);
        console.log('');
      });
    }

    closeDb();
    return;
  }

  // ── --status: show database stats ─────────────────────────────────────────
  if (args.includes('--status')) {
    logBanner('📊 Agent Status');
    const counts = countLeads();
    console.log('\n📦 Database Statistics:');
    console.log(`   Total leads:       ${counts.total}`);
    console.log(`   🔥 Hot leads:      ${counts.hot}`);
    console.log(`   🌡️  Warm leads:     ${counts.warm}`);
    console.log(`   ❄️  Cold leads:     ${counts.cold}`);
    console.log(`   🌐 No website:     ${counts.no_website}`);
    console.log(`   📅 Added today:    ${counts.today}`);

    const today = new Date().toISOString().split('T')[0];
    const report = generateReport(today);
    if (report.totals.searches_run > 0) {
      console.log(`\n🔍 Today's Activity:`);
      console.log(`   Research cycles:   ${report.totals.searches_run}`);
      console.log(`   Businesses checked: ${report.totals.businesses_checked}`);
      console.log(`   Leads saved today:  ${report.totals.leads_saved}`);
    }

    closeDb();
    return;
  }

  // ── Default: start 24/7 scheduler ─────────────────────────────────────────
  startScheduler();
  // Scheduler keeps the process alive via cron jobs
}

main().catch((err) => {
  logger.error('Fatal error', { error: err instanceof Error ? err.message : err });
  closeDb();
  process.exit(1);
});
