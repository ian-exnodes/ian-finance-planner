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
