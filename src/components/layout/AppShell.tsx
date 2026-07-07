import type { ReactNode } from "react";

import { Logo } from "@/components/brand/Logo";
import { Disclaimer } from "@/components/layout/Disclaimer";
import { MainNav } from "@/components/layout/MainNav";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { SignOutButton } from "@/components/ui/SignOutButton";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-subtle">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-4 xl:gap-6">
            <Logo />
            <MainNav />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">{children}</main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Disclaimer />
        </div>
      </footer>
    </div>
  );
}
