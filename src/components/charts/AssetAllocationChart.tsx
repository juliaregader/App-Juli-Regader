import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "@/lib/format/currency";

const COLORS = ["#2a78d6", "#eda100", "#4a3aa7", "#e34948"];

interface AssetAllocationChartProps {
  data: { name: string; value: number }[];
  currency?: string;
}

export function AssetAllocationChart({ data, currency = "EUR" }: AssetAllocationChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-content-muted">Añade activos para ver su distribución.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value), currency)} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
