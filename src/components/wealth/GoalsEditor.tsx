import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useDeleteGoal, useGoals, useUpsertGoal } from "@/features/wealth/queries";

export function GoalsEditor({ userId }: { userId: string | undefined }) {
  const { t } = useTranslation();
  const { data: goals = [], isLoading } = useGoals(userId);
  const upsert = useUpsertGoal(userId);
  const remove = useDeleteGoal(userId);

  const addRow = () => {
    upsert.mutate({ title: t("wealth.newGoal") });
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-content">{t("wealth.goalsTitle")}</h3>
          <p className="help-text">{t("wealth.goalsExamples")}</p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary shrink-0">
          <Plus className="h-4 w-4" aria-hidden /> {t("wealth.addGoal")}
        </button>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-content-muted">{t("wealth.loading")}</p>
      ) : goals.length === 0 ? (
        <p className="mt-4 text-sm text-content-muted">{t("wealth.emptyGoals")}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-center">
              <input
                className="input sm:col-span-4"
                defaultValue={goal.title}
                aria-label={t("wealth.goalTitle")}
                onBlur={(e) => {
                  if (e.target.value !== goal.title) upsert.mutate({ id: goal.id, title: e.target.value });
                }}
              />
              <div className="sm:col-span-3">
                <label className="help-text mb-1 block">{t("wealth.targetAmount")}</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  defaultValue={goal.target_amount ?? ""}
                  aria-label={t("wealth.targetAmount")}
                  onBlur={(e) => {
                    const value = e.target.value === "" ? null : Number(e.target.value);
                    upsert.mutate({ id: goal.id, target_amount: value });
                  }}
                />
              </div>
              <div className="sm:col-span-3">
                <label className="help-text mb-1 block">{t("wealth.targetDate")}</label>
                <input
                  type="date"
                  className="input"
                  defaultValue={goal.target_date ?? ""}
                  aria-label={t("wealth.targetDate")}
                  onChange={(e) => upsert.mutate({ id: goal.id, target_date: e.target.value || null })}
                />
              </div>
              <button
                type="button"
                aria-label={t("wealth.deleteGoal")}
                className="justify-self-end text-content-muted hover:text-red-600 sm:col-span-2"
                onClick={() => remove.mutate(goal.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
