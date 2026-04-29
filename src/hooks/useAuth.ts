"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/src/lib/types";
import { getSession, signOut, useSession } from "@/src/lib/auth-client";

export function useAuth() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = (session?.user as User | null | undefined) ?? null;
  const isAuthenticated = Boolean(user);

  const refreshUser = useCallback(async () => {
    await getSession();
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  }, [router]);

  return {
    user,
    isAuthenticated,
    loading: isPending,
    refreshUser,
    logout,
  };
}
