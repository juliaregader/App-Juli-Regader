import { Link } from "react-router-dom";

export function PaymentCancelled() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-brand-900">Pago cancelado</h1>
      <p className="max-w-md text-content-muted">
        No se ha completado el pago. Puedes volver a intentarlo cuando quieras desde la página de
        servicios.
      </p>
      <div className="flex gap-3">
        <Link to="/servicios" className="btn-primary">
          Volver a servicios
        </Link>
      </div>
    </section>
  );
}
