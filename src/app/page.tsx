"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, cubicBezier } from "framer-motion";
import { CalendarPlus2, CreditCard, LayoutDashboard, UsersRound, ArrowRight, MapPin, Clock } from "lucide-react";
import api from "@/src/lib/api";
import type { Event } from "@/src/lib/types";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

type PaginatedEvents = { data: Event[]; total: number; page: number; limit: number };

const ease = cubicBezier(0.22, 1, 0.36, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function HomePage() {
  const [featured, setFeatured] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [category, setCategory] = useState<"ALL" | "PUBLIC" | "PRIVATE">("ALL");
  const [loading, setLoading] = useState(true);

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
        toast.error(err instanceof Error ? err.message : "Failed to load homepage");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredEvents = useMemo(
    () =>
      (category === "ALL" ? events : events.filter((e) => e.type === category))
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 6),
    [events, category]
  );

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={stagger}
      className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6"
    >
      {/* ── Hero ── */}
      <motion.section
        variants={fadeUp}
        className="relative flex min-h-[82vh] w-full items-end overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0">
          <motion.img
            src="https://images.unsplash.com/photo-1571645163064-77faa9676a46?q=80&w=1170&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7, ease: "easeOut" }}
          />
          {/* layered gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        {/* floating pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute top-8 left-8 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-white">Events live now</span>
        </motion.div>

        <div className="relative z-10 w-full max-w-2xl p-8 sm:p-12">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease }}
            className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl"
          >
            Plan smarter.<br />
            <span className="text-slate-300">Event together.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-4 max-w-md text-base text-slate-300 sm:text-lg"
          >
            Invitations, payments, and participant management — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-white/20"
            >
              Explore Events
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
            >
              Get started free
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Featured Event ── */}
      <motion.section variants={fadeUp} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Featured Event</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : featured ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              {/* colored accent bar */}
              <div className="mt-1 h-12 w-1 shrink-0 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${featured.type === "PUBLIC"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                      }`}
                  >
                    {featured.type}
                  </span>
                  <span className="text-xs text-slate-700">
                    {featured.fee > 0 ? `BDT ${featured.fee}` : "Free"}
                  </span>
                </div>
                <p className="mt-1.5 text-xl font-bold text-slate-900">{featured.title}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(featured.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {featured.time}
                </p>
                <p className="mt-2 max-w-xl text-sm text-slate-600 line-clamp-2">{featured.description}</p>
              </div>
            </div>
            <Link
              href={`/events/${featured.id}`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95"
            >
              View Event
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-slate-400">No featured event at the moment.</p>
        )}
      </motion.section>

      {/* ── Upcoming Events ── */}
      <motion.section variants={fadeUp} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
          <Link href="/events" className="group flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900">
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="flex gap-1.5">
            {(["ALL", "PUBLIC", "PRIVATE"] as const).map((item) => (
              <motion.button
                key={item}
                onClick={() => setCategory(item)}
                whileTap={{ scale: 0.95 }}
                className={`relative rounded-xl px-4 py-1.5 text-sm font-medium transition-all duration-200 ${category === item
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {item}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-6 pt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner centered />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid gap-3 md:grid-cols-3"
              >
                {filteredEvents.length === 0 ? (
                  <p className="col-span-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-400">
                    No events in this category yet.
                  </p>
                ) : (
                  filteredEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      animate="show"
                    >
                      <Link
                        href={`/events/${event.id}`}
                        className="group flex h-full flex-col rounded-2xl border border-slate-100 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${event.type === "PUBLIC"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                              }`}
                          >
                            {event.type}
                          </span>
                          <span className="text-xs font-medium text-slate-700">
                            {event.fee > 0 ? `BDT ${event.fee}` : "Free"}
                          </span>
                        </div>
                        <p className="mt-3 font-semibold text-slate-900 transition-colors duration-200 group-hover:text-slate-700 leading-snug">
                          {event.title}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString()} · {event.time}
                        </p>
                        <div className="mt-auto pt-3 flex items-center justify-between">
                          <span className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">View details</span>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-slate-600" />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.section>

      {/* ── Why Planora ── */}
      <motion.section variants={fadeUp}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Why Choose Planora</h2>
          <p className="mt-1 text-sm text-slate-500">Everything you need to launch, manage, and grow successful events.</p>
        </div>
        <motion.div variants={stagger} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarPlus2, color: "text-blue-500", bg: "bg-blue-50", title: "Easy Event Creation", desc: "Create and manage events in minutes." },
            { icon: CreditCard, color: "text-amber-500", bg: "bg-amber-50", title: "Secure Payments", desc: "Integrated payment system for paid events." },
            { icon: UsersRound, color: "text-emerald-500", bg: "bg-emerald-50", title: "Smart Participation", desc: "Join, request, and manage approvals easily." },
            { icon: LayoutDashboard, color: "text-violet-500", bg: "bg-violet-50", title: "Real-Time Dashboard", desc: "Track events, invitations, and reviews." },
          ].map(({ icon: Icon, color, bg, title, desc }, i) => (
            <motion.article
              key={title}
              custom={i}
              variants={fadeUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className={`inline-flex rounded-xl ${bg} p-2.5`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 shadow-sm sm:p-12"
      >
        {/* subtle gradient orb */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to launch your event?</h2>
          <p className="mt-2 max-w-xl text-slate-400">
            Create events, send invitations, manage participants, and collect reviews — all in one place.
          </p>
          <Link
            href="/dashboard/my-events"
            className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.section>
    </motion.main>
  );
}