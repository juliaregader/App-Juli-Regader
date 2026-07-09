import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AssetsEditor } from "@/components/wealth/AssetsEditor";
import { GoalsEditor } from "@/components/wealth/GoalsEditor";
import { IncomeExpensesEditor } from "@/components/wealth/IncomeExpensesEditor";
import { LiabilitiesEditor } from "@/components/wealth/LiabilitiesEditor";
import { useToast } from "@/components/ui/useToast";
import { useUpdateProfile } from "@/features/auth/profileQueries";
import { useAuth } from "@/features/auth/useAuth";
import { useDeleteAccount, useExportMyData } from "@/features/privacy/queries";
import { firstOfMonth } from "@/lib/dates";

const currencies = ["EUR", "USD", "GBP", "CHF"];
const languages: { value: "es" | "ca" | "en"; label: string }[] = [
  { value: "es", label: "Castellano" },
  { value: "ca", label: "Català" },
  { value: "en", label: "English" },
];

export function Perfil() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, profile, signOut } = useAuth();
  const updateProfile = useUpdateProfile(user?.id);
  const exportData = useExportMyData(user?.id);
  const deleteAccount = useDeleteAccount();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const month = firstOfMonth();

  const handleSavePersonalInfo = async () => {
    try {
      await updateProfile.mutateAsync({ full_name: fullName, phone });
      showToast(t("profile.saved"));
    } catch {
      showToast(t("profile.saveError"), "error");
    }
  };

  const handleExport = async () => {
    try {
      await exportData.mutateAsync();
      showToast(t("profile.exported"));
    } catch {
      showToast(t("profile.exportError"), "error");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount.mutateAsync();
      await signOut();
      navigate("/", { replace: true });
    } catch {
      showToast(t("profile.deleteError"), "error");
    }
  };

  return (
    <section className="container-page max-w-3xl space-y-10 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">{t("profile.title")}</h1>
        <p className="mt-1 text-content-muted">{t("profile.subtitle")}</p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-content">{t("profile.personalDataTitle")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="full_name">
              {t("profile.fullName")}
            </label>
            <input id="full_name" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              {t("profile.phone")}
            </label>
            <input id="phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="language">
              {t("profile.language")}
            </label>
            <select
              id="language"
              className="input"
              defaultValue={profile?.language}
              onChange={(e) => updateProfile.mutate({ language: e.target.value as "es" | "ca" | "en" })}
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="currency">
              {t("profile.currency")}
            </label>
            <select
              id="currency"
              className="input"
              defaultValue={profile?.currency}
              onChange={(e) => updateProfile.mutate({ currency: e.target.value })}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="button" className="btn-primary mt-4" onClick={handleSavePersonalInfo}>
          {t("profile.save")}
        </button>
      </div>

      <div className="card">
        <IncomeExpensesEditor userId={user?.id} month={month} />
      </div>

      <div className="card">
        <AssetsEditor userId={user?.id} />
      </div>

      <div className="card">
        <LiabilitiesEditor userId={user?.id} />
      </div>

      <div className="card">
        <GoalsEditor userId={user?.id} />
      </div>

      <div className="card">
        <h2 className="font-semibold text-content">{t("profile.privacyTitle")}</h2>
        <p className="help-text">{t("profile.privacyDescription")}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={handleExport} disabled={exportData.isPending}>
            {exportData.isPending ? t("profile.exporting") : t("profile.exportButton")}
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-red-700">{t("profile.dangerZoneTitle")}</h3>
          {!confirmingDelete ? (
            <button
              type="button"
              className="mt-3 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              onClick={() => setConfirmingDelete(true)}
            >
              {t("profile.deleteAccountButton")}
            </button>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-content-muted">{t("profile.deleteConfirm")}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  onClick={handleDeleteAccount}
                  disabled={deleteAccount.isPending}
                >
                  {deleteAccount.isPending ? t("profile.deleting") : t("profile.deleteYes")}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setConfirmingDelete(false)}>
                  {t("profile.deleteCancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
