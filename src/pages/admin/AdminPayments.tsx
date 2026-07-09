import { useToast } from "@/components/ui/useToast";
import { useAllPayments, useMarkPaymentPaid } from "@/features/admin/queries";
import { formatCurrency } from "@/lib/format/currency";

const serviceLabels: Record<string, string> = {
  plan_329: "Plan patrimonial (329 €)",
  sesion_80: "Sesión individual (80 €)",
};

export function AdminPayments() {
  const { showToast } = useToast();
  const { data: payments = [], isLoading } = useAllPayments();
  const markPaid = useMarkPaymentPaid();

  if (isLoading) return <p className="text-content-muted">Cargando…</p>;

  if (payments.length === 0) {
    return <p className="text-content-muted">Todavía no hay ningún pago.</p>;
  }

  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-content-muted">
            <th className="p-4 font-medium">Servicio</th>
            <th className="p-4 font-medium">Importe</th>
            <th className="p-4 font-medium">Estado</th>
            <th className="p-4 font-medium">Fecha</th>
            <th className="p-4 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0">
              <td className="p-4">{serviceLabels[p.service] ?? p.service}</td>
              <td className="p-4">{formatCurrency(p.amount, p.currency)}</td>
              <td className="p-4 capitalize">{p.status}</td>
              <td className="p-4">{new Date(p.created_at).toLocaleDateString("es-ES")}</td>
              <td className="p-4">
                {p.status !== "pagado" && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => markPaid.mutate(p.id, { onSuccess: () => showToast("Pago marcado como pagado") })}
                  >
                    Marcar como pagado
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
