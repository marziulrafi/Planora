"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";
import type { User } from "@/src/lib/types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getSessionUser = useCallback(async () => {
    try {
      const sessionRes = await api.get<{ user: User | null }>("/auth/session");
      return sessionRes?.user ?? null;
    } catch {
      const fallbackRes = await api.get<{ user: User | null }>("/auth/get-session");
      return fallbackRes?.user ?? null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const sessionUser = await getSessionUser();
      setUser(sessionUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [getSessionUser]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/sign-out", {});
    } catch {
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    getSessionUser()
      .then((sessionUser) => setUser(sessionUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [getSessionUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      refreshUser,
      logout,
    }),
    [user, loading, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
}
