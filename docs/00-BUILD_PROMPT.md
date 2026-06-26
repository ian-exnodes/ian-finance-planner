# Build Prompt: Personal Finance Debt Planner with Supabase

You are a **Senior Full-stack Engineer + Product Designer**. Build a personal finance web app that helps one individual manage planned spending, credit card payments, pay-later purchases, and installment obligations.

The app must be deployable to **Vercel** and must use **Supabase** as the backend.

## Important Language Requirement

The **prompt, code comments, technical documentation, database names, TypeScript types, and developer-facing terms can be in English**.

However, the **user-facing application UI must be fully in Vietnamese**.

This includes:

- Page titles
- Navigation labels
- Buttons
- Forms
- Table headers
- Empty states
- Toast messages
- Error messages
- Chart labels
- Status labels
- Confirmation dialogs
- Dashboard cards
- Auth pages
- Onboarding/help text

Do not mix English into the visible UI unless it is a common finance/product term that Vietnamese users normally understand, such as:

- Dashboard
- Debt Ratio
- Visa
- Mastercard
- Credit Card

Even then, prefer Vietnamese labels when possible.

Examples:

```txt
Good:
- Tổng quan tài chính
- Thu nhập tháng này
- Chi phí cố định
- Cần trả tháng này
- Tiền còn lại
- Tỷ lệ trả nợ
- Khoản trả góp
- Thẻ tín dụng
- Ví trả sau
- Kế hoạch mua sắm

Bad:
- Monthly Income
- Fixed Costs
- Remaining Cash
- Add Transaction
- Delete Item
- Payment Due
```

## Product Goal

Create an app that helps the user manage:

- Monthly income
- Fixed monthly expenses
- Credit cards
- Pay-later wallets
- Installment purchases
- Credit card transactions
- Wishlist / purchase planning

The app must help answer:

- How much money do I need to reserve this month for repayments?
- How much money will remain after fixed costs and repayments?
- Which future months are financially stressful?
- What is my debt ratio?
- If I buy another item, is it still financially safe?

## Target User

This app is for personal use by a single user.

However, still implement Supabase Auth properly because the deployed app should not expose personal financial data publicly.

No multi-tenant/team features are required.

## Tech Stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Supabase
  - Supabase Auth
  - Supabase Postgres
  - Row Level Security
- React Hook Form
- Zod
- Vercel deployment

Do **not** use localStorage as the main persistence layer.

LocalStorage may only be used for UI preferences such as:

- Theme
- Sidebar collapsed state
- Last selected month

## Authentication

Implement Supabase Auth.

Required auth flows:

- Sign up with email/password
- Sign in with email/password
- Sign out
- Protect all app routes
- Redirect unauthenticated users to `/login`
- Redirect authenticated users away from `/login`

Every user-owned table must include `user_id`.

The authenticated user must only see their own financial data.

## Routes

### `/`

If unauthenticated, show a simple landing page in Vietnamese.

Suggested UI copy:

```txt
Quản lý chi tiêu và trả góp cá nhân
Theo dõi thu nhập, thẻ tín dụng, ví trả sau và các khoản cần thanh toán hằng tháng.
Đăng nhập
Tạo tài khoản
```

If authenticated, redirect to `/dashboard`.

### `/login`

Vietnamese UI only.

Fields:

- Email
- Mật khẩu

Buttons:

- Đăng nhập
- Tạo tài khoản

Messages:

- Đăng nhập thành công
- Email hoặc mật khẩu không đúng
- Vui lòng nhập email hợp lệ
- Mật khẩu không được để trống

### `/dashboard`

Vietnamese title:

```txt
Tổng quan tài chính
```

Show cards:

- Thu nhập tháng này
- Chi phí cố định
- Trả góp tháng này
- Thẻ tín dụng cần trả
- Tổng cần trả
- Tiền còn lại
- Tỷ lệ trả nợ

Charts:

- Dòng tiền theo tháng
- Khoản phải trả theo tháng
- Tỷ lệ trả nợ theo tháng
- Phân bổ khoản nợ theo nguồn

Debt ratio display rules:

- `<20%`: An toàn
- `20–35%`: Cần theo dõi
- `35–50%`: Rủi ro
- `>50%`: Nguy hiểm

Use color indicators:

- Green for safe
- Yellow for watch
- Orange for risky
- Red for dangerous

