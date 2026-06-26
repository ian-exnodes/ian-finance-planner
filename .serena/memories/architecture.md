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
