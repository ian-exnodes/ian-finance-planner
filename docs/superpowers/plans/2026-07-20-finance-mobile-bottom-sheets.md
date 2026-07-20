# Finance Mobile Bottom Sheets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render only finance feature dialogs and confirmations as bottom sheets below 768px while preserving every existing centered desktop dialog.

**Architecture:** Extend the existing Radix-based `DialogContent` and `AlertDialogContent` primitives with an opt-in `mobileSheet` prop. Shared primitives own responsive placement, top-only radius, safe-area spacing, internal overflow, handle, and motion; ten scoped finance consumers opt in without changing their forms or behaviors.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 3, Radix Dialog and Alert Dialog, existing Tailwind animation plugin.

## Global Constraints

- Bottom-sheet presentation applies only below the Tailwind `md` breakpoint of 768px.
- Mobile sheets use full width, `max-h-[90dvh]`, internal vertical scrolling, square bottom corners, and a small soft radius on both top corners.
- Bottom padding respects `env(safe-area-inset-bottom)`.
- A short muted handle is visible on mobile and is visual only.
- At 768px and above, centered dialog placement, width, radius, padding, close behavior, and hierarchy remain unchanged.
- Only income, fixed costs, installments, credit cards, and credit-card transaction dialogs opt in.
- Authentication, wishlist, navigation, and other dialogs remain unchanged.
- Preserve Radix focus trapping, Escape behavior, backdrop rules, titles, descriptions, portals, and pending-state protections.
- Preserve all form fields, field order, copy, validation, routes, data access, mutations, and business logic.
- No swipe-to-dismiss, pointer tracking, viewport listener, or new dependency.
- Reduced-motion users receive no transform animation.

## File map

- Modify `src/components/ui/dialog.tsx`: add `mobileSheet` to standard dialog content.
- Modify `src/components/ui/alert-dialog.tsx`: add `mobileSheet` to confirmation content.
- Modify ten scoped feature files to pass the opt-in prop.
- Update `docs/05-TASKLIST.md` using its existing convention.
- Create a significant-session checkpoint under `.serena/checkpoint/active/`.

---

### Task 1: Standard dialog bottom-sheet variant

**Files:**
- Modify: `src/components/ui/dialog.tsx`

**Interfaces:**
- Produces: `DialogContent` with optional `mobileSheet?: boolean`, defaulting to `false`.
- Preserves: every existing `DialogContent` caller that omits the prop.

- [ ] **Step 1: Confirm the baseline behavior**

Run:

```bash
rg -n '<DialogContent' src/features src/app
```

Expected: finance and non-finance consumers use the same primitive, confirming that an opt-in API is required.

- [ ] **Step 2: Add the opt-in content props type**

Add this type above `DialogContent`:

```tsx
type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  mobileSheet?: boolean;
};
```

Update the component generic and destructuring:

```tsx
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, mobileSheet = false, ...props }, ref) => (
```

- [ ] **Step 3: Separate shared, centered, and mobile-sheet classes**

Replace the current single class string with `cn` arguments that preserve the existing default verbatim and apply this opt-in mode:

```tsx
className={cn(
  "fixed z-50 grid w-full gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  mobileSheet
    ? "bottom-0 left-0 right-0 top-auto max-h-[90dvh] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-t-xl rounded-b-none border-x-0 border-b-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom motion-reduce:animate-none md:bottom-auto md:left-[50%] md:right-auto md:top-[50%] md:max-w-lg md:translate-x-[-50%] md:translate-y-[-50%] md:overflow-visible md:rounded-lg md:border md:p-6 md:data-[state=closed]:zoom-out-95 md:data-[state=open]:zoom-in-95 md:data-[state=closed]:slide-out-to-left-1/2 md:data-[state=closed]:slide-out-to-top-[48%] md:data-[state=open]:slide-in-from-left-1/2 md:data-[state=open]:slide-in-from-top-[48%]"
    : "left-[50%] top-[50%] max-w-lg translate-x-[-50%] translate-y-[-50%] data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
  className
)}
```

The default branch is the current placement and animation behavior. Do not change it while implementing the variant.

- [ ] **Step 4: Add the visual handle**

Insert this as the first content child:

```tsx
{mobileSheet ? (
  <div
    aria-hidden="true"
    className="mx-auto -mt-3 mb-1 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/25 md:hidden"
  />
) : null}
```

