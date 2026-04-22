"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGetArray } from "@/src/lib/api";
import type { Event } from "@/src/lib/types";

const filterOptions = [
  "All" as const,
  "Public Free",
  "Public Paid",
  "Private Free",
  "Private Paid",
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filterOptions)[number]>("All");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setEvents(await apiGetArray<Event>("/events"));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesQuery = event.title.toLowerCase().includes(query.toLowerCase());
      const paymentLabel = event.fee > 0 ? "Paid" : "Free";
      const typeLabel = event.type === "PUBLIC" ? "Public" : "Private";
      const matchesFilter = filter === "All" ? true : `${typeLabel} ${paymentLabel}` === filter;

      return matchesQuery && matchesFilter;
    });
  }, [events, filter, query]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Events</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <input
          className="rounded border px-3 py-2"
          placeholder="Search by title"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {filterOptions.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`rounded px-3 py-2 ${filter === option ? "bg-slate-900 text-white" : "bg-slate-100"}`}
          >
            {option}
          </button>
        ))}
      </div>
      {loading ? <p className="mt-4">Loading...</p> : null}
      {error ? <p className="mt-4 text-red-600">{error}</p> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {filteredEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`} className="rounded border bg-white p-4 hover:bg-slate-50">
            <p className="font-semibold">{event.title}</p>
            <p className="text-sm text-slate-600">{event.type} | {event.fee > 0 ? "Paid" : "Free"}</p>
            <p className="mt-1 text-sm text-slate-500">{event.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
