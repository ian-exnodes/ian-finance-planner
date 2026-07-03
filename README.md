# Quản lý Tài chính Cá nhân (Personal Finance Debt Planner)

A single-user personal finance web app for tracking monthly income, fixed
costs, installments, credit card spending, and planned purchases — with a
Vietnamese-language UI. Built with Next.js App Router, Supabase, and
Tailwind/shadcn.

See [docs/01-PRD.md](docs/01-PRD.md) for the full product spec.

## Stack

- Next.js 15 (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth + RLS)
- React Hook Form + Zod
- Recharts

## Features

- Email/password auth with protected routes and session refresh
- Dashboard: monthly summary tiles, repayment/cashflow/debt-ratio charts,
  debt breakdown, month selector
- Income, fixed costs, installments, credit cards & transactions, wishlist —
  full CRUD with Vietnamese copy, empty states, and delete confirmations
- Wishlist purchase planner: projects the debt ratio impact of a planned
  purchase and shows a decision label (Có thể mua / Nên cân nhắc / Nên trì
  hoãn / Không nên mua lúc này)
- Development-only sample data seeding

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your own Supabase project's values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Optional, server-only — enables the seed feature's duplicate-safety
# checks in local/dev tooling. Never expose this to the client.
SUPABASE_SERVICE_ROLE_KEY=
```

### Database

Apply the migrations in [supabase/migrations](supabase/migrations) to your
Supabase project (see that folder's README for the CLI/dashboard steps),
then confirm RLS is enabled — every user-owned table only allows a user to
read/write their own rows.

## Scripts

```bash
npm run dev         # start the dev server
npm run build        # production build
npm run lint          # ESLint
npm run typecheck  # tsc --noEmit
```

## Project Docs

- [docs/01-PRD.md](docs/01-PRD.md) — product requirements
- [docs/02-ARCHITECTURE.md](docs/02-ARCHITECTURE.md) — architecture
- [docs/03-DATABASE.md](docs/03-DATABASE.md) — database schema
- [docs/04-DESIGN_SYSTEM.md](docs/04-DESIGN_SYSTEM.md) — Vietnamese UI/design guidelines
- [docs/05-TASKLIST.md](docs/05-TASKLIST.md) — build task list
- [docs/08-DEPLOYMENT.md](docs/08-DEPLOYMENT.md) — deployment guide

This repo also carries the Claude Code / Serena workflow scaffolding
(`CLAUDE.md`, `AGENTS.md`, `.agents/`, `.serena/`) used to build it — see
`SETUP_STEPS.md` if you want to reuse that workflow for a similar project.
