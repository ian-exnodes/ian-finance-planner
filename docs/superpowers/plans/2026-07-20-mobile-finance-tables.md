# Mobile Finance Tables Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace horizontally scrolling finance tables with compact stacked records below 768px while preserving the existing desktop tables and behavior.

**Architecture:** Add one shared, presentation-only mobile record shell, then render feature-specific record content beside each existing table. CSS breakpoint utilities select the mobile list or desktop table; both consume the same records and existing dialogs, calculations, status controls, and formatters.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 3, existing shadcn-style UI primitives, Lucide icons already installed.

## Global Constraints

- Mobile layout applies below the Tailwind `md` breakpoint of 768px.
- Desktop table structure and behavior remain unchanged at 768px and above.
- No route, form, field-name, database, calculation, or mutation changes.
- No new package or table library.
- Visible UI remains Vietnamese.
- Use the existing palette, typography, radius system, theme tokens, and Lucide icon family.
- Mobile icon-button hit areas are at least 44 by 44 pixels.
- No automatic animation or viewport JavaScript listeners.
- Preserve existing dialog, confirmation, toast, focus, and empty-state behavior.

## File map

- Create `src/components/shared/mobile-data-record.tsx`: shared semantic list shell, header, details, optional content, and actions.
- Modify `src/features/income/incomes-table.tsx`: add mobile income records and retain the desktop table.
- Modify `src/features/fixed-costs/fixed-costs-table.tsx`: add mobile fixed-cost records and a monthly-total summary.
- Modify `src/features/installments/installments-table.tsx`: add mobile installment records with computed values and status.
- Modify `src/features/credit-cards/transactions-table.tsx`: add mobile transaction records with the existing paid control.
- Update `docs/05-TASKLIST.md`: record completion using the file's existing checklist convention.

---

### Task 1: Shared mobile record shell

**Files:**
- Create: `src/components/shared/mobile-data-record.tsx`

**Interfaces:**
- Consumes: `ReactNode` content supplied by feature components.
- Produces: `MobileDataList`, `MobileDataRecord`, and `MobileDataDetail` React components.

- [ ] **Step 1: Confirm the new module does not exist**

Run: `test ! -e src/components/shared/mobile-data-record.tsx`

Expected: exit code 0.

- [ ] **Step 2: Create the shared presentation module**

Create `src/components/shared/mobile-data-record.tsx` with:

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function MobileDataList({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-3 md:hidden" role="list">
      {children}
    </ul>
  );
}

export function MobileDataRecord({
  title,
  supportingText,
  amount,
  children,
  status,
  notes,
  actions,
}: {
  title: ReactNode;
  supportingText?: ReactNode;
  amount: ReactNode;
  children: ReactNode;
  status?: ReactNode;
  notes?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <li className="overflow-hidden rounded-md border bg-card text-card-foreground">
      <div className="space-y-4 p-4">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="line-clamp-2 font-medium leading-5">{title}</div>
            {supportingText ? (
              <div className="mt-1 truncate text-xs text-muted-foreground">
                {supportingText}
              </div>
            ) : null}
          </div>
          <div className="shrink-0 whitespace-nowrap text-right font-semibold tabular-nums">
            {amount}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</dl>

        {status ? <div>{status}</div> : null}
        {notes ? (
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {notes}
          </p>
        ) : null}
      </div>

      <div className="flex min-h-11 items-center justify-end border-t bg-muted/30 px-2 [&_button]:h-11 [&_button]:w-11">
        {actions}
      </div>
    </li>
  );
}

export function MobileDataDetail({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("min-w-0", align === "right" && "text-right")}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium tabular-nums">
        {children}
      </dd>
    </div>
  );
}
```

- [ ] **Step 3: Verify the module type-checks**

Run: `npm run typecheck`

Expected: exit code 0. If unrelated existing errors appear, record them before continuing.

- [ ] **Step 4: Commit the shared shell**

```bash
git add src/components/shared/mobile-data-record.tsx
git commit -m "feat: add mobile finance record shell"
```

### Task 2: Income and fixed-cost mobile records

**Files:**
- Modify: `src/features/income/incomes-table.tsx`
- Modify: `src/features/fixed-costs/fixed-costs-table.tsx`

**Interfaces:**
- Consumes: `MobileDataList`, `MobileDataRecord`, and `MobileDataDetail` from Task 1.
- Produces: responsive income and fixed-cost presentations with the same component props as before.

- [ ] **Step 1: Add shared imports to both files**

Add this import after the existing component imports in each file:

```tsx
import {
  MobileDataDetail,
  MobileDataList,
  MobileDataRecord,
} from "@/components/shared/mobile-data-record";
```

- [ ] **Step 2: Add income mobile records before the desktop table**

Change the `IncomesTable` return root to a fragment. Insert this block before the current bordered table wrapper, and change that wrapper class to `hidden overflow-x-auto rounded-md border md:block`:

```tsx
<MobileDataList>
  {incomes.map((income) => {
    const total = income.salary + income.bonus + income.other;

    return (
      <MobileDataRecord
        key={income.id}
        title={formatMonthVi(income.month)}
        amount={formatVND(total)}
        notes={income.notes || undefined}
        actions={
          <>
            <IncomeDialog
              income={income}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11"
                  aria-label="Chỉnh sửa thu nhập"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
            <DeleteIncomeButton id={income.id} />
          </>
        }
      >
        <MobileDataDetail label="Lương">
          {formatVND(income.salary)}
        </MobileDataDetail>
        <MobileDataDetail label="Thưởng" align="right">
          {formatVND(income.bonus)}
        </MobileDataDetail>
        <MobileDataDetail label="Khoản khác">
          {formatVND(income.other)}
        </MobileDataDetail>
      </MobileDataRecord>
    );
  })}
