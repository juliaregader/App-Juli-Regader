import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTheme, type Theme } from "@/lib/theme/ThemeProvider";

const OPTIONS: { value: Theme; icon: typeof Sun; labelKey: string }[] = [
  { value: "light", icon: Sun, labelKey: "common.themeLight" },
  { value: "dark", icon: Moon, labelKey: "common.themeDark" },
  { value: "system", icon: Monitor, labelKey: "common.themeSystem" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      role="radiogroup"
      aria-label={t("common.theme")}
      className="flex items-center gap-0.5 rounded-lg border border-border bg-surface p-0.5"
    >
      {OPTIONS.map(({ value, icon: Icon, labelKey }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            title={t(labelKey)}
            onClick={() => setTheme(value)}
            className={`rounded-md p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              active
                ? "bg-brand-900 text-white dark:bg-brand-100 dark:text-brand-900"
                : "text-content-muted hover:text-content"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span className="sr-only">{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
