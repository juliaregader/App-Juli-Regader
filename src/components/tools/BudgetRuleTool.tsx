import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/lib/format/currency";
import type { AssetBreakdownEntry } from "@/lib/wealth/kpis";

const NEEDS_CATEGORIES = new Set(["housing", "utilities", "transport", "debt"]);
const WANTS_CATEGORIES = new Set(["leisure", "other"]);
const SAVINGS_CATEGORIES = new Set(["savings"]);

interface BudgetRuleToolProps {
  totalIncome: number;
  expenseBreakdown: AssetBreakdownEntry[];
  currency: string;
}

function sumByCategories(breakdown: AssetBreakdownEntry[], categories: Set<string>): number {
  return breakdown
    .filter((entry) => categories.has(entry.category))
    .reduce((sum, entry) => sum + entry.total, 0);
}

export function BudgetRuleTool({ totalIncome, expenseBreakdown, currency }: BudgetRuleToolProps) {
  const { t } = useTranslation();

  const needs = sumByCategories(expenseBreakdown, NEEDS_CATEGORIES);
  const wants = sumByCategories(expenseBreakdown, WANTS_CATEGORIES);
  const savings = sumByCategories(expenseBreakdown, SAVINGS_CATEGORIES);

  const rows = [
    { key: "needs", actual: needs, target: 0.5 },
    { key: "wants", actual: wants, target: 0.3 },
    { key: "savings", actual: savings, target: 0.2 },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="font-display text-base font-semibold text-content">
        {t("tools.budgetRule.title")}
      </h2>
      <p className="mt-1 text-sm text-content-muted">{t("tools.budgetRule.description")}</p>

      {totalIncome <= 0 ? (
        <p className="mt-3 text-sm text-content-muted">{t("tools.budgetRule.noIncome")}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {rows.map(({ key, actual, target }) => {
            const actualPercentage = (actual / totalIncome) * 100;
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-content">{t(`tools.budgetRule.${key}`)}</span>
                  <span className="tabular-nums text-content-muted">
                    {actualPercentage.toFixed(0)}% {t("tools.budgetRule.vsTarget")}{" "}
                    {target * 100}% · {formatCurrency(actual, currency)}
                  </span>
                </div>
                <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
                  <div
                    className="h-full rounded-full bg-brand-900"
                    style={{ width: `${Math.min(actualPercentage, 100)}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-0.5 bg-content-muted"
                    style={{ left: `${target * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
