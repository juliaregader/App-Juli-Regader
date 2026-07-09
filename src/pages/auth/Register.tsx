import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { appUrl } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";

const schema = z
  .object({
    fullName: z.string().min(2, "Introduce tu nombre completo"),
    email: z.string().email("Introduce un email válido"),
    phone: z.string().optional(),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Debes aceptar la política de privacidad y los términos" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function Register() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, phone: values.phone || null },
        emailRedirectTo: `${appUrl}/login`,
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-900">Revisa tu correo</h1>
        <p className="max-w-md text-content-muted">
          Te hemos enviado un enlace de confirmación. Ábrelo para activar tu cuenta y poder
          acceder.
        </p>
        <Link to="/login" className="btn-secondary">
          Ir a acceder
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-brand-900">Crea tu perfil patrimonial</h1>
        <p className="mt-1 text-sm text-content-muted">
          En unos minutos tendrás acceso a tu área privada en JuliusCapital.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="fullName">
              Nombre completo
            </label>
            <input id="fullName" className="input" {...register("fullName")} />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" className="input" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="phone">
              Teléfono (opcional)
            </label>
            <input id="phone" type="tel" className="input" {...register("phone")} />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Contraseña
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

          <div className="flex items-start gap-2">
            <input id="consent" type="checkbox" className="mt-1" {...register("consent")} />
            <label htmlFor="consent" className="text-xs text-content-muted">
              Acepto la{" "}
              <Link to="/legal/privacidad" className="underline">
                política de privacidad
              </Link>{" "}
              y los{" "}
              <Link to="/legal/terminos" className="underline">
                términos de uso
              </Link>
              .
            </label>
          </div>
          {errors.consent && <p className="text-xs text-red-600">{errors.consent.message}</p>}

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta…" : "Crear mi perfil"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-content-muted">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-brand-900 underline">
            Accede
          </Link>
        </p>
      </div>
    </section>
  );
}
