# 03 — Database Specification

## General Rules

Use Supabase Postgres.

Every user-owned table must include:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Enable Row Level Security for every user-owned table.

## Tables

- `incomes`
- `fixed_costs`
- `installments`
- `credit_cards`
- `credit_transactions`
- `wishlist_items`

## Migration SQL

```sql
create table public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null,
  salary numeric not null default 0,
  bonus numeric not null default 0,
  other numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create type installment_type as enum (
  'credit_card',
  'pay_later',
  'loan',
  'other'
);

create type installment_status as enum (
  'active',
  'paid',
  'paused'
);

create table public.installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  provider text not null,
  type installment_type not null default 'other',
  purchase_date date not null,
  total_amount numeric not null,
  months int not null,
  monthly_payment numeric,
  start_month text not null,
  due_day int,
  status installment_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  provider text not null,
  statement_day int,
  due_day int,
  credit_limit numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.credit_cards(id) on delete cascade,
  date date not null,
  description text not null,
  category text not null,
  amount numeric not null,
  statement_month text not null,
  due_date date,
  paid boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type wishlist_priority as enum (
  'low',
  'medium',
  'high'
);

create type wishlist_need_level as enum (
  'nice_to_have',
  'useful',
  'necessary'
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  price numeric not null,
  payment_method text not null,
  months int not null default 1,
  expected_purchase_month text not null,
  priority wishlist_priority not null default 'medium',
  need_level wishlist_need_level not null default 'useful',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Updated At Trigger

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Add a `before update` trigger for all user-owned tables.

## RLS Policy Pattern

For every table:

```sql
alter table public.<table_name> enable row level security;

create policy "Users can view own <table_name>"
on public.<table_name>
for select
using (auth.uid() = user_id);

create policy "Users can insert own <table_name>"
on public.<table_name>
for insert
with check (auth.uid() = user_id);

create policy "Users can update own <table_name>"
on public.<table_name>
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own <table_name>"
on public.<table_name>
for delete
using (auth.uid() = user_id);
```

## Recommended Indexes

```sql
create index incomes_user_month_idx on public.incomes(user_id, month);
create index fixed_costs_user_idx on public.fixed_costs(user_id);
create index installments_user_start_month_idx on public.installments(user_id, start_month);
create index credit_cards_user_idx on public.credit_cards(user_id);
create index credit_transactions_user_statement_month_idx on public.credit_transactions(user_id, statement_month);
create index credit_transactions_card_idx on public.credit_transactions(card_id);
create index wishlist_items_user_expected_month_idx on public.wishlist_items(user_id, expected_purchase_month);
```
