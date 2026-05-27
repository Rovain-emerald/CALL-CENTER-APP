import { getDb } from '../database/init';

export interface DailyReport {
  date: string;
  totals: {
    searches_run: number;
    businesses_checked: number;
    leads_saved: number;
    hot_leads: number;
    warm_leads: number;
    cold_leads: number;
    no_website_leads: number;
  };
  top_leads: Array<{
    business_name: string;
    city: string;
    category: string;
    score: number;
    priority: string;
    phone: string | null;
    automation_needs: string;
  }>;
  locations_searched: string[];
  report_text: string;
}

export function generateReport(date?: string): DailyReport {
  const db = getDb();
  const targetDate = date ?? new Date().toISOString().split('T')[0];

  // Aggregate search stats for the day
  const searchStats = db.prepare(`
    SELECT
      COUNT(*) AS searches_run,
      SUM(results_found) AS businesses_checked,
      SUM(leads_saved) AS leads_saved
    FROM search_history
    WHERE date(searched_at) = ?
  `).get(targetDate) as Record<string, number>;

  // Lead breakdown for the day
  const leadBreakdown = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN priority = 'hot'       THEN 1 ELSE 0 END) AS hot_leads,
      SUM(CASE WHEN priority = 'warm'      THEN 1 ELSE 0 END) AS warm_leads,
      SUM(CASE WHEN priority = 'cold'      THEN 1 ELSE 0 END) AS cold_leads,
      SUM(CASE WHEN has_website = 0        THEN 1 ELSE 0 END) AS no_website_leads
    FROM leads
    WHERE date(created_at) = ?
  `).get(targetDate) as Record<string, number>;

  // Top 10 leads
  const topLeads = db.prepare(`
    SELECT business_name, city, category, score, priority, phone, automation_needs
    FROM leads
    WHERE date(created_at) = ?
    ORDER BY score DESC
    LIMIT 10
  `).all(targetDate) as DailyReport['top_leads'];

  // Locations searched
  const locations = db.prepare(`
    SELECT DISTINCT location FROM search_history WHERE date(searched_at) = ?
  `).all(targetDate) as { location: string }[];

  const totals = {
    searches_run:      searchStats.searches_run       ?? 0,
    businesses_checked: searchStats.businesses_checked ?? 0,
    leads_saved:       searchStats.leads_saved        ?? 0,
    hot_leads:         leadBreakdown.hot_leads         ?? 0,
    warm_leads:        leadBreakdown.warm_leads        ?? 0,
    cold_leads:        leadBreakdown.cold_leads        ?? 0,
    no_website_leads:  leadBreakdown.no_website_leads  ?? 0,
  };

  const locationsSearched = locations.map(l => l.location);

  // Build human-readable report
  const reportLines: string[] = [
    `📊 DAILY LEAD REPORT — ${targetDate}`,
    '═'.repeat(50),
    `🔍 Research cycles: ${totals.searches_run}`,
    `🏢 Businesses checked: ${totals.businesses_checked}`,
    `💾 Leads saved: ${totals.leads_saved}`,
    '',
    `🔥 Hot leads:  ${totals.hot_leads}`,
    `🌡️  Warm leads: ${totals.warm_leads}`,
    `❄️  Cold leads: ${totals.cold_leads}`,
    `🌐 No website: ${totals.no_website_leads}`,
    '',
    `📍 Locations searched: ${locationsSearched.join(', ') || 'None'}`,
    '',
    `🏆 TOP LEADS TODAY:`,
  ];

  topLeads.forEach((lead, i) => {
    reportLines.push(`  ${i + 1}. [${lead.priority.toUpperCase()} ${lead.score}/100] ${lead.business_name}`);
    reportLines.push(`     📍 ${lead.city} | 📂 ${lead.category}`);
    if (lead.phone) reportLines.push(`     📞 ${lead.phone}`);
    if (lead.automation_needs) reportLines.push(`     🔧 ${lead.automation_needs}`);
    reportLines.push('');
  });

  return {
    date:               targetDate,
    totals,
    top_leads:          topLeads,
    locations_searched: locationsSearched,
    report_text:        reportLines.join('\n'),
  };
}
