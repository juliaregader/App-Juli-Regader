import { useState } from "react";
import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/lib/format/currency";

interface FireCalculatorToolProps {
  currency: string;
  currentNetWorth: number;
  suggestedMonthlyExpenses: number;
}

export function FireCalculatorTool({
  currency,
  currentNetWorth,
  suggestedMonthlyExpenses,
}: FireCalculatorToolProps) {
  const { t } = useTranslation();
  const [monthlyExpenses, setMonthlyExpenses] = useState(String(suggestedMonthlyExpenses || ""));

  const annualExpenses = (Number(monthlyExpenses) || 0) * 12;
  const target = annualExpenses * 25;
  const progress = target > 0 ? Math.min(currentNetWorth / target, 1) : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="font-display text-base font-semibold text-content">
        {t("tools.fire.title")}
      </h2>
      <p className="mt-1 text-sm text-content-muted">{t("tools.fire.description")}</p>

      <label className="mt-4 flex max-w-xs flex-col gap-1 text-xs text-content-muted">
        {t("tools.fire.monthlyExpensesLabel")}
        <input
          type="number"
          value={monthlyExpenses}
          onChange={(e) => setMonthlyExpenses(e.target.value)}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
      </label>

      <p className="mt-4 text-sm text-content-muted">
        {t("tools.fire.targetLabel")}{" "}
        <span className="font-semibold tabular-nums text-content">
          {formatCurrency(target, currency)}
        </span>
      </p>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
        <div
          className="h-full rounded-full bg-brand-900 transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-content-muted">
        {formatCurrency(currentNetWorth, currency)} ({Math.round(progress * 100)}%)
      </p>
    </div>
  );
}
