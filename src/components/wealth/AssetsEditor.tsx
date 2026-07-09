import { Plus, Trash2 } from "lucide-react";

import { useAssets, useDeleteAsset, useUpsertAsset } from "@/features/wealth/queries";
import type { AssetType } from "@/features/wealth/types";

const typeLabels: Record<AssetType, string> = {
  liquido: "Líquido (cuentas, efectivo)",
  inversion: "Inversión (fondos, acciones...)",
  inmueble: "Inmueble",
  otros: "Otros",
};

const EXAMPLES = "Ej.: cuenta corriente 5.000 €, fondo indexado 12.000 €, piso 180.000 €, coche 9.000 €";

export function AssetsEditor({ userId }: { userId: string | undefined }) {
  const { data: assets = [], isLoading } = useAssets(userId);
  const upsert = useUpsertAsset(userId);
  const remove = useDeleteAsset(userId);

  const addRow = () => {
    upsert.mutate({ name: "Nuevo activo", type: "liquido", value: 0, currency: "EUR", is_liquid: true });
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-content">Activos</h3>
          <p className="help-text">{EXAMPLES}</p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary shrink-0">
          <Plus className="h-4 w-4" aria-hidden /> Añadir
        </button>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-content-muted">Cargando…</p>
      ) : assets.length === 0 ? (
        <p className="mt-4 text-sm text-content-muted">Aún no has añadido ningún activo.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {assets.map((asset) => (
            <div key={asset.id} className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-center">
              <input
                className="input sm:col-span-4"
                defaultValue={asset.name}
                aria-label="Nombre del activo"
                onBlur={(e) => {
                  if (e.target.value !== asset.name) {
                    upsert.mutate({ id: asset.id, name: e.target.value });
                  }
                }}
              />
              <select
                className="input sm:col-span-3"
                defaultValue={asset.type}
                aria-label="Tipo de activo"
                onChange={(e) => upsert.mutate({ id: asset.id, type: e.target.value as AssetType })}
              >
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                className="input sm:col-span-2"
                defaultValue={asset.value}
                aria-label="Valor"
                onBlur={(e) => {
                  const value = Number(e.target.value);
                  if (value !== asset.value) upsert.mutate({ id: asset.id, value });
                }}
              />
              <label className="flex items-center gap-2 text-xs text-content-muted sm:col-span-2">
                <input
                  type="checkbox"
                  defaultChecked={asset.is_liquid}
                  onChange={(e) => upsert.mutate({ id: asset.id, is_liquid: e.target.checked })}
                />
                Líquido
              </label>
              <button
                type="button"
                aria-label="Eliminar activo"
                className="justify-self-end text-content-muted hover:text-red-600 sm:col-span-1"
                onClick={() => remove.mutate(asset.id)}
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
