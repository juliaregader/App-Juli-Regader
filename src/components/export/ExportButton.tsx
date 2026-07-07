import { Download } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import {
  useAssets,
  useExpenseItems,
  useIncomeItems,
  useLiabilities,
  useStrategyAllocations,
} from "@/lib/wealth/queries";
import type {
  AssetCategory,
  ExpenseCategory,
  IncomeCategory,
  LiabilityCategory,
} from "@/lib/wealth/types";

const INCOME_CATEGORIES: IncomeCategory[] = ["fixed", "variable"];
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "housing",
  "utilities",
  "transport",
  "leisure",
  "debt",
  "savings",
  "other",
];
const ASSET_CATEGORIES: AssetCategory[] = ["liquid", "investment", "real_estate", "other"];
const LIABILITY_CATEGORIES: LiabilityCategory[] = ["mortgage", "loan", "credit_card", "other"];

function toRecord<K extends string>(keys: K[], translate: (key: K) => string): Record<K, string> {
  return Object.fromEntries(keys.map((key) => [key, translate(key)])) as Record<K, string>;
}

export function ExportButton() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const { data: income } = useIncomeItems();
  const { data: expenses } = useExpenseItems();
  const { data: assets } = useAssets();
  const { data: liabilities } = useLiabilities();
  const { data: strategy } = useStrategyAllocations();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!profile) return;
    setIsExporting(true);
    try {
      const { buildWorkbook } = await import("@/lib/export/buildWorkbook");
      const workbook = await buildWorkbook(
        {
          fullName: profile.full_name ?? "",
          baseCurrency: profile.base_currency,
          income: income ?? [],
          expenses: expenses ?? [],
          assets: assets ?? [],
          liabilities: liabilities ?? [],
          strategy: strategy ?? [],
          categoryLabels: {
            income: toRecord(INCOME_CATEGORIES, (k) => t(`onboarding.categories.income.${k}`)),
            expense: toRecord(EXPENSE_CATEGORIES, (k) => t(`onboarding.categories.expenses.${k}`)),
            asset: toRecord(ASSET_CATEGORIES, (k) => t(`onboarding.categories.assets.${k}`)),
            liability: toRecord(LIABILITY_CATEGORIES, (k) =>
              t(`onboarding.categories.liabilities.${k}`),
            ),
          },
          liquidAssetLabel: t("onboarding.categories.assets.liquid"),
          projectionDefaults: { initial: 1000, monthly: 100, ratePercent: 5, years: 20 },
        },
        {
          summarySheet: t("export.sheets.summary"),
          incomeExpenseSheet: t("export.sheets.incomeExpense"),
          assetsSheet: t("export.sheets.assets"),
          liabilitiesSheet: t("export.sheets.liabilities"),
          strategySheet: t("export.sheets.strategy"),
          projectionSheet: t("export.sheets.projection"),
          legalSheet: t("export.sheets.legal"),
          summary: {
            title: t("export.summary.title", { name: profile.full_name ?? "" }),
            totalAssets: t("export.summary.totalAssets"),
            totalLiabilities: t("export.summary.totalLiabilities"),
            netWorth: t("dashboard.kpis.netWorth.label"),
            monthlyIncome: t("export.summary.monthlyIncome"),
            monthlyExpenses: t("export.summary.monthlyExpenses"),
            cashFlow: t("dashboard.kpis.cashFlow.label"),
            savingsRate: t("dashboard.kpis.savingsRate.label"),
            liquidAssets: t("export.summary.liquidAssets"),
            emergencyFundMonths: t("dashboard.kpis.emergencyFund.label"),
            debtToAssets: t("dashboard.kpis.debtToAssets.label"),
            debtToIncome: t("dashboard.kpis.debtToIncome.label"),
          },
          columns: {
            name: t("onboarding.common.nameLabel"),
            category: t("onboarding.common.categoryLabel"),
            amount: t("onboarding.common.amountLabel"),
            value: t("onboarding.common.valueLabel"),
            currency: t("export.columns.currency"),
            interestRate: t("onboarding.common.interestRateLabel"),
            monthlyPayment: t("onboarding.common.monthlyPaymentLabel"),
            targetPercentage: t("strategy.form.targetPercentage"),
            currentValue: t("strategy.form.currentValue"),
            actualPercentage: t("strategy.row.actual"),
            deviation: t("strategy.row.deviation"),
            year: t("export.columns.year"),
            estimatedValue: t("tools.compoundInterest.resultLabel"),
            contributed: t("tools.compoundInterest.contributedLabel"),
          },
          incomeTitle: t("onboarding.steps.income.title"),
          expenseTitle: t("onboarding.steps.expenses.title"),
          projectionInitial: t("tools.compoundInterest.initial"),
          projectionMonthly: t("tools.compoundInterest.monthly"),
          projectionRate: t("tools.compoundInterest.rate"),
          projectionYears: t("tools.compoundInterest.years"),
          disclaimerTitle: t("legal.disclaimerTitle"),
          disclaimerBody: t("legal.disclaimer"),
        },
      );

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `patrimonio-${(profile.full_name ?? "cliente").trim().replace(/\s+/g, "-").toLowerCase()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleExport()}
      disabled={isExporting || !profile}
      className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-content-muted transition-colors hover:text-content disabled:opacity-50"
    >
      <Download className="size-4" aria-hidden="true" />
      {isExporting ? t("export.exporting") : t("export.button")}
    </button>
  );
}
