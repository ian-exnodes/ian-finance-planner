import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function MobileDataList({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-3 md:hidden" role="list">
      {children}
    </ul>
  );
}

export function MobileDataRecord({
  title,
  supportingText,
  amount,
  children,
  status,
  notes,
  actions,
}: {
  title: ReactNode;
  supportingText?: ReactNode;
  amount: ReactNode;
  children: ReactNode;
  status?: ReactNode;
  notes?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <li className="overflow-hidden rounded-md border bg-card text-card-foreground">
      <div className="space-y-4 p-4">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="line-clamp-2 font-medium leading-5">{title}</div>
            {supportingText ? (
              <div className="mt-1 truncate text-xs text-muted-foreground">
                {supportingText}
              </div>
            ) : null}
          </div>
          <div className="min-w-0 max-w-[45%] break-words text-right font-semibold tabular-nums">
            {amount}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</dl>

        {status ? <div>{status}</div> : null}
        {notes ? (
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {notes}
          </p>
        ) : null}
      </div>

      <div className="flex min-h-11 items-center justify-end border-t bg-muted/30 px-2 [&_button]:h-11 [&_button]:w-11">
        {actions}
      </div>
    </li>
  );
}

export function MobileDataDetail({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("min-w-0", align === "right" && "text-right")}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium tabular-nums">
        {children}
      </dd>
    </div>
  );
}
