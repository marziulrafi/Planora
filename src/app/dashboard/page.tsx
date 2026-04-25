"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/src/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-base text-slate-600">Welcome, {user?.name || "User"}.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link className="rounded-2xl border border-gray-200 p-4 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" href="/dashboard/my-events">Manage My Events</Link>
        <Link className="rounded-2xl border border-gray-200 p-4 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" href="/dashboard/invitations">View Invitations</Link>
        <Link className="rounded-2xl border border-gray-200 p-4 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" href="/dashboard/reviews">Manage Reviews</Link>
        <Link className="rounded-2xl border border-gray-200 p-4 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" href="/dashboard/settings">Profile Settings</Link>
      </div>
    </motion.div>
  );
}
