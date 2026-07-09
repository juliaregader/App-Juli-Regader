import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { supabase } from "@/lib/supabase/client";

const schema = z
  .object({
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPassword() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      setServerError(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => navigate("/app", { replace: true }), 1500);
  };

  return (
    <section className="container-page flex min-h-[60vh] items-center justify-center py-16">
      <div className="card w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-brand-900">Nueva contraseña</h1>

        {done ? (
          <p className="mt-4 text-content-muted">Contraseña actualizada. Redirigiendo…</p>
        ) : (
          <form className="mt-6 space-y-4 text-left" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="label" htmlFor="password">
                Nueva contraseña
              </label>
              <input id="password" type="password" className="input" {...register("password")} />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
