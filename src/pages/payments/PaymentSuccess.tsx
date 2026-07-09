import { Link } from "react-router-dom";

export function PaymentSuccess() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-brand-900">Pago completado</h1>
      <p className="max-w-md text-content-muted">
        Gracias por tu compra. En unos segundos recibirás la confirmación por email. Si tienes
        cuenta, ya puedes acceder a tu área privada.
      </p>
      <div className="flex gap-3">
        <Link to="/app" className="btn-primary">
          Ir a mi área
        </Link>
        <Link to="/" className="btn-secondary">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
