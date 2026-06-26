# API Memory

## Supabase

- Use Supabase Auth for email/password login.
- Use Supabase Postgres for all business data.
- All user-owned tables include `user_id`.
- RLS must prevent users from reading or modifying other users' data.
- Do not trust form-submitted `user_id`.
- Do not expose Supabase service role keys to the browser.

## Repository convention

Each feature should expose repository/service functions:

- `list`
- `create`
- `update`
- `remove`

Repositories should be the main data-access layer.
