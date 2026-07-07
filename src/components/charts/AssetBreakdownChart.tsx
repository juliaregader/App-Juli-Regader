import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { formatCurrency } from "@/lib/format/currency";
import type { AssetBreakdownEntry } from "@/lib/wealth/kpis";
import type { AssetCategory } from "@/lib/wealth/types";

const CATEGORY_COLOR: Record<AssetCategory, string> = {
  liquid: "var(--chart-series-1)",
  investment: "var(--chart-series-2)",
  real_estate: "var(--chart-series-3)",
  other: "var(--chart-series-4)",
};

interface AssetBreakdownChartProps {
  data: AssetBreakdownEntry[];
  currency: string;
  categoryLabels: Record<string, string>;
}

export function AssetBreakdownChart({ data, currency, categoryLabels }: AssetBreakdownChartProps) {
  const chartData = data.map((entry) => ({
    name: categoryLabels[entry.category] ?? entry.category,
    value: entry.total,
    color: CATEGORY_COLOR[entry.category as AssetCategory] ?? "var(--chart-series-4)",
  }));

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-56 w-full sm:w-56 sm:shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip currency={currency} />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="var(--color-surface)"
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-1 flex-col gap-2">
        {chartData.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-content-muted">{entry.name}</span>
            <span className="ml-auto font-semibold tabular-nums text-content">
              {formatCurrency(entry.value, currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
