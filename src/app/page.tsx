"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiGetArray } from "@/src/lib/api";
import type { Event } from "@/src/lib/types";

export default function HomePage() {
  const [featured, setFeatured] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState<"ALL" | "PUBLIC" | "PRIVATE">("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [featuredEvent, upcoming] = await Promise.all([
          apiGet<Event | null>("/events/featured"),
          apiGetArray<Event>("/events?limit=9"),
        ]);
        setFeatured(featuredEvent);
        setEvents(upcoming);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load homepage");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredEvents = useMemo(
    () => (category === "ALL" ? events : events.filter((event) => event.type === category)),
    [events, category]
  );

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <section className="rounded border bg-white p-6">
        <h1 className="text-3xl font-bold">Planora</h1>
        <p className="mt-2 text-slate-600">Plan, join, and manage events with a complete workflow.</p>
        <Link href="/events" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white">
          Explore Events
        </Link>
      </section>

      <section className="rounded border bg-white p-6">
        <h2 className="text-xl font-semibold">Featured Event</h2>
        {loading ? <p className="mt-3">Loading...</p> : null}
        {error ? <p className="mt-3 text-red-600">{error}</p> : null}
        {!loading && !error && featured ? (
          <div className="mt-3">
            <p className="font-medium">{featured.title}</p>
            <p className="text-sm text-slate-600">{new Date(featured.date).toLocaleDateString()} - {featured.time}</p>
            <p className="text-sm text-slate-600">{featured.description}</p>
          </div>
        ) : null}
      </section>

      <section className="rounded border bg-white p-6">
        <h2 className="text-xl font-semibold">Upcoming Events</h2>
        <div className="mt-4 flex gap-2">
          {(["ALL", "PUBLIC", "PRIVATE"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded px-3 py-1 ${category === item ? "bg-slate-900 text-white" : "bg-slate-100"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {filteredEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="rounded border p-3 hover:bg-slate-50">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-slate-600">{event.type} | {event.fee > 0 ? `BDT ${event.fee}` : "Free"}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded border bg-slate-900 p-6 text-white">
        <h2 className="text-xl font-semibold">Ready to launch your event?</h2>
        <p className="mt-2 text-slate-200">Create events, handle invitations, and collect reviews in one place.</p>
        <Link href="/dashboard/my-events" className="mt-4 inline-block rounded bg-white px-4 py-2 text-slate-900">
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
