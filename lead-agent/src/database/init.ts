import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { DB_PATH } from '../config';
import { logger } from '../utils/logger';

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const resolvedPath = path.resolve(DB_PATH);
  const dir = path.dirname(resolvedPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  _db = new Database(resolvedPath);
  _db.pragma('journal_mode = WAL');   // Better concurrent reads
  _db.pragma('foreign_keys = ON');
  _db.pragma('synchronous = NORMAL'); // Good balance of safety/speed

  initSchema(_db);
  logger.info(`Database ready at: ${resolvedPath}`);

  return _db;
}

export function closeDb() {
  if (_db) {
    _db.close();
    _db = null;
    logger.info('Database closed');
  }
}

function initSchema(db: Database.Database) {
  db.exec(`
    -- ── Leads ────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS leads (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name    TEXT    NOT NULL,
      phone            TEXT,
      address          TEXT,
      city             TEXT,
      category         TEXT    NOT NULL,
      google_place_id  TEXT    UNIQUE,
      website          TEXT,
      has_website      INTEGER NOT NULL DEFAULT 0,  -- 0 = no, 1 = yes
      rating           REAL,
      review_count     INTEGER DEFAULT 0,
      score            INTEGER NOT NULL,            -- 0-100
      automation_needs TEXT,                        -- comma-separated list
      priority         TEXT    NOT NULL,            -- hot | warm | cold
      status           TEXT    NOT NULL DEFAULT 'new',  -- new | contacted | converted | skip
      notes            TEXT,
      created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_leads_priority   ON leads(priority);
    CREATE INDEX IF NOT EXISTS idx_leads_score      ON leads(score DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_created    ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_has_website ON leads(has_website);

    -- ── Search History ────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS search_history (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      location       TEXT    NOT NULL,
      category       TEXT    NOT NULL,
      results_found  INTEGER DEFAULT 0,
      leads_saved    INTEGER DEFAULT 0,
      cycle_summary  TEXT,
      searched_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ── Agent Sessions ────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS agent_sessions (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      session_type TEXT    NOT NULL DEFAULT 'research', -- research | report
      location     TEXT,
      category     TEXT,
      status       TEXT    NOT NULL DEFAULT 'running',  -- running | done | error
      leads_found  INTEGER DEFAULT 0,
      leads_saved  INTEGER DEFAULT 0,
      error_msg    TEXT,
      started_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at     DATETIME
    );
  `);
}
