"use client";

import ProtectedRoute from "@/src/components/auth/protected-route";
import DashboardSidebar from "@/src/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-[240px_1fr] md:items-start">
        <DashboardSidebar />
        <section className="space-y-6">{children}</section>
      </main>
    </ProtectedRoute>
  );
}