</MobileDataList>
```

- [ ] **Step 3: Add fixed-cost mobile records before the desktop table**

Change the `FixedCostsTable` return root to a fragment. Insert this block before the current bordered table wrapper, and change that wrapper class to `hidden overflow-x-auto rounded-md border md:block`:

```tsx
<div className="space-y-3 md:hidden">
  <MobileDataList>
    {fixedCosts.map((cost) => (
      <MobileDataRecord
        key={cost.id}
        title={cost.name}
        amount={formatVND(cost.amount)}
        notes={cost.notes || undefined}
        actions={
          <>
            <FixedCostDialog
              fixedCost={cost}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11"
                  aria-label="Chỉnh sửa chi phí cố định"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
            <DeleteFixedCostButton id={cost.id} />
          </>
        }
      >
        <MobileDataDetail label="Danh mục">
          {cost.category}
        </MobileDataDetail>
        <MobileDataDetail label="Ngày đến hạn" align="right">
          {cost.due_day ? `Ngày ${cost.due_day}` : "-"}
        </MobileDataDetail>
      </MobileDataRecord>
    ))}
  </MobileDataList>

  <div className="flex items-center justify-between rounded-md border bg-muted/50 px-4 py-3">
    <span className="text-sm font-medium">Tổng cộng hằng tháng</span>
    <span className="font-semibold tabular-nums">
      {formatVND(getTotalFixedCosts(fixedCosts))}
    </span>
  </div>
</div>
```

Because `MobileDataList` already hides itself above `md`, remove `md:hidden` from its class only if nested responsive behavior creates duplicate spacing. The outer fixed-cost wrapper remains `md:hidden`.

- [ ] **Step 4: Type-check both responsive views**

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 5: Commit the income and fixed-cost views**

```bash
git add src/features/income/incomes-table.tsx src/features/fixed-costs/fixed-costs-table.tsx
git commit -m "feat: improve income and fixed-cost mobile lists"
```

### Task 3: Installment mobile records

**Files:**
- Modify: `src/features/installments/installments-table.tsx`

**Interfaces:**
- Consumes: Task 1 mobile record components and existing installment calculations.
- Produces: the existing `InstallmentsTable` API with a mobile list below 768px.

- [ ] **Step 1: Import the shared mobile components**

```tsx
import {
  MobileDataDetail,
  MobileDataList,
  MobileDataRecord,
} from "@/components/shared/mobile-data-record";
```

- [ ] **Step 2: Add the mobile installment collection**

Change the return root to a fragment. Insert the following before the current bordered table wrapper, then change that wrapper class to `hidden overflow-x-auto rounded-md border md:block`:

```tsx
<MobileDataList>
  {installments.map((installment) => {
    const remainingMonths = getRemainingMonths(installment, currentMonth);

    return (
      <MobileDataRecord
        key={installment.id}
        title={installment.item_name}
        supportingText={installment.provider || undefined}
        amount={formatVND(getMonthlyPayment(installment))}
        status={
          <Badge variant={STATUS_VARIANTS[installment.status]}>
            {INSTALLMENT_STATUS_LABELS[installment.status]}
          </Badge>
        }
        actions={
          <>
            <InstallmentDialog
              installment={installment}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11"
                  aria-label="Chỉnh sửa khoản trả góp"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
            <DeleteInstallmentButton id={installment.id} />
          </>
        }
      >
        <MobileDataDetail label="Loại">
          {INSTALLMENT_TYPE_LABELS[installment.type]}
        </MobileDataDetail>
        <MobileDataDetail label="Bắt đầu" align="right">
          {formatMonthVi(installment.start_month)}
        </MobileDataDetail>
        <MobileDataDetail label="Còn lại">
          {remainingMonths > 0 ? `${remainingMonths} tháng` : "-"}
        </MobileDataDetail>
        <MobileDataDetail label="Còn nợ" align="right">
          {formatVND(getRemainingBalance(installment, currentMonth))}
        </MobileDataDetail>
      </MobileDataRecord>
    );
  })}
