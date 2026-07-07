import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAppointments, useClientProfiles, useUpdateClientStatus } from "@/lib/admin/queries";

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const colors: Record<string, string> = {
    approved: "bg-brand-100 text-brand-900 dark:bg-brand-900 dark:text-brand-100",
    pending: "bg-surface-subtle text-content-muted",
    rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? ""}`}>
      {t(`admin.status.${status}`)}
    </span>
  );
}

export function AdminHome() {
  const { t } = useTranslation();
  const { data: clients, isLoading } = useClientProfiles();
  const { data: appointments } = useAppointments();
  const updateStatus = useUpdateClientStatus();
  const [search, setSearch] = useState("");

  const filtered = (clients ?? []).filter((c) =>
    (c.full_name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const metrics = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeClients = (clients ?? []).filter((c) => c.status === "approved").length;
    const pending = (clients ?? []).filter((c) => c.status === "pending").length;
    const recentSignups = (clients ?? []).filter((c) => new Date(c.created_at) >= weekAgo).length;

    const monthAppointments = (appointments ?? []).filter(
      (a) => new Date(a.starts_at) >= monthStart && a.status !== "cancelled",
    );
    const estimatedIncome = monthAppointments
      .filter((a) => a.status === "confirmed" || a.status === "completed")
      .reduce((sum, a) => sum + a.amount, 0);

    return {
      activeClients,
      pending,
      recentSignups,
      sessionsThisMonth: monthAppointments.length,
      estimatedIncome,
    };
  }, [clients, appointments]);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-content">
          {t("admin.homeTitle")}
        </h1>
        <p className="mt-1 text-sm text-content-muted">{t("admin.homeBody")}</p>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: t("admin.metrics.activeClients"), value: metrics.activeClients },
          { label: t("admin.metrics.pending"), value: metrics.pending },
          { label: t("admin.metrics.sessionsThisMonth"), value: metrics.sessionsThisMonth },
          {
            label: t("admin.metrics.estimatedIncome"),
            value: `${metrics.estimatedIncome.toFixed(0)} €`,
          },
          { label: t("admin.metrics.recentSignups"), value: metrics.recentSignups },
        ].map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <p className="text-xs text-content-muted">{metric.label}</p>
            <p className="mt-1 font-display text-xl font-bold text-content">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold text-content">
            {t("admin.clientsTitle")}
          </h2>
          <Link
            to="/admin/appointments"
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-content-muted hover:text-content"
          >
            {t("admin.appointmentsLink")}
          </Link>
        </div>

        <input
          type="search"
          placeholder={t("admin.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 w-full max-w-sm rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        />

        <div className="mt-4 flex flex-col gap-2">
          {isLoading ? null : filtered.length === 0 ? (
            <p className="text-sm text-content-muted">{t("admin.noClients")}</p>
          ) : (
            filtered.map((client) => (
              <div
                key={client.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Link
                    to={`/admin/clients/${client.id}`}
                    className="text-sm font-medium text-content hover:underline"
                  >
                    {client.full_name || t("admin.unnamedClient")}
                  </Link>
                  <StatusBadge status={client.status} />
                </div>
                {client.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus.mutate({ id: client.id, status: "approved" })}
                      className="rounded-lg bg-brand-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 dark:bg-brand-100 dark:text-brand-900"
                    >
                      {t("admin.approve")}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus.mutate({ id: client.id, status: "rejected" })}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-content-muted hover:text-content"
                    >
                      {t("admin.reject")}
                    </button>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
