# Suggested Commands

All commands are available in package.json scripts.

```bash
npm install --legacy-peer-deps   # needed due to tailwindcss-animate peer dep
npm run dev                       # start dev server
npm run lint                      # ESLint via next lint
npm run typecheck                 # tsc --noEmit
npm run build                     # production build (also runs lint + typecheck)
npm run start                     # start production server
```

## Notes

- `npm install` requires `--legacy-peer-deps` due to tailwindcss-animate peer dep conflict with tailwind v3
- `npm run build` will run ESLint and TypeScript checks automatically
- `npx shadcn@latest add <component> --yes` to add new shadcn/ui components
