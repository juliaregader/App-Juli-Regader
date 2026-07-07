import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { formatCurrency } from "@/lib/format/currency";
import {
  useCreateStrategyAllocation,
  useDeleteStrategyAllocation,
  useStrategyAllocations,
  useUpdateStrategyAllocation,
} from "@/lib/wealth/queries";

const TEMPLATE_KEYS = ["conservative", "moderate", "dynamic"] as const;

const TEMPLATES: Record<(typeof TEMPLATE_KEYS)[number], { classKey: string; target: number }[]> = {
  conservative: [
    { classKey: "cash", target: 20 },
    { classKey: "bonds", target: 60 },
    { classKey: "equities", target: 20 },
  ],
  moderate: [
    { classKey: "cash", target: 20 },
    { classKey: "bonds", target: 40 },
    { classKey: "equities", target: 40 },
  ],
  dynamic: [
    { classKey: "cash", target: 10 },
    { classKey: "bonds", target: 20 },
    { classKey: "equities", target: 70 },
  ],
};

export function Strategy() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const currency = profile?.base_currency ?? "EUR";

  const { data: allocations, isLoading } = useStrategyAllocations();
  const createAllocation = useCreateStrategyAllocation();
  const updateAllocation = useUpdateStrategyAllocation();
  const deleteAllocation = useDeleteStrategyAllocation();

  const [assetClass, setAssetClass] = useState("");
  const [targetPercentage, setTargetPercentage] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const rows = allocations ?? [];
  const totalValue = rows.reduce((sum, row) => sum + row.current_value, 0);
  const totalTarget = rows.reduce((sum, row) => sum + row.target_percentage, 0);

  const handleAdd = () => {
    const target = Number(targetPercentage);
    const value = Number(currentValue) || 0;
    if (!assetClass.trim() || !Number.isFinite(target) || target < 0) return;
    createAllocation.mutate({
      asset_class: assetClass.trim(),
      target_percentage: target,
      current_value: value,
      currency,
    });
    setAssetClass("");
    setTargetPercentage("");
    setCurrentValue("");
  };

  const applyTemplate = (key: (typeof TEMPLATE_KEYS)[number]) => {
    for (const { classKey, target } of TEMPLATES[key]) {
      createAllocation.mutate({
        asset_class: t(`strategy.classes.${classKey}`),
        target_percentage: target,
        current_value: 0,
        currency,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-content">{t("strategy.title")}</h1>
        <p className="mt-1 text-sm text-content-muted">{t("strategy.description")}</p>
        <p className="mt-3 rounded-lg bg-surface-subtle px-3 py-2 text-xs text-content-muted">
          {t("strategy.educationalNote")}
        </p>
      </section>

      {rows.length === 0 && !isLoading ? (
        <section className="rounded-2xl border border-dashed border-brand-300 bg-brand-100/40 p-6 dark:bg-brand-950/40">
          <p className="text-sm font-medium text-content">{t("strategy.templatesTitle")}</p>
          <p className="mt-1 text-xs text-content-muted">{t("strategy.templatesNote")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEMPLATE_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => applyTemplate(key)}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-content hover:bg-surface-subtle"
              >
                {t(`strategy.templates.${key}`)}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            type="text"
            placeholder={t("strategy.form.assetClass")}
            value={assetClass}
            onChange={(e) => setAssetClass(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            placeholder={t("strategy.form.targetPercentage")}
            value={targetPercentage}
            onChange={(e) => setTargetPercentage(e.target.value)}
            className="w-28 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <input
            type="number"
            inputMode="decimal"
            min={0}
            placeholder={t("strategy.form.currentValue")}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            className="w-32 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-900 px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-brand-100 dark:text-brand-900"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("onboarding.common.add")}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {rows.length === 0 ? (
            <p className="text-sm text-content-muted">{t("onboarding.common.empty")}</p>
          ) : (
            rows.map((row) => {
              const actualPercentage = totalValue > 0 ? (row.current_value / totalValue) * 100 : 0;
              const deviation = actualPercentage - row.target_percentage;
              return (
                <div
                  key={row.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-content">{row.asset_class}</p>
                    <p className="text-xs text-content-muted">
                      {t("strategy.row.target")} {row.target_percentage}% ·{" "}
                      {t("strategy.row.actual")} {actualPercentage.toFixed(1)}% ·{" "}
                      {t("strategy.row.deviation")}{" "}
                      <span className={deviation === 0 ? "" : deviation > 0 ? "text-brand-500" : "text-content-muted"}>
                        {deviation > 0 ? "+" : ""}
                        {deviation.toFixed(1)}%
                      </span>
                    </p>
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    aria-label={t("strategy.form.currentValue")}
                    defaultValue={row.current_value}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isFinite(value) && value !== row.current_value) {
                        updateAllocation.mutate({ id: row.id, patch: { current_value: value } });
                      }
                    }}
                    className="w-28 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  />
                  <span className="text-sm font-semibold tabular-nums text-content">
                    {formatCurrency(row.current_value, row.currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteAllocation.mutate(row.id)}
                    className="text-content-muted hover:text-red-600"
                    aria-label={t("onboarding.common.remove")}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {rows.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-sm">
            <span className="text-content-muted">
              {t("strategy.totalTarget")}:{" "}
              <span className={totalTarget === 100 ? "text-content" : "font-semibold text-brand-500"}>
                {totalTarget}%
              </span>
            </span>
            <span className="font-semibold tabular-nums text-content">
              {t("strategy.totalValue")}: {formatCurrency(totalValue, currency)}
            </span>
          </div>
        ) : null}
      </section>
    </div>
  );
}
