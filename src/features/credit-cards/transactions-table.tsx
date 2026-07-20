"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { formatDateVi, formatMonthVi, formatVND } from "@/lib/formatters";
import type { CreditCard, CreditTransaction } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MobileDataDetail,
  MobileDataList,
  MobileDataRecord,
} from "@/components/shared/mobile-data-record";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  deleteCreditTransactionAction,
  setTransactionPaidAction,
} from "./actions";
import { TransactionDialog } from "./transaction-dialog";

function PaidToggle({ transaction }: { transaction: CreditTransaction }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  function onToggle() {
    startTransition(async () => {
      const result = await setTransactionPaidAction(
        transaction.id,
        !transaction.paid
      );
      if (result && "error" in result) {
        toast({ variant: "destructive", description: result.error });
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isPending}
      aria-label={
        transaction.paid
          ? "Đánh dấu chưa thanh toán"
          : "Đánh dấu đã thanh toán"
      }
      className="inline-flex min-h-11 items-center rounded-md disabled:opacity-50 md:min-h-0"
    >
      <Badge variant={transaction.paid ? "secondary" : "destructive"}>
        {transaction.paid ? "Đã trả" : "Chưa trả"}
      </Badge>
    </button>
  );
}

function DeleteTransactionButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
  }

  function onConfirm(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await deleteCreditTransactionAction(id);
      if (result && "error" in result) {
        toast({ variant: "destructive", description: result.error });
        return;
      }
      toast({ description: "Đã xóa giao dịch." });
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Xóa giao dịch">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent mobileSheet>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc muốn xóa khoản này không?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function TransactionsTable({
  transactions,
  cards,
}: {
  transactions: CreditTransaction[];
  cards: CreditCard[];
}) {
  const cardNames = new Map(cards.map((c) => [c.id, c.name]));

  return (
    <>
      <MobileDataList>
        {transactions.map((transaction) => (
          <MobileDataRecord
            key={transaction.id}
            title={transaction.description}
            amount={formatVND(transaction.amount)}
            status={<PaidToggle transaction={transaction} />}
            actions={
              <>
                <TransactionDialog
                  cards={cards}
                  transaction={transaction}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11"
                      aria-label="Chỉnh sửa giao dịch"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <DeleteTransactionButton id={transaction.id} />
              </>
            }
          >
            <MobileDataDetail label="Ngày">
              {formatDateVi(transaction.date)}
            </MobileDataDetail>
            <MobileDataDetail label="Danh mục" align="right">
              {transaction.category}
            </MobileDataDetail>
            <MobileDataDetail label="Thẻ">
              {cardNames.get(transaction.card_id) ?? "-"}
            </MobileDataDetail>
            <MobileDataDetail label="Kỳ sao kê" align="right">
              {formatMonthVi(transaction.statement_month)}
            </MobileDataDetail>
          </MobileDataRecord>
        ))}
      </MobileDataList>
      <div className="hidden overflow-x-auto rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Thẻ</TableHead>
              <TableHead>Kỳ sao kê</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDateVi(transaction.date)}</TableCell>
                <TableCell className="max-w-48 truncate font-medium">
                  {transaction.description}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  {cardNames.get(transaction.card_id) ?? "-"}
                </TableCell>
                <TableCell>
                  {formatMonthVi(transaction.statement_month)}
                </TableCell>
                <TableCell className="text-right">
                  {formatVND(transaction.amount)}
                </TableCell>
                <TableCell>
                  <PaidToggle transaction={transaction} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <TransactionDialog
                      cards={cards}
                      transaction={transaction}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Chỉnh sửa giao dịch"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteTransactionButton id={transaction.id} />
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
