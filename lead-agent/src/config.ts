import 'dotenv/config';

// ── Research Targets ──────────────────────────────────────────────────────────
// The agent rotates through these (location, category) pairs every cycle.
// Add or remove to focus on specific markets.
export const RESEARCH_TARGETS: Array<{ location: string; category: string }> = [
  // Johannesburg — service businesses
  { location: 'Johannesburg, South Africa', category: 'plumber' },
  { location: 'Johannesburg, South Africa', category: 'electrician' },
  { location: 'Johannesburg, South Africa', category: 'mechanic' },
  { location: 'Johannesburg, South Africa', category: 'cleaning service' },
  { location: 'Johannesburg, South Africa', category: 'painter' },
  { location: 'Johannesburg, South Africa', category: 'hair salon' },
  { location: 'Johannesburg, South Africa', category: 'restaurant' },
  // Cape Town — service businesses
  { location: 'Cape Town, South Africa', category: 'plumber' },
  { location: 'Cape Town, South Africa', category: 'electrician' },
  { location: 'Cape Town, South Africa', category: 'mechanic' },
  { location: 'Cape Town, South Africa', category: 'hair salon' },
  { location: 'Cape Town, South Africa', category: 'restaurant' },
  { location: 'Cape Town, South Africa', category: 'cleaning service' },
  // Durban
  { location: 'Durban, South Africa', category: 'plumber' },
  { location: 'Durban, South Africa', category: 'electrician' },
  { location: 'Durban, South Africa', category: 'restaurant' },
  { location: 'Durban, South Africa', category: 'hair salon' },
  // Pretoria
  { location: 'Pretoria, South Africa', category: 'plumber' },
  { location: 'Pretoria, South Africa', category: 'electrician' },
  { location: 'Pretoria, South Africa', category: 'mechanic' },
  // Other cities
  { location: 'Port Elizabeth, South Africa', category: 'plumber' },
  { location: 'Bloemfontein, South Africa', category: 'plumber' },
  { location: 'Polokwane, South Africa', category: 'electrician' },
  { location: 'East London, South Africa', category: 'mechanic' },
  // Niche categories
  { location: 'Johannesburg, South Africa', category: 'landscaper' },
  { location: 'Johannesburg, South Africa', category: 'pest control' },
  { location: 'Cape Town, South Africa', category: 'pool cleaning' },
  { location: 'Johannesburg, South Africa', category: 'gym' },
  { location: 'Cape Town, South Africa', category: 'dentist' },
  { location: 'Johannesburg, South Africa', category: 'physiotherapist' },
];

// ── Schedule ──────────────────────────────────────────────────────────────────
export const SCHEDULE = {
  /** How often to run a research cycle (default: every 4 hours) */
  RESEARCH_CRON: process.env.RESEARCH_CRON || '0 */4 * * *',
  /** Daily summary report at 6am */
  DAILY_REPORT_CRON: '0 6 * * *',
  /** Weekly deep report on Sunday at 8am */
  WEEKLY_REPORT_CRON: '0 8 * * 0',
};

// ── Agent Config ──────────────────────────────────────────────────────────────
export const AGENT_CONFIG = {
  MODEL: 'claude-opus-4-7' as const,
  MAX_TOKENS: 4096,
  /** Max tool-call iterations per cycle (safety limit) */
  MAX_ITERATIONS: 30,
  /** Only save leads scoring at or above this threshold */
  MIN_LEAD_SCORE: parseInt(process.env.MIN_LEAD_SCORE || '40', 10),
  /** Max businesses to check per search */
  MAX_BUSINESSES_PER_CYCLE: parseInt(process.env.MAX_BUSINESSES_PER_CYCLE || '20', 10),
};

// ── Paths ─────────────────────────────────────────────────────────────────────
export const DB_PATH = process.env.DB_PATH || './data/leads.db';

// ── API Keys ──────────────────────────────────────────────────────────────────
export const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY is required. Copy .env.example to .env and add your key.');
  process.exit(1);
}

export const USE_MOCK_DATA = !GOOGLE_PLACES_API_KEY;
