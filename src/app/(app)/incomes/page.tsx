import { Plus } from "lucide-react";

import { getIncomes } from "@/features/income/repository";
import { IncomeDialog } from "@/features/income/income-dialog";
import { IncomesTable } from "@/features/income/incomes-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function IncomesPage() {
  const incomes = await getIncomes();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Thu nhập</h1>
          <p className="text-sm text-muted-foreground">
            Thu nhập hằng tháng của bạn: lương, thưởng và các khoản khác.
          </p>
        </div>
        <IncomeDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm thu nhập
            </Button>
          }
        />
      </div>

      {incomes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="font-medium">Chưa có dữ liệu thu nhập.</p>
            <p className="text-sm text-muted-foreground">
              Hãy thêm thu nhập hằng tháng để hệ thống tính toán dòng tiền
              chính xác hơn.
            </p>
          </CardContent>
        </Card>
      ) : (
        <IncomesTable incomes={incomes} />
      )}
    </div>
  );
}
