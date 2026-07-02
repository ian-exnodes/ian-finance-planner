"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteIncomeAction } from "./actions";

export function DeleteIncomeButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function onConfirm() {
    startTransition(async () => {
      const result = await deleteIncomeAction(id);
      if (result && "error" in result) {
        toast({ variant: "destructive", description: result.error });
        return;
      }
      toast({ description: "Đã xóa thu nhập." });
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Xóa thu nhập">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc muốn xóa khoản này không?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
