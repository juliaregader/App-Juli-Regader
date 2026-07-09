import { useState } from "react";

import { AssetsEditor } from "@/components/wealth/AssetsEditor";
import { GoalsEditor } from "@/components/wealth/GoalsEditor";
import { IncomeExpensesEditor } from "@/components/wealth/IncomeExpensesEditor";
import { LiabilitiesEditor } from "@/components/wealth/LiabilitiesEditor";
import { useUpdateProfile } from "@/features/auth/profileQueries";
import { useAuth } from "@/features/auth/useAuth";
import { firstOfMonth } from "@/lib/dates";

const currencies = ["EUR", "USD", "GBP", "CHF"];
const languages: { value: "es" | "ca" | "en"; label: string }[] = [
  { value: "es", label: "Castellano" },
  { value: "ca", label: "Català" },
  { value: "en", label: "English" },
];

export function Perfil() {
  const { user, profile } = useAuth();
  const updateProfile = useUpdateProfile(user?.id);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [saved, setSaved] = useState(false);

  const month = firstOfMonth();

  const handleSavePersonalInfo = async () => {
    await updateProfile.mutateAsync({ full_name: fullName, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
    </section>
  );
}
