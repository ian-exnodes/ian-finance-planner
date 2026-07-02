"use client";

import { Pencil } from "lucide-react";

import { formatMonthVi, formatVND } from "@/lib/formatters";
import type { Income } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteIncomeButton } from "./delete-income-button";
import { IncomeDialog } from "./income-dialog";

export function IncomesTable({ incomes }: { incomes: Income[] }) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tháng</TableHead>
            <TableHead className="text-right">Lương</TableHead>
            <TableHead className="text-right">Thưởng</TableHead>
            <TableHead className="text-right">Khoản khác</TableHead>
            <TableHead className="text-right">Tổng cộng</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead className="w-24 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.map((income) => (
            <TableRow key={income.id}>
              <TableCell className="font-medium">
                {formatMonthVi(income.month)}
              </TableCell>
              <TableCell className="text-right">
                {formatVND(income.salary)}
              </TableCell>
              <TableCell className="text-right">
                {formatVND(income.bonus)}
              </TableCell>
              <TableCell className="text-right">
                {formatVND(income.other)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatVND(income.salary + income.bonus + income.other)}
              </TableCell>
              <TableCell className="max-w-40 truncate text-muted-foreground">
                {income.notes}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <IncomeDialog
                    income={income}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Chỉnh sửa thu nhập"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DeleteIncomeButton id={income.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
