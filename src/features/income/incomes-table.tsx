"use client";

import { Pencil } from "lucide-react";

import { formatMonthVi, formatVND } from "@/lib/formatters";
import type { Income } from "@/types";
import {
  MobileDataDetail,
  MobileDataList,
  MobileDataRecord,
} from "@/components/shared/mobile-data-record";
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
    <>
      <MobileDataList>
        {incomes.map((income) => {
          const total = income.salary + income.bonus + income.other;

          return (
            <MobileDataRecord
              key={income.id}
              title={formatMonthVi(income.month)}
              amount={formatVND(total)}
              notes={income.notes || undefined}
              actions={
                <>
                  <IncomeDialog
                    income={income}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11"
                        aria-label="Chỉnh sửa thu nhập"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DeleteIncomeButton id={income.id} />
                </>
              }
            >
              <MobileDataDetail label="Lương">
                {formatVND(income.salary)}
              </MobileDataDetail>
              <MobileDataDetail label="Thưởng" align="right">
                {formatVND(income.bonus)}
              </MobileDataDetail>
              <MobileDataDetail label="Khoản khác">
                {formatVND(income.other)}
              </MobileDataDetail>
            </MobileDataRecord>
          );
        })}
      </MobileDataList>

      <div className="hidden overflow-x-auto rounded-md border md:block">
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
                  {formatMonthVi(income.month).replace(/^Tháng /, "")}
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
    </>
  );
}
