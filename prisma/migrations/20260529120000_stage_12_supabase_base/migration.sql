create extension if not exists pgcrypto;

create type public.project_type as enum (
  'audio_summary',
  'video_subtitle'
);

create type public.project_status as enum (
  'processing',
  'completed',
  'draft'
);

create type public.draft_kind as enum (
  'audio',
  'subtitle'
);

create type public.export_record_type as enum (
  'meeting_summary',
  'subtitle_file',
  'transcript_text'
);

create type public.export_format as enum (
  'TXT',
  'SRT',
  'VTT'
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type public.project_type not null,
  status public.project_status not null default 'processing',
  file_name text not null,
  file_format text not null,
  file_size text,
  file_mime_type text,
  duration text,
  owner text,
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_drafts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  kind public.draft_kind not null,
  content jsonb not null,
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.export_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  project_title text not null,
  file_name text not null,
  type public.export_record_type not null,
  format public.export_format not null,
  exported_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index export_records_project_id_idx on public.export_records(project_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger set_project_drafts_updated_at
before update on public.project_drafts
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.project_drafts enable row level security;
alter table public.export_records enable row level security;
