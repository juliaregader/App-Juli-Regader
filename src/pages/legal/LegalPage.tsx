import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  children: ReactNode;
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <section className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-bold text-brand-900">{title}</h1>
      <div className="prose prose-sm mt-6 max-w-none space-y-4 text-content-muted">{children}</div>
    </section>
  );
}
