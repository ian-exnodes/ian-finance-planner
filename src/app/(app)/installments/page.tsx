import { Plus } from "lucide-react";

import { getInstallments } from "@/features/installments/repository";
import { InstallmentDialog } from "@/features/installments/installment-dialog";
import { InstallmentsTable } from "@/features/installments/installments-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function InstallmentsPage() {
  const installments = await getInstallments();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Khoản trả góp</h1>
          <p className="text-sm text-muted-foreground">
            Các khoản trả góp qua thẻ tín dụng, ví trả sau và khoản vay.
          </p>
        </div>
        <InstallmentDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khoản trả góp
            </Button>
          }
        />
      </div>

      {installments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="font-medium">Chưa có khoản trả góp.</p>
            <p className="text-sm text-muted-foreground">
              Hãy thêm các khoản trả góp để theo dõi số tiền phải trả mỗi
              tháng.
            </p>
          </CardContent>
        </Card>
      ) : (
        <InstallmentsTable installments={installments} />
      )}
    </div>
  );
}
