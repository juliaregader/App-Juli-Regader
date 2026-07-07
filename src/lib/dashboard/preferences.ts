import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useProfile } from "@/lib/auth/useProfile";
import { supabase } from "@/lib/supabase/client";

export const DASHBOARD_CARD_IDS = [
  "netWorth",
  "cashFlow",
  "savingsRate",
  "emergencyFund",
  "debtToAssets",
  "debtToIncome",
  "assetsVsLiabilities",
  "assetBreakdown",
] as const;

export type DashboardCardId = (typeof DASHBOARD_CARD_IDS)[number];

function getHiddenCards(dashboardPreferences: Record<string, unknown> | undefined): string[] {
  const hidden = dashboardPreferences?.hiddenCards;
  return Array.isArray(hidden) ? hidden.filter((id): id is string => typeof id === "string") : [];
}

export function useDashboardPreferences() {
  const { session } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  const hiddenCards = getHiddenCards(profile?.dashboard_preferences);

  const toggleCard = useMutation({
    mutationFn: async (cardId: DashboardCardId) => {
      if (!userId) throw new Error("No hay sesión activa.");
      const next = hiddenCards.includes(cardId)
        ? hiddenCards.filter((id) => id !== cardId)
        : [...hiddenCards, cardId];

      const { error } = await supabase
        .from("profiles")
        .update({
          dashboard_preferences: { ...profile?.dashboard_preferences, hiddenCards: next },
        })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return {
    hiddenCards,
    isVisible: (cardId: DashboardCardId) => !hiddenCards.includes(cardId),
    toggleCard,
  };
}
