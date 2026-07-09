import { LineChart, ListChecks, PiggyBank, Target } from "lucide-react";
import { Link } from "react-router-dom";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const items = [
  {
    icon: LineChart,
    title: "Dashboard financiero",
    description: "Tu patrimonio neto, ahorro, endeudamiento y liquidez, siempre a la vista.",
  },
  {
    icon: ListChecks,
    title: "Indicadores claros",
    description: "Cada indicador con su fórmula, su explicación y un semáforo de riesgo fácil de leer.",
  },
  {
    icon: PiggyBank,
    title: "Seguimiento mensual",
    description: "Actualiza tu registro cada mes y observa la evolución real de tu patrimonio.",
  },
  {
    icon: Target,
    title: "Estrategia de inversión propia",
    description: "Define y sigue tu propia estrategia: activos, % objetivo y aportación mensual.",
  },
];

export function ConsultaPatrimonial() {
  useDocumentTitle("Consulta patrimonial");

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">
          Consulta patrimonial
        </h1>
        <p className="mt-3 text-content-muted">
          Al crear tu perfil en JuliusCapital, tu área privada te da acceso a:
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, description }) => (
          <div key={title} className="card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="mt-4 font-semibold text-content">{title}</h2>
            <p className="mt-1.5 text-sm text-content-muted">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 text-center">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/registro" className="btn-primary">
            Crea tu perfil patrimonial
          </Link>
          <Link to="/login" className="btn-secondary">
            Ya tengo cuenta, acceder
          </Link>
        </div>
        <p className="max-w-md text-xs text-content-muted">
          JuliusCapital es una herramienta de organización patrimonial con fines educativos e
          informativos. No constituye asesoramiento financiero, fiscal ni de inversión
          personalizado.
        </p>
      </div>
    </section>
  );
}
