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
- [x] Verify auth works after page refresh.

## Phase 2 — Database

- [x] Create migration for enums.
- [x] Create migration for `incomes`.
- [x] Create migration for `fixed_costs`.
- [x] Create migration for `installments`.
- [x] Create migration for `credit_cards`.
- [x] Create migration for `credit_transactions`.
- [x] Create migration for `wishlist_items`.
- [x] Add `updated_at` trigger function.
- [x] Add triggers for all tables.
- [x] Add indexes.
- [x] Enable RLS.
- [x] Add RLS policies.
- [x] Verify users cannot read other users' rows.

## Phase 3 — Shared Utilities

- [x] Create TypeScript domain types.
- [x] Create VND formatter.
- [x] Create Vietnamese date formatter.
- [x] Create Vietnamese month formatter.
- [x] Create debt ratio helper.
- [x] Create month range helper.
- [x] Create installment schedule helper.
- [x] Create credit card due-by-month helper.
- [x] Create monthly cashflow helper.
- [x] Add tests for calculation helpers if test framework exists. (no framework in repo — verified via standalone assert script instead)

## Phase 4 — App Shell

- [x] Create authenticated layout.
- [x] Create sidebar navigation.
- [x] Create mobile navigation.
- [x] Create top bar.
- [x] Add theme support.
- [x] Add loading states.
- [x] Add toast provider.
- [x] Verify responsive layout. (verified at markup level + build; visual click-through pending a browser session)

## Phase 5 — Income

- [x] Create income repository.
- [x] Create income list page.
- [x] Create income form.
- [x] Add create income.
- [x] Add edit income.
- [x] Add delete income.
- [x] Add empty state.
- [x] Verify dashboard data updates after income changes. (verified live in Phase 10 test)

## Phase 6 — Fixed Costs

- [x] Create fixed costs repository.
- [x] Create fixed costs list page.
- [x] Create fixed cost form.
- [x] Add create fixed cost.
- [x] Add edit fixed cost.
- [x] Add delete fixed cost.
- [x] Add empty state.
- [x] Verify fixed costs affect dashboard. (verified live in Phase 10 test)

## Phase 7 — Installments

- [x] Create installments repository.
- [x] Create installments list page.
- [x] Create installment form.
- [x] Add create installment.
- [x] Add edit installment.
- [x] Add delete installment.
- [x] Calculate monthly payment automatically.
- [x] Show remaining months.
- [x] Show remaining balance.
- [x] Verify active installments affect dashboard. (verified live in Phase 10 test)
- [x] Verify paid/paused installments do not affect dashboard. (verified live in Phase 10 test)

## Phase 8 — Credit Cards

- [x] Create credit cards repository.
- [x] Create credit cards page.
- [x] Add card CRUD.
- [x] Create transaction repository.
- [x] Add transaction CRUD.
- [x] Add paid/unpaid status.
- [x] Show totals by statement month.
- [x] Verify transactions affect dashboard. (verified live in Phase 10 test; paid transactions excluded)

## Phase 9 — Wishlist

- [x] Create wishlist repository.
- [x] Create wishlist page.
- [x] Add wishlist CRUD.
- [x] Calculate monthly payment impact.
- [x] Calculate projected debt ratio.
- [x] Show decision label.
- [x] Add helpful Vietnamese explanation.
- [x] Verify wishlist does not affect real dashboard debt unless implemented as actual installment. (cashflow calculation takes no wishlist input — verified structurally)

## Phase 10 — Dashboard

- [x] Create dashboard data loader.
- [x] Build summary cards.
- [x] Build monthly repayment chart.
- [x] Build remaining cash chart.
- [x] Build debt ratio chart.
- [x] Build debt breakdown chart.
- [x] Add current month selector.
- [x] Add empty state if no data.
- [x] Verify all calculations with sample data.

## Phase 11 — Seed Data

- [x] Add development-only seed button.
- [x] Seed current user only.
- [x] Seed income.
- [x] Seed fixed costs.
- [x] Seed installments.
- [x] Seed credit transactions.
- [x] Seed wishlist.
- [x] Prevent duplicate seed data or warn before creating duplicates. (action refuses unless the account has no data)

## Phase 12 — Polish + Verification

- [x] Improve mobile records for income, fixed costs, installments, and credit-card transactions
- [x] Present finance dialogs as mobile bottom sheets below 768px
- [x] Review all Vietnamese UI copy. (scanned all JSX text, placeholders, aria-labels, toasts — no stray English UI copy found)
- [x] Review mobile layout. (every table wrapped in overflow-x-auto; responsive grid breakpoints consistent across pages)
- [x] Review dark mode. (no hardcoded light-only colors outside the validated --viz-* chart tokens; both mode variants confirmed in compiled CSS)
- [x] Review loading/error/empty states. (shared (app)/loading.tsx + error.tsx cover all nested routes; all 6 feature pages + dashboard have empty states)
- [x] Review destructive confirmations. (all 6 delete flows use the design-system confirmation copy; card delete adds a cascade warning)
- [x] Run typecheck.
- [x] Run lint.
- [x] Run build.
- [x] Fix all blocking issues. (none found)
- [x] Update README.
- [x] Write final checkpoint.
