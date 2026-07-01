# 05 — Tasklist

Use this file as the main execution queue for Claude Code.

## How to Work

For each task:

1. Read `AGENTS.md`.
2. Read `CLAUDE.md`.
3. Read relevant docs in `docs/`.
4. Read `.serena/memories/INDEX.md`.
5. Use Serena symbol tools when editing code symbols.
6. Implement one task or one small group of related tasks.
7. Run relevant verification.
8. Update this checklist.
9. Update Serena memory if durable knowledge changed.
10. Write a checkpoint.

## Phase 0 — Project Setup

- [x] Create Next.js App Router project with TypeScript.
- [x] Install Tailwind CSS.
- [x] Install shadcn/ui.
- [x] Install Supabase packages.
- [x] Install React Hook Form.
- [x] Install Zod.
- [x] Install Recharts.
- [x] Create base folder structure.
- [x] Add `.env.example`.
- [x] Add initial README.
- [x] Configure lint/typecheck/build scripts.
- [x] Verify `npm run build`.

## Phase 1 — Supabase + Auth

- [x] Create Supabase client utility.
- [x] Create Supabase server utility.
- [x] Create middleware/session handling.
- [x] Build landing page.
- [x] Build login page with Vietnamese UI.
- [x] Build signup flow.
- [x] Build sign-out action.
- [x] Protect app routes.
- [x] Redirect authenticated users to dashboard.
- [x] Verify unauthenticated access is blocked.
- [ ] Verify auth works after page refresh.

## Phase 2 — Database

- [ ] Create migration for enums.
- [ ] Create migration for `incomes`.
- [ ] Create migration for `fixed_costs`.
- [ ] Create migration for `installments`.
- [ ] Create migration for `credit_cards`.
- [ ] Create migration for `credit_transactions`.
- [ ] Create migration for `wishlist_items`.
- [ ] Add `updated_at` trigger function.
- [ ] Add triggers for all tables.
- [ ] Add indexes.
- [ ] Enable RLS.
- [ ] Add RLS policies.
- [ ] Verify users cannot read other users' rows.

## Phase 3 — Shared Utilities

- [ ] Create TypeScript domain types.
- [ ] Create VND formatter.
- [ ] Create Vietnamese date formatter.
- [ ] Create Vietnamese month formatter.
- [ ] Create debt ratio helper.
- [ ] Create month range helper.
- [ ] Create installment schedule helper.
- [ ] Create credit card due-by-month helper.
- [ ] Create monthly cashflow helper.
- [ ] Add tests for calculation helpers if test framework exists.

## Phase 4 — App Shell

- [ ] Create authenticated layout.
- [ ] Create sidebar navigation.
- [ ] Create mobile navigation.
- [ ] Create top bar.
- [ ] Add theme support.
- [ ] Add loading states.
- [ ] Add toast provider.
- [ ] Verify responsive layout.

## Phase 5 — Income

- [ ] Create income repository.
- [ ] Create income list page.
- [ ] Create income form.
- [ ] Add create income.
- [ ] Add edit income.
- [ ] Add delete income.
- [ ] Add empty state.
- [ ] Verify dashboard data updates after income changes.

## Phase 6 — Fixed Costs

- [ ] Create fixed costs repository.
- [ ] Create fixed costs list page.
- [ ] Create fixed cost form.
- [ ] Add create fixed cost.
- [ ] Add edit fixed cost.
- [ ] Add delete fixed cost.
- [ ] Add empty state.
- [ ] Verify fixed costs affect dashboard.

## Phase 7 — Installments

- [ ] Create installments repository.
- [ ] Create installments list page.
- [ ] Create installment form.
- [ ] Add create installment.
- [ ] Add edit installment.
- [ ] Add delete installment.
- [ ] Calculate monthly payment automatically.
- [ ] Show remaining months.
- [ ] Show remaining balance.
- [ ] Verify active installments affect dashboard.
- [ ] Verify paid/paused installments do not affect dashboard.

## Phase 8 — Credit Cards

- [ ] Create credit cards repository.
- [ ] Create credit cards page.
- [ ] Add card CRUD.
- [ ] Create transaction repository.
- [ ] Add transaction CRUD.
- [ ] Add paid/unpaid status.
- [ ] Show totals by statement month.
- [ ] Verify transactions affect dashboard.

## Phase 9 — Wishlist

- [ ] Create wishlist repository.
- [ ] Create wishlist page.
- [ ] Add wishlist CRUD.
- [ ] Calculate monthly payment impact.
- [ ] Calculate projected debt ratio.
- [ ] Show decision label.
- [ ] Add helpful Vietnamese explanation.
- [ ] Verify wishlist does not affect real dashboard debt unless implemented as actual installment.

## Phase 10 — Dashboard

- [ ] Create dashboard data loader.
- [ ] Build summary cards.
- [ ] Build monthly repayment chart.
- [ ] Build remaining cash chart.
- [ ] Build debt ratio chart.
- [ ] Build debt breakdown chart.
- [ ] Add current month selector.
- [ ] Add empty state if no data.
- [ ] Verify all calculations with sample data.

## Phase 11 — Seed Data

- [ ] Add development-only seed button.
- [ ] Seed current user only.
- [ ] Seed income.
- [ ] Seed fixed costs.
- [ ] Seed installments.
- [ ] Seed credit transactions.
- [ ] Seed wishlist.
- [ ] Prevent duplicate seed data or warn before creating duplicates.

## Phase 12 — Polish + Verification

- [ ] Review all Vietnamese UI copy.
- [ ] Review mobile layout.
- [ ] Review dark mode.
- [ ] Review loading/error/empty states.
- [ ] Review destructive confirmations.
- [ ] Run typecheck.
- [ ] Run lint.
- [ ] Run build.
- [ ] Fix all blocking issues.
- [ ] Update README.
- [ ] Write final checkpoint.
