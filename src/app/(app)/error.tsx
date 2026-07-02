"use client";

import { Button } from "@/components/ui/button";

export default function AppError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="font-medium">Đã xảy ra lỗi. Vui lòng thử lại.</p>
      <Button variant="outline" onClick={reset}>
        Thử lại
      </Button>
    </div>
  );
}
