import { useMemo, useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";

import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { formatCurrency } from "@/lib/format/currency";
import { projectCompoundGrowth } from "@/lib/tools/compoundInterest";

interface CompoundInterestToolProps {
  currency: string;
}

export function CompoundInterestTool({ currency }: CompoundInterestToolProps) {
  const { t } = useTranslation();
  const [initial, setInitial] = useState("1000");
  const [monthly, setMonthly] = useState("100");
  const [rate, setRate] = useState("5");
  const [years, setYears] = useState("20");

  const projection = useMemo(
    () =>
      projectCompoundGrowth(
        Number(initial) || 0,
        Number(monthly) || 0,
        Number(rate) || 0,
        Math.max(1, Number(years) || 1),
      ),
    [initial, monthly, rate, years],
  );

  const final = projection.at(-1);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="font-display text-base font-semibold text-content">
        {t("tools.compoundInterest.title")}
      </h2>
      <p className="mt-1 text-sm text-content-muted">{t("tools.compoundInterest.description")}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs text-content-muted">
          {t("tools.compoundInterest.initial")}
          <input
            type="number"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-content-muted">
          {t("tools.compoundInterest.monthly")}
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-content-muted">
          {t("tools.compoundInterest.rate")}
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-content-muted">
          {t("tools.compoundInterest.years")}
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </label>
      </div>

      <p className="mt-4 text-sm text-content-muted">
        {t("tools.compoundInterest.resultLabel")}{" "}
        <span className="font-semibold tabular-nums text-content">
          {formatCurrency(final?.value ?? 0, currency)}
        </span>{" "}
        ({t("tools.compoundInterest.contributedLabel")}{" "}
        {formatCurrency(final?.contributed ?? 0, currency)})
      </p>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projection} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "var(--color-content-muted)" }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
              tickFormatter={(y: number) => `${y}a`}
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
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="contributed"
              name={t("tools.compoundInterest.contributedLabel")}
              stroke="var(--color-content-muted)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              name={t("tools.compoundInterest.resultLabel")}
              stroke="var(--color-brand-500)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
