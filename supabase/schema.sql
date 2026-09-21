-- ==============================================================================
-- OpsDesk IT — Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/qunqprgjxsuyvcugtzmr/sql)
-- ==============================================================================

-- 1. Profiles Table (Users & IT Staff)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null default 'user' check (role in ('agent', 'user')),
  department text not null default 'General Staff',
  avatar_initials text not null,
  created_at timestamptz not null default now()
);

-- 2. Tickets Table
create table if not exists public.tickets (
  id text primary key,
  title text not null,
  description text not null,
  status text not null default 'triage' check (status in ('triage', 'in_progress', 'waiting_user', 'escalated', 'resolved', 'closed')),
  priority text not null default 'P3' check (priority in ('P1', 'P2', 'P3', 'P4')),
  category text not null default 'Endpoint & Hardware',
  requester jsonb not null,
  assignee jsonb,
  sla_target_minutes integer not null default 480,
  sla_remaining_minutes integer not null default 480,
  tags text[] not null default '{}',
  device jsonb not null default '{}',
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Comments & Activity Table
create table if not exists public.ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null references public.tickets(id) on delete cascade,
  author jsonb not null,
  content text not null,
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_comments enable row level security;

-- Permissive public policies for app interaction (Anon Key access)
create policy "Allow all operations for anon on profiles"
  on public.profiles for all
  using (true)
  with check (true);

create policy "Allow all operations for anon on tickets"
  on public.tickets for all
  using (true)
  with check (true);

create policy "Allow all operations for anon on ticket_comments"
  on public.ticket_comments for all
  using (true)
  with check (true);

-- 5. Enable Supabase Realtime for instant WebSocket updates across team devices
alter publication supabase_realtime add table public.tickets;
alter publication supabase_realtime add table public.ticket_comments;

-- 6. Insert Default Organization Owner: John Lester Fuertes
insert into public.profiles (name, email, role, department, avatar_initials)
values ('John Lester Fuertes', 'john.fuertes@company.com', 'agent', 'IT Administration', 'JF')
on conflict (email) do nothing;
