import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { appUrl } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Introduce un email válido"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPassword() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${appUrl}/restablecer-contrasena`,
    });

    if (error) {
      setServerError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="card w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-brand-900">{t("auth.forgotPassword.title")}</h1>

        {sent ? (
          <p className="mt-4 text-content-muted">{t("auth.forgotPassword.sent")}</p>
        ) : (
          <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="label" htmlFor="email">
                {t("auth.forgotPassword.email")}
              </label>
              <input id="email" type="email" className="input" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-content-muted">
          <Link to="/login" className="font-medium text-brand-900 underline">
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </p>
      </div>
    </section>
  );
}
