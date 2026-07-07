import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-subtle">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">{children}</main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <Disclaimer />
        </div>
      </footer>
    </div>
  );
}
