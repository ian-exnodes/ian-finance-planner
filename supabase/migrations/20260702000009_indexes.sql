create index incomes_user_month_idx on public.incomes(user_id, month);
create index fixed_costs_user_idx on public.fixed_costs(user_id);
create index installments_user_start_month_idx on public.installments(user_id, start_month);
create index credit_cards_user_idx on public.credit_cards(user_id);
create index credit_transactions_user_statement_month_idx on public.credit_transactions(user_id, statement_month);
create index credit_transactions_card_idx on public.credit_transactions(card_id);
create index wishlist_items_user_expected_month_idx on public.wishlist_items(user_id, expected_purchase_month);
