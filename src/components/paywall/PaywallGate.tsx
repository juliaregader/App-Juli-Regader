import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useProfile } from "@/lib/auth/useProfile";

export function PaywallGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();

  const locked = Boolean(profile) && profile?.role !== "admin" && !profile?.has_paid;

  if (!locked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none select-none blur-sm opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="mx-auto max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
          <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-brand-900 text-white">
            <Lock className="size-5" aria-hidden="true" />
          </span>
          <h2 className="mt-3 font-display text-lg font-semibold text-content">
            {t("paywall.title")}
          </h2>
          <p className="mt-1 text-sm text-content-muted">{t("paywall.body")}</p>
          <Link
            to="/book"
            className="mt-4 inline-block w-full rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t("paywall.cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
