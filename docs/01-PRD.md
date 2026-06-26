# 01 — Product Requirements Document

## Product Name

Personal Finance Debt Planner

## Product Goal

Build a personal finance web application for one individual to manage monthly income, fixed costs, credit card transactions, pay-later spending, installments, and planned future purchases.

The application must help the user answer:

- How much money must be reserved this month for repayments?
- How much cash remains after fixed costs and debt payments?
- Which upcoming months are financially risky?
- What is the current debt ratio?
- Is a planned purchase financially safe?

## Target User

A single private user managing personal spending.

This is not a team app, accounting app, banking app, or public SaaS.

## Language Requirement

Developer-facing docs and code may use English.

All visible UI must be Vietnamese.

Examples:

- `Tổng quan tài chính`
- `Thu nhập tháng này`
- `Chi phí cố định`
- `Cần trả tháng này`
- `Tiền còn lại`
- `Tỷ lệ trả nợ`
- `Khoản trả góp`
- `Thẻ tín dụng`
- `Ví trả sau`
- `Kế hoạch mua sắm`

## In Scope

- Email/password authentication
- Dashboard
- Income CRUD
- Fixed costs CRUD
- Installments CRUD
- Credit cards CRUD
- Credit card transaction CRUD
- Wishlist / purchase planner
- Monthly cashflow calculation
- Debt ratio calculation
- Vietnamese currency/date/month formatting
- Supabase persistence
- Vercel deployment

## Out of Scope for v1

- Team sharing
- Bank sync
- Payment automation
- AI spending analysis
- OCR bill import
- Investment tracking
- Push notifications
- Mobile native app
- Public SaaS billing
- Multi-currency support

## Core User Flows

### First Use

1. User opens app.
2. User signs up or signs in.
3. User optionally creates sample data.
4. User adds monthly income.
5. User adds fixed costs.
6. User adds installments and credit card transactions.
7. Dashboard shows monthly financial pressure.

### Add Installment

1. User opens `Khoản trả góp`.
2. User adds item name, provider, amount, months, start month, due day.
3. App calculates monthly payment if not manually provided.
4. Dashboard updates monthly repayment schedule.

### Plan Future Purchase

1. User opens `Kế hoạch mua sắm`.
2. User adds item price, payment method, months, expected purchase month.
3. App calculates monthly impact and new debt ratio.
4. App labels the purchase as safe, caution, delay, or do not buy.

## Business Rules

### Debt Ratio

```ts
debtRatio = totalDebtPayment / income
```

If income is `0`, debt ratio must be `null`, not `NaN`.

### Debt Risk Labels

- `<20%`: `An toàn`
- `20–35%`: `Cần theo dõi`
- `35–50%`: `Rủi ro`
- `>50%`: `Nguy hiểm`

### Installment Payment

If `monthly_payment` is empty:

```ts
monthlyPayment = totalAmount / months
```

Only active installments affect dashboard calculations.

### Wishlist Decision

Suggested rule:

- `<20%`: `Có thể mua`
- `20–35%`: `Nên cân nhắc`
- `35–50%`: `Nên trì hoãn`
- `>50%`: `Không nên mua lúc này`

## Success Criteria

- User can understand monthly obligations within 10 seconds of opening the dashboard.
- User can add a transaction or installment quickly on mobile.
- Data persists securely in Supabase.
- Each authenticated user only sees their own data.
- App deploys successfully to Vercel.
