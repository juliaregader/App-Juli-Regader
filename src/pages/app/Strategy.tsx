import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AssetAllocationChart } from "@/components/charts/AssetAllocationChart";
import { useToast } from "@/components/ui/useToast";
import { useAuth } from "@/features/auth/useAuth";
import {
  useDeleteStrategyAsset,
  useStrategy,
  useStrategyAssets,
  useUpdateStrategy,
  useUpsertStrategyAsset,
} from "@/features/strategy/queries";
import { formatCurrency } from "@/lib/format/currency";

export function Strategy() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { user, profile } = useAuth();
  const currency = profile?.currency ?? "EUR";
  const { data: strategy, isLoading: loadingStrategy } = useStrategy(user?.id);
  const updateStrategy = useUpdateStrategy(user?.id);

  const { data: assets = [], isLoading: loadingAssets } = useStrategyAssets(strategy?.id);
  const upsertAsset = useUpsertStrategyAsset(strategy?.id, user?.id);
  const deleteAsset = useDeleteStrategyAsset(strategy?.id);

  const [monthlyContribution, setMonthlyContribution] = useState(strategy?.monthly_contribution ?? 0);

  if (loadingStrategy || !strategy) {
    return <p className="container-page py-10 text-content-muted">{t("strategy.loading")}</p>;
  }

  const totalPct = assets.reduce((sum, a) => sum + a.target_pct, 0);
  const pctWarning = assets.length > 0 && Math.abs(totalPct - 100) > 0.01;

  const addRow = () => {
    upsertAsset.mutate({ asset_name: t("wealth.newAsset"), target_pct: 0, amount: 0, currency });
  };

  return (
    <section className="container-page max-w-4xl space-y-8 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">{t("strategy.title")}</h1>
        <p className="mt-1 max-w-2xl text-sm text-content-muted">{t("strategy.subtitle")}</p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-content">{t("strategy.contributionTitle")}</h2>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="number"
            step="0.01"
            className="input max-w-xs"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            onBlur={() => {
              updateStrategy.mutate({ id: strategy.id, monthly_contribution: monthlyContribution });
              showToast(t("strategy.contributionUpdated"));
            }}
          />
          <span className="text-sm text-content-muted">
            {currency} {t("strategy.perMonth")}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-content">{t("strategy.assetsTitle")}</h2>
            <p className="help-text">{t("strategy.assetsSubtitle")}</p>
          </div>
          <button type="button" className="btn-secondary shrink-0" onClick={addRow}>
            <Plus className="h-4 w-4" aria-hidden /> {t("strategy.addAsset")}
          </button>
        </div>

        {pctWarning && (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {t("strategy.pctWarning", { pct: totalPct.toFixed(1) })}
          </p>
        )}

        {loadingAssets ? (
          <p className="mt-4 text-sm text-content-muted">{t("strategy.loading")}</p>
        ) : assets.length === 0 ? (
          <p className="mt-4 text-sm text-content-muted">{t("strategy.emptyAssets")}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-center"
              >
                <input
                  className="input sm:col-span-4"
                  defaultValue={asset.asset_name}
                  aria-label={t("strategy.assetName")}
                  onBlur={(e) => {
                    if (e.target.value !== asset.asset_name) {
                      upsertAsset.mutate({ id: asset.id, asset_name: e.target.value });
                    }
                  }}
                />
                <div className="sm:col-span-2">
                  <label className="help-text mb-1 block">{t("strategy.targetPct")}</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    defaultValue={asset.target_pct}
                    aria-label={t("strategy.targetPct")}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (value !== asset.target_pct) upsertAsset.mutate({ id: asset.id, target_pct: value });
                    }}
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="help-text mb-1 block">{t("strategy.amount")}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    defaultValue={asset.amount}
                    aria-label={t("strategy.amount")}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (value !== asset.amount) upsertAsset.mutate({ id: asset.id, amount: value });
                    }}
                  />
                </div>
                <div className="text-xs text-content-muted sm:col-span-2">
                  {t("strategy.suggestedContribution")}
                  <br />
                  <span className="font-semibold text-content">
                    {formatCurrency((monthlyContribution * asset.target_pct) / 100, currency)}
                    {t("strategy.perMonth")}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={t("strategy.deleteAsset")}
                  className="justify-self-end text-content-muted hover:text-red-600 sm:col-span-1"
                  onClick={() => deleteAsset.mutate(asset.id)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="font-semibold text-content">{t("strategy.allocationTitle")}</h2>
        <div className="mt-4">
          <AssetAllocationChart
            data={assets.map((a) => ({ name: a.asset_name, value: a.amount }))}
            currency={currency}
          />
        </div>
      </div>
    </section>
  );
}
