"use client";

import { usePathname, useRouter } from "next/navigation";

import { formatMonthVi } from "@/lib/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MonthSelector({
  months,
  value,
}: {
  months: string[];
  value: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={value}
      onValueChange={(month) => router.push(`${pathname}?month=${month}`)}
    >
      <SelectTrigger className="w-44" aria-label="Chọn tháng">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {months.map((month) => (
          <SelectItem key={month} value={month}>
            {formatMonthVi(month)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