### `/income`

Vietnamese title:

```txt
Thu nhập
```

CRUD monthly income.

Fields:

- Tháng
- Lương
- Thưởng
- Thu nhập khác
- Ghi chú

Buttons:

- Thêm thu nhập
- Lưu thay đổi
- Xóa
- Hủy

Empty state:

```txt
Chưa có dữ liệu thu nhập.
Hãy thêm thu nhập hằng tháng để Dashboard có thể tính toán dòng tiền.
```

### `/fixed-costs`

Vietnamese title:

```txt
Chi phí cố định
```

CRUD recurring monthly expenses.

Fields:

- Tên khoản chi
- Danh mục
- Số tiền hằng tháng
- Ngày thanh toán
- Ghi chú

Examples:

- Tiền nhà
- Điện
- Nước
- Internet
- Ăn uống
- Xăng xe
- Điện thoại

### `/installments`

Vietnamese title:

```txt
Khoản trả góp
```

CRUD installment items.

Fields:

- Tên món
- Nguồn thanh toán
- Loại thanh toán
- Ngày mua
- Tổng giá trị
- Số tháng trả góp
- Số tiền trả mỗi tháng
- Tháng bắt đầu
- Ngày đến hạn
- Trạng thái
- Ghi chú

Payment type labels:

- `credit_card`: Thẻ tín dụng
- `pay_later`: Ví trả sau
- `loan`: Khoản vay
- `other`: Khác

Status labels:

- `active`: Đang trả
- `paid`: Đã trả xong
- `paused`: Tạm dừng

Logic:

- If monthly payment is empty, calculate `total amount / number of months`.
- Generate monthly repayment schedule automatically.
- Show remaining months.
- Show remaining balance.
- Only active installments affect dashboard calculations.

### `/credit-cards`

Vietnamese title:

```txt
Thẻ tín dụng
```

Manage cards.

Fields:

- Tên thẻ
- Ngân hàng / Nhà cung cấp
- Ngày sao kê
- Ngày thanh toán
- Hạn mức
- Ghi chú

Manage transactions.

Fields:

- Ngày giao dịch
- Thẻ
- Nội dung
- Danh mục
- Số tiền
- Tháng sao kê
- Ngày đến hạn
- Đã thanh toán
- Ghi chú

Transaction UI labels:

- Thêm giao dịch
- Đã thanh toán
- Chưa thanh toán
- Tổng chưa thanh toán
- Tổng đã thanh toán

### `/wishlist`

Vietnamese title:

```txt
Kế hoạch mua sắm
```

The user can simulate future purchases.

Fields:

- Tên món
- Giá
- Phương thức thanh toán
- Số tháng trả
- Dự kiến mua vào tháng
- Độ ưu tiên
- Mức độ cần thiết
- Ghi chú

Priority labels:

- `low`: Thấp
- `medium`: Trung bình
- `high`: Cao

Need level labels:

- `nice_to_have`: Có thì tốt
- `useful`: Hữu ích
- `necessary`: Cần thiết

For each wishlist item, calculate:

- Monthly payment impact
- New debt ratio after purchase
- Whether the purchase is financially safe

Decision labels:

- Có thể mua
- Nên cân nhắc
- Nên trì hoãn
- Không nên mua lúc này

Suggested explanation copy:

```txt
Nếu mua món này, mỗi tháng bạn sẽ cần trả thêm {amount}.
Tỷ lệ trả nợ dự kiến sẽ tăng lên {ratio}.
```

## Data Model

Create Supabase tables.

Use UUID primary keys.

Every user-owned table must include:

- `id uuid primary key`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Tables:

- `incomes`
- `fixed_costs`
- `installments`
- `credit_cards`
- `credit_transactions`
- `wishlist_items`

## Database Schema

Create SQL migrations for the following.

### incomes

```sql
create table public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null,
  salary numeric not null default 0,
  bonus numeric not null default 0,
  other numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### fixed_costs

```sql
create table public.fixed_costs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  amount numeric not null default 0,
  due_day int,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### installments

```sql
create type installment_type as enum (
  'credit_card',
  'pay_later',
  'loan',
  'other'
);

create type installment_status as enum (
  'active',
  'paid',
  'paused'
);

create table public.installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  provider text not null,
  type installment_type not null default 'other',
  purchase_date date not null,
  total_amount numeric not null,
  months int not null,
  monthly_payment numeric,
  start_month text not null,
  due_day int,
  status installment_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### credit_cards

```sql
create table public.credit_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  provider text not null,
  statement_day int,
  due_day int,
  credit_limit numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### credit_transactions

