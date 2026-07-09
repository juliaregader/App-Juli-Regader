import { Link } from "react-router-dom";

export function Reservas() {
  return (
    <section className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-brand-900">Reservas</h1>
      <p className="max-w-md text-content-muted">
        El calendario de reservas estará disponible muy pronto. Mientras tanto, contáctanos
        directamente para concretar tu sesión.
      </p>
      <Link to="/contacto" className="btn-primary">
        Ir a contacto
      </Link>
    </section>
  );
}
