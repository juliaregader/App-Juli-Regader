import { Settings2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DASHBOARD_CARD_IDS, useDashboardPreferences } from "@/lib/dashboard/preferences";

export function CustomizePanel() {
  const { t } = useTranslation();
  const { isVisible, toggleCard } = useDashboardPreferences();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-content-muted transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-expanded={open}
      >
        <Settings2 className="size-4" aria-hidden="true" />
        {t("dashboard.customize.button")}
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-border bg-surface p-3 shadow-soft">
          <p className="px-1 pb-2 text-xs font-medium uppercase tracking-wide text-content-muted">
            {t("dashboard.customize.title")}
          </p>
          <ul className="flex flex-col gap-1">
            {DASHBOARD_CARD_IDS.map((cardId) => (
              <li key={cardId}>
                <label className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-content hover:bg-surface-subtle">
                  <input
                    type="checkbox"
                    checked={isVisible(cardId)}
                    onChange={() => toggleCard.mutate(cardId)}
                    className="size-4 rounded border-border accent-brand-900"
                  />
                  {t(`dashboard.customize.cards.${cardId}`)}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
