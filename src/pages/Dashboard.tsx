import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AssetBreakdownChart } from "@/components/charts/AssetBreakdownChart";
import { AssetsVsLiabilitiesChart } from "@/components/charts/AssetsVsLiabilitiesChart";
import { NetWorthChart } from "@/components/charts/NetWorthChart";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useProfile } from "@/lib/auth/useProfile";
import { formatCurrency } from "@/lib/format/currency";
import {
  useAssetBreakdown,
  useDebtRatios,
  useEmergencyFundMonths,
  useMonthlyCashFlow,
  useNetWorthHistory,
} from "@/lib/wealth/kpis";

function formatPercent(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 }).format(
    value,
  );
}

function formatRatio(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

export function Dashboard() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const currency = profile?.base_currency ?? "EUR";

  const { data: history, isLoading: historyLoading } = useNetWorthHistory();
  const { data: cashFlow } = useMonthlyCashFlow();
  const { data: debtRatios } = useDebtRatios();
  const { data: emergencyFundMonths } = useEmergencyFundMonths();
  const { data: assetBreakdown } = useAssetBreakdown();

  const latest = history?.at(-1);
  const hasData = Boolean(history && history.length > 0);

  const categoryLabels = {
    liquid: t("onboarding.categories.assets.liquid"),
    investment: t("onboarding.categories.assets.investment"),
    real_estate: t("onboarding.categories.assets.real_estate"),
    other: t("onboarding.categories.assets.other"),
  };

  if (!historyLoading && !hasData) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-100/40 p-8 text-center dark:bg-brand-950/40">
        <h2 className="font-display text-lg font-semibold text-content">
          {t("dashboard.empty.title")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-content-muted">
          {t("dashboard.empty.body")}
        </p>
        <Link
          to="/wealth"
          className="mt-4 inline-block rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-brand-100 dark:text-brand-900"
        >
          {t("dashboard.empty.cta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-brand-300 bg-brand-100/40 p-6 shadow-soft dark:bg-brand-950/40">
        <div className="flex items-center gap-1.5">
          <p className="text-sm text-content-muted">{t("dashboard.kpis.netWorth.label")}</p>
        </div>
        <p className="mt-1 font-display text-3xl font-bold tabular-nums text-content">
          {formatCurrency(latest?.net_worth ?? 0, currency)}
        </p>
        <div className="mt-4">
          <NetWorthChart
            history={history ?? []}
            currency={currency}
            seriesLabel={t("dashboard.kpis.netWorth.label")}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label={t("dashboard.kpis.cashFlow.label")}
          value={formatCurrency(cashFlow?.cashFlow ?? 0, currency)}
          tooltip={t("dashboard.kpis.cashFlow.tooltip")}
        />
        <KpiCard
          label={t("dashboard.kpis.savingsRate.label")}
          value={formatPercent(cashFlow?.savingsRate ?? null)}
          tooltip={t("dashboard.kpis.savingsRate.tooltip")}
        />
        <KpiCard
          label={t("dashboard.kpis.emergencyFund.label")}
          value={
            emergencyFundMonths != null
              ? t("dashboard.kpis.emergencyFund.months", {
                  count: Math.round(emergencyFundMonths * 10) / 10,
                })
              : "—"
          }
          tooltip={t("dashboard.kpis.emergencyFund.tooltip")}
        />
        <KpiCard
          label={t("dashboard.kpis.debtToAssets.label")}
          value={formatRatio(debtRatios?.debtToAssets ?? null)}
          tooltip={t("dashboard.kpis.debtToAssets.tooltip")}
        />
        <KpiCard
          label={t("dashboard.kpis.debtToIncome.label")}
          value={formatRatio(debtRatios?.debtToIncome ?? null)}
          tooltip={t("dashboard.kpis.debtToIncome.tooltip")}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-display text-base font-semibold text-content">
            {t("dashboard.charts.assetsVsLiabilitiesTitle")}
          </h2>
          <div className="mt-4">
            <AssetsVsLiabilitiesChart
              totalAssets={latest?.total_assets ?? 0}
              totalLiabilities={latest?.total_liabilities ?? 0}
              currency={currency}
              assetsLabel={t("dashboard.charts.assetsLabel")}
              liabilitiesLabel={t("dashboard.charts.liabilitiesLabel")}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="font-display text-base font-semibold text-content">
            {t("dashboard.charts.assetBreakdownTitle")}
          </h2>
          <div className="mt-4">
            <AssetBreakdownChart
              data={assetBreakdown ?? []}
              currency={currency}
              categoryLabels={categoryLabels}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
