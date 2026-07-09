import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useToast } from "@/components/ui/useToast";
import { useAssets, useLiabilities, useMonthSnapshot, useUpsertMonthSnapshot } from "@/features/wealth/queries";
import type { FinancialSnapshot } from "@/features/wealth/types";
import { formatMonthLabel } from "@/lib/dates";

interface ExpenseRow {
  category: string;
  amount: number;
}

const DEFAULT_CATEGORIES = ["Vivienda", "Alimentación", "Transporte", "Ocio", "Otros"];

function rowsFromExpenses(expenses: Record<string, number> | undefined) {
  const entries = Object.entries(expenses || {});
  return entries.length > 0
    ? entries.map(([category, amount]) => ({ category, amount }))
    : DEFAULT_CATEGORIES.map((category) => ({ category, amount: 0 }));
}

interface IncomeExpensesEditorProps {
  userId: string | undefined;
  month: string;
  onSaved?: () => void;
  saveLabel?: string;
  /** Mes anterior (si existe) para prellenar un mes nuevo aún sin registro. */
  prefillFrom?: FinancialSnapshot | null;
}

export function IncomeExpensesEditor({ userId, month, onSaved, saveLabel = "Guardar", prefillFrom }: IncomeExpensesEditorProps) {
  const { showToast } = useToast();
  const { data: snapshot, isLoading } = useMonthSnapshot(userId, month);
  const { data: assets = [] } = useAssets(userId);
  const { data: liabilities = [] } = useLiabilities(userId);
  const upsertSnapshot = useUpsertMonthSnapshot(userId);

  const [netIncome, setNetIncome] = useState(0);
  const [rows, setRows] = useState<ExpenseRow[]>(DEFAULT_CATEGORIES.map((category) => ({ category, amount: 0 })));
  const initializedFor = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading || initializedFor.current === month) return;
    initializedFor.current = month;

    if (snapshot) {
      setNetIncome(snapshot.net_income);
      setRows(rowsFromExpenses(snapshot.expenses));
    } else if (prefillFrom) {
      setNetIncome(prefillFrom.net_income);
      setRows(rowsFromExpenses(prefillFrom.expenses));
    } else {
      setNetIncome(0);
      setRows(DEFAULT_CATEGORIES.map((category) => ({ category, amount: 0 })));
    }
  }, [snapshot, isLoading, month, prefillFrom]);

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
  const totalExpenses = rows.reduce((sum, r) => sum + (Number.isFinite(r.amount) ? r.amount : 0), 0);

  const updateRow = (index: number, patch: Partial<ExpenseRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index));
  const addRow = () => setRows((prev) => [...prev, { category: "Nueva categoría", amount: 0 }]);

  const handleSave = async () => {
    const expenses = Object.fromEntries(rows.map((r) => [r.category, r.amount]));
    await upsertSnapshot.mutateAsync({
      month,
      net_income: netIncome,
      expenses,
      total_expenses: totalExpenses,
      total_assets: totalAssets,
      total_liabilities: totalLiabilities,
    });
    showToast("Registro guardado");
    onSaved?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-content capitalize">{formatMonthLabel(month)}</h3>
        {!snapshot && prefillFrom && (
          <p className="help-text">Precargado con los datos del mes anterior: edítalos si han cambiado.</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="net_income">
          Ingresos mensuales netos
        </label>
        <input
          id="net_income"
          type="number"
          step="0.01"
          className="input"
          value={netIncome}
          onChange={(e) => setNetIncome(Number(e.target.value))}
        />
        <p className="help-text">Ej.: 2.400 € de nómina + 300 € de alquiler = 2.700 €</p>
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-content">Gastos mensuales</h4>
            <p className="help-text">Ej.: vivienda 800 €, alimentación 400 €, transporte 150 €, ocio 200 €…</p>
          </div>
          <button type="button" onClick={addRow} className="btn-secondary shrink-0">
            <Plus className="h-4 w-4" aria-hidden /> Categoría
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {rows.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                className="input"
                value={row.category}
                onChange={(e) => updateRow(index, { category: e.target.value })}
                aria-label="Categoría de gasto"
              />
              <input
                type="number"
                step="0.01"
                className="input w-32 shrink-0"
                value={row.amount}
                onChange={(e) => updateRow(index, { amount: Number(e.target.value) })}
                aria-label="Importe"
              />
              <button
                type="button"
                aria-label="Eliminar categoría"
                className="shrink-0 text-content-muted hover:text-red-600"
                onClick={() => removeRow(index)}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-3 text-sm font-medium text-content">
          Total gastos: {totalExpenses.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
        </p>
      </div>

      <button type="button" className="btn-primary" onClick={handleSave} disabled={upsertSnapshot.isPending}>
        {upsertSnapshot.isPending ? "Guardando…" : saveLabel}
      </button>
    </div>
  );
}
