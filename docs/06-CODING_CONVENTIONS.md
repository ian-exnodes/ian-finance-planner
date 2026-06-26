# 06 — Coding Conventions

## General

- Keep code boring and explicit.
- Prefer small files with clear ownership.
- Do not over-engineer v1.
- Do not add dependencies unless clearly useful.
- Do not mix unrelated refactors with feature work.

## Naming

Developer-facing names may be English.

Visible UI text must be Vietnamese.

Database names use snake_case.

TypeScript names use PascalCase for types and camelCase for fields.

## Forms

- Use React Hook Form.
- Use Zod for validation.
- Validation messages visible to users must be Vietnamese.
- Keep form state inside RHF.
- Avoid duplicate shadow state with `useState`.

## Supabase

- Do not hard-code secrets.
- Do not expose service role keys in the browser.
- Do not trust form-submitted `user_id`.
- Get authenticated user from Supabase session/server context.
- All user-owned queries must be scoped by RLS and user ownership.

## UI Components

- Prefer shadcn/ui components.
- Keep components accessible.
- All buttons and controls need clear labels.
- Use confirmation dialogs for destructive actions.

## Calculations

- Calculations must be pure functions.
- Do not calculate financial values ad hoc in components.
- Avoid floating-point surprises where possible.
- Always handle zero income safely.

## Error Handling

Visible errors must be Vietnamese and helpful.

Example:

```txt
Không thể lưu dữ liệu. Vui lòng thử lại.
```

Avoid leaking raw database or auth errors directly to the user.

## Verification

At minimum before marking a coding task complete:

```bash
npm run build
```

When available:

```bash
npm run lint
npm run typecheck
npm test
```
