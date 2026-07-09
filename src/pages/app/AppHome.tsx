import { useAuth } from "@/features/auth/useAuth";

export function AppHome() {
  const { profile } = useAuth();

  return (
    <section className="container-page py-10">
      <h1 className="font-display text-2xl font-bold text-brand-900">
        Hola{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p className="mt-2 max-w-lg text-content-muted">
        Tu cuenta está activa ({profile?.email}, rol {profile?.role}). El onboarding patrimonial y
        el dashboard financiero llegarán en las próximas fases.
      </p>
    </section>
  );
}
