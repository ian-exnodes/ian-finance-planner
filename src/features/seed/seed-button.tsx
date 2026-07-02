"use client";

import { useTransition } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { seedDemoDataAction } from "./actions";

export function SeedButton() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function onClick() {
    startTransition(async () => {
      const result = await seedDemoDataAction();
      if (result && "error" in result) {
        toast({ variant: "destructive", description: result.error });
        return;
      }
      toast({ description: "Đã tạo dữ liệu mẫu." });
    });
  }

  return (
    <Button variant="secondary" onClick={onClick} disabled={isPending}>
      <Sparkles className="mr-2 h-4 w-4" />
      {isPending ? "Đang tạo..." : "Tạo dữ liệu mẫu"}
    </Button>
  );
}
