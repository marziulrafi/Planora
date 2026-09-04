"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api, { ensureSession } from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";
import type { Event, User } from "@/src/lib/types";
import ProtectedRoute from "@/src/components/auth/protected-route";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

type PaginatedUsers = { data: User[]; total: number; page: number; limit: number };
type PaginatedEvents = { data: Event[]; total: number; page: number; limit: number };
type Stats = {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  totalPayments: number;
};

function Pagination({ page, total, onPageChange }: { page: number; total: number; onPageChange: (page: number) => void }) {
  const totalPages = Math.ceil(total / 10);
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 border-t px-4 py-4" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`h-9 min-w-9 rounded-lg px-3 text-sm ${pageNumber === page ? "bg-slate-900 text-white" : "border border-slate-200 hover:bg-slate-50"}`}
          aria-current={pageNumber === page ? "page" : undefined}
        >
          {pageNumber}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  confirmLabel?: string;
}

function ConfirmDialog({ message, onConfirm, onCancel, danger = true, confirmLabel = "Delete" }: ConfirmDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-medium text-slate-900 leading-relaxed">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-gray-50 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-xs font-medium text-white transition active:scale-95 ${danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-900 hover:bg-slate-700"
              }`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"users" | "events">("users");
  const [usersPage, setUsersPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [eventsTotal, setEventsTotal] = useState(0);

  const [confirm, setConfirm] = useState<{
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  const showConfirm = (message: string, confirmLabel: string) =>
    new Promise<boolean>((resolve) => {
      setConfirm({
        message,
        confirmLabel,
        onConfirm: () => { setConfirm(null); resolve(true); },
      });
    });

  const handleConfirmCancel = () => {
    setConfirm(null);
  };

  const load = async (requestedUsersPage = usersPage, requestedEventsPage = eventsPage) => {
    try {
      setLoading(true);
      await ensureSession();
      const [usersRes, eventsRes, statsRes] = await Promise.all([
        api.get<PaginatedUsers>(`/admin/users?page=${requestedUsersPage}&limit=10`),
        api.get<PaginatedEvents>(`/admin/events?page=${requestedEventsPage}&limit=10`),
        api.get<Stats>("/admin/stats"),
      ]);

      setUsers(Array.isArray(usersRes) ? usersRes : usersRes?.data ?? []);
      setEvents(Array.isArray(eventsRes) ? eventsRes : eventsRes?.data ?? []);
      setUsersTotal(Array.isArray(usersRes) ? usersRes.length : usersRes?.total ?? 0);
      setEventsTotal(Array.isArray(eventsRes) ? eventsRes.length : eventsRes?.total ?? 0);
      const userPageCount = Math.max(1, Math.ceil((Array.isArray(usersRes) ? usersRes.length : usersRes?.total ?? 0) / 10));
      const eventPageCount = Math.max(1, Math.ceil((Array.isArray(eventsRes) ? eventsRes.length : eventsRes?.total ?? 0) / 10));
      if (requestedUsersPage > userPageCount) setUsersPage(userPageCount);
      if (requestedEventsPage > eventPageCount) setEventsPage(eventPageCount);
      setStats(statsRes);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [usersPage, eventsPage]);

  const deleteUser = async (userId: string) => {
    const confirmed = await showConfirm(
      "Permanently delete this user and all their data? This cannot be undone.",
      "Delete user"
    );
    if (!confirmed) return;
    try {
      await toast.promise(api.delete(`/admin/users/${userId}`), {
        loading: "Deleting user...",
        success: "User deleted successfully",
        error: (err) => err instanceof Error ? err.message : "Failed to delete user",
      });
      await load(usersPage, eventsPage);
    } catch { }
  };

  const deleteEvent = async (eventId: string) => {
    const confirmed = await showConfirm(
      "Permanently delete this event? All participants and reviews will be removed.",
      "Delete event"
    );
    if (!confirmed) return;
    try {
      await toast.promise(api.delete(`/admin/events/${eventId}`), {
        loading: "Deleting event...",
        success: "Event deleted",
        error: (err) => err instanceof Error ? err.message : "Failed to delete event",
      });
      await load(usersPage, eventsPage);
    } catch { }
  };

  const STAT_CARDS = stats ? [
    { label: "Total Users", value: stats.totalUsers, color: "bg-blue-50   text-blue-700" },
    { label: "Total Events", value: stats.totalEvents, color: "bg-green-50  text-green-700" },
    { label: "Successful Payments", value: stats.totalPayments, color: "bg-purple-50 text-purple-700" },
    { label: "Total Revenue", value: `BDT ${stats.totalRevenue.toLocaleString()}`, color: "bg-amber-50  text-amber-700" },
  ] : [];

  return (
    <ProtectedRoute adminOnly>
      {/* Confirm dialog portal */}
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog
            message={confirm.message}
            confirmLabel={confirm.confirmLabel}
            onConfirm={confirm.onConfirm}
            onCancel={handleConfirmCancel}
          />
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-slate-500">Logged in as: {user?.email}</p>
          </div>
        </motion.div>

        {/* Stats */}
        <AnimatePresence>
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {STAT_CARDS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                  className={`rounded-xl p-5 ${stat.color}`}
                >
                  <p className="text-sm font-medium opacity-80">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {(["users", "events"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              {t} ({t === "users" ? usersTotal : eventsTotal})
              {tab === t && (
                <motion.div
                  layoutId="admin-tab-indicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-slate-900 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-8">
            <Spinner centered />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.section
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border bg-white"
            >
              <div className="divide-y">
                {tab === "users" ? (
                  users.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-500">No users.</p>
                  ) : (
                    users.map((u, i) => (
                      <motion.div
                        key={u.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <div className="mr-auto">
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-slate-500">
                            {u.email} · {u.role}
                          </p>
                        </div>
                        {u.role !== "ADMIN" && (
                          <button
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 active:scale-95"
                            onClick={() => void deleteUser(u.id)}
                          >
                            Delete
                          </button>
                        )}
                      </motion.div>
                    ))
                  )
                ) : (
                  events.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-slate-500">No events.</p>
                  ) : (
                    events.map((ev, i) => (
                      <motion.div
                        key={ev.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <div className="mr-auto">
                          <p className="text-sm font-medium">{ev.title}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(ev.date).toLocaleDateString()} ·{" "}
                            {ev.fee > 0 ? `BDT ${ev.fee}` : "Free"} · {ev.type} ·{" "}
                            Owner: {ev.owner?.name ?? ev.ownerId}
                          </p>
                        </div>
                        <button
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 active:scale-95"
                          onClick={() => void deleteEvent(ev.id)}
                        >
                          Delete
                        </button>
                      </motion.div>
                    ))
                  )
                )}
              </div>
              <Pagination
                page={tab === "users" ? usersPage : eventsPage}
                total={tab === "users" ? usersTotal : eventsTotal}
                onPageChange={tab === "users" ? setUsersPage : setEventsPage}
              />
            </motion.section>
          </AnimatePresence>
        )}
      </main>
    </ProtectedRoute>
  );
}