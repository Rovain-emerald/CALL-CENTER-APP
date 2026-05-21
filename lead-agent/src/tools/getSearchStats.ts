import { getSearchHistory, countLeads } from '../database/queries';

export interface SearchStats {
  recent_searches: Array<{
    location: string;
    category: string;
    results_found: number;
    leads_saved: number;
    searched_at: string;
  }>;
  total_leads: {
    total: number;
    hot: number;
    warm: number;
    cold: number;
    no_website: number;
    today: number;
  };
  coverage_summary: string;
}

export function getSearchStats(days = 7): SearchStats {
  const history  = getSearchHistory(days);
  const totals   = countLeads();

  const locationsSearched = [...new Set(history.map(h => h.location))];
  const categoriesSearched = [...new Set(history.map(h => h.category))];

  const coverageSummary =
    history.length === 0
      ? 'No searches yet — agent is starting fresh.'
      : `In the last ${days} days: searched ${locationsSearched.length} location(s) ` +
        `(${locationsSearched.join(', ')}) across ${categoriesSearched.length} category(ies). ` +
        `${history.length} total cycles run.`;

  return {
    recent_searches:  history,
    total_leads:      totals,
    coverage_summary: coverageSummary,
  };
}
