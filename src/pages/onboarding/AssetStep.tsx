import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { useAssets, useCreateAsset, useDeleteAsset } from "@/lib/wealth/queries";
import type { AssetCategory } from "@/lib/wealth/types";
import { WealthItemStep } from "@/pages/onboarding/WealthItemStep";

const CATEGORIES: AssetCategory[] = ["liquid", "investment", "real_estate", "other"];

export function AssetStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const currency = profile?.base_currency ?? "EUR";

  const { data: items, isLoading } = useAssets();
  const createItem = useCreateAsset();
  const deleteItem = useDeleteAsset();

  const categoryOptions = CATEGORIES.map((value) => ({
    value,
    label: t(`onboarding.categories.assets.${value}`),
  }));

  return (
    <WealthItemStep
      heading={t("onboarding.steps.assets.title")}
      description={t("onboarding.steps.assets.description")}
      nameLabel={t("onboarding.common.nameLabel")}
      categoryLabel={t("onboarding.common.categoryLabel")}
      amountLabel={t("onboarding.common.valueLabel")}
      categoryOptions={categoryOptions}
      currency={currency}
      isLoading={isLoading}
      isSubmitting={createItem.isPending}
      items={(items ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        categoryLabel: t(`onboarding.categories.assets.${item.category}`),
        amount: item.value,
        currency: item.currency,
      }))}
      onAdd={({ name, category, amount }) =>
        createItem.mutate({ name, category: category as AssetCategory, value: amount, currency })
      }
      onDelete={(id) => deleteItem.mutate(id)}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
