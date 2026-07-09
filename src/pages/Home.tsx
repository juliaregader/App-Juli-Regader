import { Link } from "react-router-dom";

import { LogoMark } from "@/components/brand/LogoMark";

export function Home() {
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <LogoMark className="h-16 w-16 text-brand-900" />
      <h1 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">
        JuliusCapital
      </h1>
      <p className="max-w-xl text-lg text-content-muted">
        Organización financiera para tomar mejores decisiones.
      </p>
      <Link to="/status" className="text-sm font-medium text-brand-500 hover:underline">
        Ver estado del sistema →
      </Link>
    </section>
  );
}
