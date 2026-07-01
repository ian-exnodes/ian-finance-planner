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

## Auth feature

- `src/app/(auth)/login`, `src/app/(auth)/signup` — route-group pages, wrapped by `src/app/(auth)/layout.tsx` (centered card layout).
- `src/features/auth/actions.ts` — server actions `login`, `signup`, `signOut`. Return `{ error }` or `{ message }` on failure/info instead of throwing; call `redirect()` on success.
- `src/features/auth/schemas.ts` — shared Zod `authSchema` (email + password) for both forms.
- `src/features/auth/login-form.tsx` / `signup-form.tsx` — client components, RHF + zodResolver, call the server action directly (not via `<form action>`), show inline destructive-text errors (no toast provider wired yet — that's Phase 4).
- `signOut` action exists but has no UI caller yet; wire it into the topbar in Phase 4.

## Auth middleware

- `src/middleware.ts` + `src/lib/supabase/middleware.ts` refresh the Supabase session on every request and enforce route protection.
- Public paths (no auth required): `/`, `/login*`, `/signup*`, `/auth*`. Everything else redirects unauthenticated users to `/login`.
- Authenticated users hitting a public auth path (`/login`, `/signup`) redirect to `/dashboard`.
- `/dashboard` route does not exist yet (Phase 4/10) — middleware redirect target is forward-looking.
