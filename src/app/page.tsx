"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus2, CreditCard, LayoutDashboard, UsersRound } from "lucide-react";
import api from "@/src/lib/api";
import type { Event } from "@/src/lib/types";

type PaginatedEvents = { data: Event[]; total: number; page: number; limit: number };

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
          api.get<Event | null>("/events/featured"),
          api.get<Event[]>("/events/upcoming"),
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
    () =>
      category === "ALL"
        ? events
        : events.filter((e) => e.type === category),
    [events, category]
  );

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl space-y-10 px-6 py-16"
    >
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden rounded-2xl">
        <div className="absolute inset-0">
          <motion.img
            src="https://images.unsplash.com/photo-1571645163064-77faa9676a46?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 8, ease: "easeOut" }}
          />
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl px-6 text-center text-white"
        >
          <h1 className="text-4xl font-bold md:text-5xl">Planora</h1>
          <p className="mt-4 text-base text-slate-100 md:text-lg">
            Plan, join, and manage events — complete with invitations, payments,
            and participant management.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/events"
              className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-105"
            >
              Explore Events
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Event */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Featured Event</h2>
        {loading ? (
          <p className="mt-3 text-slate-500 animate-pulse">Loading…</p>
        ) : error ? (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : featured ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">{featured.title}</p>
              <p className="text-sm text-slate-500">
                {new Date(featured.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {featured.time}
              </p>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                {featured.description}
              </p>
              <p className="mt-1 text-sm font-medium">
                {featured.fee > 0 ? `BDT ${featured.fee}` : "Free"}
                {" · "}
                <span
                  className={
                    featured.type === "PUBLIC"
                      ? "text-green-700"
                      : "text-orange-600"
                  }
                >
                  {featured.type}
                </span>
              </p>
            </div>
            <Link
              href={`/events/${featured.id}`}
              className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95"
            >
              View Event →
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No featured event at the moment.
          </p>
        )}
      </section>

      {/* Upcoming Events */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <Link href="/events" className="text-sm text-slate-600 hover:underline">
            View all →
          </Link>
        </div>

        {/* Category Filters */}
        <div className="mt-4 flex gap-2">
          {(["ALL", "PUBLIC", "PRIVATE"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 ${category === item
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {filteredEvents.length === 0 ? (
              <p className="col-span-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                No data found for this category.
              </p>
            ) : (
              filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group rounded-2xl border border-gray-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <p className="font-semibold group-hover:text-slate-700">
                    {event.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(event.date).toLocaleDateString()} · {event.time}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span
                      className={`rounded px-1.5 py-0.5 font-medium ${event.type === "PUBLIC"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                        }`}
                    >
                      {event.type}
                    </span>
                    <span className="text-slate-500">
                      {event.fee > 0 ? `BDT ${event.fee}` : "Free"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl py-16">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-semibold">Why Choose Planora</h2>
          <p className="text-sm text-slate-600">
            Everything you need to launch, manage, and grow successful events.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
            <CalendarPlus2 className="h-5 w-5 text-blue-600" />
            <h3 className="mt-3 text-base font-semibold">Easy Event Creation</h3>
            <p className="mt-1 text-sm text-slate-600">Create and manage events in minutes.</p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
            <CreditCard className="h-5 w-5 text-amber-600" />
            <h3 className="mt-3 text-base font-semibold">Secure Payments</h3>
            <p className="mt-1 text-sm text-slate-600">Integrated payment system for paid events.</p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
            <UsersRound className="h-5 w-5 text-emerald-600" />
            <h3 className="mt-3 text-base font-semibold">Smart Participation</h3>
            <p className="mt-1 text-sm text-slate-600">Join, request, and manage approvals easily.</p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md">
            <LayoutDashboard className="h-5 w-5 text-violet-600" />
            <h3 className="mt-3 text-base font-semibold">Real-Time Dashboard</h3>
            <p className="mt-1 text-sm text-slate-600">Track events, invitations, and reviews.</p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-slate-900 p-8 text-white shadow-sm">
        <h2 className="text-2xl font-semibold">Ready to launch your event?</h2>
        <p className="mt-2 text-slate-300">
          Create events, send invitations, manage participants, and collect
          reviews — all in one place.
        </p>
        <Link
          href="/dashboard/my-events"
          className="mt-5 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-100 hover:shadow-md active:scale-95"
        >
          Go to Dashboard
        </Link>
      </section>
    </motion.main>
  );
}
