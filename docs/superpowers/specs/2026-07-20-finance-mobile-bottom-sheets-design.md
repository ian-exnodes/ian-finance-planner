# Finance Mobile Bottom Sheets Design

## Goal

Present dialogs and destructive confirmations in income, fixed costs, installments, and credit cards as bottom sheets below 768px while preserving current centered dialogs on wider screens.

## Scope

The change applies only to these finance feature dialogs:

- Income create/edit and delete confirmation.
- Fixed-cost create/edit and delete confirmation.
- Installment create/edit and delete confirmation.
- Credit-card create/edit and delete confirmation.
- Credit-card transaction create/edit and delete confirmation.

Authentication, wishlist, navigation, and any other application dialogs remain unchanged.

## Architecture

Add an optional `mobileSheet` boolean prop to the existing `DialogContent` and `AlertDialogContent` primitives. The default remains `false`, preserving every existing consumer. Finance feature consumers opt in explicitly with `mobileSheet`.

The shared primitives own responsive placement, safe-area spacing, motion, and the visual handle. Feature dialogs continue to own their forms, copy, validation, pending state, actions, and mutations.

## Mobile presentation

Below the Tailwind `md` breakpoint:

- Anchor the surface to the bottom edge of the viewport.
- Use the full available viewport width.
- Use a small soft radius on the top-left and top-right corners.
- Keep both bottom corners square against the viewport edge.
- Limit height to `90dvh`.
- Allow vertical scrolling inside the surface when content exceeds the limit.
- Respect `env(safe-area-inset-bottom)` in the bottom padding.
- Show a short, centered, muted handle near the top edge. The handle is visual only and is not draggable.
- Retain the existing close button for standard dialogs.
- Use the existing overlay, theme tokens, border, typography, and shadow language.

At 768px and above, preserve the current centered dialog width, full soft radius, padding, close control, and visual hierarchy.

## Motion

- Mobile opening enters from the bottom and closing exits toward the bottom.
- Desktop retains the current centered fade, zoom, and directional transition.
- Motion is brief and communicates the surface transition rather than adding decoration.
- Under `prefers-reduced-motion: reduce`, remove transform animation and render the state transition without movement.

## Interaction and accessibility

- Preserve Radix focus trapping, initial focus, Escape behavior, backdrop dismissal rules, accessible titles, descriptions, and portal behavior.
- Preserve each dialog's existing protection against closing while a request is pending.
- Keep destructive confirmations explicit; do not convert them to swipe actions.
- Keep form field order, labels, validation, submit behavior, and button copy unchanged.
- Do not implement swipe-to-dismiss or pointer gesture tracking.
- Ensure the sheet remains usable with the mobile software keyboard and scrollable content.

## Target files

Shared primitives:

- `src/components/ui/dialog.tsx`
- `src/components/ui/alert-dialog.tsx`

Opt-in consumers:

- `src/features/income/income-dialog.tsx`
- `src/features/income/delete-income-button.tsx`
- `src/features/fixed-costs/fixed-cost-dialog.tsx`
- `src/features/fixed-costs/delete-fixed-cost-button.tsx`
- `src/features/installments/installment-dialog.tsx`
- `src/features/installments/delete-installment-button.tsx`
- `src/features/credit-cards/card-dialog.tsx`
- `src/features/credit-cards/delete-card-button.tsx`
- `src/features/credit-cards/transaction-dialog.tsx`
- `src/features/credit-cards/transactions-table.tsx`

## States and edge cases

- Short confirmations remain compact and anchored to the bottom.
- Long forms scroll internally without exceeding `90dvh`.
- Safe-area padding prevents controls from touching an iPhone home indicator.
- Opening the software keyboard must not make the title, active field, or submit action permanently unreachable.
- Pending and error states remain visible inside the scrollable surface.
- Light and dark themes retain existing semantic colors and contrast.

## Validation

- Run `npm run typecheck` with the supported Node version.
- Run `npm run lint`.
- Run `npm run build`.
- Confirm non-finance dialogs do not opt in and remain unchanged.
- Review each scoped create/edit and delete dialog at 320px, 375px, 767px, and 768px.
- Check short and long content, software-keyboard behavior, internal scrolling, safe-area padding, close/backdrop/Escape behavior, pending-state protection, focus order, light and dark themes, and reduced motion.
- Run `git diff --check` and review the final diff for scope.

## Scope boundaries

- No new dependency.
- No global conversion of all dialogs.
- No changes to forms, field names, copy, validation, routes, data access, mutations, or business logic.
- No swipe-to-dismiss implementation.
- No redesign of desktop dialogs.
