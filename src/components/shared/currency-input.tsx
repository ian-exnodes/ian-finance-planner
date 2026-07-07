"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const groupFormatter = new Intl.NumberFormat("vi-VN");

function parseDigits(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

function formatValue(value: number | null | undefined): string {
  return value == null ? "" : groupFormatter.format(value);
}

type CurrencyInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
> & {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
};

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(function CurrencyInput({ value, onChange, onFocus, className, ...props }, ref) {
  const [display, setDisplay] = React.useState(() => formatValue(value));

  React.useEffect(() => {
    setDisplay(formatValue(value));
  }, [value]);

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        inputMode="numeric"
        value={display}
        onFocus={(event) => {
          // Only auto-select the default "0" so a fresh field is easy to
          // overwrite. Selecting on every focus would wipe out an existing
          // amount when the user just wants to tweak one digit of it.
          if (value == null || value === 0) {
            event.target.select();
          }
          onFocus?.(event);
        }}
        onChange={(event) => {
          const parsed = parseDigits(event.target.value);
          setDisplay(formatValue(parsed));
          onChange(parsed);
        }}
        className={cn("pr-8", className)}
      />
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
        ₫
      </span>
    </div>
  );
});
