import { useState } from "react";
import { Link } from "react-router-dom";

import { useAllProfiles } from "@/features/admin/queries";

export function AdminClients() {
  const { data: profiles = [], isLoading } = useAllProfiles();
  const [search, setSearch] = useState("");

  const filtered = profiles.filter((p) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return p.full_name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term);
  });

  return (
    <div>
      <input
        className="input max-w-sm"
        placeholder="Buscar por nombre o email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <p className="mt-4 text-sm text-content-muted">Cargando…</p>
      ) : (
        <div className="card mt-4 overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-content-muted">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Rol</th>
                <th className="p-4 font-medium">Onboarding</th>
                <th className="p-4 font-medium">Alta</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-brand-100/40">
                  <td className="p-4">
                    <Link to={`/app/admin/clientes/${p.id}`} className="font-medium text-brand-900 underline">
                      {p.full_name || "(sin nombre)"}
                    </Link>
                  </td>
                  <td className="p-4">{p.email}</td>
                  <td className="p-4 capitalize">{p.role}</td>
                  <td className="p-4">{p.onboarding_completed ? "Completo" : "Pendiente"}</td>
                  <td className="p-4">{new Date(p.created_at).toLocaleDateString("es-ES")}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-content-muted">
                    No hay clientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
