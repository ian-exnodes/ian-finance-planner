"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { monthFromDate } from "@/lib/calculations";
import { formatMonthVi } from "@/lib/formatters";
import type { Income } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createIncomeAction, updateIncomeAction } from "./actions";
import { incomeSchema, type IncomeValues } from "./schemas";

const AMOUNT_FIELDS = [
  { name: "salary", label: "Lương" },
  { name: "bonus", label: "Thưởng" },
  { name: "other", label: "Khoản khác" },
] as const;

function buildDefaultValues(income?: Income): IncomeValues {
  return income
    ? {
        month: income.month,
        salary: income.salary,
        bonus: income.bonus,
        other: income.other,
        notes: income.notes ?? "",
      }
    : {
        month: monthFromDate(new Date()),
        salary: 0,
        bonus: 0,
        other: 0,
        notes: "",
      };
}

export function IncomeDialog({
  income,
  previousIncome,
  trigger,
}: {
  income?: Income;
  previousIncome?: Income;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<IncomeValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: buildDefaultValues(income),
  });

  // Re-sync form state every time the dialog opens: without this, editing the
  // same row twice shows stale values, because RHF only reads defaultValues
  // once at mount and this dialog instance stays mounted across saves.
  useEffect(() => {
    if (!open) return;
    setServerError(null);
    form.reset(buildDefaultValues(income));
  }, [open, income, form]);

  function handleOpenChange(next: boolean) {
    if (isPending) return; // block Escape/overlay-click while a request is in flight
    setOpen(next);
  }

  function copyFromPrevious() {
    if (!previousIncome) return;
    form.setValue("salary", previousIncome.salary, { shouldDirty: true });
    form.setValue("bonus", previousIncome.bonus, { shouldDirty: true });
    form.setValue("other", previousIncome.other, { shouldDirty: true });
  }

  function onSubmit(values: IncomeValues) {
    setServerError(null);
    startTransition(async () => {
      const result = income
        ? await updateIncomeAction(income.id, values)
        : await createIncomeAction(values);
      if (result && "error" in result) {
        setServerError(result.error);
        return;
      }
      toast({ description: "Đã lưu thu nhập." });
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          form.setFocus("month");
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {income ? "Chỉnh sửa thu nhập" : "Thêm thu nhập"}
          </DialogTitle>
          <DialogDescription>
            Nhập thu nhập theo tháng để hệ thống tính toán dòng tiền.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tháng</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!income && previousIncome && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyFromPrevious}
              >
                Dùng lại số liệu {formatMonthVi(previousIncome.month)}
              </Button>
            )}
            {AMOUNT_FIELDS.map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label} (₫)</FormLabel>
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
            ))}
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
