# Checkpoint: claude — 2026-07-02 11:08 +07 — Phase 7 installments CRUD

Date: 2026-07-02
Time: 11:08 +07
Author/Agent: claude
Branch: main
Commit: committed + pushed this session
Topic: Phase 7 — installments with calculated payment/remaining columns

## What was done

- `src/features/installments/`: schemas.ts (enums for type/status, nullable monthly_payment + due_day via preprocess), labels.ts (docs/04 Vietnamese labels for type + status — reusable by dashboard later), repository.ts (order: status asc → active first, then start_month desc), actions.ts, installment-dialog.tsx (type/status Selects; live auto-calc hint "Để trống sẽ tự tính: X/tháng" via form.watch), delete-installment-button.tsx, installments-table.tsx (getMonthlyPayment / getRemainingMonths / getRemainingBalance columns, status Badge variants).
- `src/app/(app)/installments/page.tsx` with empty state.

## Files changed

- src/features/installments/* (7 new files)
- src/app/(app)/installments/page.tsx (new)
- docs/05-TASKLIST.md

## Current state

- working

## Verified

- typecheck / lint / build clean.
- Live dev-server test (disposable user, deleted after): 12/12 — auto payment 12tr/12 → "1.000.000", explicit 1.100.000 respected, mid-schedule remaining "10 tháng" + balance 10.000.000, labels "Ví trả sau/Khoản vay/Đang trả/Tạm dừng", month formatting, empty state before/after.
- Dashboard-effect items deferred to Phase 10 (calc layer already proven: only 'active' counts).

## Next steps

- Phase 8 — Credit Cards: two-entity CRUD (cards + transactions), paid/unpaid toggle, totals by statement month.

## Blockers / Risks

- Remaining balance = remaining months × monthly payment (approximation when explicit payment doesn't divide total; accepted v1).
- Dialog clicks still browser-untested.
