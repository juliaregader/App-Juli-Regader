import { useTranslation } from "react-i18next";

import { BudgetRuleTool } from "@/components/tools/BudgetRuleTool";
import { CompoundInterestTool } from "@/components/tools/CompoundInterestTool";
import { DebtPayoffTool } from "@/components/tools/DebtPayoffTool";
import { FireCalculatorTool } from "@/components/tools/FireCalculatorTool";
import { useProfile } from "@/lib/auth/useProfile";
import { useExpenseBreakdown, useMonthlyCashFlow } from "@/lib/wealth/kpis";
import { useLatestNetWorth, useLiabilities } from "@/lib/wealth/queries";

export function Tools() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const currency = profile?.base_currency ?? "EUR";

  const { data: cashFlow } = useMonthlyCashFlow();
  const { data: netWorth } = useLatestNetWorth();
  const { data: liabilities } = useLiabilities();
  const { data: expenseBreakdown } = useExpenseBreakdown();

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-content">{t("tools.title")}</h1>
        <p className="mt-1 text-sm text-content-muted">{t("tools.description")}</p>
      </section>

      <CompoundInterestTool currency={currency} />

      <FireCalculatorTool
        currency={currency}
        currentNetWorth={netWorth?.net_worth ?? 0}
        suggestedMonthlyExpenses={cashFlow?.totalExpenses ?? 0}
      />

      <DebtPayoffTool liabilities={liabilities ?? []} currency={currency} />

      <BudgetRuleTool
        totalIncome={cashFlow?.totalIncome ?? 0}
        expenseBreakdown={expenseBreakdown ?? []}
        currency={currency}
      />
    </div>
  );
}
