-- Enable RLS and add owner-only policies for every user-owned table
-- (pattern from docs/03-DATABASE.md)

alter table public.incomes enable row level security;

create policy "Users can view own incomes"
on public.incomes
for select
using (auth.uid() = user_id);

create policy "Users can insert own incomes"
on public.incomes
for insert
with check (auth.uid() = user_id);

create policy "Users can update own incomes"
on public.incomes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own incomes"
on public.incomes
for delete
using (auth.uid() = user_id);

alter table public.fixed_costs enable row level security;

create policy "Users can view own fixed_costs"
on public.fixed_costs
for select
using (auth.uid() = user_id);

create policy "Users can insert own fixed_costs"
on public.fixed_costs
for insert
with check (auth.uid() = user_id);

create policy "Users can update own fixed_costs"
on public.fixed_costs
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own fixed_costs"
on public.fixed_costs
for delete
using (auth.uid() = user_id);

alter table public.installments enable row level security;

create policy "Users can view own installments"
on public.installments
for select
using (auth.uid() = user_id);

create policy "Users can insert own installments"
on public.installments
for insert
with check (auth.uid() = user_id);

create policy "Users can update own installments"
on public.installments
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own installments"
on public.installments
for delete
using (auth.uid() = user_id);

alter table public.credit_cards enable row level security;

create policy "Users can view own credit_cards"
on public.credit_cards
for select
using (auth.uid() = user_id);

create policy "Users can insert own credit_cards"
on public.credit_cards
for insert
with check (auth.uid() = user_id);

create policy "Users can update own credit_cards"
on public.credit_cards
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own credit_cards"
on public.credit_cards
for delete
using (auth.uid() = user_id);

alter table public.credit_transactions enable row level security;

create policy "Users can view own credit_transactions"
on public.credit_transactions
for select
using (auth.uid() = user_id);

create policy "Users can insert own credit_transactions"
on public.credit_transactions
for insert
with check (auth.uid() = user_id);

create policy "Users can update own credit_transactions"
on public.credit_transactions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own credit_transactions"
on public.credit_transactions
for delete
using (auth.uid() = user_id);

alter table public.wishlist_items enable row level security;

create policy "Users can view own wishlist_items"
on public.wishlist_items
for select
using (auth.uid() = user_id);

create policy "Users can insert own wishlist_items"
on public.wishlist_items
for insert
with check (auth.uid() = user_id);

create policy "Users can update own wishlist_items"
on public.wishlist_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own wishlist_items"
on public.wishlist_items
for delete
using (auth.uid() = user_id);
