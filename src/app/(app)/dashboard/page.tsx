import Link from "next/link";

import { monthFromDate } from "@/lib/calculations";
import { getDashboardData } from "@/features/dashboard/loader";
import {
  BreakdownChart,
  DebtRatioChart,
  RemainingCashChart,
  RepaymentChart,
} from "@/features/dashboard/charts";
import { MonthSelector } from "@/features/dashboard/month-selector";
import { SummaryCards } from "@/features/dashboard/summary-cards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const selectedMonth =
    month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)
      ? month
      : monthFromDate(new Date());

  const data = await getDashboardData(selectedMonth);

  if (!data.hasAnyData) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Tổng quan tài chính</h1>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="font-medium">Chưa có dữ liệu.</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Hãy thêm thu nhập hằng tháng và chi phí cố định để hệ thống tính
              toán dòng tiền chính xác hơn.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link href="/incomes">Thêm thu nhập</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/fixed-costs">Thêm chi phí cố định</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Tổng quan tài chính</h1>
        <MonthSelector months={data.months} value={data.selectedMonth} />
      </div>

      <SummaryCards summary={data.selected} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lịch trả nợ hằng tháng</CardTitle>
          <CardDescription>
            Trả góp và sao kê thẻ tín dụng trong 12 tháng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RepaymentChart data={data.summaries} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tiền còn lại</CardTitle>
            <CardDescription>
              Thu nhập trừ chi phí cố định và các khoản phải trả.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RemainingCashChart data={data.summaries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tỷ lệ trả nợ</CardTitle>
            <CardDescription>
              So với các ngưỡng an toàn 20% / 35% / 50%.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DebtRatioChart data={data.summaries} />
          </CardContent>
        </Card>
      </div>

      {data.breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cơ cấu khoản phải trả</CardTitle>
            <CardDescription>
              Các khoản phải trả trong tháng đã chọn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BreakdownChart data={data.breakdown} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
