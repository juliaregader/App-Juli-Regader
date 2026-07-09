import { CalendarCheck, LineChart, Compass as CompassIcon, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "1. Reunión inicial",
    description:
      "Hablamos de tu situación, tus objetivos y cómo puede ayudarte JuliusCapital. Sin compromiso.",
  },
  {
    icon: LineChart,
    title: "2. Dashboard financiero en la app",
    description:
      "Cargamos tus ingresos, gastos, activos y pasivos: obtienes un panel claro con tus indicadores clave.",
  },
  {
    icon: CompassIcon,
    title: "3. Te explico a través de dónde puedes invertir",
    description:
      "Repasamos juntos las opciones y herramientas para que definas tu propia estrategia de inversión.",
  },
  {
    icon: RefreshCw,
    title: "4. Seguimiento mensual",
    description:
      "Actualizas tu registro cada mes y ves la evolución real de tu patrimonio a lo largo del tiempo.",
  },
];

export function Method() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <h2 className="text-center font-display text-2xl font-bold text-brand-900 sm:text-3xl">
          El método JuliusCapital
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, description }) => (
            <div key={title} className="card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-white">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-content">{title}</h3>
              <p className="mt-1.5 text-sm text-content-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