Keep the existing close button after the dialog children.

- [ ] **Step 5: Verify types and default-call compatibility**

Run:

```bash
PATH=/Users/vyhocgioi/.nvm/versions/node/v24.4.1/bin:$PATH npm run typecheck
git diff --check
```

Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/dialog.tsx
git commit -m "feat: add opt-in mobile dialog sheet"
```

### Task 2: Alert dialog bottom-sheet variant

**Files:**
- Modify: `src/components/ui/alert-dialog.tsx`

**Interfaces:**
- Produces: `AlertDialogContent` with optional `mobileSheet?: boolean`, defaulting to `false`.
- Preserves: every confirmation caller that omits the prop.

- [ ] **Step 1: Add the opt-in props type**

```tsx
type AlertDialogContentProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
> & {
  mobileSheet?: boolean;
};
```

Update the component to receive children:

```tsx
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, children, mobileSheet = false, ...props }, ref) => (
```

- [ ] **Step 2: Apply the same responsive class contract**

Use the same shared, opt-in, and default class strings from Task 1, retaining the current Alert Dialog default when `mobileSheet` is absent.

Render the primitive with explicit children:

```tsx
<AlertDialogPrimitive.Content ref={ref} className={computedClasses} {...props}>
  {mobileSheet ? (
    <div
      aria-hidden="true"
      className="mx-auto -mt-3 mb-1 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/25 md:hidden"
    />
  ) : null}
  {children}
</AlertDialogPrimitive.Content>
```

Use the direct `cn(...)` expression from Task 1 in place of `computedClasses`; do not introduce a variable that is not declared.

- [ ] **Step 3: Verify the primitive**

Run:

```bash
PATH=/Users/vyhocgioi/.nvm/versions/node/v24.4.1/bin:$PATH npm run typecheck
git diff --check
```

Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/alert-dialog.tsx
git commit -m "feat: add opt-in mobile confirmation sheet"
```

### Task 3: Opt in finance form dialogs

**Files:**
- Modify: `src/features/income/income-dialog.tsx`
- Modify: `src/features/fixed-costs/fixed-cost-dialog.tsx`
- Modify: `src/features/installments/installment-dialog.tsx`
- Modify: `src/features/credit-cards/card-dialog.tsx`
- Modify: `src/features/credit-cards/transaction-dialog.tsx`

**Interfaces:**
- Consumes: `DialogContent mobileSheet` from Task 1.
- Produces: bottom-sheet behavior only for the five finance create/edit dialog components.

- [ ] **Step 1: Opt in each form dialog**

For every `DialogContent` in the five files, add `mobileSheet` and move existing `sm:` width rules to `md:` so they cannot narrow the sheet between 640px and 767px.

Income, fixed-cost, and credit-card dialogs use:

```tsx
<DialogContent mobileSheet className="md:max-w-md">
```

Installment and transaction dialogs currently own desktop height and overflow rules. Keep those rules at `md:` while the shared primitive owns mobile height and scrolling:

```tsx
<DialogContent
  mobileSheet
  className="md:max-h-[90vh] md:max-w-lg md:overflow-y-auto"
>
```

Do not change focus callbacks, children, form structure, or copy. The breakpoint-only `className` adjustments above are required to preserve a full-width sheet below 768px and the current constrained dialog behavior at 768px and above.

- [ ] **Step 2: Verify complete and limited opt-in coverage**

Run:

```bash
rg -n '<DialogContent' src/features/income src/features/fixed-costs src/features/installments src/features/credit-cards
rg -n 'mobileSheet' src/features/income src/features/fixed-costs src/features/installments src/features/credit-cards
```

Expected: all five form dialog content instances include `mobileSheet`; no unrelated feature directory was modified.

- [ ] **Step 3: Type-check and commit**

Run:

```bash
PATH=/Users/vyhocgioi/.nvm/versions/node/v24.4.1/bin:$PATH npm run typecheck
git diff --check
```

Expected: both exit 0.

Commit:

```bash
git add src/features/income/income-dialog.tsx src/features/fixed-costs/fixed-cost-dialog.tsx src/features/installments/installment-dialog.tsx src/features/credit-cards/card-dialog.tsx src/features/credit-cards/transaction-dialog.tsx
git commit -m "feat: use mobile sheets for finance forms"
```

### Task 4: Opt in finance confirmations

**Files:**
- Modify: `src/features/income/delete-income-button.tsx`
- Modify: `src/features/fixed-costs/delete-fixed-cost-button.tsx`
- Modify: `src/features/installments/delete-installment-button.tsx`
- Modify: `src/features/credit-cards/delete-card-button.tsx`
- Modify: `src/features/credit-cards/transactions-table.tsx`

**Interfaces:**
- Consumes: `AlertDialogContent mobileSheet` from Task 2.
- Produces: bottom-sheet behavior only for the five finance delete confirmations.

- [ ] **Step 1: Opt in every scoped confirmation**

Replace each scoped opening tag:

```tsx
<AlertDialogContent>
```

with:

```tsx
<AlertDialogContent mobileSheet>
```

Do not change confirmation text, pending behavior, buttons, actions, or state management.

- [ ] **Step 2: Verify coverage**

Run:

```bash
rg -n '<AlertDialogContent' src/features/income src/features/fixed-costs src/features/installments src/features/credit-cards
```

Expected: all five scoped confirmation instances include `mobileSheet`.

- [ ] **Step 3: Type-check and commit**

Run:

```bash
PATH=/Users/vyhocgioi/.nvm/versions/node/v24.4.1/bin:$PATH npm run typecheck
git diff --check
```

Expected: both exit 0.

Commit:

```bash
git add src/features/income/delete-income-button.tsx src/features/fixed-costs/delete-fixed-cost-button.tsx src/features/installments/delete-installment-button.tsx src/features/credit-cards/delete-card-button.tsx src/features/credit-cards/transactions-table.tsx
git commit -m "feat: use mobile sheets for finance confirmations"
```

### Task 5: Integrated validation and documentation

**Files:**
- Modify: `docs/05-TASKLIST.md`
- Create: `.serena/checkpoint/active/2026-07-20_14-58_codex_finance-mobile-bottom-sheets.md`

**Interfaces:**
- Consumes: completed dialog primitives and scoped consumers.
- Produces: verified branch state, task-list record, and checkpoint.

- [ ] **Step 1: Run automated checks**

Run:

```bash
PATH=/Users/vyhocgioi/.nvm/versions/node/v24.4.1/bin:$PATH npm run typecheck
PATH=/Users/vyhocgioi/.nvm/versions/node/v24.4.1/bin:$PATH npm run lint
PATH=/Users/vyhocgioi/.nvm/versions/node/v24.4.1/bin:$PATH npm run build
git diff --check
```

Expected: all commands exit 0. Record any non-blocking framework warnings exactly.

- [ ] **Step 2: Audit scope and opt-in boundaries**

Run:

```bash
rg -n 'mobileSheet' src
git diff --stat 758311f..HEAD
```

Expected: the prop exists in two shared primitives and the ten scoped finance consumers only. No authentication, wishlist, navigation, form schema, action, or repository file is changed.

- [ ] **Step 3: Review responsive and accessibility behavior**

At 320px, 375px, 767px, and 768px, verify:

- Finance form dialogs and confirmations anchor to the viewport bottom below 768px.
- Top corners have a small soft radius and bottom corners remain square.
- The visual handle appears only below 768px and has no interactive semantics.
- Long forms stay within `90dvh` and scroll internally.
- Bottom controls clear the device safe area.
- Close, backdrop, Escape, initial focus, focus trap, errors, pending protection, and submit/delete behavior remain intact.
- The mobile keyboard does not make the active field or actions permanently unreachable.
- At 768px, centered dialog layout and current widths return.
- Non-finance dialogs retain their previous behavior.
- Light mode, dark mode, and reduced motion remain usable.

If an authenticated browser session is unavailable, report these checks as skipped and do not claim them.

- [ ] **Step 4: Update the task list**

Add this completed entry under the nearest relevant polish or responsive section, preserving existing syntax:

```markdown
- [x] Present finance dialogs as mobile bottom sheets below 768px
```

- [ ] **Step 5: Create the checkpoint**

Use the repository checkpoint template with actual local time. Record the branch, commit, files changed, automated checks, browser checks or explicit skips, remaining risks, and next steps.

- [ ] **Step 6: Commit documentation**

```bash
git add docs/05-TASKLIST.md .serena/checkpoint/active/2026-07-20_14-58_codex_finance-mobile-bottom-sheets.md
git commit -m "docs: record finance mobile bottom sheets"
```
