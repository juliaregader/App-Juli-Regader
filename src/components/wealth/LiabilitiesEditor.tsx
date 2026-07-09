import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useDeleteLiability, useLiabilities, useUpsertLiability } from "@/features/wealth/queries";

export function LiabilitiesEditor({ userId }: { userId: string | undefined }) {
  const { t } = useTranslation();
  const { data: liabilities = [], isLoading } = useLiabilities(userId);
  const upsert = useUpsertLiability(userId);
  const remove = useDeleteLiability(userId);

  const addRow = () => {
    upsert.mutate({ name: t("wealth.newLiability"), type: "otros", balance: 0, monthly_payment: 0 });
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-content">{t("wealth.liabilitiesTitle")}</h3>
          <p className="help-text">{t("wealth.liabilitiesExamples")}</p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary shrink-0">
          <Plus className="h-4 w-4" aria-hidden /> {t("wealth.addLiability")}
        </button>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-content-muted">{t("wealth.loading")}</p>
      ) : liabilities.length === 0 ? (
        <p className="mt-4 text-sm text-content-muted">{t("wealth.emptyLiabilities")}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {liabilities.map((liability) => (
            <div key={liability.id} className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-center">
              <input
                className="input sm:col-span-5"
                defaultValue={liability.name}
                aria-label={t("wealth.liabilityName")}
                onBlur={(e) => {
                  if (e.target.value !== liability.name) {
                    upsert.mutate({ id: liability.id, name: e.target.value });
                  }
                }}
              />
              <div className="sm:col-span-3">
                <label className="help-text mb-1 block">{t("wealth.balance")}</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  defaultValue={liability.balance}
                  aria-label={t("wealth.balance")}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value !== liability.balance) upsert.mutate({ id: liability.id, balance: value });
                  }}
                />
              </div>
              <div className="sm:col-span-3">
                <label className="help-text mb-1 block">{t("wealth.monthlyPayment")}</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  defaultValue={liability.monthly_payment}
                  aria-label={t("wealth.monthlyPayment")}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value !== liability.monthly_payment) {
                      upsert.mutate({ id: liability.id, monthly_payment: value });
                    }
                  }}
                />
              </div>
              <button
                type="button"
                aria-label={t("wealth.deleteLiability")}
                className="justify-self-end text-content-muted hover:text-red-600 sm:col-span-1"
                onClick={() => remove.mutate(liability.id)}
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
