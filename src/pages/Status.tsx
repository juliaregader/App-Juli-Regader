import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

type PingState = "idle" | "checking" | "ok" | "error";

export function Status() {
  const { t } = useTranslation();
  const [ping, setPing] = useState<PingState>("idle");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    setPing("checking");
    supabase.auth
      .getSession()
      .then(() => setPing("ok"))
      .catch(() => setPing("error"));
  }, []);

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-brand-900">{t("status.title")}</h1>

      <div className="card w-full max-w-md text-left">
        <dl className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-content-muted">VITE_SUPABASE_URL / ANON_KEY</dt>
            <dd className={isSupabaseConfigured ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
              {isSupabaseConfigured ? t("status.ok") : "❌"}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-content-muted">Cliente Supabase</dt>
            <dd className="font-semibold">
              {ping === "idle" && "—"}
              {ping === "checking" && t("common.loading")}
              {ping === "ok" && <span className="text-emerald-600">{t("status.ok")}</span>}
              {ping === "error" && <span className="text-red-600">Error</span>}
            </dd>
          </div>
        </dl>
      </div>

      {!isSupabaseConfigured ? (
        <p className="max-w-md text-sm text-red-600">{t("status.supabaseMissing")}</p>
      ) : (
        <p className="max-w-md text-sm text-content-muted">{t("status.supabaseConfigured")}</p>
      )}
    </section>
  );
}
