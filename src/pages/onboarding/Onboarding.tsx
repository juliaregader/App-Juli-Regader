import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AssetStep } from "@/pages/onboarding/AssetStep";
import { ExpenseStep } from "@/pages/onboarding/ExpenseStep";
import { IncomeStep } from "@/pages/onboarding/IncomeStep";
import { LiabilityStep } from "@/pages/onboarding/LiabilityStep";
import { SummaryStep } from "@/pages/onboarding/SummaryStep";

const STEP_COUNT = 5;

export function Onboarding() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-content-muted">
          {t("onboarding.progress", { current: step + 1, total: STEP_COUNT })}
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
          <div
            className="h-full rounded-full bg-brand-900 transition-all"
            style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
        {step === 0 ? <IncomeStep onNext={() => setStep(1)} /> : null}
        {step === 1 ? (
          <ExpenseStep onBack={() => setStep(0)} onNext={() => setStep(2)} />
        ) : null}
        {step === 2 ? <AssetStep onBack={() => setStep(1)} onNext={() => setStep(3)} /> : null}
        {step === 3 ? (
          <LiabilityStep onBack={() => setStep(2)} onNext={() => setStep(4)} />
        ) : null}
        {step === 4 ? <SummaryStep onBack={() => setStep(3)} /> : null}
      </div>
    </div>
  );
}
