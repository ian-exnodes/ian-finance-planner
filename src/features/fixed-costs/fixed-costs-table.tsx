"use client";

import { Pencil } from "lucide-react";

import { getTotalFixedCosts } from "@/lib/calculations";
import { formatVND } from "@/lib/formatters";
import type { FixedCost } from "@/types";
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
    <div className="overflow-x-auto rounded-md border">
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
                {cost.due_day ? `Ngày ${cost.due_day}` : "—"}
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
  );
}
