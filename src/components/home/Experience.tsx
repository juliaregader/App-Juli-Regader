import { GraduationCap, LineChart, Wallet } from "lucide-react";

/**
 * Texto de marcador editable — sustituir por la biografía definitiva de
 * Julià Regader antes de publicar.
 */
const bio =
  "Julià Regader combina la docencia universitaria con la educación financiera práctica. " +
  "Como profesor universitario de organización y operaciones, y como inversor personal desde " +
  "hace años, ayuda a personas y familias a poner en orden su patrimonio y a entender sus " +
  "propias decisiones financieras, con un enfoque didáctico y sin tecnicismos innecesarios.";

const highlights = [
  { icon: GraduationCap, label: "Profesor universitario de organización y operaciones" },
  { icon: Wallet, label: "Educador financiero" },
  { icon: LineChart, label: "Inversor personal" },
];

export function Experience() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
          Experiencia profesional
        </h2>
        <p className="mt-5 text-content-muted">{bio}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {highlights.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-content"
            >
              <Icon className="h-4 w-4 text-brand-500" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
