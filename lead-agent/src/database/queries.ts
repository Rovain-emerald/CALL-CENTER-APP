import { getDb } from './init';
import { logger } from '../utils/logger';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LeadRow {
  id?: number;
  business_name: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  category: string;
  google_place_id?: string | null;
  website?: string | null;
  has_website: boolean;
  rating?: number | null;
  review_count?: number | null;
  score: number;
  automation_needs?: string | null;
  priority: 'hot' | 'warm' | 'cold';
  status?: string;
  notes?: string | null;
}

export interface SearchHistoryRow {
  location: string;
  category: string;
  results_found: number;
  leads_saved: number;
  cycle_summary?: string;
}

// ── Lead Operations ───────────────────────────────────────────────────────────

export function upsertLead(lead: LeadRow): { success: boolean; id?: number; message: string } {
  const db = getDb();

  try {
    // Duplicate check via place ID
    if (lead.google_place_id) {
      const existing = db
        .prepare('SELECT id FROM leads WHERE google_place_id = ?')
        .get(lead.google_place_id) as { id: number } | undefined;

      if (existing) {
        return { success: false, message: `Already exists (id=${existing.id})` };
      }
    }

    const stmt = db.prepare(`
      INSERT INTO leads (
        business_name, phone, address, city, category,
        google_place_id, website, has_website, rating, review_count,
        score, automation_needs, priority, notes
      ) VALUES (
        @business_name, @phone, @address, @city, @category,
        @google_place_id, @website, @has_website, @rating, @review_count,
        @score, @automation_needs, @priority, @notes
      )
    `);

    const result = stmt.run({
      ...lead,
      has_website: lead.has_website ? 1 : 0,
      phone: lead.phone ?? null,
      address: lead.address ?? null,
      city: lead.city ?? null,
      google_place_id: lead.google_place_id ?? null,
      website: lead.website ?? null,
      rating: lead.rating ?? null,
      review_count: lead.review_count ?? 0,
      automation_needs: lead.automation_needs ?? null,
      notes: lead.notes ?? null,
    });

    return { success: true, id: result.lastInsertRowid as number, message: 'Lead saved successfully' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('Failed to save lead', { error: msg, business: lead.business_name });
    return { success: false, message: `DB error: ${msg}` };
  }
}

export function getLeads(options: {
  limit?: number;
  priority?: 'hot' | 'warm' | 'cold';
  status?: string;
  city?: string;
  minScore?: number;
} = {}): LeadRow[] {
  const db = getDb();
  const { limit = 50, priority, status, city, minScore } = options;

  const conditions: string[] = [];
  if (priority) conditions.push(`priority = '${priority}'`);
  if (status)   conditions.push(`status = '${status}'`);
  if (city)     conditions.push(`city LIKE '%${city}%'`);
  if (minScore) conditions.push(`score >= ${minScore}`);

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return db.prepare(`
    SELECT * FROM leads ${where}
    ORDER BY score DESC, created_at DESC
    LIMIT ${limit}
  `).all() as LeadRow[];
}

export function countLeads(): {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  no_website: number;
  today: number;
} {
  const db = getDb();
  const row = db.prepare(`
    SELECT
      COUNT(*)                                            AS total,
      SUM(CASE WHEN priority = 'hot'  THEN 1 ELSE 0 END) AS hot,
      SUM(CASE WHEN priority = 'warm' THEN 1 ELSE 0 END) AS warm,
      SUM(CASE WHEN priority = 'cold' THEN 1 ELSE 0 END) AS cold,
      SUM(CASE WHEN has_website = 0   THEN 1 ELSE 0 END) AS no_website,
      SUM(CASE WHEN date(created_at) = date('now') THEN 1 ELSE 0 END) AS today
    FROM leads
  `).get() as Record<string, number>;

  return {
    total:      row.total      ?? 0,
    hot:        row.hot        ?? 0,
    warm:       row.warm       ?? 0,
    cold:       row.cold       ?? 0,
    no_website: row.no_website ?? 0,
    today:      row.today      ?? 0,
  };
}

// ── Search History ────────────────────────────────────────────────────────────

export function saveSearchHistory(row: SearchHistoryRow): void {
  getDb().prepare(`
    INSERT INTO search_history (location, category, results_found, leads_saved, cycle_summary)
    VALUES (@location, @category, @results_found, @leads_saved, @cycle_summary)
  `).run(row);
}

export function getSearchHistory(days = 7): Array<{
  location: string;
  category: string;
  results_found: number;
  leads_saved: number;
  searched_at: string;
}> {
  return getDb().prepare(`
    SELECT location, category, results_found, leads_saved, searched_at
    FROM search_history
    WHERE searched_at >= datetime('now', '-${days} days')
    ORDER BY searched_at DESC
    LIMIT 100
  `).all() as Array<{
    location: string;
    category: string;
    results_found: number;
    leads_saved: number;
    searched_at: string;
  }>;
}

export function wasRecentlySearched(location: string, category: string, withinHours = 48): boolean {
  const row = getDb().prepare(`
    SELECT COUNT(*) AS cnt FROM search_history
    WHERE location = ? AND category = ?
      AND searched_at >= datetime('now', '-${withinHours} hours')
  `).get(location, category) as { cnt: number };
  return row.cnt > 0;
}

// ── Agent Sessions ────────────────────────────────────────────────────────────

export function startSession(location: string, category: string): number {
  const result = getDb().prepare(`
    INSERT INTO agent_sessions (session_type, location, category, status)
    VALUES ('research', ?, ?, 'running')
  `).run(location, category);
  return result.lastInsertRowid as number;
}

export function endSession(
  id: number,
  leadsFound: number,
  leadsSaved: number,
  errorMsg?: string
): void {
  getDb().prepare(`
    UPDATE agent_sessions
    SET status = ?, leads_found = ?, leads_saved = ?, error_msg = ?, ended_at = datetime('now')
    WHERE id = ?
  `).run(errorMsg ? 'error' : 'done', leadsFound, leadsSaved, errorMsg ?? null, id);
}

export function getDailyStats(date?: string): {
  searches: number;
  leads_saved: number;
  hot_leads: number;
  warm_leads: number;
  locations: string[];
} {
  const d = date ?? new Date().toISOString().split('T')[0];
  const db = getDb();

  const history = db.prepare(`
    SELECT COUNT(*) AS searches, SUM(leads_saved) AS leads_saved
    FROM search_history WHERE date(searched_at) = ?
  `).get(d) as { searches: number; leads_saved: number };

  const leads = db.prepare(`
    SELECT
      SUM(CASE WHEN priority = 'hot'  THEN 1 ELSE 0 END) AS hot,
      SUM(CASE WHEN priority = 'warm' THEN 1 ELSE 0 END) AS warm
    FROM leads WHERE date(created_at) = ?
  `).get(d) as { hot: number; warm: number };

  const locs = db.prepare(`
    SELECT DISTINCT location FROM search_history WHERE date(searched_at) = ?
  `).all(d) as { location: string }[];

  return {
    searches:    history.searches  ?? 0,
    leads_saved: history.leads_saved ?? 0,
    hot_leads:   leads.hot  ?? 0,
    warm_leads:  leads.warm ?? 0,
    locations:   locs.map(r => r.location),
  };
}
