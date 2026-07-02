-- Keep updated_at current on every row update

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
before update on public.incomes
for each row execute function public.set_updated_at();

create trigger set_updated_at
before update on public.fixed_costs
for each row execute function public.set_updated_at();

create trigger set_updated_at
before update on public.installments
for each row execute function public.set_updated_at();

create trigger set_updated_at
before update on public.credit_cards
for each row execute function public.set_updated_at();

create trigger set_updated_at
before update on public.credit_transactions
for each row execute function public.set_updated_at();

create trigger set_updated_at
before update on public.wishlist_items
for each row execute function public.set_updated_at();
