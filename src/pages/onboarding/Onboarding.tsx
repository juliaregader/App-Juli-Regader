import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AssetsEditor } from "@/components/wealth/AssetsEditor";
import { GoalsEditor } from "@/components/wealth/GoalsEditor";
import { IncomeExpensesEditor } from "@/components/wealth/IncomeExpensesEditor";
import { LiabilitiesEditor } from "@/components/wealth/LiabilitiesEditor";
import { useUpdateProfile } from "@/features/auth/profileQueries";
import { useAuth } from "@/features/auth/useAuth";
import { useAssets, useGoals, useLiabilities } from "@/features/wealth/queries";
import { firstOfMonth } from "@/lib/dates";

const STEP_TITLES = ["Ingresos y gastos", "Activos", "Pasivos y deudas", "Objetivos financieros", "Resumen"];

export function Onboarding() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const updateProfile = useUpdateProfile(user?.id);
  const [step, setStep] = useState(0);
  const month = firstOfMonth();

  const { data: assets = [] } = useAssets(user?.id);
  const { data: liabilities = [] } = useLiabilities(user?.id);
  const { data: goals = [] } = useGoals(user?.id);

  const finish = async () => {
    await updateProfile.mutateAsync({ onboarding_completed: true });
    navigate("/app", { replace: true });
  };

  const skip = async () => {
    await updateProfile.mutateAsync({ onboarding_completed: true });
    navigate("/app", { replace: true });
  };

  return (
    <section className="container-page max-w-2xl py-12">
      <div className="mb-2 flex items-center justify-between text-sm text-content-muted">
        <span>
          Paso {step + 1} de {STEP_TITLES.length}: {STEP_TITLES[step]}
        </span>
        <button type="button" onClick={skip} className="underline hover:text-brand-900">
          Rellenar más tarde
        </button>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-brand-900 transition-all"
          style={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
        />
      </div>

      <div className="card mt-6">
        {step === 0 && (
          <IncomeExpensesEditor
            userId={user?.id}
            month={month}
            saveLabel="Guardar y continuar"
            onSaved={() => setStep(1)}
          />
        )}
        {step === 1 && <AssetsEditor userId={user?.id} />}
        {step === 2 && <LiabilitiesEditor userId={user?.id} />}
        {step === 3 && <GoalsEditor userId={user?.id} />}
        {step === 4 && (
          <div>
            <h3 className="font-semibold text-content">Todo listo, {profile?.full_name || "bienvenido/a"}</h3>
            <ul className="mt-4 space-y-1 text-sm text-content-muted">
              <li>{assets.length} activo(s) registrado(s)</li>
              <li>{liabilities.length} deuda(s) registrada(s)</li>
              <li>{goals.length} objetivo(s) financiero(s)</li>
            </ul>
            <p className="mt-4 text-sm text-content-muted">
              Podrás editar toda esta información en cualquier momento desde "Mi perfil".
            </p>
          </div>
        )}

        {step > 0 && (
          <div className="mt-6 flex justify-between border-t border-border pt-4">
            <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)}>
              Atrás
            </button>
            {step < STEP_TITLES.length - 1 ? (
              <button type="button" className="btn-primary" onClick={() => setStep((s) => s + 1)}>
                Siguiente
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={finish} disabled={updateProfile.isPending}>
                Finalizar
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
