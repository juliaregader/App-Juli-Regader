import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AssetsEditor } from "@/components/wealth/AssetsEditor";
import { GoalsEditor } from "@/components/wealth/GoalsEditor";
import { IncomeExpensesEditor } from "@/components/wealth/IncomeExpensesEditor";
import { LiabilitiesEditor } from "@/components/wealth/LiabilitiesEditor";
import { useUpdateProfile } from "@/features/auth/profileQueries";
import { useAuth } from "@/features/auth/useAuth";
import { useAssets, useGoals, useLiabilities } from "@/features/wealth/queries";
import { firstOfMonth } from "@/lib/dates";

export function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const updateProfile = useUpdateProfile(user?.id);
  const [step, setStep] = useState(0);
  const month = firstOfMonth();

  const stepTitles = t("onboarding.stepTitles", { returnObjects: true }) as string[];

  const { data: assets = [] } = useAssets(user?.id);
  const { data: liabilities = [] } = useLiabilities(user?.id);
  const { data: goals = [] } = useGoals(user?.id);

  const finish = async () => {
    await updateProfile.mutateAsync({ onboarding_completed: true });
    navigate("/app", { replace: true });
  };

  const skip = async () => {
    await updateProfile.mutateAsync({ onboarding_completed: true });
    navigate("/app", { replace: true });
  };

  return (
    <section className="container-page max-w-2xl py-12">
      <div className="mb-2 flex items-center justify-between text-sm text-content-muted">
        <span>{t("onboarding.stepOf", { step: step + 1, total: stepTitles.length, title: stepTitles[step] })}</span>
        <button type="button" onClick={skip} className="underline hover:text-brand-900">
          {t("onboarding.fillLater")}
        </button>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-brand-900 transition-all"
          style={{ width: `${((step + 1) / stepTitles.length) * 100}%` }}
        />
      </div>

      <div className="card mt-6">
        {step === 0 && (
          <IncomeExpensesEditor
            userId={user?.id}
            month={month}
            saveLabel={t("onboarding.saveAndContinue")}
            onSaved={() => setStep(1)}
          />
        )}
        {step === 1 && <AssetsEditor userId={user?.id} />}
        {step === 2 && <LiabilitiesEditor userId={user?.id} />}
        {step === 3 && <GoalsEditor userId={user?.id} />}
        {step === 4 && (
          <div>
            <h3 className="font-semibold text-content">
              {t("onboarding.allDoneTitle", { name: profile?.full_name || t("onboarding.welcomeFallback") })}
            </h3>
            <ul className="mt-4 space-y-1 text-sm text-content-muted">
              <li>{t("onboarding.assetsCount", { count: assets.length })}</li>
              <li>{t("onboarding.liabilitiesCount", { count: liabilities.length })}</li>
              <li>{t("onboarding.goalsCount", { count: goals.length })}</li>
            </ul>
            <p className="mt-4 text-sm text-content-muted">{t("onboarding.editLaterNote")}</p>
          </div>
        )}

        {step > 0 && (
          <div className="mt-6 flex justify-between border-t border-border pt-4">
            <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
              {t("onboarding.back")}
            </button>
            {step < stepTitles.length - 1 ? (
              <button type="button" className="btn-primary" onClick={() => setStep((s) => s + 1)}>
                {t("onboarding.next")}
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={finish} disabled={updateProfile.isPending}>
                {t("onboarding.finish")}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
