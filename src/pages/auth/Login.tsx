import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { supabase } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

type FormValues = z.infer<typeof schema>;

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/app";
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setServerError(
        error.message === "Email not confirmed" ? t("auth.login.notConfirmed") : t("auth.login.invalidCredentials"),
      );
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-brand-900">{t("auth.login.title")}</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="email">
              {t("auth.login.email")}
            </label>
            <input id="email" type="email" className="input" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">
              {t("auth.login.password")}
            </label>
            <input id="password" type="password" className="input" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <Link to="/recuperar-contrasena" className="text-xs font-medium text-brand-500 hover:underline">
              {t("auth.login.forgotPassword")}
            </Link>
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-content-muted">
          {t("auth.login.noAccount")}{" "}
          <Link to="/registro" className="font-medium text-brand-900 underline">
            {t("auth.login.goToRegister")}
          </Link>
        </p>
      </div>
    </section>
  );
}
