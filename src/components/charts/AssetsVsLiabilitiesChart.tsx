import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "@/components/charts/ChartTooltip";

interface AssetsVsLiabilitiesChartProps {
  totalAssets: number;
  totalLiabilities: number;
  currency: string;
  assetsLabel: string;
  liabilitiesLabel: string;
}

export function AssetsVsLiabilitiesChart({
  totalAssets,
  totalLiabilities,
  currency,
  assetsLabel,
  liabilitiesLabel,
}: AssetsVsLiabilitiesChartProps) {
  const data = [
    { name: assetsLabel, value: totalAssets, color: "var(--chart-series-1)" },
    { name: liabilitiesLabel, value: totalLiabilities, color: "var(--chart-negative)" },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "var(--color-content-muted)" }}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
          />
          <YAxis
            width={64}
            tick={{ fontSize: 12, fill: "var(--color-content-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) =>
              new Intl.NumberFormat(undefined, { notation: "compact" }).format(value)
            }
          />
          <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ fill: "var(--color-surface-subtle)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={72}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
