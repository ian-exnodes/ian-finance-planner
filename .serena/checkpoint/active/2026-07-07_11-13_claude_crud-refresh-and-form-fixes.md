# Checkpoint: claude — 2026-07-07 11:13 +07 — CRUD refresh/form bugs + income UX

Date: 2026-07-07
Time: 11:13 +07
Author/Agent: claude
Branch: main
Commit: uncommitted
Topic: Fix "can't delete/update" + "no loading state" bug report; income UX requests

## What was done

- Root-caused via DB snapshot diff (service role key) on the deployed Vercel app: deletes/updates
  DO hit the database correctly. The bug is purely client-side, two causes, present in all 6
  CRUD features:
  1. Server Actions were invoked via `startTransition(async () => await action())` (not
     `<form action>`), so Next.js never auto-refreshed the route after `revalidatePath`. Fixed by
     calling `router.refresh()` after every successful mutation.
  2. `useForm({ defaultValues: entity ? {...} : {...} })` only reads defaultValues once at mount;
     reopening an edit dialog for the same row showed stale (pre-edit) values. Fixed with a
     `useEffect` that calls `form.reset(buildDefaultValues(entity))` whenever `open` becomes true.
  3. (Secondary, explains "no loading state" on delete) Radix `AlertDialogAction` closes the
     dialog on click by default; `disabled={isPending}` never had a chance to render. Fixed by
     controlling `open`/`onOpenChange` (gated on `isPending`) plus `event.preventDefault()` in the
     confirm handler, so the dialog now stays open with a visible "Đang xóa..." state.
- Applied all three fixes to all 6 CRUD surfaces: income, fixed-costs, installments,
  credit-cards (cards + transactions + paid-toggle), wishlist.
- Built `src/components/shared/currency-input.tsx` — VND thousands-separator input, nullable-aware
  — and swapped it in for every money field app-wide (income salary/bonus/other, fixed_costs.amount,
  installments.total_amount/monthly_payment, credit_cards.credit_limit, credit_transactions.amount,
  wishlist.price).
- Income-specific new UX (user's step-by-step request, scoped to income only):
  - Autofocus the month field on dialog open (`onOpenAutoFocus` + `form.setFocus("month")`).
  - "Dùng lại số liệu tháng trước" button in create mode, prefills salary/bonus/other from the
    most recent income row (passed in as `previousIncome` prop from the page).

## Files changed

- src/components/shared/currency-input.tsx (new)
- src/app/(app)/incomes/page.tsx
- src/features/income/{income-dialog,delete-income-button}.tsx
- src/features/fixed-costs/{fixed-cost-dialog,delete-fixed-cost-button}.tsx
- src/features/installments/{installment-dialog,delete-installment-button}.tsx
- src/features/credit-cards/{card-dialog,transaction-dialog,delete-card-button,transactions-table}.tsx
- src/features/wishlist/{wishlist-dialog,delete-wishlist-button}.tsx

## Current state

- working (tsc + eslint clean on all changed files)

## Verified

- npx tsc --noEmit — clean
- npx eslint <all changed files> — clean
- NOT yet verified live on Vercel — user should redeploy and re-test delete/update on income,
  confirm the row now disappears/updates without a manual reload, and reopening an edited row
  shows the new values.

## Next steps

- User has 3 more income-only asks not yet done: (1) verify "modal can't close during
  update" (create dialog now uses the same isPending-gated onOpenChange, should already hold);
  (2) confirm autofocus/copy-previous-month feel right in the browser; (3) once income is
  confirmed good, user said to proceed step-by-step to the other sections — the underlying
  bug fixes are already replicated there, but the *new* UX (autofocus, "copy previous", etc.)
  was intentionally left income-only per "we go step by step."

## Blockers / Risks

- Root cause for issue #1 (missing `router.refresh()`) was confirmed by symptom-matching
  (DB changed, screen didn't, per user's own testing), not by reading a Next.js changelog line
  directly — recommend the user do one more live delete/update pass after deploy to be certain.
- CurrencyInput is a new component with no automated tests; only exercised via read/typecheck.
