import { Compass, PiggyBank, ShieldCheck, Target, TrendingDown } from "lucide-react";

const points = [
  {
    icon: Compass,
    title: "Claridad",
    description: "Una foto clara de tu situación financiera real: qué tienes, qué debes y cuánto ahorras.",
  },
  {
    icon: PiggyBank,
    title: "Control del ahorro",
    description: "Entiende a dónde va tu dinero cada mes y toma decisiones sobre tu tasa de ahorro.",
  },
  {
    icon: TrendingDown,
    title: "Reducir el endeudamiento",
    description: "Identifica tu ratio de endeudamiento y prioriza qué deudas amortizar antes.",
  },
  {
    icon: ShieldCheck,
    title: "Decisiones informadas",
    description: "Indicadores claros para decidir con datos, no con intuición o presión externa.",
  },
  {
    icon: Target,
    title: "Planificar objetivos",
    description: "Define metas concretas (fondo de emergencia, vivienda, jubilación) y sigue tu progreso.",
  },
];

export function WhyOrganize() {
  return (
    <section className="container-page py-16 sm:py-20">
      <h2 className="text-center font-display text-2xl font-bold text-brand-900 sm:text-3xl">
        Por qué organizar tu patrimonio
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {points.map(({ icon: Icon, title, description }) => (
          <div key={title} className="card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="mt-4 font-semibold text-content">{title}</h3>
            <p className="mt-1.5 text-sm text-content-muted">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
