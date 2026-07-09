import { Plus, Trash2 } from "lucide-react";

import { useDeleteLiability, useLiabilities, useUpsertLiability } from "@/features/wealth/queries";

const EXAMPLES = "Ej.: hipoteca 120.000 € (cuota 650 €/mes), préstamo coche 6.000 € (cuota 180 €/mes)";

export function LiabilitiesEditor({ userId }: { userId: string | undefined }) {
  const { data: liabilities = [], isLoading } = useLiabilities(userId);
  const upsert = useUpsertLiability(userId);
  const remove = useDeleteLiability(userId);

  const addRow = () => {
    upsert.mutate({ name: "Nueva deuda", type: "otros", balance: 0, monthly_payment: 0 });
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-content">Pasivos / deudas</h3>
          <p className="help-text">{EXAMPLES}</p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary shrink-0">
          <Plus className="h-4 w-4" aria-hidden /> Añadir
        </button>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-content-muted">Cargando…</p>
      ) : liabilities.length === 0 ? (
        <p className="mt-4 text-sm text-content-muted">No tienes deudas registradas.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {liabilities.map((liability) => (
            <div key={liability.id} className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-center">
              <input
                className="input sm:col-span-5"
                defaultValue={liability.name}
                aria-label="Nombre de la deuda"
                onBlur={(e) => {
                  if (e.target.value !== liability.name) {
                    upsert.mutate({ id: liability.id, name: e.target.value });
                  }
                }}
              />
              <div className="sm:col-span-3">
                <label className="help-text mb-1 block">Saldo pendiente</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  defaultValue={liability.balance}
                  aria-label="Saldo pendiente"
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value !== liability.balance) upsert.mutate({ id: liability.id, balance: value });
                  }}
                />
              </div>
              <div className="sm:col-span-3">
                <label className="help-text mb-1 block">Cuota mensual</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  defaultValue={liability.monthly_payment}
                  aria-label="Cuota mensual"
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
                aria-label="Eliminar deuda"
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
