import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AssetsEditor } from "@/components/wealth/AssetsEditor";
import { GoalsEditor } from "@/components/wealth/GoalsEditor";
import { IncomeExpensesEditor } from "@/components/wealth/IncomeExpensesEditor";
import { LiabilitiesEditor } from "@/components/wealth/LiabilitiesEditor";
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
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const updateProfile = useUpdateProfile(user?.id);
  const exportData = useExportMyData(user?.id);
  const deleteAccount = useDeleteAccount();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const month = firstOfMonth();

  const handleSavePersonalInfo = async () => {
    await updateProfile.mutateAsync({ full_name: fullName, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount.mutateAsync();
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <section className="container-page max-w-3xl space-y-10 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Mi perfil</h1>
        <p className="mt-1 text-content-muted">
          Edita tus datos personales y toda tu información patrimonial cuando quieras.
        </p>
      </div>

      <div className="card">
        <h2 className="font-semibold text-content">Datos personales</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="full_name">
              Nombre completo
            </label>
            <input id="full_name" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              Teléfono
            </label>
            <input id="phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="language">
              Idioma
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
              Divisa
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
          Guardar datos personales
        </button>
        {saved && <span className="ml-3 text-sm text-emerald-600">Guardado</span>}
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
        <h2 className="font-semibold text-content">Privacidad y datos</h2>
        <p className="help-text">
          Puedes exportar toda tu información en cualquier momento, o eliminar tu cuenta y todos
          tus datos de forma permanente (derecho de acceso y supresión, RGPD).
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => exportData.mutate()}
            disabled={exportData.isPending}
          >
            {exportData.isPending ? "Exportando…" : "Exportar mis datos (JSON)"}
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-red-700">Zona de peligro</h3>
          {!confirmingDelete ? (
            <button
              type="button"
              className="mt-3 rounded-xl border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              onClick={() => setConfirmingDelete(true)}
            >
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-content-muted">
                Esta acción borra tu cuenta y todos tus datos patrimoniales de forma permanente e
                irreversible. ¿Seguro que quieres continuar?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  onClick={handleDeleteAccount}
                  disabled={deleteAccount.isPending}
                >
                  {deleteAccount.isPending ? "Eliminando…" : "Sí, eliminar definitivamente"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setConfirmingDelete(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
