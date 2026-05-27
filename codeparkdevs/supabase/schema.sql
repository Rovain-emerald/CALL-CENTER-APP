-- ============================================================
-- CODEPARKDEVS — Supabase Schema
-- Run this in Supabase SQL Editor to set up your database
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ── ENUMS ────────────────────────────────────────────────────

create type plan_type as enum ('free', 'starter', 'pro', 'agency');
create type credit_action as enum ('image_gen', 'video_gen', 'text_gen', 'agent_run', 'post_scheduled', 'voice_gen', 'manual_adjustment');
create type agent_status as enum ('active', 'inactive');
create type generation_type as enum ('image', 'text', 'video', 'voice');
create type platform_type as enum ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest');
create type post_status as enum ('pending', 'approved', 'posted', 'failed');
create type library_item_type as enum ('image', 'video', 'document', 'brand_asset', 'code', 'audio');
create type announcement_type as enum ('announcement', 'changelog', 'feature');
create type subscription_status as enum ('active', 'canceled', 'past_due', 'trialing', 'incomplete');
create type audit_action as enum ('login', 'logout', 'create', 'update', 'delete', 'download', 'share', 'payment', 'agent_run', 'credit_deduction', 'security_event');

-- ── USERS ────────────────────────────────────────────────────

create table users (
  id text primary key,  -- Clerk user ID
  email text unique not null,
  name text,
  avatar_url text,
  plan plan_type default 'free' not null,
  credits integer default 50 not null check (credits >= 0),
  stripe_customer_id text unique,
  trial_ends_at timestamptz default (now() + interval '3 days'),
  theme text default 'dark',
  sidebar_collapsed boolean default false,
  accent_color text default '#C8A882',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table users enable row level security;
create policy "Users can read own data" on users for select using (auth.uid()::text = id);
create policy "Users can update own data" on users for update using (auth.uid()::text = id);
create policy "Service role full access to users" on users using (auth.role() = 'service_role');

-- ── CREDIT TRANSACTIONS ───────────────────────────────────────

create table credit_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references users(id) on delete cascade,
  action credit_action not null,
  amount integer not null,  -- negative = deduction, positive = top-up
  balance_after integer not null,
  metadata jsonb default '{}',
  created_at timestamptz default now() not null
);

alter table credit_transactions enable row level security;
create policy "Users can read own transactions" on credit_transactions for select using (auth.uid()::text = user_id);
create policy "Service role full access to credit_transactions" on credit_transactions using (auth.role() = 'service_role');

-- Index for dashboard queries
create index idx_credit_transactions_user_id on credit_transactions(user_id, created_at desc);

-- ── AGENTS ───────────────────────────────────────────────────

