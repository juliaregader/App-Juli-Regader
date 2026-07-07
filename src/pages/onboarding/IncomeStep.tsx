import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { useCreateIncomeItem, useDeleteIncomeItem, useIncomeItems } from "@/lib/wealth/queries";
import type { IncomeCategory } from "@/lib/wealth/types";
import { WealthItemStep } from "@/pages/onboarding/WealthItemStep";

const CATEGORIES: IncomeCategory[] = ["fixed", "variable"];

export function IncomeStep({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const currency = profile?.base_currency ?? "EUR";

  const { data: items, isLoading } = useIncomeItems();
  const createItem = useCreateIncomeItem();
  const deleteItem = useDeleteIncomeItem();

  const categoryOptions = CATEGORIES.map((value) => ({
    value,
    label: t(`onboarding.categories.income.${value}`),
  }));

  return (
    <WealthItemStep
      heading={t("onboarding.steps.income.title")}
      description={t("onboarding.steps.income.description")}
      nameLabel={t("onboarding.common.nameLabel")}
      categoryLabel={t("onboarding.common.categoryLabel")}
      amountLabel={t("onboarding.common.amountLabel")}
      categoryOptions={categoryOptions}
      currency={currency}
      isLoading={isLoading}
      isSubmitting={createItem.isPending}
      items={(items ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        categoryLabel: t(`onboarding.categories.income.${item.category}`),
        amount: item.amount,
        currency: item.currency,
      }))}
      onAdd={({ name, category, amount }) =>
        createItem.mutate({ name, category: category as IncomeCategory, amount, currency })
      }
      onDelete={(id) => deleteItem.mutate(id)}
      onNext={onNext}
    />
  );
}
