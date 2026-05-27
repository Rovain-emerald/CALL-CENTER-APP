export interface LeadScore {
  score: number;               // 0–100
  priority: 'hot' | 'warm' | 'cold';
  automation_needs: string[];  // Specific opportunities
  scoring_breakdown: string;   // Human-readable explanation
}

// ── Category Maps ─────────────────────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  'plumber', 'plumbing', 'electrician', 'electrical', 'mechanic', 'auto repair',
  'painter', 'carpenter', 'handyman', 'contractor', 'builder', 'construction',
  'landscaper', 'gardener', 'lawn', 'tree', 'pool', 'pest control', 'exterminator',
  'locksmith', 'cleaner', 'cleaning', 'laundry', 'mover', 'moving',
];

const FOOD_CATEGORIES = [
  'restaurant', 'cafe', 'coffee shop', 'bakery', 'catering', 'takeaway',
  'fast food', 'diner', 'grill', 'kitchen', 'eatery',
];

const BEAUTY_CATEGORIES = [
  'hair salon', 'barbershop', 'barber', 'nail salon', 'beauty salon',
  'spa', 'massage', 'waxing', 'lashes', 'eyebrow',
];

const HEALTH_CATEGORIES = [
  'dentist', 'physiotherapist', 'chiropractor', 'optometrist', 'doctor',
  'clinic', 'medical', 'pharmacy', 'veterinary', 'vet',
];

const FITNESS_CATEGORIES = [
  'gym', 'fitness', 'yoga', 'pilates', 'crossfit', 'martial arts', 'boxing',
];

function categoryMatch(category: string, list: string[]): boolean {
  const lc = category.toLowerCase();
  return list.some(c => lc.includes(c));
}

// ── Main Scoring Function ─────────────────────────────────────────────────────

export function scoreLead(input: Record<string, unknown>): LeadScore {
  let score = 0;
  const automationNeeds: string[] = [];
  const breakdown: string[] = [];

  const category    = String(input.category  ?? '').toLowerCase();
  const hasWebsite  = Boolean(input.has_website);
  const rating      = typeof input.rating       === 'number' ? input.rating      : 0;
  const reviewCount = typeof input.review_count === 'number' ? input.review_count : 0;
  const hasPhone    = Boolean(input.has_phone);
  const isOp        = input.is_operational !== false; // default operational

  // ── 1. Website absence (core opportunity) ────────────────────────────────
  if (!hasWebsite) {
    score += 40;
    automationNeeds.push('Professional website');
    breakdown.push('+40 No website (primary opportunity)');
  } else {
    breakdown.push('+0 Already has website');
  }

  // ── 2. Business category (automation potential) ──────────────────────────
  if (categoryMatch(category, SERVICE_CATEGORIES)) {
    score += 20;
    automationNeeds.push('Online quote requests', 'Appointment scheduling', 'Job tracking');
    breakdown.push('+20 Service business (high automation need)');

  } else if (categoryMatch(category, FOOD_CATEGORIES)) {
    score += 16;
    automationNeeds.push('Online ordering / menu', 'Table reservations', 'Loyalty program');
    breakdown.push('+16 Food business');

  } else if (categoryMatch(category, BEAUTY_CATEGORIES)) {
    score += 18;
    automationNeeds.push('Online booking system', 'Client reminders', 'Loyalty rewards');
    breakdown.push('+18 Beauty/wellness business');

  } else if (categoryMatch(category, HEALTH_CATEGORIES)) {
    score += 15;
    automationNeeds.push('Appointment booking', 'Patient reminders', 'Online intake forms');
    breakdown.push('+15 Health/medical business');

  } else if (categoryMatch(category, FITNESS_CATEGORIES)) {
    score += 12;
    automationNeeds.push('Class bookings', 'Membership management', 'Automated follow-ups');
    breakdown.push('+12 Fitness/wellness business');

  } else {
    score += 5;
    automationNeeds.push('Digital presence', 'Contact form');
    breakdown.push('+5 General business');
  }

  // ── 3. Business activity (rating + reviews) ──────────────────────────────
  if (rating >= 4.0 && reviewCount >= 50) {
    score += 15;
    breakdown.push(`+15 High activity (${rating}★, ${reviewCount} reviews)`);
  } else if (rating >= 4.0 && reviewCount >= 10) {
    score += 10;
    breakdown.push(`+10 Good activity (${rating}★, ${reviewCount} reviews)`);
  } else if (rating >= 3.5 && reviewCount >= 5) {
    score += 5;
    breakdown.push(`+5 Moderate activity (${rating}★, ${reviewCount} reviews)`);
  } else if (reviewCount > 0) {
    score += 2;
    breakdown.push(`+2 Has some reviews (${reviewCount})`);
  } else {
    breakdown.push('+0 No reviews yet');
  }

  // ── 4. Contactability (can the sales team reach them?) ───────────────────
  if (hasPhone) {
    score += 10;
    automationNeeds.push('CRM / call tracking integration');
    breakdown.push('+10 Has phone number (callable)');
  } else {
    breakdown.push('+0 No phone number');
  }

  // ── 5. Business is open ──────────────────────────────────────────────────
  if (isOp) {
    score += 5;
    breakdown.push('+5 Business is operational');
  } else {
    score -= 10;
    breakdown.push('-10 Business may be closed');
  }

  // ── Normalise ──────────────────────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score));

  const priority: 'hot' | 'warm' | 'cold' =
    score >= 65 ? 'hot' :
    score >= 40 ? 'warm' : 'cold';

  return {
    score,
    priority,
    automation_needs: [...new Set(automationNeeds)],
    scoring_breakdown: breakdown.join(' | '),
  };
}
