import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { useCreateExpenseItem, useDeleteExpenseItem, useExpenseItems } from "@/lib/wealth/queries";
import type { ExpenseCategory } from "@/lib/wealth/types";
import { WealthItemStep } from "@/pages/onboarding/WealthItemStep";

const CATEGORIES: ExpenseCategory[] = [
  "housing",
  "utilities",
  "transport",
  "leisure",
  "debt",
  "savings",
  "other",
];

export function ExpenseStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const currency = profile?.base_currency ?? "EUR";

  const { data: items, isLoading } = useExpenseItems();
  const createItem = useCreateExpenseItem();
  const deleteItem = useDeleteExpenseItem();

  const categoryOptions = CATEGORIES.map((value) => ({
    value,
    label: t(`onboarding.categories.expenses.${value}`),
  }));

  return (
    <WealthItemStep
      heading={t("onboarding.steps.expenses.title")}
      description={t("onboarding.steps.expenses.description")}
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
        categoryLabel: t(`onboarding.categories.expenses.${item.category}`),
        amount: item.amount,
        currency: item.currency,
      }))}
      onAdd={({ name, category, amount }) =>
        createItem.mutate({ name, category: category as ExpenseCategory, amount, currency })
      }
      onDelete={(id) => deleteItem.mutate(id)}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
