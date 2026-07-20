# Checkpoint: claude — 2026-07-17 14:35 +07 — income UX verified in browser

Date: 2026-07-17
Time: 14:35 +07 (supersedes the 10:30 "blocked" state — Supabase was resumed by the owner)
Author/Agent: claude
Branch: main
Commit: 5b199da + 1 uncommitted fix
Topic: Browser-verify income UX; propagate autofocus/copy-previous to next section

## What was done

- Supabase was paused (NXDOMAIN at 10:30); owner resumed it, dashboard now STATUS Healthy.
  Verification then ran for real against the live DB.
- **Verified all 3 income items from the 2026-07-07 checkpoint (browser, real DB):**
  1. Autofocus — focus lands on the month input on dialog open. WORKS.
  2. "Dùng lại số liệu tháng trước" — prefills salary/bonus/other from the previous row and
     correctly leaves `month` alone. Verified end-to-end: created 06/2026 (25M/5M/1M), then the
     copy button produced an identical 07/2026 row.
  3. Modal cannot close mid-update — CONFIRMED with a 100ms DOM sampler: pending began at
     t=2901ms ("Đang lưu..."), dialog still open at t=9201ms despite Escape. Control test proves
     Escape DOES close the dialog when idle, so the test was not vacuous.
- **Bonus: the 2026-07-07 `router.refresh()` CRUD fix is now verified live** (it was listed as
  "NOT yet verified" there). New rows appear immediately with a toast, no manual reload.
- **BUG FOUND + FIXED — duplicated word in the copy button label.** `formatMonthVi` already
  returns "Tháng MM/YYYY" (`src/lib/formatters/month.ts:5`), but `income-dialog.tsx:156` also
  prepended the literal "tháng", rendering "Dùng lại số liệu tháng Tháng 06/2026". Every other
  formatMonthVi caller uses it standalone; this was the only one that prepended. Shipped
  2026-07-07 because the feature was never opened in a browser. Now reads
  "Dùng lại số liệu Tháng 06/2026".

## Decisions

- **copy-previous stays income-only** (owner's call). Income is the only entity with a bare
  `month` field. Fixed costs / credit cards are standing items; installments / wishlist / credit
  transactions are one-time purchases. Nothing to copy from.
- **autofocus is NOT propagated — deliberately.** The `onOpenAutoFocus` override is redundant.
  Proven two ways:
  - Source: `react-dialog/dist/index.mjs:217` forwards `onOpenAutoFocus` → FocusScope's
    `onMountAutoFocus`; `react-focus-scope/dist/index.mjs:81` focuses the FIRST TABBABLE element
    when not defaultPrevented. `src/components/ui/dialog.tsx:46-47` renders `{children}` before
    the close button, so that first tabbable IS the first form field.
  - Empirical (income): removed the override, reloaded, reopened — focus STILL landed on month.
  - Empirical (fixed-costs): OBSERVED in browser — the fixed-costs dialog has NO override and
    focuses `name` (placeholder "Tiền thuê nhà") on open, purely via Radix.
  => Fixed-costs already has the autofocus UX. Adding the override there = dead code.

## Files changed

- src/features/income/income-dialog.tsx (copy-button label fix — 1 line)

## Current state

- working

## Verified

- `npx tsc --noEmit` — clean
- `npx eslint src/features/income/income-dialog.tsx src/features/income/actions.ts` — clean
- Browser (Chrome DevTools MCP) against live Supabase — all 3 income items above
- Temporary test scaffolding REMOVED and confirmed absent: a 6000ms delay in
  `updateIncomeAction` (used to widen the pending window) — `grep` confirms no `setTimeout`
  remains in `src/features/income/`. Final `git diff` is the 1-line label fix only.
- Test users `ianlearnhowtocode+uxtest@gmail.com` (5f4e2095…) and `+uxtest2@gmail.com`
  (f8c34448…) DELETED; income rows cascade-deleted (verified `[]` via REST); admin user list
  confirms no `uxtest` accounts remain.

## Next steps

- Consider DELETING the redundant `onOpenAutoFocus` override in income-dialog.tsx (~5 lines).
  Argument to keep: it pins intent, and survives someone adding a field above `month`.
  Argument to cut: it is provably a no-op today. Owner's call — not done unasked.
- Unrelated leftover: `src/features/auth/actions.ts:27` still has the temporary signup
  `console.error` from commit 65c9908 ("revert once resolved"). The paused project explains that
  production signup failure, so the original bug may never have been real.

## Blockers / Risks

- `CurrencyInput` deliberately does NOT select-on-focus when a value is non-zero
  (`currency-input.tsx:44-52`, commented as intentional). Typing without select-all therefore
  appends digits. Not a bug — normal text-input behavior — but it means formatted-value editing
  relies on the user selecting first. Untouched; flagged only.
