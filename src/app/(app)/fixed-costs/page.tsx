import { Plus } from "lucide-react";

import { getFixedCosts } from "@/features/fixed-costs/repository";
import { FixedCostDialog } from "@/features/fixed-costs/fixed-cost-dialog";
import { FixedCostsTable } from "@/features/fixed-costs/fixed-costs-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function FixedCostsPage() {
  const fixedCosts = await getFixedCosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Chi phí cố định</h1>
          <p className="text-sm text-muted-foreground">
            Các khoản chi lặp lại hằng tháng như tiền nhà, điện nước, internet.
          </p>
        </div>
        <FixedCostDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm chi phí cố định
            </Button>
          }
        />
      </div>

      {fixedCosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="font-medium">Chưa có chi phí cố định.</p>
            <p className="text-sm text-muted-foreground">
              Hãy thêm các khoản chi hằng tháng để hệ thống tính toán tiền còn
              lại chính xác hơn.
            </p>
          </CardContent>
        </Card>
      ) : (
        <FixedCostsTable fixedCosts={fixedCosts} />
      )}
    </div>
  );
}
