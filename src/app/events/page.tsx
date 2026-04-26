"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import api from "@/src/lib/api";
import type { Event } from "@/src/lib/types";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

type PaginatedEvents = {
  data: Event[];
  total: number;
  page: number;
  limit: number;
};

const FILTER_OPTIONS = [
  { label: "All", type: "", fee: "" },
  { label: "Public · Free", type: "PUBLIC", fee: "free" },
  { label: "Public · Paid", type: "PUBLIC", fee: "paid" },
  { label: "Private · Free", type: "PRIVATE", fee: "free" },
  { label: "Private · Paid", type: "PRIVATE", fee: "paid" },
] as const;

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filterIdx, setFilterIdx] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 400);
  };

  const filter = FILTER_OPTIONS[filterIdx];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({ limit: "12" });
        if (debouncedQuery) params.set("search", debouncedQuery);
        if (filter.type) params.set("type", filter.type);
        if (filter.fee) params.set("fee", filter.fee);

        const result = await api.get<PaginatedEvents>(`/events?${params.toString()}`);
        setEvents(result.data);
        setTotal(result.total);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [debouncedQuery, filterIdx]);

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl px-6 py-16"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-bold">Events</h1>
        {total > 0 && (
          <span className="text-sm text-slate-500">{total} events found</span>
        )}
      </div>

      {/* Search & Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Search events or organizers…"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {FILTER_OPTIONS.map((opt, idx) => (
          <button
            key={opt.label}
            onClick={() => setFilterIdx(idx)}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
              filterIdx === idx
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="mt-6">
          <Spinner centered />
        </div>
      ) : events.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">No data found.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                href={`/events/${event.id}`}
                className="group block rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold leading-tight group-hover:text-slate-700">
                    {event.title}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                      event.type === "PUBLIC"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(event.date).toLocaleDateString()} · {event.time}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {event.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{event.owner?.name ?? "Unknown organizer"}</span>
                  <span className="font-semibold text-slate-800">
                    {event.fee > 0 ? `BDT ${event.fee}` : "Free"}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.main>
  );
}
