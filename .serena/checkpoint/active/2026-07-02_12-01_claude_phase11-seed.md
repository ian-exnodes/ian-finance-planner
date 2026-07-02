# Checkpoint: claude — 2026-07-02 12:01 +07 — Phase 11 seed data

Date: 2026-07-02
Time: 12:01 +07
Author/Agent: claude
Branch: main
Commit: committed + pushed this session
Topic: Phase 11 — dev-only demo seed

## What was done

- `src/features/seed/data.ts` — PURE buildSeedRows(currentMonth): 3 incomes (cur, -1, -2), 4 fixed costs, 3 installments (2 active + 1 paid), 1 credit card with explicit crypto.randomUUID() id, 3 transactions (1 paid prev month, 2 unpaid current) referencing that id, 2 wishlist items (+1/+2 months). All rows noted "Dữ liệu mẫu".
- `src/features/seed/actions.ts` — seedDemoDataAction: refuses in production; gets user from session (seeds current user only); duplicate guard = refuses unless ALL 5 seedable tables are empty for this user; inserts card before transactions (FK); revalidates all 6 pages.
- `src/features/seed/seed-button.tsx` — client button with toast; rendered in the dashboard empty state ONLY when NODE_ENV === "development" (server-side check).

## Files changed

- src/features/seed/* (3 new)
- src/app/(app)/dashboard/page.tsx (seed button in empty state)
- docs/05-TASKLIST.md

## Current state

- working — Phases 0–11 complete; only Phase 12 (polish + final verification) remains.

## Verified

- typecheck / lint / build clean.
- Pure builder asserts (compiled): counts, relative months, statuses, FK id wiring, unique ids per call — all pass.
- Live test 16/16 (disposable user, deleted after): seed button visible in dev empty state; inserting the exact built rows succeeds under RLS incl. explicit card id + FK; guard query flips from empty→non-empty (re-seed would refuse); dashboard shows income 29.5tr / debt 3.4tr; installments, credit-cards, wishlist pages all render the seeded rows.
- NOT verified: actual button click → action round-trip (browser needed); logic verified piecewise as above.

## Next steps

- Phase 12 — Polish + Verification: review VN copy, mobile, dark mode, states, confirmations; full typecheck/lint/build; update README; final checkpoint.

## Blockers / Risks

- Seed button click untested in a real browser (same limitation as all dialogs).
