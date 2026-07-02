import type { InstallmentStatus, InstallmentType } from "@/types";

// Labels from docs/04-DESIGN_SYSTEM.md
export const INSTALLMENT_TYPE_LABELS: Record<InstallmentType, string> = {
  credit_card: "Thẻ tín dụng",
  pay_later: "Ví trả sau",
  loan: "Khoản vay",
  other: "Khác",
};

export const INSTALLMENT_STATUS_LABELS: Record<InstallmentStatus, string> = {
  active: "Đang trả",
  paid: "Đã trả xong",
  paused: "Tạm dừng",
};
