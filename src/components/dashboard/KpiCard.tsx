import { clsx } from "clsx";
import type { ReactNode } from "react";

import { InfoTooltip } from "@/components/dashboard/InfoTooltip";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  tooltip: string;
  accent?: boolean;
  glossaryTerm?: string;
  glossaryLabel?: string;
}

export function KpiCard({
  label,
  value,
  tooltip,
  accent = false,
  glossaryTerm,
  glossaryLabel,
}: KpiCardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border p-6 shadow-soft",
        accent
          ? "border-brand-300 bg-brand-100/40 dark:bg-brand-950/40"
          : "border-border bg-surface",
      )}
    >
      <div className="flex items-center gap-1.5">
        <p className="text-sm normal-case text-content-muted">{label}</p>
        <InfoTooltip
          text={tooltip}
          linkTo={glossaryTerm ? `/glossary#${glossaryTerm}` : undefined}
          linkLabel={glossaryLabel}
        />
      </div>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums text-content">{value}</p>
    </div>
  );
}
