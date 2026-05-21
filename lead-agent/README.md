# 🤖 Lead Research Agent

An AI-powered agent that runs **24/7** and automatically finds businesses **without websites** that need web development and automation services — feeding qualified leads directly into the Veritas Call Center pipeline.

## How It Works

```
Every 4 hours (by default):
  Claude Opus 4.7 (AI brain)
       │
       ├─ search_businesses()  ──► Google Places API (or mock data)
       │                               ↓ list of businesses
       ├─ check_website()      ──► DNS lookup + HTTP check
       │                               ↓ has_website: true/false
       ├─ score_lead()         ──► Scoring algorithm (0–100)
       │                               ↓ priority: hot/warm/cold
       └─ save_lead()          ──► SQLite database
```

Claude acts as the **intelligent orchestrator** — it decides which businesses to investigate, handles edge cases, and writes concise summaries after each cycle.

## Quick Start

### 1. Install dependencies

```bash
cd lead-agent
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Run

```bash
# Start 24/7 scheduler (runs every 4 hours)
npm start

# Run a single research cycle right now
npm run cycle

# Research a specific location/category
npm run cycle -- -l "Cape Town, South Africa" -c "plumber"

# View today's report
npm run report

# List latest leads
npm run leads          # all
npm run leads -- hot   # hot leads only

# Show stats
npm run status
```

## API Keys

| Key | Required | Purpose |
|-----|----------|---------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Claude AI — the agent's brain |
| `GOOGLE_PLACES_API_KEY` | 🟡 Optional | Real business data; without it runs in **mock mode** |

### Getting API Keys

- **Anthropic**: https://console.anthropic.com/settings/keys
- **Google Places**: https://console.cloud.google.com → Enable "Places API (New)"

> **Mock Mode**: If no Google Places key is set, the agent uses realistic generated business data from South African cities. Great for testing!

## Lead Scoring (0–100)

| Points | Criteria |
|--------|---------|
| +40 | No website (core opportunity) |
| +20 | Service business (plumber, electrician, cleaner…) |
| +18 | Beauty/salon business |
| +16 | Restaurant/food business |
| +15 | Active (4★+ rating, 10+ reviews) |
| +10 | Has phone number (callable) |
| +5  | Business is operational |

**Priority tiers:**
- 🔥 **Hot** (65–100): Ideal lead — no website, active, callable
- 🌡️ **Warm** (40–64): Good lead — worth contacting
- ❄️ **Cold** (<40): Lower priority

## Research Targets

The agent rotates through 30+ `(location, category)` pairs covering:

**Cities**: Johannesburg, Cape Town, Durban, Pretoria, Port Elizabeth, Bloemfontein, and more

**Categories**: Plumbers, Electricians, Mechanics, Hair salons, Restaurants, Cleaning services, Landscapers, Pest control, Gyms, Dentists, Physiotherapists

> Add more targets in `src/config.ts` → `RESEARCH_TARGETS`

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | — | Required |
| `GOOGLE_PLACES_API_KEY` | — | Optional (enables real data) |
| `RESEARCH_CRON` | `0 */4 * * *` | How often to run a cycle |
| `MIN_LEAD_SCORE` | `40` | Minimum score to save a lead |
| `DB_PATH` | `./data/leads.db` | SQLite database path |
| `LOG_LEVEL` | `info` | Logging verbosity |

## Database

All leads are stored in SQLite at `./data/leads.db`. The schema includes:

- **leads**: All discovered leads with scores, priorities, contact info
- **search_history**: Log of every research cycle run
- **agent_sessions**: Claude session tracking

### Accessing leads programmatically

```typescript
import Database from 'better-sqlite3';
const db = new Database('./data/leads.db');
const hotLeads = db.prepare("SELECT * FROM leads WHERE priority = 'hot' ORDER BY score DESC").all();
```

## Running 24/7 in Production

### Option 1: PM2 (recommended)

```bash
npm install -g pm2
pm2 start "npm start" --name lead-agent
pm2 save
pm2 startup  # Auto-start on system boot
```

### Option 2: Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY lead-agent/ .
RUN npm install
CMD ["npm", "start"]
```

### Option 3: systemd (Linux)

```ini
[Unit]
Description=Lead Research Agent
After=network.target

[Service]
WorkingDirectory=/path/to/lead-agent
ExecStart=/usr/bin/npm start
Restart=always
EnvironmentFile=/path/to/lead-agent/.env

[Install]
WantedBy=multi-user.target
```

## Cost Estimates

| Component | Cost |
|-----------|------|
| Claude Opus 4.7 per cycle | ~$0.05–0.15 |
| 6 cycles/day | ~$0.30–0.90/day |
| Monthly | ~$9–27/month |
| Google Places per cycle | $0.017 (Text Search) |
| 6 searches/day | ~$0.10/day = $3/month |
| **Total** | **~$12–30/month** |

> Switch `claude-opus-4-7` to `claude-haiku-4-5` in `src/config.ts` for ~90% cost reduction with slightly lower quality.

## Architecture

```
lead-agent/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── agent.ts          # Claude agentic loop (the AI brain)
│   ├── config.ts         # Research targets & configuration
│   ├── database/
│   │   ├── init.ts       # SQLite schema & connection
│   │   └── queries.ts    # CRUD operations
│   ├── tools/
│   │   ├── definitions.ts       # Tool schemas for Claude
│   │   ├── searchBusinesses.ts  # Google Places / mock search
│   │   ├── checkWebsite.ts      # Website detection
│   │   ├── scoreLead.ts         # Lead scoring algorithm
│   │   ├── saveLead.ts          # Database persistence
│   │   ├── getSearchStats.ts    # Coverage statistics
│   │   ├── generateReport.ts    # Daily reports
│   │   └── index.ts             # Tool dispatcher
│   └── utils/
│       ├── logger.ts     # Winston logger
│       └── scheduler.ts  # node-cron 24/7 scheduling
└── data/
    └── leads.db          # SQLite database (auto-created)
```
