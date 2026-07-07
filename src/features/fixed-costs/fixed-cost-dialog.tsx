"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import type { FixedCost } from "@/types";
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
import { createFixedCostAction, updateFixedCostAction } from "./actions";
import { fixedCostSchema, type FixedCostValues } from "./schemas";

function buildDefaultValues(fixedCost?: FixedCost): FixedCostValues {
  return fixedCost
    ? {
        name: fixedCost.name,
        category: fixedCost.category,
        amount: fixedCost.amount,
        due_day: fixedCost.due_day,
        notes: fixedCost.notes ?? "",
      }
    : {
        name: "",
        category: "",
        amount: 0,
        due_day: null,
        notes: "",
      };
}

export function FixedCostDialog({
  fixedCost,
  trigger,
}: {
  fixedCost?: FixedCost;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FixedCostValues>({
    resolver: zodResolver(fixedCostSchema),
    defaultValues: buildDefaultValues(fixedCost),
  });

  useEffect(() => {
    if (!open) return;
    setServerError(null);
    form.reset(buildDefaultValues(fixedCost));
  }, [open, fixedCost, form]);

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
  }

  function onSubmit(values: FixedCostValues) {
    setServerError(null);
    startTransition(async () => {
      const result = fixedCost
        ? await updateFixedCostAction(fixedCost.id, values)
        : await createFixedCostAction(values);
      if (result && "error" in result) {
        setServerError(result.error);
        return;
      }
      toast({ description: "Đã lưu chi phí cố định." });
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {fixedCost ? "Chỉnh sửa chi phí cố định" : "Thêm chi phí cố định"}
          </DialogTitle>
          <DialogDescription>
            Các khoản chi lặp lại hằng tháng như tiền nhà, điện nước, internet.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khoản chi</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiền thuê nhà" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhà ở" {...field} />
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
            <FormField
              control={form.control}
              name="due_day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày đến hạn hằng tháng (tùy chọn)</FormLabel>
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