create table agents (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references users(id) on delete cascade,
  name text not null,
  persona text default '',
  tone text default 'professional',
  goals text default '',
  instructions text default '',
  memory jsonb default '{}',
  status agent_status default 'active' not null,
  runs_count integer default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table agents enable row level security;
create policy "Users can CRUD own agents" on agents using (auth.uid()::text = user_id);
create policy "Service role full access to agents" on agents using (auth.role() = 'service_role');

-- ── AGENT RUNS ────────────────────────────────────────────────

create table agent_runs (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid not null references agents(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  input text not null,
  output text,
  credits_used integer default 0,
  duration_ms integer,
  status text default 'completed',
  created_at timestamptz default now() not null
);

alter table agent_runs enable row level security;
create policy "Users can read own agent runs" on agent_runs for select using (auth.uid()::text = user_id);
create policy "Service role full access to agent_runs" on agent_runs using (auth.role() = 'service_role');

create index idx_agent_runs_user_id on agent_runs(user_id, created_at desc);

-- ── GENERATIONS ───────────────────────────────────────────────

create table generations (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references users(id) on delete cascade,
  type generation_type not null,
  prompt text not null,
  result_url text,
  result_text text,
  model text not null,
  metadata jsonb default '{}',
  credits_used integer default 0,
  created_at timestamptz default now() not null
);

alter table generations enable row level security;
create policy "Users can CRUD own generations" on generations using (auth.uid()::text = user_id);
create policy "Service role full access to generations" on generations using (auth.role() = 'service_role');

create index idx_generations_user_id on generations(user_id, created_at desc);

-- ── LIBRARY ITEMS ─────────────────────────────────────────────

create table library_items (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references users(id) on delete cascade,
  name text not null,
  type library_item_type not null,
  file_url text not null,
  file_size bigint,
  mime_type text,
  tags text[] default '{}',
  is_brand_asset boolean default false,
  created_at timestamptz default now() not null
);

alter table library_items enable row level security;
create policy "Users can CRUD own library items" on library_items using (auth.uid()::text = user_id);
create policy "Service role full access to library_items" on library_items using (auth.role() = 'service_role');

-- ── SOCIAL ACCOUNTS ──────────────────────────────────────────

create table social_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references users(id) on delete cascade,
  platform platform_type not null,
  account_name text,
  account_id text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  followers integer default 0,
  connected_at timestamptz default now() not null,
  unique(user_id, platform)
);

alter table social_accounts enable row level security;
create policy "Users can CRUD own social accounts" on social_accounts using (auth.uid()::text = user_id);
create policy "Service role full access to social_accounts" on social_accounts using (auth.role() = 'service_role');

-- ── SCHEDULED POSTS ──────────────────────────────────────────

create table scheduled_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references users(id) on delete cascade,
  content text not null,
  platforms platform_type[] not null,
  media_urls text[] default '{}',
  scheduled_at timestamptz not null,
  status post_status default 'pending' not null,
  approved boolean default false,
  generation_id uuid references generations(id),
  created_at timestamptz default now() not null
);

alter table scheduled_posts enable row level security;
create policy "Users can CRUD own scheduled posts" on scheduled_posts using (auth.uid()::text = user_id);
create policy "Service role full access to scheduled_posts" on scheduled_posts using (auth.role() = 'service_role');

-- ── SUBSCRIPTIONS ─────────────────────────────────────────────

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id text unique not null references users(id) on delete cascade,
  stripe_subscription_id text unique,
  plan plan_type not null,
  status subscription_status default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table subscriptions enable row level security;
create policy "Users can read own subscription" on subscriptions for select using (auth.uid()::text = user_id);
create policy "Service role full access to subscriptions" on subscriptions using (auth.role() = 'service_role');

-- ── AUDIT LOGS ────────────────────────────────────────────────

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id text references users(id) on delete set null,
  action audit_action not null,
  resource_type text,
  resource_id text,
  metadata jsonb default '{}',
  ip_address inet,
  created_at timestamptz default now() not null
);

alter table audit_logs enable row level security;
create policy "Users can read own audit logs" on audit_logs for select using (auth.uid()::text = user_id);
create policy "Service role full access to audit_logs" on audit_logs using (auth.role() = 'service_role');

create index idx_audit_logs_user_id on audit_logs(user_id, created_at desc);

-- ── COMMUNITY ANNOUNCEMENTS ───────────────────────────────────

create table community_announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  type announcement_type default 'announcement',
  created_at timestamptz default now() not null
);

alter table community_announcements enable row level security;
create policy "Anyone can read announcements" on community_announcements for select using (true);
create policy "Service role full access to announcements" on community_announcements using (auth.role() = 'service_role');

-- Insert default announcements
insert into community_announcements (title, content, type) values
  ('Welcome to Codeparkdevs!', 'We are excited to have you on board. Start by creating your first AI agent.', 'announcement'),
  ('v1.0 Launched', 'Image generation, AI agents, content scheduling, and social media automation are all live.', 'changelog'),
  ('FLUX Pro Now Available', 'Generate stunning images with FLUX Pro — our highest quality model with photorealistic results.', 'feature');

-- ── UPDATED_AT TRIGGERS ──────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on users for each row execute function update_updated_at();
create trigger agents_updated_at before update on agents for each row execute function update_updated_at();
create trigger subscriptions_updated_at before update on subscriptions for each row execute function update_updated_at();

-- ── STORAGE BUCKETS ──────────────────────────────────────────

-- Run in Supabase dashboard > Storage > New bucket:
-- 1. "user-uploads" — private, 50MB limit
-- 2. "generations" — private, 10MB limit
-- 3. "brand-assets" — private, 20MB limit
