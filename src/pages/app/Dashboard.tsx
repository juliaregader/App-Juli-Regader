import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AssetAllocationChart } from "@/components/charts/AssetAllocationChart";
import { NetWorthEvolutionChart } from "@/components/charts/NetWorthEvolutionChart";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useAuth } from "@/features/auth/useAuth";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatCurrency, formatPercent } from "@/lib/format/currency";

export function Dashboard() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const currency = profile?.currency ?? "EUR";
  const data = useDashboardData(user?.id);

  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/app/onboarding" replace />;
  }

  const debtRatioLabel =
    data.debtRatioLevel === "good"
      ? t("dashboard.debtLevelGood")
      : data.debtRatioLevel === "warning"
        ? t("dashboard.debtLevelWarning")
        : t("dashboard.debtLevelRisk");

  return (
    <section className="container-page space-y-8 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">{t("dashboard.title")}</h1>
        <p className="mt-1 text-content-muted">{t("dashboard.subtitle")}</p>
      </div>

      {!data.hasSnapshot && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {t("dashboard.noSnapshotWarning")}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label={t("dashboard.income")} value={formatCurrency(data.monthlyIncome, currency)} />
        <KpiCard label={t("dashboard.expenses")} value={formatCurrency(data.monthlyExpenses, currency)} />
        <KpiCard
          label={t("dashboard.savings")}
          value={formatCurrency(data.monthlySavings, currency)}
          formula={t("dashboard.savingsFormula")}
          explanation={
            data.savingsRate !== null
              ? t("dashboard.savingsRate", { rate: formatPercent(data.savingsRate) })
              : undefined
          }
        />
        <KpiCard
          label={t("dashboard.netWorth")}
          value={formatCurrency(data.netWorth, currency)}
          formula={t("dashboard.netWorthFormula")}
        />
        <KpiCard
          label={t("dashboard.debtRatio")}
          value={data.debtRatio !== null ? formatPercent(data.debtRatio) : "—"}
          formula={t("dashboard.debtRatioFormula")}
          level={data.debtRatioLevel}
          levelLabel={debtRatioLabel}
          explanation={t("dashboard.debtRatioExplain")}
        />
        <KpiCard
          label={t("dashboard.emergencyFund")}
          value={data.emergencyFundMonths !== null ? t("dashboard.months", { count: Number(data.emergencyFundMonths.toFixed(1)) }) : "—"}
          formula={t("dashboard.emergencyFundFormula")}
        />
        <KpiCard
          label={t("dashboard.liquidityRatio")}
          value={data.liquidityRatio !== null ? formatPercent(data.liquidityRatio) : "—"}
          formula={t("dashboard.liquidityRatioFormula")}
        />
        <KpiCard
          label={t("dashboard.realEstateWeight")}
          value={data.realEstateWeight !== null ? formatPercent(data.realEstateWeight) : "—"}
          formula={t("dashboard.realEstateWeightFormula")}
        />
        <KpiCard
          label={t("dashboard.debtToAssets")}
          value={data.debtToAssetsRatio !== null ? formatPercent(data.debtToAssetsRatio) : "—"}
          formula={t("dashboard.debtToAssetsFormula")}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold text-content">{t("dashboard.allocationTitle")}</h2>
          <div className="mt-4">
            <AssetAllocationChart data={data.assetAllocation} currency={currency} />
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold text-content">{t("dashboard.evolutionTitle")}</h2>
          <div className="mt-4">
            <NetWorthEvolutionChart data={data.netWorthEvolution} currency={currency} />
          </div>
        </div>
      </div>
    </section>
  );
}
