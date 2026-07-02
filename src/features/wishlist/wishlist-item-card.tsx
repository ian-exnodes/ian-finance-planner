"use client";

import { Pencil } from "lucide-react";

import { formatMonthVi, formatVND } from "@/lib/formatters";
import type { WishlistDecisionLabel, WishlistItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { WishlistAnalysis } from "./analysis";
import { DeleteWishlistButton } from "./delete-wishlist-button";
import {
  WISHLIST_NEED_LEVEL_LABELS,
  WISHLIST_PRIORITY_LABELS,
} from "./labels";
import { WishlistDialog } from "./wishlist-dialog";

const DECISION_VARIANTS: Record<
  WishlistDecisionLabel,
  "default" | "secondary" | "outline" | "destructive"
> = {
  "Có thể mua": "default",
  "Nên cân nhắc": "secondary",
  "Nên trì hoãn": "outline",
  "Không nên mua lúc này": "destructive",
};

function percent(ratio: number | null): string {
  return ratio === null ? "—" : `${Math.round(ratio * 100)}%`;
}

export function WishlistItemCard({
  item,
  analysis,
}: {
  item: WishlistItem;
  analysis: WishlistAnalysis;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{item.item_name}</CardTitle>
          <CardDescription>
            {formatVND(item.price)} · {item.payment_method}
          </CardDescription>
        </div>
        <div className="flex shrink-0">
          <WishlistDialog
            item={item}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Chỉnh sửa kế hoạch mua sắm"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <DeleteWishlistButton id={item.id} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">
            Ưu tiên: {WISHLIST_PRIORITY_LABELS[item.priority]}
          </Badge>
          <Badge variant="outline">
            {WISHLIST_NEED_LEVEL_LABELS[item.need_level]}
          </Badge>
          <Badge variant="outline">
            {formatMonthVi(item.expected_purchase_month)}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="flex justify-between">
            <span className="text-muted-foreground">Trả mỗi tháng</span>
            <span className="font-medium">
              {formatVND(analysis.monthlyImpact)}
              {item.months > 1 ? ` × ${item.months} tháng` : ""}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Tỷ lệ trả nợ hiện tại</span>
            <span>{percent(analysis.currentRatio)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-muted-foreground">Nếu mua</span>
            <span className="font-medium">{percent(analysis.projectedRatio)}</span>
          </p>
        </div>
        <Separator />
        <div className="mt-auto space-y-2">
          <Badge variant={DECISION_VARIANTS[analysis.decision]}>
            {analysis.decision}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {analysis.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
