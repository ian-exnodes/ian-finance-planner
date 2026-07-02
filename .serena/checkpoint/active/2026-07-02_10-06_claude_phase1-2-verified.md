# Checkpoint: claude — 2026-07-02 10:06 +07 — Phase 1+2 verification complete

Date: 2026-07-02
Time: 10:06 +07
Author/Agent: claude
Branch: main
Commit: uncommitted
Topic: RLS + auth-refresh verified; middleware 500-lockout fix

## What was done

- User added `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (server-only, gitignored).
- Cross-user RLS suite (2 admin-confirmed test users, 1 row per table as A): 22/22 passed — B cannot select (list or by id), insert-as-A, update, or delete on any of the 6 tables; anon fully blocked.
- Auth-after-refresh suite against `npm run dev`: 6/6 passed — session cookie keeps protected routes accessible across repeated requests; authenticated /login → /dashboard; no cookie → /login.
- Found + fixed real bug: corrupted auth cookie made `getUser()` throw "Invalid UTF-8 sequence" → 500 on EVERY route (permanent lockout until cookies cleared). Fix: try/catch in `src/lib/supabase/middleware.ts`, treat as unauthenticated.
- All test auth users deleted via admin API (project now has 0 users).
- Checked off last Phase 1 + last Phase 2 tasklist items. Phases 0–2 complete.

## Files changed

- src/lib/supabase/middleware.ts (try/catch around getUser + User type import)
- docs/05-TASKLIST.md
- .serena/memories/architecture.md

## Current state

- working — Phases 0–2 fully done and verified.

## Verified

- `npx tsc --noEmit`, `npx eslint src/lib/supabase/middleware.ts` — clean.
- RLS 22/22, refresh 6/6 (incl. garbage-cookie → /login after fix; was 500 before).

## Next steps

- Phase 3: shared utilities (domain types, VND/date/month formatters, debt ratio, month range, installment schedule, credit due-by-month, monthly cashflow helpers + tests).
- User question outstanding: no user exists for ianlearnhowtocode@gmail.com in this project — their registration went elsewhere (likely Supabase platform account). Email confirmation + built-in mailer limits may block app signups for non-team addresses.

## Blockers / Risks

- "Confirm email" still enabled with default mailer: real signups to arbitrary addresses may not receive confirmation mail (rate limits/team-member restriction). Recommend disabling for dev or custom SMTP.
- Middleware fix + migrations are uncommitted on main.
