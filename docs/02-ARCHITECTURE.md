# 02 — Architecture

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- React Hook Form
- Zod
- Supabase Auth
- Supabase Postgres
- Supabase RLS
- Vercel

## Core Architecture

Use a feature-oriented structure.

```txt
src/
├── app/
│   ├── (auth)/
│   ├── (app)/
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── shared/
├── features/
│   ├── income/
│   ├── fixed-costs/
│   ├── installments/
│   ├── credit-cards/
│   ├── wishlist/
│   └── dashboard/
├── lib/
│   ├── supabase/
│   ├── formatters/
│   └── calculations/
└── types/
```

## Data Access Rule

Do not call Supabase directly from random UI components.

Prefer this flow:

```txt
Page / Server Action / Feature Hook
→ repository/service function
→ Supabase client
→ database
```

## Component Rule

- Server Components by default.
- Client Components only when interactivity is required.
- Forms, charts, dialogs, toasts, and client-side filters can be Client Components.
- Keep business calculations in `src/lib/calculations`, not inside UI components.

## Auth Flow

- Use Supabase Auth.
- Protect all app routes.
- Unauthenticated users go to `/login`.
- Authenticated users visiting `/login` go to `/dashboard`.

## Security Boundaries

- All user-owned tables require `user_id`.
- RLS must be enabled.
- User can only select/insert/update/delete own rows.
- Never trust user-submitted `user_id`.
- Do not log tokens, sessions, or personal financial data.

## Rendering Strategy

- Use server-side data fetching where simple.
- Use client-side interactions for CRUD modals/forms.
- Keep optimistic UI optional for v1.
- Prefer correctness over clever caching.

## Calculation Ownership

Use pure utility functions for:

- Month ranges
- Installment schedules
- Credit card due-by-month
- Fixed cost totals
- Income-by-month
- Monthly cashflow
- Debt ratio
- Wishlist impact

These utilities must be deterministic and testable.
