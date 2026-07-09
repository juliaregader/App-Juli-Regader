import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth";
import { useAvailableSlots, useCreateBooking } from "@/features/booking/queries";
import type { BookingService, Slot } from "@/features/booking/types";

const DAYS_AHEAD = 21;

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function upcomingDays(count: number): Date[] {
  const start = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

const serviceLabels: Record<BookingService, string> = {
  plan_329: "Plan de organización patrimonial (329 €)",
  sesion_80: "Sesión individual (80 €)",
};

export function BookingCalendar() {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const initialService = (searchParams.get("servicio") as BookingService | null) ?? "sesion_80";

  const days = useMemo(() => upcomingDays(DAYS_AHEAD), []);
  const [selectedDate, setSelectedDate] = useState(() => toDateInput(days[0]));
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [service, setService] = useState<BookingService>(initialService);
  const [name, setName] = useState(profile?.full_name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [confirmed, setConfirmed] = useState(false);

  const { data: slots = [], isLoading } = useAvailableSlots(selectedDate);
  const createBooking = useCreateBooking();

  const handleSubmit = async () => {
    if (!selectedSlot || !name || !email) return;
    await createBooking.mutateAsync({
      userId: user?.id,
      name,
      email,
      phone: phone || undefined,
      service,
      startAt: selectedSlot.slot_start,
      endAt: selectedSlot.slot_end,
    });
    setConfirmed(true);
  };

  if (confirmed && selectedSlot) {
    return (
      <div className="card text-center">
        <h3 className="font-display text-xl font-bold text-brand-900">Reserva confirmada</h3>
        <p className="mt-2 text-content-muted">
          {serviceLabels[service]} el{" "}
          {new Date(selectedSlot.slot_start).toLocaleString("es-ES", {
            dateStyle: "full",
            timeStyle: "short",
          })}
          .
        </p>
        <p className="mt-2 text-sm text-content-muted">
          Te hemos enviado un email de confirmación a {email}.
          {service === "sesion_80" && " El pago se gestiona después de la sesión, sin necesidad de adelantarlo."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Servicio</label>
        <select className="input max-w-sm" value={service} onChange={(e) => setService(e.target.value as BookingService)}>
          <option value="sesion_80">{serviceLabels.sesion_80}</option>
          <option value="plan_329">{serviceLabels.plan_329}</option>
        </select>
      </div>

      <div>
        <label className="label">Día</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => {
            const iso = toDateInput(day);
            const isSelected = iso === selectedDate;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => {
                  setSelectedDate(iso);
                  setSelectedSlot(null);
                }}
                className={`flex shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-sm ${
                  isSelected ? "border-brand-900 bg-brand-900 text-white" : "border-border bg-white text-content hover:bg-brand-100"
                }`}
              >
                <span className="text-xs uppercase">{day.toLocaleDateString("es-ES", { weekday: "short" })}</span>
                <span className="font-semibold">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="label">Hora</label>
        {isLoading ? (
          <p className="text-sm text-content-muted">Cargando huecos disponibles…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-content-muted">No hay huecos disponibles este día. Prueba otro día.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.slot_start === slot.slot_start;
              return (
                <button
                  key={slot.slot_start}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    isSelected ? "border-brand-900 bg-brand-900 text-white" : "border-border bg-white text-content hover:bg-brand-100"
                  }`}
                >
                  {new Date(slot.slot_start).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedSlot && (
        <div className="card space-y-4">
          <div>
            <label className="label" htmlFor="booking-name">
              Nombre
            </label>
            <input id="booking-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="booking-email">
              Email
            </label>
            <input
              id="booking-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="booking-phone">
              Teléfono (opcional)
            </label>
            <input id="booking-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            onClick={handleSubmit}
            disabled={createBooking.isPending || !name || !email}
          >
            {createBooking.isPending ? "Confirmando…" : "Confirmar reserva"}
          </button>
          {createBooking.isError && (
            <p className="text-sm text-red-600">
              No se ha podido confirmar la reserva (puede que alguien la haya ocupado justo ahora). Elige otro hueco.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
