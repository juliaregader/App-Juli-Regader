import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { formatCurrency } from "@/lib/format/currency";
import { useCreateGoal, useDeleteGoal, useGoals, useUpdateGoal } from "@/lib/wealth/queries";

export function Goals() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const currency = profile?.base_currency ?? "EUR";

  const { data: goals, isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const rows = goals ?? [];

  const handleAdd = () => {
    const amount = Number(targetAmount);
    if (!name.trim() || !Number.isFinite(amount) || amount <= 0) return;
    createGoal.mutate({
      name: name.trim(),
      target_amount: amount,
      current_amount: 0,
      currency,
      target_date: targetDate || null,
    });
    setName("");
    setTargetAmount("");
    setTargetDate("");
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-content">{t("goals.title")}</h1>
        <p className="mt-1 text-sm text-content-muted">{t("goals.description")}</p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            type="text"
            aria-label={t("goals.form.name")}
            placeholder={t("goals.form.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <input
            type="number"
            inputMode="decimal"
            min={0}
            aria-label={t("goals.form.targetAmount")}
            placeholder={t("goals.form.targetAmount")}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-36 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <input
            type="date"
            aria-label={t("goals.form.targetDate")}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-900 px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("onboarding.common.add")}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {isLoading ? null : rows.length === 0 ? (
            <p className="text-sm text-content-muted">{t("onboarding.common.empty")}</p>
          ) : (
            rows.map((goal) => {
              const progress = Math.min(goal.current_amount / goal.target_amount, 1);
              return (
                <div key={goal.id} className="rounded-lg border border-border bg-surface px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-content">{goal.name}</p>
                      {goal.target_date ? (
                        <p className="text-xs text-content-muted">
                          {t("goals.targetDateLabel")} {goal.target_date}
                        </p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteGoal.mutate(goal.id)}
                      className="text-content-muted hover:text-red-600"
                      aria-label={t("onboarding.common.remove")}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
                    <div
                      className="h-full rounded-full bg-brand-900 transition-all"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                    <label className="flex items-center gap-2 text-content-muted">
                      {t("goals.currentAmountLabel")}
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        defaultValue={goal.current_amount}
                        onBlur={(e) => {
                          const value = Number(e.target.value);
                          if (Number.isFinite(value) && value !== goal.current_amount) {
                            updateGoal.mutate({ id: goal.id, patch: { current_amount: value } });
                          }
                        }}
                        className="w-28 rounded-lg border border-border bg-surface px-2 py-1 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      />
                    </label>
                    <span className="font-semibold tabular-nums text-content">
                      {formatCurrency(goal.current_amount, goal.currency)} /{" "}
                      {formatCurrency(goal.target_amount, goal.currency)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
