# Checkpoint: claude — 2026-07-02 10:26 +07 — Phase 3 shared utilities

Date: 2026-07-02
Time: 10:26 +07
Author/Agent: claude
Branch: main
Commit: uncommitted
Topic: Phase 3 — formatters + calculation helpers

## What was done

- Domain types already existed in `src/types/index.ts` (verified they match the applied migrations exactly).
- `src/lib/formatters/`: currency.ts (formatVND), date.ts (formatDateVi, tz-safe for date-only strings), month.ts (formatMonthVi), index.ts barrel.
- `src/lib/calculations/`: months.ts (addMonths/monthDiff/monthRange/monthFromDate), debt-ratio.ts (ratio null on zero income + PRD risk/wishlist labels), installments.ts (monthly payment/schedule/per-month/remaining), credit-cards.ts (unpaid due by statement month, per card, totals), cashflow.ts (calculateMonthlySummary), index.ts barrel.
- All functions pure; month keys "YYYY-MM"; Pick<>-based inputs.
- Phase 3 fully checked off in docs/05-TASKLIST.md.

## Files changed

- src/lib/formatters/{currency,date,month,index}.ts (new)
- src/lib/calculations/{months,debt-ratio,installments,credit-cards,cashflow,index}.ts (new)
- docs/05-TASKLIST.md
- .serena/memories/architecture.md

## Current state

- working

## Verified

- 60+ assert smoke tests against tsc-compiled output (formatters, boundaries, paused/paid exclusion, unpaid-only credit, zero-income null ratio, full summary integration) — all passed.
- `npm run typecheck`, `npm run lint`, `npm run build` — all clean.
- No test framework in repo (tasklist condition not met) — noted inline in tasklist.

## Next steps

- Phase 4 — App Shell: authenticated layout, sidebar/mobile nav, top bar (wire signOut), theme, loading states, toast provider, responsive check.

## Blockers / Risks

- Debt-ratio boundary values (exactly 20%/35%/50%) mapped as <0.2 / <0.35 / ≤0.5 — PRD ranges are ambiguous at the edges; trivially adjustable.
- getRemainingBalance = remaining months × monthly payment; if an explicit monthly_payment doesn't divide total evenly, it's an approximation (acceptable v1).
- Phases 1–3 work still uncommitted on main.
