"use client";

import { Pencil } from "lucide-react";

import { getTotalFixedCosts } from "@/lib/calculations";
import { formatVND } from "@/lib/formatters";
import type { FixedCost } from "@/types";
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteFixedCostButton } from "./delete-fixed-cost-button";
import { FixedCostDialog } from "./fixed-cost-dialog";

export function FixedCostsTable({ fixedCosts }: { fixedCosts: FixedCost[] }) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        <MobileDataList>
          {fixedCosts.map((cost) => (
            <MobileDataRecord
              key={cost.id}
              title={cost.name}
              amount={formatVND(cost.amount)}
              notes={cost.notes || undefined}
              actions={
                <>
                  <FixedCostDialog
                    fixedCost={cost}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11"
                        aria-label="Chỉnh sửa chi phí cố định"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DeleteFixedCostButton id={cost.id} />
                </>
              }
            >
              <MobileDataDetail label="Danh mục">
                {cost.category}
              </MobileDataDetail>
              <MobileDataDetail label="Ngày đến hạn" align="right">
                {cost.due_day ? `Ngày ${cost.due_day}` : "-"}
              </MobileDataDetail>
            </MobileDataRecord>
          ))}
        </MobileDataList>

        <div className="flex items-center justify-between rounded-md border bg-muted/50 px-4 py-3">
          <span className="text-sm font-medium">Tổng cộng hằng tháng</span>
          <span className="font-semibold tabular-nums">
            {formatVND(getTotalFixedCosts(fixedCosts))}
          </span>
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên khoản chi</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead>Ngày đến hạn</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fixedCosts.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell className="font-medium">{cost.name}</TableCell>
                <TableCell>{cost.category}</TableCell>
                <TableCell className="text-right">
                  {formatVND(cost.amount)}
                </TableCell>
                <TableCell>
                  {cost.due_day ? `Ngày ${cost.due_day}` : "-"}
                </TableCell>
                <TableCell className="max-w-40 truncate text-muted-foreground">
                  {cost.notes}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <FixedCostDialog
                      fixedCost={cost}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Chỉnh sửa chi phí cố định"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteFixedCostButton id={cost.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Tổng cộng hằng tháng</TableCell>
              <TableCell className="text-right font-semibold">
                {formatVND(getTotalFixedCosts(fixedCosts))}
              </TableCell>
              <TableCell colSpan={3} />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
