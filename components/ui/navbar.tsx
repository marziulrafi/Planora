"use client";

import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Events", href: "#events" },
  { label: "Pricing", href: "#pricing" },
  { label: "Company", href: "#footer" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-white/70 bg-white/70 backdrop-blur-xl"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#hero" className="flex items-center gap-3 text-slate-950">
          <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-accent-400 text-white shadow-soft">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">Planora</p>
            <p className="text-lg font-semibold leading-none">Event platform</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#cta"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-950 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Get started
          </a>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden border-t border-slate-200 bg-white/95 px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="text-base font-medium text-slate-700 hover:text-slate-950">
                {item.label}
              </a>
            ))}
            <Button variant="secondary" size="default" className="w-full">
              Start free trial
            </Button>
          </div>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
