import { upsertLead, LeadRow } from '../database/queries';
import { logger } from '../utils/logger';

export interface SaveLeadInput {
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
  automation_needs: string | string[];
  priority: 'hot' | 'warm' | 'cold';
  notes?: string | null;
}

export function saveLead(input: SaveLeadInput): {
  success: boolean;
  id?: number;
  message: string;
} {
  // Normalise automation_needs to comma-separated string
  const automationNeeds = Array.isArray(input.automation_needs)
    ? input.automation_needs.join(', ')
    : String(input.automation_needs ?? '');

  const row: LeadRow = {
    business_name:   input.business_name,
    phone:           input.phone          ?? null,
    address:         input.address        ?? null,
    city:            input.city           ?? null,
    category:        input.category,
    google_place_id: input.google_place_id ?? null,
    website:         input.website        ?? null,
    has_website:     Boolean(input.has_website),
    rating:          input.rating         ?? null,
    review_count:    input.review_count   ?? 0,
    score:           input.score,
    automation_needs: automationNeeds,
    priority:        input.priority,
    notes:           input.notes          ?? null,
  };

  const result = upsertLead(row);

  if (result.success) {
    logger.info(`✅ Lead saved: [${input.priority.toUpperCase()}] ${input.business_name} — score ${input.score}`, {
      id: result.id,
      city: input.city,
      category: input.category,
    });
  }

  return result;
}
