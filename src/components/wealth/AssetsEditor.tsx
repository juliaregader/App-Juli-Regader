import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAssets, useDeleteAsset, useUpsertAsset } from "@/features/wealth/queries";
import type { AssetType } from "@/features/wealth/types";

export function AssetsEditor({ userId }: { userId: string | undefined }) {
  const { t } = useTranslation();
  const { data: assets = [], isLoading } = useAssets(userId);
  const upsert = useUpsertAsset(userId);
  const remove = useDeleteAsset(userId);

  const typeLabels: Record<AssetType, string> = {
    liquido: t("wealth.assetTypes.liquido"),
    inversion: t("wealth.assetTypes.inversion"),
    inmueble: t("wealth.assetTypes.inmueble"),
    otros: t("wealth.assetTypes.otros"),
  };

  const addRow = () => {
    upsert.mutate({ name: t("wealth.newAsset"), type: "liquido", value: 0, currency: "EUR", is_liquid: true });
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-content">{t("wealth.assetsTitle")}</h3>
          <p className="help-text">{t("wealth.assetsExamples")}</p>
        </div>
        <button type="button" onClick={addRow} className="btn-secondary shrink-0">
          <Plus className="h-4 w-4" aria-hidden /> {t("wealth.addAsset")}
        </button>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-content-muted">{t("wealth.loading")}</p>
      ) : assets.length === 0 ? (
        <p className="mt-4 text-sm text-content-muted">{t("wealth.emptyAssets")}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {assets.map((asset) => (
            <div key={asset.id} className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-center">
              <input
                className="input sm:col-span-4"
                defaultValue={asset.name}
                aria-label={t("wealth.assetName")}
                onBlur={(e) => {
                  if (e.target.value !== asset.name) {
                    upsert.mutate({ id: asset.id, name: e.target.value });
                  }
                }}
              />
              <select
                className="input sm:col-span-3"
                defaultValue={asset.type}
                aria-label={t("wealth.assetType")}
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
                aria-label={t("wealth.value")}
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
                {t("wealth.liquid")}
              </label>
              <button
                type="button"
                aria-label={t("wealth.deleteAsset")}
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
