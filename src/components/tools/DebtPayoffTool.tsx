import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { formatCurrency } from "@/lib/format/currency";
import { simulatePayoff } from "@/lib/tools/debtPayoff";
import type { Liability } from "@/lib/wealth/types";

interface DebtPayoffToolProps {
  liabilities: Liability[];
  currency: string;
}

export function DebtPayoffTool({ liabilities, currency }: DebtPayoffToolProps) {
  const { t } = useTranslation();
  const [extra, setExtra] = useState("100");

  const debts = liabilities
    .filter((l) => l.value > 0)
    .map((l) => ({
      id: l.id,
      name: l.name,
      balance: l.value,
      annualRatePercent: l.interest_rate ?? 0,
      minPayment: l.monthly_payment ?? 0,
    }));

  const avalanche = useMemo(
    () => simulatePayoff(debts, Number(extra) || 0, "avalanche"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(debts), extra],
  );
  const snowball = useMemo(
    () => simulatePayoff(debts, Number(extra) || 0, "snowball"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(debts), extra],
  );

  if (debts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-content">
          {t("tools.debtPayoff.title")}
        </h2>
        <p className="mt-2 text-sm text-content-muted">{t("tools.debtPayoff.noDebts")}</p>
      </div>
    );
  }

  const nameById = new Map(debts.map((d) => [d.id, d.name]));

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <h2 className="font-display text-base font-semibold text-content">
        {t("tools.debtPayoff.title")}
      </h2>
      <p className="mt-1 text-sm text-content-muted">{t("tools.debtPayoff.description")}</p>

      <label className="mt-4 flex max-w-xs flex-col gap-1 text-xs text-content-muted">
        {t("tools.debtPayoff.extraLabel")}
        <input
          type="number"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />
      </label>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { key: "avalanche", result: avalanche },
          { key: "snowball", result: snowball },
        ].map(({ key, result }) => (
          <div key={key} className="rounded-lg border border-border bg-surface-subtle p-4">
            <p className="text-sm font-semibold text-content">{t(`tools.debtPayoff.${key}`)}</p>
            <p className="mt-2 text-xs text-content-muted">
              {t("tools.debtPayoff.monthsLabel")}{" "}
              <span className="font-semibold text-content">{result.months}</span>
            </p>
            <p className="text-xs text-content-muted">
              {t("tools.debtPayoff.interestLabel")}{" "}
              <span className="font-semibold text-content">
                {formatCurrency(result.totalInterest, currency)}
              </span>
            </p>
            <ol className="mt-2 list-decimal pl-4 text-xs text-content-muted">
              {result.payoffOrder.map((id) => (
                <li key={id}>{nameById.get(id)}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
