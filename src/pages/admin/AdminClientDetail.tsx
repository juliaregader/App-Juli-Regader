import { Link, useParams } from "react-router-dom";

import { useClientProfile } from "@/features/admin/queries";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { useAssets, useGoals, useLiabilities } from "@/features/wealth/queries";
import { formatCurrency } from "@/lib/format/currency";

export function AdminClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: profile, isLoading: loadingProfile } = useClientProfile(id);
  const { data: assets = [] } = useAssets(id);
  const { data: liabilities = [] } = useLiabilities(id);
  const { data: goals = [] } = useGoals(id);
  const kpis = useDashboardData(id);

  if (loadingProfile || !profile) {
    return <p className="text-content-muted">Cargando…</p>;
  }

  const currency = profile.currency || "EUR";

  return (
    <div className="space-y-6">
      <Link to="/app/admin" className="text-sm text-brand-500 hover:underline">
        ← Volver a clientes
      </Link>

      <div>
        <h2 className="font-display text-xl font-bold text-brand-900">{profile.full_name || profile.email}</h2>
        <p className="text-sm text-content-muted">
          {profile.email} {profile.phone ? `· ${profile.phone}` : ""}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <p className="text-sm text-content-muted">Patrimonio neto</p>
          <p className="mt-1 font-display text-xl font-bold text-content">{formatCurrency(kpis.netWorth, currency)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-content-muted">Ahorro mensual</p>
          <p className="mt-1 font-display text-xl font-bold text-content">{formatCurrency(kpis.monthlySavings, currency)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-content-muted">Ratio de endeudamiento</p>
          <p className="mt-1 font-display text-xl font-bold text-content">
            {kpis.debtRatio !== null ? `${(kpis.debtRatio * 100).toFixed(1)}%` : "—"}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-content-muted">Cobertura emergencia</p>
          <p className="mt-1 font-display text-xl font-bold text-content">
            {kpis.emergencyFundMonths !== null ? `${kpis.emergencyFundMonths.toFixed(1)} meses` : "—"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card">
          <h3 className="font-semibold text-content">Activos ({assets.length})</h3>
          <ul className="mt-3 space-y-1 text-sm text-content-muted">
            {assets.map((a) => (
              <li key={a.id} className="flex justify-between">
                <span>{a.name}</span>
                <span>{formatCurrency(a.value, currency)}</span>
              </li>
            ))}
            {assets.length === 0 && <li>Sin activos registrados.</li>}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold text-content">Pasivos ({liabilities.length})</h3>
          <ul className="mt-3 space-y-1 text-sm text-content-muted">
            {liabilities.map((l) => (
              <li key={l.id} className="flex justify-between">
                <span>{l.name}</span>
                <span>{formatCurrency(l.balance, currency)}</span>
              </li>
            ))}
            {liabilities.length === 0 && <li>Sin pasivos registrados.</li>}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold text-content">Objetivos ({goals.length})</h3>
          <ul className="mt-3 space-y-1 text-sm text-content-muted">
            {goals.map((g) => (
              <li key={g.id}>{g.title}</li>
            ))}
            {goals.length === 0 && <li>Sin objetivos registrados.</li>}
          </ul>
        </div>
      </div>

      <p className="text-xs text-content-muted">
        Vista de solo lectura del panel de administrador. Los datos los edita el propio cliente
        desde su perfil.
      </p>
    </div>
  );
}
