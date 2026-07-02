"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatMonthVi, formatVND } from "@/lib/formatters";
import type { MonthlySummary } from "@/types";

const SERIES_1 = "var(--viz-series-1)";
const SERIES_2 = "var(--viz-series-2)";
const NEGATIVE = "var(--viz-negative)";
const GRID = "var(--viz-grid)";
const MUTED = "var(--viz-muted)";
const SURFACE = "hsl(var(--card))";

/** 12500000 → "12,5tr"; keeps axis ticks short */
function compactVND(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}${+(abs / 1e9).toFixed(1)} tỷ`;
  if (abs >= 1e6) return `${sign}${+(abs / 1e6).toFixed(1)}tr`;
  if (abs >= 1e3) return `${sign}${Math.round(abs / 1e3)}k`;
  return `${value}`;
}

function shortMonth(month: string): string {
  const [y, m] = month.split("-");
  return `${m}/${y.slice(2)}`;
}

interface TooltipRow {
  name: string;
  value: number | null;
  color?: string;
  isPercent?: boolean;
}

function ChartTooltip({
  active,
  label,
  rows,
}: {
  active?: boolean;
  label?: string;
  rows: TooltipRow[];
}) {
  if (!active) return null;
  return (
    <div className="rounded-md border bg-card px-3 py-2 text-sm shadow-md">
      {label && <p className="mb-1 font-medium">{formatMonthVi(label)}</p>}
      {rows.map((row) => (
        <p key={row.name} className="flex items-center gap-2">
          {row.color && (
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: row.color }}
            />
          )}
          <span className="text-muted-foreground">{row.name}</span>
          <span className="ml-auto pl-3 font-medium">
            {row.value === null
              ? "—"
              : row.isPercent
                ? `${row.value}%`
                : formatVND(row.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

const AXIS_PROPS = {
  axisLine: false as const,
  tickLine: false as const,
  tick: { fill: MUTED, fontSize: 12 },
};

export function RepaymentChart({ data }: { data: MonthlySummary[] }) {
  return (
    <div>
      <div className="mb-2 flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--viz-series-1)" }}
          />
          Trả góp
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--viz-series-2)" }}
          />
          Thẻ tín dụng
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis dataKey="month" tickFormatter={shortMonth} {...AXIS_PROPS} />
          <YAxis tickFormatter={compactVND} width={48} {...AXIS_PROPS} />
          <Tooltip
            cursor={{ fill: GRID, opacity: 0.4 }}
            content={({ active, label, payload }) => (
              <ChartTooltip
                active={active}
                label={label as string}
                rows={(payload ?? []).map((p) => ({
                  name:
                    p.dataKey === "installmentPayments"
                      ? "Trả góp"
                      : "Thẻ tín dụng",
                  value: p.value as number,
                  color:
                    p.dataKey === "installmentPayments" ? SERIES_1 : SERIES_2,
                }))}
              />
            )}
          />
          <Bar
            dataKey="installmentPayments"
            stackId="debt"
            fill={SERIES_1}
            stroke={SURFACE}
            strokeWidth={2}
          />
          <Bar
            dataKey="creditPayments"
            stackId="debt"
            fill={SERIES_2}
            stroke={SURFACE}
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RemainingCashChart({ data }: { data: MonthlySummary[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barCategoryGap="25%">
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="month" tickFormatter={shortMonth} {...AXIS_PROPS} />
        <YAxis tickFormatter={compactVND} width={48} {...AXIS_PROPS} />
        <ReferenceLine y={0} stroke={MUTED} />
        <Tooltip
          cursor={{ fill: GRID, opacity: 0.4 }}
          content={({ active, label, payload }) => (
            <ChartTooltip
              active={active}
              label={label as string}
              rows={(payload ?? []).map((p) => ({
                name: "Tiền còn lại",
                value: p.value as number,
              }))}
            />
          )}
        />
        <Bar dataKey="remaining" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.month}
              fill={entry.remaining < 0 ? NEGATIVE : SERIES_1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DebtRatioChart({ data }: { data: MonthlySummary[] }) {
  const chartData = data.map((s) => ({
    month: s.month,
    ratio: s.debtRatio === null ? null : Math.round(s.debtRatio * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey="month" tickFormatter={shortMonth} {...AXIS_PROPS} />
        <YAxis
          tickFormatter={(v: number) => `${v}%`}
          width={40}
          domain={[0, (dataMax: number) => Math.max(60, dataMax + 10)]}
          {...AXIS_PROPS}
        />
        {[20, 35, 50].map((threshold) => (
          <ReferenceLine
            key={threshold}
            y={threshold}
            stroke={GRID}
            strokeDasharray="4 4"
            label={{
              value: `${threshold}%`,
              position: "right",
              fill: MUTED,
              fontSize: 10,
            }}
          />
        ))}
        <Tooltip
          content={({ active, label, payload }) => (
            <ChartTooltip
              active={active}
              label={label as string}
              rows={(payload ?? []).map((p) => ({
                name: "Tỷ lệ trả nợ",
                value: p.value as number | null,
                isPercent: true,
              }))}
            />
          )}
        />
        <Line
          type="monotone"
          dataKey="ratio"
          stroke={SERIES_1}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, stroke: SURFACE, strokeWidth: 2 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BreakdownChart({
  data,
}: {
  data: { label: string; amount: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 52)}>
      <BarChart data={data} layout="vertical" barCategoryGap="30%">
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={180}
          {...AXIS_PROPS}
          tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: GRID, opacity: 0.4 }}
          content={({ active, payload }) => (
            <ChartTooltip
              active={active}
              rows={(payload ?? []).map((p) => ({
                name: (p.payload as { label: string }).label,
                value: p.value as number,
              }))}
            />
          )}
        />
        <Bar dataKey="amount" fill={SERIES_1} radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey="amount"
            position="right"
            formatter={(v: number) => compactVND(v)}
            style={{ fill: MUTED, fontSize: 12 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
