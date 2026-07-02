# Checkpoint: claude — 2026-06-26 15:22 +07 — Phase 0 Project Setup

Date: 2026-06-26
Time: 15:22 +07
Author/Agent: claude
Branch: master
Commit: uncommitted
Topic: Phase 0 — Project Setup

## What was done

- Manually scaffolded Next.js 15 App Router project (could not use create-next-app due to non-empty directory)
- Installed all Phase 0 dependencies (Tailwind, shadcn/ui, Supabase, RHF, Zod, Recharts)
- Added shadcn/ui components: button, card, input, label, select, separator, badge, dialog, alert-dialog, dropdown-menu, toast, toaster, form, table, textarea, skeleton, avatar
- Created base folder structure: src/app, src/components/ui, src/components/shared, src/features/*, src/lib/supabase, src/lib/formatters, src/lib/calculations, src/types
- Added .env.example with Supabase keys
- Created src/lib/supabase/client.ts and server.ts
- Created src/types/index.ts with all domain types
- Created components.json for shadcn/ui
- Added .gitignore

## Files changed

- package.json
- tsconfig.json
- next.config.ts
- tailwind.config.ts
- postcss.config.mjs
- eslint.config.mjs
- .gitignore
- .env.example
- components.json
- src/app/globals.css
- src/app/layout.tsx
- src/app/page.tsx
- src/lib/utils.ts
- src/lib/supabase/client.ts
- src/lib/supabase/server.ts
- src/types/index.ts
- src/components/ui/* (15 shadcn components)
- src/hooks/use-toast.ts

## Current state

- working — npm run build passes cleanly

## Verified

- npm run build — passes with zero warnings/errors

## Next steps

- Phase 1: Supabase + Auth
  - Create middleware/session handling
  - Build login page with Vietnamese UI
  - Build signup flow
  - Protect app routes

## Blockers / Risks

- npm install requires --legacy-peer-deps (tailwindcss-animate vs tailwind v3 peer dep)
- Recharts v2 is deprecated; v3 migration is out of scope for now
- Supabase env vars must be provided in .env.local before auth works
