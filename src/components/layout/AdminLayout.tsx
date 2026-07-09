import { NavLink, Outlet } from "react-router-dom";
import { clsx } from "clsx";

const tabs = [
  { to: "/app/admin", label: "Clientes", end: true },
  { to: "/app/admin/reservas", label: "Reservas" },
  { to: "/app/admin/pagos", label: "Pagos" },
  { to: "/app/admin/disponibilidad", label: "Disponibilidad" },
];

export function AdminLayout() {
  return (
    <section className="container-page py-10">
      <h1 className="font-display text-2xl font-bold text-brand-900">Panel de administrador</h1>

      <nav className="mt-6 flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              clsx(
                "border-b-2 px-3 py-2 text-sm font-medium",
                isActive ? "border-brand-900 text-brand-900" : "border-transparent text-content-muted hover:text-brand-900",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </section>
  );
}
