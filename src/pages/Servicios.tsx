import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const planIncludes = [
  "Reunión inicial para entender tu situación y tus objetivos",
  "Configuración completa de tu dashboard financiero (ingresos, gastos, activos, pasivos)",
  "Cálculo de tus indicadores clave: patrimonio neto, ahorro, endeudamiento, liquidez",
  "Sesión para repasar opciones y herramientas de inversión y definir tu propia estrategia",
  "Acceso a tu área privada: registro mensual y evolución de tu patrimonio",
];

const sessionIncludes = [
  "Sesión de 1 hora, en persona o por videollamada",
  "Resolución de dudas concretas sobre tu situación financiera",
  "Ideal si ya usas la app y quieres revisar tu progreso o un tema puntual",
];

const faqs = [
  {
    q: "¿Necesito el plan de 329 € para reservar una sesión suelta?",
    a: "No, la sesión individual de 80 € es independiente y puedes reservarla sin haber contratado el plan.",
  },
  {
    q: "¿JuliusCapital me dice en qué invertir?",
    a: "No. JuliusCapital es una herramienta de organización y educación patrimonial. En las sesiones repasamos opciones y herramientas para que definas tu propia estrategia; la decisión de inversión es siempre tuya.",
  },
  {
    q: "¿Puedo pagar la sesión de 80 € más adelante?",
    a: "Sí: puedes reservar día y hora sin pagar por adelantado, y abonar la sesión después (o en el momento, si lo prefieres).",
  },
];

export function Servicios() {
  useDocumentTitle("Servicios");

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">Servicios</h1>
        <p className="mt-3 text-content-muted">
          Elige cómo quieres empezar a organizar tu patrimonio con JuliusCapital.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="card relative overflow-hidden border-2 border-brand-900 lg:col-span-3">
          <span className="absolute right-6 top-6 rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-950">
            Recomendado
          </span>
          <h2 className="font-display text-xl font-bold text-brand-900">
            Plan de organización patrimonial
          </h2>
          <p className="mt-1 text-sm text-content-muted">
            Para quien quiere poner en orden todo su patrimonio y tener un dashboard vivo.
          </p>
          <p className="mt-6 font-display text-4xl font-bold text-brand-900">
            329 € <span className="text-base font-normal text-content-muted">pago único</span>
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {planIncludes.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <span className="text-content">{item}</span>
              </li>
            ))}
          </ul>

          <Link to="/registro?plan=329" className="btn-primary mt-8 w-full sm:w-auto">
            Comprar el plan
          </Link>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-brand-900">Sesión individual</h2>
          <p className="mt-1 text-sm text-content-muted">
            Para una consulta puntual, sin necesidad de contratar el plan completo.
          </p>
          <p className="mt-6 font-display text-4xl font-bold text-brand-900">
            80 € <span className="text-base font-normal text-content-muted">/ 1 hora</span>
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {sessionIncludes.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <span className="text-content">{item}</span>
              </li>
            ))}
          </ul>

          <Link to="/reservas?servicio=sesion_80" className="btn-secondary mt-8 w-full">
            Reservar sesión
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="font-display text-2xl font-bold text-brand-900">Preguntas frecuentes</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-semibold text-content">{q}</dt>
              <dd className="mt-1 text-sm text-content-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
