import { Plus } from "lucide-react";

import { getIncomes } from "@/features/income/repository";
import { getInstallments } from "@/features/installments/repository";
import { getCreditTransactions } from "@/features/credit-cards/repository";
import { analyzeWishlistItem } from "@/features/wishlist/analysis";
import { getWishlistItems } from "@/features/wishlist/repository";
import { WishlistDialog } from "@/features/wishlist/wishlist-dialog";
import { WishlistItemCard } from "@/features/wishlist/wishlist-item-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function WishlistPage() {
  const [items, incomes, installments, creditTransactions] = await Promise.all([
    getWishlistItems(),
    getIncomes(),
    getInstallments(),
    getCreditTransactions(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Kế hoạch mua sắm</h1>
          <p className="text-sm text-muted-foreground">
            Kiểm tra tác động lên tỷ lệ trả nợ trước khi quyết định mua.
          </p>
        </div>
        <WishlistDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm kế hoạch
            </Button>
          }
        />
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="font-medium">Chưa có kế hoạch mua sắm.</p>
            <p className="text-sm text-muted-foreground">
              Hãy thêm món hàng bạn định mua để xem tác động lên tài chính
              trước khi quyết định.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              analysis={analyzeWishlistItem(item, {
                incomes,
                installments,
                creditTransactions,
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
