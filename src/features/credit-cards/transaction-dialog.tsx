"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { monthFromDate } from "@/lib/calculations";
import type { CreditCard, CreditTransaction } from "@/types";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/shared/currency-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createCreditTransactionAction,
  updateCreditTransactionAction,
} from "./actions";
import {
  creditTransactionSchema,
  type CreditTransactionValues,
} from "./schemas";

function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildDefaultValues(
  transaction: CreditTransaction | undefined,
  cards: CreditCard[]
): CreditTransactionValues {
  return transaction
    ? {
        card_id: transaction.card_id,
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount,
        statement_month: transaction.statement_month,
        due_date: transaction.due_date,
        paid: transaction.paid,
        notes: transaction.notes ?? "",
      }
    : {
        card_id: cards[0]?.id ?? "",
        date: todayLocal(),
        description: "",
        category: "",
        amount: 0,
        statement_month: monthFromDate(new Date()),
        due_date: null,
        paid: false,
        notes: "",
      };
}

export function TransactionDialog({
  cards,
  transaction,
  trigger,
}: {
  cards: CreditCard[];
  transaction?: CreditTransaction;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CreditTransactionValues>({
    resolver: zodResolver(creditTransactionSchema),
    defaultValues: buildDefaultValues(transaction, cards),
  });

  useEffect(() => {
    if (!open) return;
    setServerError(null);
    form.reset(buildDefaultValues(transaction, cards));
  }, [open, transaction, cards, form]);

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
  }

  function onSubmit(values: CreditTransactionValues) {
    setServerError(null);
    startTransition(async () => {
      const result = transaction
        ? await updateCreditTransactionAction(transaction.id, values)
        : await createCreditTransactionAction(values);
      if (result && "error" in result) {
        setServerError(result.error);
        return;
      }
      toast({ description: "Đã lưu giao dịch." });
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        mobileSheet
        className="md:max-h-[90vh] md:max-w-lg md:overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Chỉnh sửa giao dịch" : "Thêm giao dịch"}
          </DialogTitle>
          <DialogDescription>
            Giao dịch thẻ tín dụng tính vào kỳ sao kê tương ứng.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="card_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thẻ</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thẻ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cards.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} ({card.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Input placeholder="Mua sắm siêu thị" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Ăn uống" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền (₫)</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={(value) => field.onChange(value ?? 0)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày giao dịch</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="statement_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kỳ sao kê</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạn thanh toán</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="paid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Đã thanh toán</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <p className="text-sm font-medium text-destructive">
                {serverError}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
