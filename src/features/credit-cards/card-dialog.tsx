"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import type { CreditCard } from "@/types";
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
import { createCreditCardAction, updateCreditCardAction } from "./actions";
import { creditCardSchema, type CreditCardValues } from "./schemas";

function buildDefaultValues(card?: CreditCard): CreditCardValues {
  return card
    ? {
        name: card.name,
        provider: card.provider,
        statement_day: card.statement_day,
        due_day: card.due_day,
        credit_limit: card.credit_limit,
        notes: card.notes ?? "",
      }
    : {
        name: "",
        provider: "",
        statement_day: null,
        due_day: null,
        credit_limit: null,
        notes: "",
      };
}

export function CardDialog({
  card,
  trigger,
}: {
  card?: CreditCard;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CreditCardValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: buildDefaultValues(card),
  });

  useEffect(() => {
    if (!open) return;
    setServerError(null);
    form.reset(buildDefaultValues(card));
  }, [open, card, form]);

  function handleOpenChange(next: boolean) {
    if (isPending) return;
    setOpen(next);
  }

  function onSubmit(values: CreditCardValues) {
    setServerError(null);
    startTransition(async () => {
      const result = card
        ? await updateCreditCardAction(card.id, values)
        : await createCreditCardAction(values);
      if (result && "error" in result) {
        setServerError(result.error);
        return;
      }
      toast({ description: "Đã lưu thẻ tín dụng." });
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent mobileSheet className="md:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {card ? "Chỉnh sửa thẻ tín dụng" : "Thêm thẻ tín dụng"}
          </DialogTitle>
          <DialogDescription>
            Thông tin thẻ để theo dõi giao dịch và kỳ sao kê.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thẻ</FormLabel>
                  <FormControl>
                    <Input placeholder="VIB Online Plus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngân hàng phát hành</FormLabel>
                  <FormControl>
                    <Input placeholder="VIB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="statement_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sao kê</FormLabel>
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
              name="credit_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hạn mức (₫, tùy chọn)</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      value={field.value}
                      onChange={field.onChange}
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
