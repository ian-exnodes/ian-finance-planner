"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { monthFromDate } from "@/lib/calculations";
import type { Income } from "@/types";
import { Button } from "@/components/ui/button";
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

export function IncomeDialog({
  income,
  trigger,
}: {
  income?: Income;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<IncomeValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: income
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
        },
  });

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
      setOpen(false);
      if (!income) form.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
            {AMOUNT_FIELDS.map(({ name, label }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label} (₫)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={1000} {...field} />
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
