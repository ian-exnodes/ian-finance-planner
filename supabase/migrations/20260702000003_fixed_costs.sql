create table public.fixed_costs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  amount numeric not null default 0,
  due_day int,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
