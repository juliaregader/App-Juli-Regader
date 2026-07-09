import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase/client";

import type { Profile } from "./types";

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Pick<Profile, "full_name" | "phone" | "language" | "currency" | "onboarding_completed">>) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", userId!)
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", userId] }),
  });
}
