# Architecture Memory

## App shape

- Feature-oriented Next.js app.
- Use Server Components by default.
- Use Client Components for forms, charts, dialogs, toasts, and interactive UI.
- Keep calculations in pure utility modules.
- Do not put financial formulas directly inside components.

## Data flow

```txt
UI / Page / Server Action
→ feature repository/service
→ Supabase
→ Postgres with RLS
```

## Module boundaries

- `src/features/*` owns feature-specific UI and repositories.
- `src/lib/supabase/*` owns Supabase client/server setup.
- `src/lib/calculations/*` owns financial calculations.
- `src/lib/formatters/*` owns Vietnamese formatting.
- `src/components/ui/*` contains shadcn components.

## Shared utilities (Phase 3)

- `src/types/index.ts` — DB row types (snake_case, mirror Supabase columns) + derived types (`MonthlySummary`, `DebtRiskLabel`, `WishlistDecisionLabel` with exact Vietnamese strings from the PRD).
- `src/lib/formatters/` — `formatVND` (Intl vi-VN, "30.000.000 ₫"), `formatDateVi` ("01/07/2026", date-only strings formatted without Date to avoid tz shifts), `formatMonthVi` ("Tháng 7/2026").
- `src/lib/calculations/` — all pure, month keys are "YYYY-MM" strings (compare with </>):
  - `months.ts`: addMonths, monthDiff, monthRange (inclusive), monthFromDate
  - `debt-ratio.ts`: calculateDebtRatio (income ≤ 0 → null, never NaN), getDebtRiskLabel, getWishlistDecision (null ratio → "Không nên mua lúc này"). Boundaries: <0.2 / <0.35 / ≤0.5 / >0.5.
  - `installments.ts`: getMonthlyPayment (explicit wins, else round(total/months)), schedule, per-month payment (active status only), remaining months/balance. Inputs are Pick<> types so partial shapes work.
  - `credit-cards.ts`: getCreditDueForMonth (unpaid × statement_month), per-card, totals by statement month.
  - `cashflow.ts`: calculateMonthlySummary → MonthlySummary (totalDebt = active installments + unpaid credit for the month).
- No test framework in repo; calculations verified with an assert script against tsc-compiled output (60+ assertions). If tests are added later, use these smoke cases as the seed.

## App shell (Phase 4)

- `src/app/(app)/layout.tsx` — server layout for authenticated routes: re-checks `getUser()` (defense in depth on top of middleware), desktop sidebar (`hidden md:flex`, w-64) + `Topbar` + main. Pages live under `src/app/(app)/<route>/page.tsx`.
- `src/components/shared/nav-items.ts` — single source for nav (labels from docs/04, no "Cài đặt" until a settings page exists). Used by both sidebar and mobile sheet.
- `src/components/shared/` — `sidebar-nav.tsx` (client, usePathname active state), `mobile-nav.tsx` (sheet drawer, `md:hidden` trigger), `topbar.tsx` (client: avatar dropdown with email + "Đăng xuất" → signOut server action, theme toggle), `theme-provider.tsx` / `theme-toggle.tsx` (next-themes, attribute="class", system default).
- Root layout wraps ThemeProvider + mounts `<Toaster />` (shadcn use-toast) globally.
- `src/components/ui/sheet.tsx` added (standard shadcn, radix dialog based).
- `formatMonthVi` outputs zero-padded "Tháng 07/2026" per docs/04 (not "Tháng 7/2026").
- Dashboard page is a placeholder empty state until Phase 10.

## Feature CRUD pattern (established in Phase 5 income — reuse for Phases 6–9)

- `src/features/<name>/schemas.ts` — Zod schema with Vietnamese messages; `z.coerce.number()` for amount inputs.
- `src/features/<name>/repository.ts` — server-only Supabase access; `create*` gets user via `auth.getUser()` and sets `user_id` explicitly (columns have no default); throws on error.
- `src/features/<name>/actions.ts` — "use server"; re-validates with Zod (never trust client), maps errors to generic Vietnamese strings, `revalidatePath` for the feature page AND /dashboard, returns `{ error }` or void.
- `<name>-dialog.tsx` — one client dialog for create + edit (edit when a row prop is passed), RHF + zodResolver, useTransition, toast on success, inline destructive text on error.
- `delete-<name>-button.tsx` — AlertDialog with the docs/04 confirmation copy ("Bạn có chắc muốn xóa..."), toast feedback.
- `<name>s-table.tsx` — client table (formatVND/formatMonthVi), edit + delete per row, overflow-x-auto wrapper for mobile.
- Page: server component fetches via repository, header + add button, empty state Card (copy pattern from docs/04) or table.
- `src/app/(app)/error.tsx` — shared Vietnamese error boundary with retry.

## Auth feature

- `src/app/(auth)/login`, `src/app/(auth)/signup` — route-group pages, wrapped by `src/app/(auth)/layout.tsx` (centered card layout).
- `src/features/auth/actions.ts` — server actions `login`, `signup`, `signOut`. Return `{ error }` or `{ message }` on failure/info instead of throwing; call `redirect()` on success.
- `src/features/auth/schemas.ts` — shared Zod `authSchema` (email + password) for both forms.
- `src/features/auth/login-form.tsx` / `signup-form.tsx` — client components, RHF + zodResolver, call the server action directly (not via `<form action>`), show inline destructive-text errors (no toast provider wired yet — that's Phase 4).
- `signOut` action exists but has no UI caller yet; wire it into the topbar in Phase 4.

## Database migrations

- SQL migrations live in `supabase/migrations/` (10 ordered files, standard Supabase CLI naming `2026070200000N_<topic>.sql`), written verbatim from `docs/03-DATABASE.md`.
- Order: enums → 6 tables → `set_updated_at` function + per-table triggers → indexes → RLS enable + 4 owner-only policies per table.
- Applied to the live Supabase project by the user (2026-07-02) and verified: all 6 tables exist; cross-user RLS verified with two test users (22/22 checks — select/insert/update/delete all owner-only); anon role fully blocked.
- `.env.local` has `SUPABASE_SERVICE_ROLE_KEY` (server-only, gitignored) — bypasses RLS; used only for admin/test operations.
- Supabase project has "Confirm email" enabled; built-in mailer is rate-limited and may drop mail to non-team-member addresses — consider disabling for dev or adding custom SMTP.

## Auth middleware

- `src/middleware.ts` + `src/lib/supabase/middleware.ts` refresh the Supabase session on every request and enforce route protection.
- `getUser()` is wrapped in try/catch: a corrupted/legacy auth cookie is treated as unauthenticated (redirect to /login) instead of throwing a 500 on every route.
- Session persistence verified end-to-end (2026-07-02): real session cookie keeps protected routes accessible across repeated requests; authenticated users on /login redirect to /dashboard; garbage cookie → /login.
- Public paths (no auth required): `/`, `/login*`, `/signup*`, `/auth*`. Everything else redirects unauthenticated users to `/login`.
- Authenticated users hitting a public auth path (`/login`, `/signup`) redirect to `/dashboard`.
- `/dashboard` route does not exist yet (Phase 4/10) — middleware redirect target is forward-looking.
