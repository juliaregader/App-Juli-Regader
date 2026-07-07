import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  useAppointments,
  useClientProfiles,
  useCreateAppointment,
  useDeleteAppointment,
  useUpdateAppointment,
} from "@/lib/admin/queries";
import type { AppointmentStatus } from "@/lib/admin/types";

const STATUSES: AppointmentStatus[] = ["requested", "confirmed", "completed", "cancelled"];
const HOURLY_RATE = 80;

export function Appointments() {
  const { t } = useTranslation();
  const { data: clients } = useClientProfiles();
  const { data: appointments, isLoading } = useAppointments();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const approvedClients = (clients ?? []).filter((c) => c.status === "approved");
  const [clientId, setClientId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [duration, setDuration] = useState("60");

  const clientName = (id: string) =>
    approvedClients.find((c) => c.id === id)?.full_name || t("admin.unnamedClient");

  const handleAdd = () => {
    if (!clientId || !startsAt) return;
    const durationMinutes = Number(duration) || 60;
    createAppointment.mutate({
      client_id: clientId,
      starts_at: new Date(startsAt).toISOString(),
      duration_minutes: durationMinutes,
      status: "requested",
      amount: (HOURLY_RATE * durationMinutes) / 60,
      notes: null,
    });
    setStartsAt("");
  };

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin" className="text-sm text-content-muted hover:text-content">
        {t("admin.client.backToList")}
      </Link>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-content">
          {t("admin.appointments.title")}
        </h1>
        <p className="mt-1 text-sm text-content-muted">{t("admin.appointments.description")}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <select
            aria-label={t("admin.appointments.form.client")}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="">{t("admin.appointments.form.client")}</option>
            {approvedClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.full_name || t("admin.unnamedClient")}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            aria-label={t("admin.appointments.form.date")}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <input
            type="number"
            min={15}
            step={15}
            aria-label={t("admin.appointments.form.duration")}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-brand-100 dark:text-brand-900"
          >
            {t("admin.appointments.add")}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        {isLoading ? null : !appointments || appointments.length === 0 ? (
          <p className="text-sm text-content-muted">{t("admin.appointments.noAppointments")}</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-content">
                  {clientName(appointment.client_id)}
                </p>
                <p className="text-xs text-content-muted">
                  {new Date(appointment.starts_at).toLocaleString()} ·{" "}
                  {appointment.duration_minutes} min · {appointment.amount} €
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label={t("admin.appointments.form.status")}
                  value={appointment.status}
                  onChange={(e) =>
                    updateAppointment.mutate({
                      id: appointment.id,
                      patch: { status: e.target.value as AppointmentStatus },
                    })
                  }
                  className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {t(`admin.appointments.status.${status}`)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => deleteAppointment.mutate(appointment.id)}
                  className="text-content-muted hover:text-red-600"
                  aria-label={t("onboarding.common.remove")}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
