"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { monthFromDate } from "@/lib/calculations";
import { formatVND } from "@/lib/formatters";
import type { Installment } from "@/types";
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
  FormDescription,
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
import { createInstallmentAction, updateInstallmentAction } from "./actions";
import {
  INSTALLMENT_STATUS_LABELS,
  INSTALLMENT_TYPE_LABELS,
} from "./labels";
import { installmentSchema, type InstallmentValues } from "./schemas";

function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildDefaultValues(installment?: Installment): InstallmentValues {
  return installment
    ? {
        item_name: installment.item_name,
        provider: installment.provider,
        type: installment.type,
        purchase_date: installment.purchase_date,
        total_amount: installment.total_amount,
        months: installment.months,
        monthly_payment: installment.monthly_payment,
        start_month: installment.start_month,
        due_day: installment.due_day,
        status: installment.status,
        notes: installment.notes ?? "",
      }
    : {
        item_name: "",
        provider: "",
        type: "other",
        purchase_date: todayLocal(),
        total_amount: 0,
        months: 12,
        monthly_payment: null,
        start_month: monthFromDate(new Date()),
        due_day: null,
        status: "active",
        notes: "",
      };
}

export function InstallmentDialog({
  installment,
  trigger,
}: {
  installment?: Installment;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<InstallmentValues>({
    resolver: zodResolver(installmentSchema),
    defaultValues: buildDefaultValues(installment),
  });

  useEffect(() => {
    if (!open) return;
    setServerError(null);
    form.reset(buildDefaultValues(installment));
  }, [open, installment, form]);

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
  }

  const totalAmount = Number(form.watch("total_amount"));
  const months = Number(form.watch("months"));
  const monthlyPayment = form.watch("monthly_payment");
  const autoPayment =
    (monthlyPayment == null || String(monthlyPayment) === "") &&
    totalAmount > 0 &&
    months > 0
      ? Math.round(totalAmount / months)
      : null;

  function onSubmit(values: InstallmentValues) {
    setServerError(null);
    startTransition(async () => {
      const result = installment
        ? await updateInstallmentAction(installment.id, values)
        : await createInstallmentAction(values);
      if (result && "error" in result) {
        setServerError(result.error);
        return;
      }
      toast({ description: "Đã lưu khoản trả góp." });
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
            {installment ? "Chỉnh sửa khoản trả góp" : "Thêm khoản trả góp"}
          </DialogTitle>
          <DialogDescription>
            Theo dõi các khoản trả góp qua thẻ, ví trả sau hoặc khoản vay.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="item_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên món hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="iPhone 17" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nơi trả góp</FormLabel>
                    <FormControl>
                      <Input placeholder="Home Credit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(INSTALLMENT_TYPE_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng tiền (₫)</FormLabel>
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
              <FormField
                control={form.control}
                name="months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tháng</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={120} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="monthly_payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trả góp hằng tháng (₫, tùy chọn)</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormDescription>
                    {autoPayment
                      ? `Để trống sẽ tự tính: ${formatVND(autoPayment)}/tháng`
                      : "Để trống để tự tính theo tổng tiền chia số tháng."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày mua</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tháng bắt đầu trả</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày đến hạn</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={31}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(INSTALLMENT_STATUS_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
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
