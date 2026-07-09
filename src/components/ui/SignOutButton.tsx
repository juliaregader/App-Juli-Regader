import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/useAuth";

export function SignOutButton({ className }: { className?: string }) {
  const { t } = useTranslation();
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
      {t("nav.signOut")}
    </button>
  );
}
