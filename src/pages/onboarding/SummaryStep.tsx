import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCompleteOnboarding, useProfile } from "@/lib/auth/useProfile";
import { formatCurrency } from "@/lib/format/currency";
import { useLatestNetWorth } from "@/lib/wealth/queries";

const ANIMATION_MS = 900;

export function SummaryStep({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const { data: snapshot, isLoading } = useLatestNetWorth();
  const completeOnboarding = useCompleteOnboarding();

  const netWorth = snapshot?.net_worth ?? 0;
  const currency = profile?.base_currency ?? "EUR";
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / ANIMATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(netWorth * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [netWorth, isLoading]);

  const handleFinish = async () => {
    await completeOnboarding.mutateAsync();
    document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <h2 className="font-display text-xl font-semibold text-content">
          {t("onboarding.steps.summary.title")}
        </h2>
        <p className="mt-1 text-sm text-content-muted">
          {t("onboarding.steps.summary.description")}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface-subtle px-10 py-8">
        <p className="text-sm font-medium uppercase tracking-wide text-content-muted">
          {t("onboarding.steps.summary.netWorthLabel")}
        </p>
        <p className="mt-2 font-display text-4xl font-bold tabular-nums text-content">
          {isLoading ? "…" : formatCurrency(displayValue, currency)}
        </p>
      </div>

      <div className="flex w-full items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-content-muted hover:text-content"
        >
          {t("onboarding.common.back")}
        </button>
        <button
          type="button"
          onClick={() => void handleFinish()}
          disabled={completeOnboarding.isPending}
          className="rounded-lg bg-brand-900 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("onboarding.common.finish")}
        </button>
      </div>
    </div>
  );
}
