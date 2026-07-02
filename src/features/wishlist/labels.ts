import type { WishlistNeedLevel, WishlistPriority } from "@/types";

// Labels from docs/04-DESIGN_SYSTEM.md
export const WISHLIST_PRIORITY_LABELS: Record<WishlistPriority, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

export const WISHLIST_NEED_LEVEL_LABELS: Record<WishlistNeedLevel, string> = {
  nice_to_have: "Có thì tốt",
  useful: "Hữu ích",
  necessary: "Cần thiết",
};
