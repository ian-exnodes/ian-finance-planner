# 04 — Design System & Vietnamese UI Guidelines

## UI Language

All visible UI must be Vietnamese.

Avoid visible English labels such as:

- Add
- Edit
- Delete
- Save
- Cancel
- Monthly Income
- Fixed Costs
- Remaining Cash

Use:

- Thêm
- Chỉnh sửa
- Xóa
- Lưu
- Hủy
- Thu nhập hằng tháng
- Chi phí cố định
- Tiền còn lại

## Tone

The app should feel:

- Calm
- Clear
- Personal
- Non-judgmental
- Financially practical

Avoid scary or shaming copy.

Good:

```txt
Tháng này hơi căng, bạn nên hạn chế mở thêm khoản trả góp mới.
```

Bad:

```txt
Bạn đang nợ quá nhiều.
```

## Core Navigation Labels

- Tổng quan
- Thu nhập
- Chi phí cố định
- Khoản trả góp
- Thẻ tín dụng
- Kế hoạch mua sắm
- Cài đặt

## Status Labels

Installment status:

- `active`: Đang trả
- `paid`: Đã trả xong
- `paused`: Tạm dừng

Payment type:

- `credit_card`: Thẻ tín dụng
- `pay_later`: Ví trả sau
- `loan`: Khoản vay
- `other`: Khác

Wishlist priority:

- `low`: Thấp
- `medium`: Trung bình
- `high`: Cao

Wishlist need level:

- `nice_to_have`: Có thì tốt
- `useful`: Hữu ích
- `necessary`: Cần thiết

## Formatting

Currency:

```ts
new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
}).format(value)
```

Expected:

```txt
12.500.000 ₫
```

Month:

```txt
Tháng 07/2026
```

Date:

```txt
26/06/2026
```

## Layout

Dashboard should prioritize:

1. Current month status
2. Monthly repayment timeline
3. Future risk
4. Detailed breakdown

Mobile-first design.

## Empty States

Each empty state should explain why the data matters.

Example:

```txt
Chưa có dữ liệu thu nhập.
Hãy thêm thu nhập hằng tháng để hệ thống tính toán dòng tiền chính xác hơn.
```

## Delete Confirmation

Use confirmation dialogs for destructive actions.

Example:

```txt
Bạn có chắc muốn xóa khoản này không?
Hành động này không thể hoàn tác.
```
