import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/useAuth";

export function SignOutButton({ className }: { className?: string }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={className ?? "btn-secondary"}
      onClick={async () => {
        await signOut();
        navigate("/", { replace: true });
      }}
    >
      Cerrar sesión
    </button>
  );
}
