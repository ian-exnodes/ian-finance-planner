# 08 — Deployment Guide

## Local Setup

1. Create the Next.js project.
2. Install dependencies.
3. Create `.env.local`.
4. Add Supabase variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

5. Run Supabase migrations.
6. Start dev server:

```bash
npm run dev
```

## Supabase Setup

1. Create a Supabase project.
2. Copy Project URL.
3. Copy anon public key.
4. Run migrations in the SQL editor or Supabase CLI.
5. Confirm RLS is enabled.
6. Test with at least two users if possible.

## Vercel Deployment

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.
5. Test login.
6. Test CRUD.
7. Test RLS behavior.
8. Test mobile layout.

## Production Checklist

- [ ] No secrets committed.
- [ ] Service role key is not exposed.
- [ ] RLS enabled on all user-owned tables.
- [ ] Build passes.
- [ ] Auth redirects work.
- [ ] Mobile layout works.
- [ ] Vietnamese UI copy reviewed.
