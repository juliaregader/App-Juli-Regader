import { useTranslation } from "react-i18next";

import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function Reservas() {
  const { t } = useTranslation();
  useDocumentTitle(t("reservations.title"));

  return (
    <section className="container-page max-w-2xl py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900">{t("reservations.title")}</h1>
        <p className="mt-2 text-content-muted">{t("reservations.subtitle")}</p>
      </div>

      <div className="mt-10">
        <BookingCalendar />
      </div>
    </section>
  );
}
