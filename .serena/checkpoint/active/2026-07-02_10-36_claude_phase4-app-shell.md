# Checkpoint: claude — 2026-07-02 10:36 +07 — Phase 4 app shell

Date: 2026-07-02
Time: 10:36 +07
Author/Agent: claude
Branch: main
Commit: uncommitted (will be committed + pushed this session)
Topic: Phase 4 — authenticated layout, nav, topbar, theme, loading, toasts

## What was done

- `src/app/(app)/layout.tsx`: server layout, getUser() re-check, desktop sidebar + topbar + main.
- `src/components/shared/`: nav-items.ts (shared nav config), sidebar-nav.tsx, mobile-nav.tsx (sheet), topbar.tsx (avatar dropdown → signOut, theme toggle), theme-provider/theme-toggle (next-themes, new dep).
- `src/components/ui/sheet.tsx` (standard shadcn).
- Root layout: ThemeProvider (class attribute, system default) + global <Toaster />.
- `src/app/(app)/dashboard/page.tsx` placeholder (Vietnamese empty state) + `(app)/loading.tsx` skeletons.
- Fixed `formatMonthVi` to zero-padded "Tháng 07/2026" per docs/04; smoke tests updated.
- Phase 4 checked off in tasklist.

## Files changed

- src/app/layout.tsx, src/app/(app)/{layout,loading}.tsx, src/app/(app)/dashboard/page.tsx (new)
- src/components/shared/* (new), src/components/ui/sheet.tsx (new)
- src/lib/formatters/month.ts, package.json (+next-themes)
- docs/05-TASKLIST.md, .serena/memories/architecture.md

## Current state

- working

## Verified

- typecheck / lint / build all clean; formatter smoke tests re-passed.
- Authenticated fetch of /dashboard (real session cookie, disposable admin-confirmed user, deleted after): 200 with all Vietnamese nav labels, responsive classes (hidden md:flex sidebar, md:hidden mobile trigger), theme toggle, email in shell, empty state; unauthenticated still 307 → /login.
- NOT verified: actual click interactions (dropdown sign-out, sheet open, theme switch) — client-only, needs a browser; "Đăng xuất" confirmed in source, not in SSR HTML by design.

## Next steps

- Phase 5 — Income: repository, list page, form, CRUD, empty state.
- User should click-test: login → dashboard, mobile menu, theme toggle, sign out.

## Blockers / Risks

- Nav links (/incomes etc.) 404 until Phases 5–9 build those pages — expected.
- Visual/interaction QA pending browser (Phase 12 also re-checks).
