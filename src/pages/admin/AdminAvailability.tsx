import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  useAddAvailabilityBlock,
  useAvailabilityBlocks,
  useAvailabilityRules,
  useDeleteAvailabilityBlock,
  useDeleteAvailabilityRule,
  useUpsertAvailabilityRule,
} from "@/features/booking/queries";

const weekdayLabels = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function AdminAvailability() {
  const { data: rules = [] } = useAvailabilityRules();
  const upsertRule = useUpsertAvailabilityRule();
  const deleteRule = useDeleteAvailabilityRule();

  const { data: blocks = [] } = useAvailabilityBlocks();
  const addBlock = useAddAvailabilityBlock();
  const deleteBlock = useDeleteAvailabilityBlock();

  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [fullDay, setFullDay] = useState(true);
  const [blockStart, setBlockStart] = useState("09:00");
  const [blockEnd, setBlockEnd] = useState("14:00");

  const addRule = () => {
    upsertRule.mutate({ weekday: 1, start_time: "09:00", end_time: "14:00", slot_duration_minutes: 60, active: true });
  };

  const handleAddBlock = () => {
    if (!newBlockDate) return;
    addBlock.mutate({
      block_date: newBlockDate,
      start_time: fullDay ? null : blockStart,
      end_time: fullDay ? null : blockEnd,
      reason: newBlockReason || null,
    });
    setNewBlockDate("");
    setNewBlockReason("");
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-content">Franjas semanales disponibles</h2>
            <p className="help-text">Días de la semana y horas en las que se pueden reservar sesiones.</p>
          </div>
          <button type="button" className="btn-secondary shrink-0" onClick={addRule}>
            <Plus className="h-4 w-4" aria-hidden /> Añadir franja
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="grid grid-cols-1 gap-2 rounded-xl border border-border p-3 sm:grid-cols-12 sm:items-center">
              <select
                className="input sm:col-span-3"
                defaultValue={rule.weekday}
                onChange={(e) => upsertRule.mutate({ id: rule.id, weekday: Number(e.target.value) })}
              >
                {weekdayLabels.map((label, index) => (
                  <option key={label} value={index}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="time"
                className="input sm:col-span-2"
                defaultValue={rule.start_time.slice(0, 5)}
                onBlur={(e) => upsertRule.mutate({ id: rule.id, start_time: e.target.value })}
              />
              <input
                type="time"
                className="input sm:col-span-2"
                defaultValue={rule.end_time.slice(0, 5)}
                onBlur={(e) => upsertRule.mutate({ id: rule.id, end_time: e.target.value })}
              />
              <div className="sm:col-span-2">
                <label className="help-text mb-1 block">Duración (min)</label>
                <input
                  type="number"
                  step="15"
                  className="input"
                  defaultValue={rule.slot_duration_minutes}
                  onBlur={(e) => upsertRule.mutate({ id: rule.id, slot_duration_minutes: Number(e.target.value) })}
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-content-muted sm:col-span-2">
                <input
                  type="checkbox"
                  defaultChecked={rule.active}
                  onChange={(e) => upsertRule.mutate({ id: rule.id, active: e.target.checked })}
                />
                Activa
              </label>
              <button
                type="button"
                aria-label="Eliminar franja"
                className="justify-self-end text-content-muted hover:text-red-600 sm:col-span-1"
                onClick={() => deleteRule.mutate(rule.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
          {rules.length === 0 && <p className="text-sm text-content-muted">No hay franjas configuradas todavía.</p>}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-content">Bloqueos puntuales</h2>
        <p className="help-text">Bloquea un día completo o un tramo horario concreto (vacaciones, imprevistos…).</p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-3">
            <label className="help-text mb-1 block">Fecha</label>
            <input type="date" className="input" value={newBlockDate} onChange={(e) => setNewBlockDate(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-xs text-content-muted sm:col-span-2">
            <input type="checkbox" checked={fullDay} onChange={(e) => setFullDay(e.target.checked)} />
            Todo el día
          </label>
          {!fullDay && (
            <>
              <div className="sm:col-span-2">
                <label className="help-text mb-1 block">Desde</label>
                <input type="time" className="input" value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="help-text mb-1 block">Hasta</label>
                <input type="time" className="input" value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
              </div>
            </>
          )}
          <div className="sm:col-span-2">
            <label className="help-text mb-1 block">Motivo (opcional)</label>
            <input className="input" value={newBlockReason} onChange={(e) => setNewBlockReason(e.target.value)} />
          </div>
          <button type="button" className="btn-secondary sm:col-span-1" onClick={handleAddBlock}>
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {blocks.map((block) => (
            <div key={block.id} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>
                {block.block_date}
                {block.start_time ? ` · ${block.start_time.slice(0, 5)}–${block.end_time?.slice(0, 5)}` : " · Todo el día"}
                {block.reason ? ` · ${block.reason}` : ""}
              </span>
              <button
                type="button"
                aria-label="Eliminar bloqueo"
                className="text-content-muted hover:text-red-600"
                onClick={() => deleteBlock.mutate(block.id)}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ))}
          {blocks.length === 0 && <p className="text-sm text-content-muted">No hay bloqueos configurados.</p>}
        </div>
      </div>
    </div>
  );
}
