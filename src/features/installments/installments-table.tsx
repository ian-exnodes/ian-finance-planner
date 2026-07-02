"use client";

import { Pencil } from "lucide-react";

import {
  getMonthlyPayment,
  getRemainingBalance,
  getRemainingMonths,
  monthFromDate,
} from "@/lib/calculations";
import { formatMonthVi, formatVND } from "@/lib/formatters";
import type { Installment, InstallmentStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteInstallmentButton } from "./delete-installment-button";
import { InstallmentDialog } from "./installment-dialog";
import {
  INSTALLMENT_STATUS_LABELS,
  INSTALLMENT_TYPE_LABELS,
} from "./labels";

const STATUS_VARIANTS: Record<
  InstallmentStatus,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  paid: "secondary",
  paused: "outline",
};

export function InstallmentsTable({
  installments,
}: {
  installments: Installment[];
}) {
  const currentMonth = monthFromDate(new Date());

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Món hàng</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Bắt đầu</TableHead>
            <TableHead className="text-right">Hằng tháng</TableHead>
            <TableHead className="text-right">Còn lại</TableHead>
            <TableHead className="text-right">Còn nợ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-24 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installments.map((installment) => {
            const remainingMonths = getRemainingMonths(
              installment,
              currentMonth
            );
            return (
              <TableRow key={installment.id}>
                <TableCell>
                  <div className="font-medium">{installment.item_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {installment.provider}
                  </div>
                </TableCell>
                <TableCell>
                  {INSTALLMENT_TYPE_LABELS[installment.type]}
                </TableCell>
                <TableCell>{formatMonthVi(installment.start_month)}</TableCell>
                <TableCell className="text-right">
                  {formatVND(getMonthlyPayment(installment))}
                </TableCell>
                <TableCell className="text-right">
                  {remainingMonths > 0 ? `${remainingMonths} tháng` : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {formatVND(getRemainingBalance(installment, currentMonth))}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[installment.status]}>
                    {INSTALLMENT_STATUS_LABELS[installment.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <InstallmentDialog
                      installment={installment}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Chỉnh sửa khoản trả góp"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteInstallmentButton id={installment.id} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
