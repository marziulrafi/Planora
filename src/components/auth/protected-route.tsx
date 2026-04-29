"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import Spinner from "@/src/components/Spinner";

type Props = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const router = useRouter();
  const { loading, user } = useAuth();
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (adminOnly && user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, adminOnly, user?.role, router]);

  if (loading) return <Spinner centered />;
  if (!isAuthenticated) return null;
  if (adminOnly && user?.role !== "ADMIN") return null;

  return <>{children}</>;
}
