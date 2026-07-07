import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useProfile } from "@/lib/auth/useProfile";
import { useAdminProfile, useMyAppointments, useRequestAppointment } from "@/lib/booking/queries";

export function Book() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const { data: admin } = useAdminProfile();
  const { data: appointments } = useMyAppointments();
  const requestAppointment = useRequestAppointment();

  const [startsAt, setStartsAt] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!startsAt || !admin) return;
    requestAppointment.mutate(
      { startsAt: new Date(startsAt).toISOString(), notes: notes.trim() || null, adminId: admin.id },
      {
        onSuccess: () => {
          setStartsAt("");
          setNotes("");
          setSubmitted(true);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-content">{t("booking.title")}</h1>
        <p className="mt-1 text-sm text-content-muted">{t("booking.subtitle")}</p>

        {profile?.has_paid ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-300 bg-brand-100/40 p-4">
            <CheckCircle2 className="size-5 shrink-0 text-brand-500" aria-hidden="true" />
            <div>
              <p className="text-sm text-content">{t("booking.paidBanner")}</p>
              <Link to="/dashboard" className="mt-1 inline-block text-sm font-medium text-brand-500 hover:underline">
                {t("booking.goToDashboard")}
              </Link>
            </div>
          </div>
        ) : null}

        {submitted ? (
          <p className="mt-4 rounded-xl border border-brand-300 bg-brand-100/40 p-4 text-sm text-content">
            {t("booking.success")}
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3 sm:max-w-sm">
            <label className="text-sm font-medium text-content" htmlFor="booking-date">
              {t("booking.form.date")}
            </label>
            <input
              id="booking-date"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
            <label className="text-sm font-medium text-content" htmlFor="booking-notes">
              {t("booking.form.notes")}
            </label>
            <textarea
              id="booking-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!startsAt || !admin || requestAppointment.isPending}
              className="rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {t("booking.form.submit")}
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-content">{t("booking.yourRequests")}</h2>
        <div className="mt-4 flex flex-col gap-2">
          {!appointments || appointments.length === 0 ? (
            <p className="text-sm text-content-muted">{t("booking.noRequests")}</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-subtle px-4 py-3"
              >
                <p className="text-sm text-content">{new Date(appointment.starts_at).toLocaleString()}</p>
                <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-900">
                  {t(`admin.appointments.status.${appointment.status}`)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
