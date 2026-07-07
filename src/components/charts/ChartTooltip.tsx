import { formatCurrency } from "@/lib/format/currency";

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  currency: string;
  payload?: { name?: string; value?: number; color?: string }[];
}

export function ChartTooltip({ active, label, currency, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-soft">
      {label ? <p className="mb-1 font-medium text-content">{label}</p> : null}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-content-muted">
          {entry.color ? (
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
          ) : null}
          <span>{entry.name}</span>
          <span className="ml-auto font-semibold tabular-nums text-content">
            {formatCurrency(entry.value ?? 0, currency)}
          </span>
        </div>
      ))}
    </div>
  );
}
