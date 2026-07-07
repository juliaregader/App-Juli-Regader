import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { supabase } from "@/lib/supabase/client";

const emailStepSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
});
type EmailStepValues = z.infer<typeof emailStepSchema>;

const codeStepSchema = z.object({
  token: z.string().length(6),
});
type CodeStepValues = z.infer<typeof codeStepSchema>;

export function SignIn() {
  const { t } = useTranslation();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailForm = useForm<EmailStepValues>({
    resolver: zodResolver(emailStepSchema),
    defaultValues: { fullName: "", email: "" },
  });

  const codeForm = useForm<CodeStepValues>({
    resolver: zodResolver(codeStepSchema),
    defaultValues: { token: "" },
  });

  const requestCode = async ({ fullName, email }: EmailStepValues) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, data: { full_name: fullName } },
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    setPendingEmail(email);
  };

  const verifyCode = async ({ token }: CodeStepValues) => {
    if (!pendingEmail) return;
    setServerError(null);
    const { error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token,
      type: "email",
    });
    if (error) {
      setServerError(error.message);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 rounded-2xl border border-border bg-surface p-8 shadow-soft">
      <div>
        <h1 className="font-display text-xl font-semibold text-content">
          {t("auth.title")}
        </h1>
        <p className="mt-1 text-sm text-content-muted">{t("auth.subtitle")}</p>
      </div>

      {!pendingEmail ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => void emailForm.handleSubmit(requestCode)(e)}
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-content">{t("auth.fullNameLabel")}</span>
            <input
              type="text"
              autoComplete="name"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              {...emailForm.register("fullName")}
            />
            {emailForm.formState.errors.fullName ? (
              <span className="text-xs text-red-600">{t("auth.errors.fullNameRequired")}</span>
            ) : null}
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-content">{t("auth.emailLabel")}</span>
            <input
              type="email"
              autoComplete="email"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              {...emailForm.register("email")}
            />
            {emailForm.formState.errors.email ? (
              <span className="text-xs text-red-600">{t("auth.errors.emailInvalid")}</span>
            ) : null}
          </label>

          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

          <button
            type="submit"
            disabled={emailForm.formState.isSubmitting}
            className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-brand-100 dark:text-brand-900"
          >
            {t("auth.sendCode")}
          </button>
        </form>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => void codeForm.handleSubmit(verifyCode)(e)}
        >
          <p className="text-sm text-content-muted">
            {t("auth.codeSentTo", { email: pendingEmail })}
          </p>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-content">{t("auth.codeLabel")}</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              className="rounded-lg border border-border bg-surface px-3 py-2 text-center text-lg tracking-[0.5em] text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              {...codeForm.register("token")}
            />
            {codeForm.formState.errors.token ? (
              <span className="text-xs text-red-600">{t("auth.errors.codeLength")}</span>
            ) : null}
          </label>

          {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

          <button
            type="submit"
            disabled={codeForm.formState.isSubmitting}
            className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-brand-100 dark:text-brand-900"
          >
            {t("auth.verifyCode")}
          </button>

          <button
            type="button"
            onClick={() => setPendingEmail(null)}
            className="text-sm text-content-muted underline-offset-2 hover:underline"
          >
            {t("auth.useAnotherEmail")}
          </button>
        </form>
      )}
    </div>
  );
}
