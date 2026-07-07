import { Hourglass, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { supabase } from "@/lib/supabase/client";

export function PendingApproval() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const isRejected = profile?.status === "rejected";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center shadow-soft">
      {isRejected ? (
        <XCircle className="size-8 text-red-500" aria-hidden="true" />
      ) : (
        <Hourglass className="size-8 text-brand-500" aria-hidden="true" />
      )}
      <h1 className="font-display text-xl font-semibold text-content">
        {isRejected ? t("auth.rejected.title") : t("auth.pending.title")}
      </h1>
      <p className="text-sm text-content-muted">
        {isRejected ? t("auth.rejected.body") : t("auth.pending.body")}
      </p>
      <button
        type="button"
        onClick={() => void supabase.auth.signOut()}
        className="mt-2 text-sm font-medium text-brand-500 hover:underline"
      >
        {t("auth.signOut")}
      </button>
    </div>
  );
}
