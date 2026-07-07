import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { useCreateLiability, useDeleteLiability, useLiabilities } from "@/lib/wealth/queries";
import type { LiabilityCategory } from "@/lib/wealth/types";
import { WealthItemStep } from "@/pages/onboarding/WealthItemStep";

const CATEGORIES: LiabilityCategory[] = ["mortgage", "loan", "credit_card", "other"];

export function LiabilityStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const currency = profile?.base_currency ?? "EUR";

  const { data: items, isLoading } = useLiabilities();
  const createItem = useCreateLiability();
  const deleteItem = useDeleteLiability();

  const categoryOptions = CATEGORIES.map((value) => ({
    value,
    label: t(`onboarding.categories.liabilities.${value}`),
  }));

  return (
    <WealthItemStep
      heading={t("onboarding.steps.liabilities.title")}
      description={t("onboarding.steps.liabilities.description")}
      nameLabel={t("onboarding.common.nameLabel")}
      categoryLabel={t("onboarding.common.categoryLabel")}
      amountLabel={t("onboarding.common.valueLabel")}
      categoryOptions={categoryOptions}
      currency={currency}
      isLoading={isLoading}
      isSubmitting={createItem.isPending}
      extraNumberInputs={[
        { key: "interest_rate", label: t("onboarding.common.interestRateLabel") },
        { key: "monthly_payment", label: t("onboarding.common.monthlyPaymentLabel") },
      ]}
      items={(items ?? []).map((item) => {
        const notes: string[] = [];
        if (item.interest_rate != null) notes.push(`${item.interest_rate}%`);
        if (item.monthly_payment != null) {
          notes.push(`${t("onboarding.common.monthlyPaymentShort")} ${item.monthly_payment}`);
        }
        return {
          id: item.id,
          name: item.name,
          categoryLabel: t(`onboarding.categories.liabilities.${item.category}`),
          amount: item.value,
          currency: item.currency,
          extraNote: notes.join(" · ") || undefined,
        };
      })}
      onAdd={({ name, category, amount, extras }) =>
        createItem.mutate({
          name,
          category: category as LiabilityCategory,
          value: amount,
          currency,
          interest_rate: extras.interest_rate ?? null,
          monthly_payment: extras.monthly_payment ?? null,
        })
      }
      onDelete={(id) => deleteItem.mutate(id)}
      onBack={onBack}
      onNext={onNext}
    />
  );
}