</MobileDataList>
```

- [ ] **Step 3: Verify calculations and types remain shared**

Run: `npm run typecheck`

Expected: exit code 0 with no duplicate-variable or JSX-root errors.

- [ ] **Step 4: Commit the installment view**

```bash
git add src/features/installments/installments-table.tsx
git commit -m "feat: improve installment mobile list"
```

### Task 4: Credit-card transaction mobile records

**Files:**
- Modify: `src/features/credit-cards/transactions-table.tsx`

**Interfaces:**
- Consumes: Task 1 mobile record components, existing `PaidToggle`, `TransactionDialog`, and `DeleteTransactionButton`.
- Produces: the existing `TransactionsTable` API with a mobile list below 768px.

- [ ] **Step 1: Import the shared mobile components**

```tsx
import {
  MobileDataDetail,
  MobileDataList,
  MobileDataRecord,
} from "@/components/shared/mobile-data-record";
```

- [ ] **Step 2: Expand the paid-state touch target**

Replace the `PaidToggle` button class with:

```tsx
className="inline-flex min-h-11 items-center rounded-md disabled:opacity-50"
```

- [ ] **Step 3: Add the mobile transaction collection**

Change the return root to a fragment. Insert the following before the current bordered table wrapper, then change that wrapper class to `hidden overflow-x-auto rounded-md border md:block`:

```tsx
<MobileDataList>
  {transactions.map((transaction) => (
    <MobileDataRecord
      key={transaction.id}
      title={transaction.description}
      amount={formatVND(transaction.amount)}
      status={<PaidToggle transaction={transaction} />}
      actions={
        <>
          <TransactionDialog
            cards={cards}
            transaction={transaction}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                aria-label="Chỉnh sửa giao dịch"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <DeleteTransactionButton id={transaction.id} />
        </>
      }
    >
      <MobileDataDetail label="Ngày">
        {formatDateVi(transaction.date)}
      </MobileDataDetail>
      <MobileDataDetail label="Danh mục" align="right">
        {transaction.category}
      </MobileDataDetail>
      <MobileDataDetail label="Thẻ">
        {cardNames.get(transaction.card_id) ?? "-"}
      </MobileDataDetail>
      <MobileDataDetail label="Kỳ sao kê" align="right">
        {formatMonthVi(transaction.statement_month)}
      </MobileDataDetail>
    </MobileDataRecord>
  ))}
</MobileDataList>
```

- [ ] **Step 4: Type-check the transaction view**

Run: `npm run typecheck`

Expected: exit code 0.

- [ ] **Step 5: Commit the transaction view**

```bash
git add src/features/credit-cards/transactions-table.tsx
git commit -m "feat: improve credit transaction mobile list"
```

### Task 5: Full validation, task list, and self-review

**Files:**
- Modify: `docs/05-TASKLIST.md`
- Review: all five source files changed by Tasks 1 through 4.

**Interfaces:**
- Consumes: completed responsive feature components.
- Produces: verified implementation and documented task completion.

- [ ] **Step 1: Run repository checks**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: `typecheck` and `build` exit 0. If `npm run lint` fails because `next lint` is unsupported by the installed Next.js version, record that exact tooling failure and rely on `next build` plus TypeScript for automated validation.

- [ ] **Step 2: Run copy and diff checks**

Run:

```bash
rg -n '—|–' src/components/shared/mobile-data-record.tsx src/features/income/incomes-table.tsx src/features/fixed-costs/fixed-costs-table.tsx src/features/installments/installments-table.tsx src/features/credit-cards/transactions-table.tsx
git diff --check
git diff --stat
```

Expected: no dash-character matches in newly added visible mobile copy, no whitespace errors, and only scoped files in the diff. Existing desktop fallback characters may be replaced with `-` if encountered in a touched file.

- [ ] **Step 3: Validate responsive behavior manually**

Start the app with `npm run dev`. At 320px, 375px, 767px, and 768px widths, verify:

- Below 768px, no finance record requires horizontal page scrolling.
- At 768px, the original desktop table appears and the mobile list disappears.
- Long names and descriptions stay inside their record.
- Currency aligns on the right and remains readable.
- Edit and delete controls open their existing dialogs.
- Credit paid-state control retains loading and confirmation behavior.
- Fixed-cost monthly total is visible below the mobile list.
- Light and dark themes retain readable text, borders, badges, and focus rings.
- Keyboard focus reaches every record action in a logical order.

- [ ] **Step 4: Update the project task list**

Add one completed entry under the nearest relevant UI or responsive section in `docs/05-TASKLIST.md`, preserving its current syntax:

```markdown
- [x] Improve mobile records for income, fixed costs, installments, and credit-card transactions
```

- [ ] **Step 5: Review the final diff**

Run: `git diff -- src/components/shared/mobile-data-record.tsx src/features/income/incomes-table.tsx src/features/fixed-costs/fixed-costs-table.tsx src/features/installments/installments-table.tsx src/features/credit-cards/transactions-table.tsx docs/05-TASKLIST.md`

Expected: no business-logic, route, form, schema, or desktop-layout changes beyond responsive visibility wrappers and fallback punctuation.

- [ ] **Step 6: Commit validation documentation**

```bash
git add docs/05-TASKLIST.md
git commit -m "docs: record mobile finance table improvements"
```

- [ ] **Step 7: Write the significant-session checkpoint**

Create `.serena/checkpoint/active/2026-07-20_<HH-mm>_codex_mobile-finance-tables.md` using the repository checkpoint template. Record changed files, verification output, manual viewport checks, current branch, commit, and any skipped checks. Do not include secrets or transient debug output.
