-- ============================================
-- Supabase Schema for Makrab SI ITK 2023
-- Committee Members Table
-- ============================================

-- Create the table
create table committee_members (
  id uuid primary key default gen_random_uuid(),
  division text not null check (division in ('perkamjin', 'pdd', 'acara', 'konkos')),
  name text not null,
  nim text not null,
  role text not null default 'anggota' check (role in ('pj', 'anggota')),
  created_at timestamp with time zone default now()
);

-- Create unique index to prevent duplicate NIM per division
create unique index unique_member_per_division
on committee_members (division, nim);

-- Enable Row Level Security
alter table committee_members enable row level security;

-- Policy: Anyone can read committee members
create policy "Anyone can read committee members"
on committee_members
for select
using (true);

-- Policy: Anyone can insert committee members (only as 'anggota')
create policy "Anyone can insert committee members"
on committee_members
for insert
with check (role = 'anggota');
