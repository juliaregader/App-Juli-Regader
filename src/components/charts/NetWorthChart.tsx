import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "@/components/charts/ChartTooltip";
import type { NetWorthSnapshot } from "@/lib/wealth/types";

interface NetWorthChartProps {
  history: NetWorthSnapshot[];
  currency: string;
  seriesLabel: string;
}

export function NetWorthChart({ history, currency, seriesLabel }: NetWorthChartProps) {
  const data = history.map((snapshot) => ({
    date: new Date(snapshot.snapshot_date).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
    }),
    netWorth: snapshot.net_worth,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="date"
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
          <Tooltip content={<ChartTooltip currency={currency} />} />
          <Line
            type="monotone"
            dataKey="netWorth"
            name={seriesLabel}
            stroke="var(--color-brand-500)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
