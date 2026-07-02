"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { monthFromDate } from "@/lib/calculations";
import type { WishlistItem } from "@/types";
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
import { createWishlistItemAction, updateWishlistItemAction } from "./actions";
import {
  WISHLIST_NEED_LEVEL_LABELS,
  WISHLIST_PRIORITY_LABELS,
} from "./labels";
import { wishlistItemSchema, type WishlistItemValues } from "./schemas";

export function WishlistDialog({
  item,
  trigger,
}: {
  item?: WishlistItem;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<WishlistItemValues>({
    resolver: zodResolver(wishlistItemSchema),
    defaultValues: item
      ? {
          item_name: item.item_name,
          price: item.price,
          payment_method: item.payment_method,
          months: item.months,
          expected_purchase_month: item.expected_purchase_month,
          priority: item.priority,
          need_level: item.need_level,
          notes: item.notes ?? "",
        }
      : {
          item_name: "",
          price: 0,
          payment_method: "",
          months: 1,
          expected_purchase_month: monthFromDate(new Date()),
          priority: "medium",
          need_level: "useful",
          notes: "",
        },
  });

  function onSubmit(values: WishlistItemValues) {
    setServerError(null);
    startTransition(async () => {
      const result = item
        ? await updateWishlistItemAction(item.id, values)
        : await createWishlistItemAction(values);
      if (result && "error" in result) {
        setServerError(result.error);
        return;
      }
      toast({ description: "Đã lưu kế hoạch mua sắm." });
      setOpen(false);
      if (!item) form.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {item ? "Chỉnh sửa kế hoạch" : "Thêm kế hoạch mua sắm"}
          </DialogTitle>
          <DialogDescription>
            Hệ thống sẽ tính tác động lên tỷ lệ trả nợ trước khi bạn quyết
            định mua.
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
                    <Input placeholder="MacBook Air" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (₫)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={1000} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình thức thanh toán</FormLabel>
                    <FormControl>
                      <Input placeholder="Trả góp qua thẻ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tháng trả</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={120} {...field} />
                    </FormControl>
                    <FormDescription>
                      Mua trả thẳng thì để 1 tháng.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expected_purchase_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dự kiến mua vào tháng</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức ưu tiên</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(WISHLIST_PRIORITY_LABELS).map(
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
                name="need_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức cần thiết</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(WISHLIST_NEED_LEVEL_LABELS).map(
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
