# Decisions Memory

## ADR-001 — Supabase for backend

Decision: Use Supabase Auth + Postgres + RLS for persistence and access control.

Reason: Simple deployment, low operational cost, strong fit for a personal finance app.

## ADR-002 — Vietnamese UI, English developer docs

Decision: Keep technical prompt/docs/code in English, but all visible UI in Vietnamese.

Reason: English improves Claude/code generation consistency; Vietnamese improves personal daily usage.

## ADR-003 — No localStorage for business data

Decision: Business data must persist in Supabase. localStorage is only allowed for UI preferences.

Reason: Prevent data loss and support secure authenticated access.
