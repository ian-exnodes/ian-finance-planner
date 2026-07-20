# Mobile Finance Tables Design

## Goal

Improve the mobile experience for income, fixed costs, installments, and credit-card transactions without changing their desktop tables or business behavior.

## Success criteria

- At viewport widths below 768px, records are readable without horizontal scrolling.
- The primary identity and amount of each record are visible first.
- Secondary values remain available in a compact label-and-value layout.
- Status, edit, and delete controls remain directly accessible.
- Interactive controls provide touch targets of at least 44 by 44 pixels.
- Desktop table structure and behavior remain unchanged.
- Existing dialogs, mutations, calculations, formatting, and empty states continue to work.
- Light and dark themes preserve the existing application tokens and accessible contrast.

## Design direction

Use responsive stacked rows on mobile and retain the existing table presentation from the `md` breakpoint upward. This avoids forcing wide, seven-column or eight-column datasets into a narrow viewport while preserving the efficient desktop view.

The mobile presentation is intentionally dense and calm. It follows the current application palette, type scale, radius system, and icon family. It introduces no new design system or dependency.

## Shared mobile row anatomy

Each mobile record uses this order:

1. A header line containing the primary label on the left and primary amount on the right.
2. Optional supporting identity text directly below the primary label.
3. A compact two-column detail grid with muted labels and aligned values.
4. Status or notes when they contain useful information.
5. A final action area with edit and delete controls, separated visually from record data.

The record container uses one consistent soft radius and a subtle border. Spacing, not shadow, establishes hierarchy. Values use tabular numerals where supported. Long content wraps or truncates without increasing the viewport width.

## Screen-specific content

### Income

- Primary label: formatted month.
- Primary amount: total income.
- Details: salary, bonus, and other income.
- Notes appear only when present.
- Actions: edit and delete.

### Fixed costs

- Primary label: cost name.
- Primary amount: monthly amount.
- Details: category and due day.
- Notes appear only when present.
- Actions: edit and delete.
- The monthly total appears in a distinct summary row beneath the mobile list.

### Installments

- Primary label: item name.
- Supporting identity: provider when present.
- Primary amount: monthly payment.
- Details: installment type, start month, remaining months, and remaining balance.
- Status remains visible as the existing semantic badge.
- Actions: edit and delete.

### Credit-card transactions

- Primary label: transaction description.
- Primary amount: transaction amount.
- Details: date, category, card, and statement month.
- The existing paid control remains directly accessible.
- Actions: edit and delete.

## Responsive architecture

Each feature component renders one mobile collection below `md` and the existing table at `md` and above. Both presentations receive the same source records and reuse the existing formatting helpers, dialogs, buttons, calculations, and status controls.

No record data is copied into local state. Mutations continue through the existing feature actions and dialogs. Responsive visibility is controlled with CSS classes so viewport changes do not require JavaScript listeners.

Small repeated presentation rules may be extracted into a shared mobile record shell only if doing so reduces duplication without obscuring the feature-specific content. Business fields and calculations stay in their feature components.

## Accessibility and interaction

- Keep semantic desktop tables for wider viewports.
- Represent the mobile collection as a list with each record as one list item.
- Preserve existing accessible names on edit and delete buttons.
- Ensure icon buttons have at least 44 by 44 pixel hit areas on mobile.
- Preserve keyboard focus indicators and dialog behavior.
- Do not hide essential information behind hover interactions.
- Use existing text and border tokens to maintain theme contrast.
- Avoid automatic motion. Existing tactile button feedback is sufficient.

## States and edge cases

- Empty arrays continue to use the existing page-level empty state rather than rendering an empty list.
- Missing notes or providers do not leave blank layout rows.
- Missing due days and card names use the existing fallback convention, rendered as a regular hyphen where visible copy is touched.
- Long names and descriptions wrap to a controlled number of lines.
- Large currency values remain aligned and may wrap only as a last resort.
- Paid-state loading and confirmation behavior remain owned by the existing credit-card control.

## Validation

- Run `npm run typecheck`.
- Run `npm run lint` if the repository script is functional.
- Run `npm run build`.
- Review all four views at representative widths near 320px, 375px, and 768px.
- Confirm desktop tables remain unchanged above the breakpoint.
- Confirm edit, delete, paid-state, empty-state, light-theme, dark-theme, and keyboard-focus behavior.
- Review the final diff for unrelated changes and repeated mobile markup that warrants a small shared shell.

## Scope boundaries

- No changes to routes, navigation, forms, field names, database access, or calculations.
- No new package or table library.
- No content rewrite beyond necessary mobile labels or fallback punctuation.
- No redesign of desktop table styling.
