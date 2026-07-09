import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatMonthLabel } from "@/lib/dates";
import { formatCurrency } from "@/lib/format/currency";

interface NetWorthEvolutionChartProps {
  data: { month: string; netWorth: number }[];
  currency?: string;
}

export function NetWorthEvolutionChart({ data, currency = "EUR" }: NetWorthEvolutionChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-content-muted">
        Añade tu primer registro mensual para empezar a ver la evolución de tu patrimonio.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#e1e0d9" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={(value: string) => formatMonthLabel(value).slice(0, 3)}
          stroke="#898781"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value: number) => formatCurrency(value, currency)}
          stroke="#898781"
          fontSize={12}
          tickLine={false}
          width={90}
        />
        <Tooltip
          labelFormatter={(value) => formatMonthLabel(String(value))}
          formatter={(value) => [formatCurrency(Number(value), currency), "Patrimonio neto"]}
        />
        <Line
          type="monotone"
          dataKey="netWorth"
          stroke="#0A1F44"
          strokeWidth={2}
          dot={{ r: 4, fill: "#0A1F44", stroke: "#ffffff", strokeWidth: 2 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
