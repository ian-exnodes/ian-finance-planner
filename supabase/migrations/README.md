# Migrations

Ordered SQL migrations for the Supabase Postgres database. Source spec: [docs/03-DATABASE.md](../../docs/03-DATABASE.md).

Apply in filename order, either:

- **Supabase CLI**: `supabase link --project-ref <ref>` then `supabase db push`
- **Dashboard SQL editor**: paste each file's contents in order (0001 → 0010)

These have not been applied automatically — running them against the live project is a manual, user-confirmed step.

After applying, verify RLS with two different users: each user must only see their own rows in every table (`select * from public.incomes;` as user A must not return user B's rows).
