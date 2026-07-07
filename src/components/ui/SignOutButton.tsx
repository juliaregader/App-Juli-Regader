import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";

export function SignOutButton() {
  const { session } = useAuth();
  const { t } = useTranslation();

  if (!session) return null;

  return (
    <button
      type="button"
      onClick={() => void supabase.auth.signOut()}
      title={t("auth.signOut")}
      className="rounded-lg border border-border bg-surface p-2 text-content-muted transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <LogOut className="size-4" aria-hidden="true" />
      <span className="sr-only">{t("auth.signOut")}</span>
    </button>
  );
}
