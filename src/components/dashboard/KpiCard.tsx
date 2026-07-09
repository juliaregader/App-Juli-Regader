import { clsx } from "clsx";
import type { ReactNode } from "react";

import type { ThresholdLevel } from "@/features/dashboard/useDashboardData";

const levelStyles: Record<ThresholdLevel, string> = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  risk: "bg-red-50 text-red-700 border-red-200",
};

interface KpiCardProps {
  label: string;
  value: string;
  formula?: string;
  explanation?: string;
  level?: ThresholdLevel;
  levelLabel?: string;
  footer?: ReactNode;
}

export function KpiCard({ label, value, formula, explanation, level, levelLabel, footer }: KpiCardProps) {
  return (
    <div className={clsx("card", level && levelStyles[level], level && "border")}>
      <p className="text-sm font-medium text-content-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-content tabular-nums">{value}</p>
      {level && levelLabel && (
        <span className={clsx("mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", levelStyles[level])}>
          {levelLabel}
        </span>
      )}
      {formula && <p className="mt-2 text-xs text-content-muted">{formula}</p>}
      {explanation && <p className="mt-1 text-xs text-content-muted">{explanation}</p>}
      {footer}
    </div>
  );
}
