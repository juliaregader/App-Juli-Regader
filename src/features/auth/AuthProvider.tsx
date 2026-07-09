import type { Session, User } from "@supabase/supabase-js";
import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase/client";

import type { Profile } from "./types";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return data as Profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    });

    return () => subscription.subscription.unsubscribe();
  }, [queryClient]);

  const userId = session?.user.id;

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId!),
    enabled: Boolean(userId),
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile: profileQuery.data ?? null,
      isLoading: sessionLoading || (Boolean(userId) && profileQuery.isLoading),
      isAdmin: profileQuery.data?.role === "admin",
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [session, sessionLoading, userId, profileQuery.data, profileQuery.isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