```sql
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.credit_cards(id) on delete cascade,
  date date not null,
  description text not null,
  category text not null,
  amount numeric not null,
  statement_month text not null,
  due_date date,
  paid boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### wishlist_items

```sql
create type wishlist_priority as enum (
  'low',
  'medium',
  'high'
);

create type wishlist_need_level as enum (
  'nice_to_have',
  'useful',
  'necessary'
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_name text not null,
  price numeric not null,
  payment_method text not null,
  months int not null default 1,
  expected_purchase_month text not null,
  priority wishlist_priority not null default 'medium',
  need_level wishlist_need_level not null default 'useful',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Row Level Security

Enable RLS for all user-owned tables.

Each table must have policies for:

- Select own rows
- Insert own rows
- Update own rows
- Delete own rows

Example:

```sql
alter table public.incomes enable row level security;

create policy "Users can view own incomes"
on public.incomes
for select
using (auth.uid() = user_id);

create policy "Users can insert own incomes"
on public.incomes
for insert
with check (auth.uid() = user_id);

create policy "Users can update own incomes"
on public.incomes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own incomes"
on public.incomes
for delete
using (auth.uid() = user_id);
```

Apply equivalent policies to:

- `fixed_costs`
- `installments`
- `credit_cards`
- `credit_transactions`
- `wishlist_items`

## Updated At Trigger

Create reusable trigger function:

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

Add `before update` triggers to all user-owned tables.

## TypeScript Types

Create TypeScript types matching the database.

```ts
export type MonthKey = string; // YYYY-MM

export type Income = {
  id: string;
  userId: string;
  month: MonthKey;
  salary: number;
  bonus: number;
  other: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FixedCost = {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  dueDay?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Installment = {
  id: string;
  userId: string;
  itemName: string;
  provider: string;
  type: "credit_card" | "pay_later" | "loan" | "other";
  purchaseDate: string;
  totalAmount: number;
  months: number;
  monthlyPayment?: number | null;
  startMonth: MonthKey;
  dueDay?: number | null;
  status: "active" | "paid" | "paused";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreditCard = {
  id: string;
  userId: string;
  name: string;
  provider: string;
  statementDay?: number | null;
  dueDay?: number | null;
  creditLimit?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreditTransaction = {
  id: string;
  userId: string;
  cardId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  statementMonth: MonthKey;
  dueDate?: string | null;
  paid: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WishlistItem = {
  id: string;
  userId: string;
  itemName: string;
  price: number;
  paymentMethod: string;
  months: number;
  expectedPurchaseMonth: MonthKey;
  priority: "low" | "medium" | "high";
  needLevel: "nice_to_have" | "useful" | "necessary";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};
```

## Supabase Client Structure

Create:

```txt
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/middleware.ts
```

Use environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not hard-code Supabase credentials.

## Data Access Layer

Create repository/service functions for each domain.

Suggested structure:

```txt
src/features/income/income.repo.ts
src/features/fixed-costs/fixed-costs.repo.ts
src/features/installments/installments.repo.ts
src/features/credit-cards/credit-cards.repo.ts
src/features/wishlist/wishlist.repo.ts
```

Each repo should expose:

- `list`
- `create`
- `update`
- `remove`

All writes must rely on the authenticated user's ID.

Do not trust user-submitted `user_id` from form inputs.

## Calculation Requirements

Create utility functions:

```ts
getMonthRange(startMonth: MonthKey, count: number): MonthKey[]

calculateMonthlyInstallment(item: Installment): number

getInstallmentSchedule(items: Installment[]): Record<MonthKey, number>

getCreditCardDueByMonth(transactions: CreditTransaction[]): Record<MonthKey, number>

getFixedCostTotal(fixedCosts: FixedCost[]): number

getIncomeByMonth(incomes: Income[]): Record<MonthKey, number>

getMonthlyCashflow(...): {
  month: MonthKey;
  income: number;
  fixedCosts: number;
  installmentsDue: number;
  creditCardDue: number;
  totalDebtPayment: number;
  remainingCash: number;
  debtRatio: number | null;
}[]
```

Debt ratio formula:

```ts
debtRatio = totalDebtPayment / income
```

If income is `0`, `debtRatio` should be `null`, not `NaN`.

## Vietnamese Formatting Requirements

Currency:

```ts
new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
}).format(value)
```

Expected display:

```txt
12.500.000 ₫
```

Month display:

```txt
Tháng 07/2026
```

Date display:

```txt
26/06/2026
```

## UX Requirements

- Beautiful modern finance dashboard
- Mobile responsive
- Dark mode friendly
- Fast data entry
- Helpful empty states
- Edit/delete actions in tables
- Loading states for Supabase queries
- Toast notifications for create/update/delete
- Friendly Vietnamese error messages
- Confirmation dialog before deleting important records
- No English text in visible UI unless unavoidable

## Seed Data

Create a development-only seed button.

Button label:

```txt
Tạo dữ liệu mẫu
```

Seed data must only be created for the currently logged-in user.

Sample data:

### Income

- 2026-07 salary 30000000
- 2026-08 salary 30000000
- 2026-09 salary 30000000

### Fixed Costs

- Tiền nhà 5000000
- Ăn uống 3500000
- Internet 250000
- Xăng xe 1000000
- Điện thoại 200000

### Installments

- Màn hình, provider: Thẻ tín dụng, total 9000000, months 6, startMonth 2026-07
- Steam Summer Sale, provider: Visa, total 3000000, months 3, startMonth 2026-07
- Ghế công thái học, provider: Ví trả sau, total 6000000, months 6, startMonth 2026-08

### Credit Transactions

- Phụ kiện Shopee 700000, statementMonth 2026-07
- Đi siêu thị 1200000, statementMonth 2026-07
- DLC game 900000, statementMonth 2026-08

### Wishlist

- Tai nghe mới 4500000, 3 months, expectedPurchaseMonth 2026-08
- Warhammer DLC bundle 1500000, 1 month, expectedPurchaseMonth 2026-07

## Environment Setup

Create `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## README Requirements

Add README instructions for:

1. Creating a Supabase project
2. Copying Supabase URL and anon key
3. Creating `.env.local`
4. Running database migrations
5. Running the app locally
6. Deploying to Vercel
7. Adding env vars in Vercel project settings

README can be in English or Vietnamese.

## Implementation Tasks

1. Initialize a clean Next.js project.
2. Install and configure Tailwind CSS.
3. Install and configure shadcn/ui.
4. Install Supabase packages.
5. Create Supabase client/server utilities.
6. Create database migration SQL for all tables, enums, RLS policies, and triggers.
7. Create app layout, navigation sidebar, and responsive shell.
8. Implement auth pages.
9. Protect app routes.
10. Implement all TypeScript data models.
11. Implement data repositories.
12. Implement calculation utilities.
13. Build Dashboard page.
14. Build Income CRUD page.
15. Build Fixed Costs CRUD page.
16. Build Installments CRUD page.
17. Build Credit Cards + Transactions pages.
18. Build Wishlist Planner page.
19. Add charts using Recharts.
20. Add polished styling with Tailwind and shadcn/ui.
21. Add `.env.example`.
22. Add README with setup and deployment instructions.
23. Make sure `npm run build` passes.
24. Fix all TypeScript, lint, and runtime errors.

## Acceptance Criteria

- App runs locally with `npm run dev`.
- App builds successfully with `npm run build`.
- Auth works with Supabase email/password.
- Unauthenticated users cannot access dashboard/app routes.
- Each user can only see their own data.
- RLS is enabled and correctly configured.
- Dashboard correctly updates when data changes.
- User can add/edit/delete income, fixed costs, installments, credit cards, credit transactions, and wishlist items.
- All business data persists in Supabase.
- App is usable on mobile.
- Visible UI language is Vietnamese.
- No paid API required.
- No hard-coded secrets.
- Vercel deployment works after adding Supabase env vars.

## Final Instruction

Think through the financial logic carefully before coding.

Prioritize:

1. Correct calculations
2. Secure Supabase RLS
3. Vietnamese user-facing UI
4. Clean UX
5. Deployability

After implementation, run:

```bash
npm run build
```

Fix all TypeScript, lint, and runtime errors before finishing.

At the end, provide:

- Summary of what was built
- How to run locally
- How to configure Supabase
- How to deploy to Vercel
- Any known limitations
