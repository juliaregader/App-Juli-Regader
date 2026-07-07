import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useProfile, useUpdateProfileContact } from "@/lib/auth/useProfile";

const gateSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
});
type GateValues = z.infer<typeof gateSchema>;

export function EmailGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();
  const updateContact = useUpdateProfileContact();

  const form = useForm<GateValues>({
    resolver: zodResolver(gateSchema),
    defaultValues: { fullName: "", email: "" },
  });

  if (isLoading) return null;

  if (profile?.email) {
    return <>{children}</>;
  }

  const handleSubmit = ({ fullName, email }: GateValues) => {
    updateContact.mutate({ email, full_name: fullName });
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 rounded-2xl border border-border bg-surface p-8 text-center shadow-soft">
      <div>
        <h3 className="font-display text-lg font-semibold text-content">{t("emailGate.title")}</h3>
        <p className="mt-1 text-sm text-content-muted">{t("emailGate.body")}</p>
      </div>
      <form className="flex flex-col gap-3 text-left" onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)}>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-content">{t("auth.fullNameLabel")}</span>
          <input
            type="text"
            autoComplete="name"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            {...form.register("fullName")}
          />
          {form.formState.errors.fullName ? (
            <span className="text-xs text-red-600">{t("auth.errors.fullNameRequired")}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-content">{t("auth.emailLabel")}</span>
          <input
            type="email"
            autoComplete="email"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <span className="text-xs text-red-600">{t("auth.errors.emailInvalid")}</span>
          ) : null}
        </label>
        <button
          type="submit"
          disabled={updateContact.isPending}
          className="mt-1 rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t("emailGate.cta")}
        </button>
      </form>
    </div>
  );
}
