import {
  Eye,
  OctagonAlert,
  ShieldCheck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { getDebtRiskLabel } from "@/lib/calculations";
import { formatVND } from "@/lib/formatters";
import type { DebtRiskLabel, MonthlySummary } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Status palette (reserved; icon + label always accompany the color)
const RISK_STYLES: Record<
  DebtRiskLabel,
  { color: string; icon: LucideIcon }
> = {
  "An toàn": { color: "#0ca30c", icon: ShieldCheck },
  "Cần theo dõi": { color: "#fab219", icon: Eye },
  "Rủi ro": { color: "#ec835a", icon: TriangleAlert },
  "Nguy hiểm": { color: "#d03b3b", icon: OctagonAlert },
};

function Tile({
  title,
  value,
  detail,
  valueClassName,
}: {
  title: string;
  value: string;
  detail?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-semibold ${valueClassName ?? ""}`}>
          {value}
        </p>
        {detail}
      </CardContent>
    </Card>
  );
}

export function SummaryCards({ summary }: { summary: MonthlySummary }) {
  const risk = getDebtRiskLabel(summary.debtRatio);
  const riskStyle = risk ? RISK_STYLES[risk] : null;
  const RiskIcon = riskStyle?.icon;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Tile title="Thu nhập tháng này" value={formatVND(summary.income)} />
      <Tile title="Chi phí cố định" value={formatVND(summary.fixedCosts)} />
      <Tile title="Cần trả tháng này" value={formatVND(summary.totalDebt)} />
      <Tile
        title="Tiền còn lại"
        value={formatVND(summary.remaining)}
        valueClassName={summary.remaining < 0 ? "text-destructive" : ""}
      />
      <Tile
        title="Tỷ lệ trả nợ"
        value={
          summary.debtRatio === null
            ? "—"
            : `${Math.round(summary.debtRatio * 100)}%`
        }
        detail={
          riskStyle && RiskIcon ? (
            <p
              className="mt-1 flex items-center gap-1 text-sm font-medium"
              style={{ color: riskStyle.color }}
            >
              <RiskIcon className="h-4 w-4" />
              {risk}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Chưa có thu nhập tháng này
            </p>
          )
        }
      />
    </div>
  );
}
