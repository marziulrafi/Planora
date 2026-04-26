"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/api";
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

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"users" | "events">("users");

  const load = async () => {
    try {
      setLoading(true);
      const [usersRes, eventsRes, statsRes] = await Promise.all([
        api.get<PaginatedUsers>("/admin/users"),
        api.get<PaginatedEvents>("/admin/events"),
        api.get<Stats>("/admin/stats"),
      ]);

      if (usersRes && Array.isArray(usersRes.data)) {
        setUsers(usersRes.data);
      } else if (Array.isArray(usersRes)) {
        setUsers(usersRes);
      }

      if (eventsRes && Array.isArray(eventsRes.data)) {
        setEvents(eventsRes.data);
      } else if (Array.isArray(eventsRes)) {
        setEvents(eventsRes);
      }

      setStats(statsRes);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteUser = async (userId: string) => {
    if (!confirm("Permanently delete this user and all their data?")) return;
    try {
      await toast.promise(api.delete(`/admin/users/${userId}`), {
        loading: "Deleting user...",
        success: "User deleted",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to delete user",
      });
      await load();
    } catch {
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Permanently delete this event?")) return;
    try {
      await toast.promise(api.delete(`/admin/events/${eventId}`), {
        loading: "Deleting event...",
        success: "Event deleted",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to delete event",
      });
      await load();
    } catch {
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-slate-500">Logged in as: {user?.email}</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Users", value: stats.totalUsers, color: "bg-blue-50 text-blue-700" },
              { label: "Total Events", value: stats.totalEvents, color: "bg-green-50 text-green-700" },
              { label: "Successful Payments", value: stats.totalPayments, color: "bg-purple-50 text-purple-700" },
              {
                label: "Total Revenue",
                value: `BDT ${stats.totalRevenue.toLocaleString()}`,
                color: "bg-amber-50 text-amber-700",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl p-5 ${stat.color}`}
              >
                <p className="text-sm font-medium opacity-80">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-2 text-sm font-medium ${
              tab === "users"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setTab("events")}
            className={`px-4 py-2 text-sm font-medium ${
              tab === "events"
                ? "border-b-2 border-slate-900 text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Events ({events.length})
          </button>
        </div>

        {loading ? (
          <div className="py-4">
            <Spinner centered />
          </div>
        ) : tab === "users" ? (
          <section className="rounded-xl border bg-white">
            <div className="divide-y">
              {users.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-slate-500">No users.</p>
              ) : (
                users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="mr-auto">
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-slate-500">
                        {u.email} · {u.role}
                      </p>
                    </div>
                    {u.role !== "ADMIN" && (
                      <button
                        className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                        onClick={() => void deleteUser(u.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          <section className="rounded-xl border bg-white">
            <div className="divide-y">
              {events.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-slate-500">No events.</p>
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="mr-auto">
                      <p className="font-medium text-sm">{ev.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(ev.date).toLocaleDateString()} ·{" "}
                        {ev.fee > 0 ? `BDT ${ev.fee}` : "Free"} · {ev.type} ·{" "}
                        Owner: {(ev as any).owner?.name ?? ev.ownerId}
                      </p>
                    </div>
                    <button
                      className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                      onClick={() => void deleteEvent(ev.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </ProtectedRoute>
  );
}
