import { useMemo, useState } from "react";

import { IncomeExpensesEditor } from "@/components/wealth/IncomeExpensesEditor";
import { useAuth } from "@/features/auth/useAuth";
import { useFinancialSnapshots } from "@/features/wealth/queries";
import { firstOfMonth, formatMonthLabel, monthRange, shiftMonth } from "@/lib/dates";
import { formatCurrency } from "@/lib/format/currency";

const TRACKING_START = "2026-01-01";

export function RegistroMensual() {
  const { user, profile } = useAuth();
  const currency = profile?.currency ?? "EUR";
  const { data: snapshots = [] } = useFinancialSnapshots(user?.id);

  const months = useMemo(() => monthRange(TRACKING_START, firstOfMonth()), []);
  const lastFilledMonth = snapshots.length > 0 ? snapshots[snapshots.length - 1].month : null;
  const defaultMonth =
    lastFilledMonth && months.includes(shiftMonth(lastFilledMonth, 1)) ? shiftMonth(lastFilledMonth, 1) : months[months.length - 1];

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const snapshotByMonth = useMemo(() => new Map(snapshots.map((s) => [s.month, s])), [snapshots]);
  const previousSnapshot = snapshotByMonth.get(shiftMonth(selectedMonth, -1)) ?? null;

  return (
    <section className="container-page max-w-3xl space-y-8 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Registro mensual</h1>
        <p className="mt-1 text-content-muted">
          Añade tus ingresos y gastos cada mes desde enero de 2026 para ver la evolución real de
          tu patrimonio.
        </p>
      </div>

      <div className="card">
        <label className="label" htmlFor="month-select">
          Mes
        </label>
        <select
          id="month-select"
          className="input max-w-xs"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={m} className="capitalize">
              {formatMonthLabel(m)} {snapshotByMonth.has(m) ? "· registrado" : ""}
            </option>
          ))}
        </select>

        <div className="mt-6">
          <IncomeExpensesEditor
            key={selectedMonth}
            userId={user?.id}
            month={selectedMonth}
            prefillFrom={previousSnapshot}
          />
        </div>
      </div>

      {snapshots.length > 0 && (
        <div className="card overflow-x-auto">
          <h2 className="font-semibold text-content">Histórico</h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-content-muted">
                <th className="py-2 pr-4 font-medium">Mes</th>
                <th className="py-2 pr-4 font-medium">Ingresos</th>
                <th className="py-2 pr-4 font-medium">Gastos</th>
                <th className="py-2 pr-4 font-medium">Ahorro</th>
                <th className="py-2 font-medium">Patrimonio neto</th>
              </tr>
            </thead>
            <tbody>
              {[...snapshots]
                .reverse()
                .map((s) => (
                  <tr
                    key={s.id}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-brand-100/50"
                    onClick={() => setSelectedMonth(s.month)}
                  >
                    <td className="py-2 pr-4 capitalize">{formatMonthLabel(s.month)}</td>
                    <td className="py-2 pr-4">{formatCurrency(s.net_income, currency)}</td>
                    <td className="py-2 pr-4">{formatCurrency(s.total_expenses, currency)}</td>
                    <td className="py-2 pr-4">{formatCurrency(s.savings, currency)}</td>
                    <td className="py-2">{formatCurrency(s.net_worth, currency)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
