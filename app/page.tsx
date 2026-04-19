"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/sidebar";
import { EventCard } from "@/components/event-card";
import { Modal } from "@/components/ui/modal";
import { categories, events, heroStats } from "@/lib/mock-data";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEvents = useMemo(
    () => (selectedCategory === "All" ? events : events.filter((event) => event.category === selectedCategory)),
    [selectedCategory]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-slate-950">
      <Navbar />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-hero-glow opacity-90 blur-3xl" />

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-8 lg:px-8">
        <section id="hero" className="grid gap-10 lg:grid-cols-[1.55fr_minmax(320px,1fr)] lg:items-end">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/70 px-4 py-2 text-sm text-primary-700 shadow-soft backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Built for modern event teams
            </div>
            <div className="max-w-2xl space-y-6">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                Plan exceptional events with a polished operations platform.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                Planora gives product teams a premium command center for launch events, community experiences, and attendee engagement.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button onClick={() => setIsModalOpen(true)} size="lg">
                Start your event plan
              </Button>
              <a href="#events" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-50">
                Explore events <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-card">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.75, ease: "easeOut" }}>
            <Sidebar />
          </motion.div>
        </section>

        <section id="events" className="mt-20 space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Upcoming Events</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Curated sessions for every stage of launch.</h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              {filteredEvents.length} events available
            </div>
          </div>

          <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </section>

        <section id="features" className="mt-20 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Categories</p>
              <h2 className="text-3xl font-semibold text-slate-950">Filter events by team focus.</h2>
              <p className="text-base leading-7 text-slate-600">Choose a category to reveal the most relevant sessions for product, design, growth, and community experiences.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                "All",
                ...categories,
              ].map((category) => {
                const active = category === selectedCategory;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${active ? "bg-slate-950 text-white shadow-soft" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="cta" className="mt-20 rounded-[2rem] bg-gradient-to-r from-primary-600 via-purple-600 to-accent-500 p-10 text-white shadow-soft">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_minmax(280px,1fr)] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-white/80">Scale with confidence</p>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">Everything you need to turn ambitious launches into unforgettable experiences.</h2>
              <p className="max-w-2xl text-base leading-7 text-white/90">Planora keeps your events organized, your attendees engaged, and your product launches on-brand with a premium workflow built for the modern team.</p>
            </div>
            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-8 shadow-card backdrop-blur-xl">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.24em] text-white/75">Ready to move fast?</p>
                <p className="text-3xl font-semibold text-white">Book a demo and launch smarter.</p>
                <Button variant="secondary" size="lg" onClick={() => setIsModalOpen(true)}>
                  Request demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer id="footer" className="mt-20 border-t border-slate-200 pt-10 pb-6 text-slate-600">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Planora</p>
              <p className="mt-4 max-w-lg text-sm leading-7">The modern event platform for teams who expect fast workflows, beautiful launches, and delightful attendee experiences.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <a href="#hero" className="transition hover:text-slate-950">Home</a>
              <a href="#events" className="transition hover:text-slate-950">Events</a>
              <a href="#features" className="transition hover:text-slate-950">Categories</a>
              <a href="#cta" className="transition hover:text-slate-950">Contact</a>
            </div>
          </div>
          <p className="mt-8 text-xs text-slate-400">© 2026 Planora. Crafted for modern product teams.</p>
        </footer>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Reserve your launch planning call" description="Tell us a little about your event and we'll help configure the right workflow.">
        <Input label="Your email" type="email" placeholder="team@company.com" />
        <Input label="Event focus" placeholder="Product launch, community event, workshop" />
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Send request</Button>
        </div>
      </Modal>
    </div>
  );
}
