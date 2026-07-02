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
