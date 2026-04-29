"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api, { ensureSession } from "@/src/lib/api";
import type { Event, Participant } from "@/src/lib/types";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all duration-200";

const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    type: "PUBLIC" as "PUBLIC" | "PRIVATE",
    fee: "0",
  });

  const load = async () => {
    try {
      setLoading(true);
      await ensureSession();
      const [owned, joined] = await Promise.all([
        api.get<Event[]>("/events/my"),
        api.get<Participant[]>("/participants/my-events"),
      ]);
      setMyEvents(owned);
      setJoinedEvents(joined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const createEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.date) return toast.error("Date is required");
    if (!form.time) return toast.error("Time is required");

    try {
      setCreating(true);
      await ensureSession();
      await toast.promise(
        api.post("/events", {
          title: form.title.trim(),
          description: form.description.trim(),
          date: form.date,
          time: form.time,
          venue: form.venue.trim() || undefined,
          type: form.type,
          fee: Number(form.fee) || 0,
        }),
        {
          loading: "Creating event...",
          success: "Event created! 🎉",
          error: (err) => err instanceof Error ? err.message : "Failed to create event",
        }
      );
      setForm({ title: "", description: "", date: "", time: "", venue: "", type: "PUBLIC", fee: "0" });
      setShowForm(false);
      await load();
    } catch {
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Events</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 active:scale-95"
        >
          {showForm ? "✕ Cancel" : "+ Create Event"}
        </button>
      </div>


      {/* Created events */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="font-semibold text-slate-900">
          Created Events
          <span className="ml-2 text-sm font-normal text-slate-400">({myEvents.length})</span>
        </h2>

        {loading ? (
          <div className="mt-4"><Spinner /></div>
        ) : myEvents.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">You haven&apos;t created any events yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {myEvents.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <Link
                  href={`/events/${ev.id}`}
                  className="block rounded-xl border border-gray-100 p-3 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm"
                >
                  <p className="font-medium text-slate-900">{ev.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {new Date(ev.date).toLocaleDateString()} ·{" "}
                    {ev.fee > 0 ? `BDT ${ev.fee}` : "Free"} · {ev.type}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Joined events */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h2 className="font-semibold text-slate-900">
          Joined Events
          <span className="ml-2 text-sm font-normal text-slate-400">({joinedEvents.length})</span>
        </h2>

        {loading ? (
          <div className="mt-4"><Spinner /></div>
        ) : joinedEvents.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">You haven&apos;t joined any events yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {joinedEvents.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <Link
                  href={`/events/${p.eventId}`}
                  className="flex flex-wrap items-center justify-between rounded-xl border border-gray-100 p-3 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {p.event?.title ?? p.eventId}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {p.event?.date
                        ? new Date(p.event.date).toLocaleDateString()
                        : ""}
                    </p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.status === "APPROVED"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : p.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}>
                    {p.status}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}