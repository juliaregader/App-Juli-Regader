import { Navigate, Link } from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth";

export function AppHome() {
  const { profile } = useAuth();

  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/app/onboarding" replace />;
  }

  return (
    <section className="container-page py-10">
      <h1 className="font-display text-2xl font-bold text-brand-900">
        Hola{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p className="mt-2 max-w-lg text-content-muted">
        Tu perfil patrimonial está listo. El dashboard financiero con tus indicadores llegará en
        la próxima fase.
      </p>
      <Link to="/app/perfil" className="btn-secondary mt-4 inline-flex">
        Ir a Mi perfil
      </Link>
    </section>
  );
}
