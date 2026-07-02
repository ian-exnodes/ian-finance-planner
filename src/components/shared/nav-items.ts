import {
  CalendarClock,
  CreditCard,
  LayoutDashboard,
  ReceiptText,
  ShoppingBag,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Labels from docs/04-DESIGN_SYSTEM.md ("Cài đặt" is added when a settings page exists)
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/incomes", label: "Thu nhập", icon: Wallet },
  { href: "/fixed-costs", label: "Chi phí cố định", icon: ReceiptText },
  { href: "/installments", label: "Khoản trả góp", icon: CalendarClock },
  { href: "/credit-cards", label: "Thẻ tín dụng", icon: CreditCard },
  { href: "/wishlist", label: "Kế hoạch mua sắm", icon: ShoppingBag },
];
