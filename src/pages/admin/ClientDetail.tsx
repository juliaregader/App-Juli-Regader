import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import {
  useAdminNotes,
  useClientNetWorth,
  useClientProfile,
  useCreateAdminNote,
  useUpdateClientPaidStatus,
} from "@/lib/admin/queries";
import { formatCurrency } from "@/lib/format/currency";

export function ClientDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: client } = useClientProfile(id);
  const { data: netWorth } = useClientNetWorth(id);
  const { data: notes } = useAdminNotes(id);
  const createNote = useCreateAdminNote();
  const updatePaidStatus = useUpdateClientPaidStatus();
  const [noteText, setNoteText] = useState("");

  if (!client) return null;

  const currency = client.base_currency ?? "EUR";

  const handleAddNote = () => {
    if (!id || !noteText.trim()) return;
    createNote.mutate({ clientId: id, note: noteText.trim() });
    setNoteText("");
  };

  const handleTogglePaid = () => {
    if (!id) return;
    updatePaidStatus.mutate({ id, hasPaid: !client.has_paid });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin" className="text-sm text-content-muted hover:text-content">
        {t("admin.client.backToList")}
      </Link>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-content">
          {client.full_name || t("admin.unnamedClient")}
        </h1>
        <p className="mt-1 text-xs text-content-muted">
          {t("admin.client.clientSince")} {new Date(client.created_at).toLocaleDateString()}
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="rounded-xl border border-brand-300 bg-brand-100/40 p-4">
            <p className="text-sm text-content-muted">{t("admin.client.netWorthLabel")}</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-content">
              {formatCurrency(netWorth?.net_worth ?? 0, currency)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface-subtle p-4">
            <p className="text-sm text-content-muted">{t("admin.client.paidLabel")}</p>
            <p className="mt-1 text-sm font-semibold text-content">
              {client.has_paid ? t("admin.client.paid") : t("admin.client.unpaid")}
            </p>
            <button
              type="button"
              onClick={handleTogglePaid}
              className="mt-2 rounded-lg bg-brand-900 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              {client.has_paid ? t("admin.client.markUnpaid") : t("admin.client.markPaid")}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="font-display text-base font-semibold text-content">
          {t("admin.client.notesTitle")}
        </h2>
        <p className="mt-1 text-xs text-content-muted">{t("admin.client.notesDescription")}</p>

        <div className="mt-4 flex gap-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            aria-label={t("admin.client.addNotePlaceholder")}
            placeholder={t("admin.client.addNotePlaceholder")}
            rows={2}
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <button
            type="button"
            onClick={handleAddNote}
            className="self-end rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-brand-100 dark:text-brand-900"
          >
            {t("admin.client.addNote")}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {!notes || notes.length === 0 ? (
            <p className="text-sm text-content-muted">{t("admin.client.noNotes")}</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="rounded-lg border border-border bg-surface-subtle p-3">
                <p className="text-sm text-content">{note.note}</p>
                <p className="mt-1 text-xs text-content-muted">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
