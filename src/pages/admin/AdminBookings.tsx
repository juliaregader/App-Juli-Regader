import { useToast } from "@/components/ui/useToast";
import { useAllBookings, useUpdateBookingStatus } from "@/features/admin/queries";

const serviceLabels: Record<string, string> = {
  plan_329: "Plan patrimonial (329 €)",
  sesion_80: "Sesión individual (80 €)",
};

export function AdminBookings() {
  const { showToast } = useToast();
  const { data: bookings = [], isLoading } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();

  if (isLoading) return <p className="text-content-muted">Cargando…</p>;

  if (bookings.length === 0) {
    return <p className="text-content-muted">Todavía no hay ninguna reserva.</p>;
  }

  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-content-muted">
            <th className="p-4 font-medium">Cliente</th>
            <th className="p-4 font-medium">Servicio</th>
            <th className="p-4 font-medium">Fecha</th>
            <th className="p-4 font-medium">Estado</th>
            <th className="p-4 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-border last:border-0">
              <td className="p-4">
                {b.name}
                <br />
                <span className="text-xs text-content-muted">{b.email}</span>
              </td>
              <td className="p-4">{serviceLabels[b.service] ?? b.service}</td>
              <td className="p-4">{new Date(b.start_at).toLocaleString("es-ES")}</td>
              <td className="p-4 capitalize">{b.status}</td>
              <td className="p-4">
                <select
                  className="input"
                  value={b.status}
                  onChange={(e) =>
                    updateStatus.mutate(
                      { id: b.id, status: e.target.value },
                      { onSuccess: () => showToast("Estado de la reserva actualizado") },
                    )
                  }
                >
                  <option value="reservada">Reservada</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="pagada">Pagada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
