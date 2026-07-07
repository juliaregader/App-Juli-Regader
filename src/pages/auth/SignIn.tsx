import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { supabase } from "@/lib/supabase/client";

const emailStepSchema = z.object({
  email: z.string().email(),
});
type EmailStepValues = z.infer<typeof emailStepSchema>;

export function SignIn() {
  const { t } = useTranslation();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailForm = useForm<EmailStepValues>({
    resolver: zodResolver(emailStepSchema),
    defaultValues: { email: "" },
  });

  const sendMagicLink = async ({ email }: EmailStepValues) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    setSentTo(email);
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 rounded-2xl border border-border bg-surface p-8 shadow-soft">
      <div>
        <h1 className="font-display text-xl font-semibold text-content">
          {t("auth.title")}
        </h1>
        <p className="mt-1 text-sm text-content-muted">{t("auth.subtitle")}</p>
      </div>

      {!sentTo ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => void emailForm.handleSubmit(sendMagicLink)(e)}
        >
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
            className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {t("auth.sendLink")}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-3 text-center">
          <Mail className="size-8 text-brand-500" aria-hidden="true" />
          <p className="text-sm text-content-muted">
            {t("auth.linkSentTo", { email: sentTo })}
          </p>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="text-sm text-content-muted underline-offset-2 hover:underline"
          >
            {t("auth.useAnotherEmail")}
          </button>
        </div>
      )}
    </div>
  );
}
