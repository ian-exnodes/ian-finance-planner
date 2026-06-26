# ADR-001 — Supabase Backend

## Status

Accepted

## Context

The app needs private persistence, authentication, and secure user-level data isolation.

## Decision

Use Supabase Auth, Supabase Postgres, and Row Level Security.

## Consequences

- Faster backend setup.
- RLS must be implemented carefully.
- No service role key in the browser.
- Vercel deployment only needs public Supabase URL and anon key.
