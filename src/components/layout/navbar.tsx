"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (path: string) =>
    `group relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${pathname === path ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
    }`;

  const mobileLinkClass = (path: string) =>
    `block rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${pathname === path ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
    }`;

  const navLinks = (
    <>
      <Link className={linkClass("/")} href="/" onClick={() => setMobileOpen(false)}>
        Home
        <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-100" />
      </Link>
      <Link className={linkClass("/events")} href="/events" onClick={() => setMobileOpen(false)}>
        Upcoming Events
        <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-100" />
      </Link>
      <Link className={linkClass("/events/past")} href="/events/past" onClick={() => setMobileOpen(false)}>
        Past Events
        <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-100" />
      </Link>
      {isAuthenticated ? (
        <>
          <Link className={linkClass("/dashboard")} href="/dashboard" onClick={() => setMobileOpen(false)}>
            Dashboard
            <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
          {user?.role === "ADMIN" && (
            <Link className={linkClass("/admin")} href="/admin" onClick={() => setMobileOpen(false)}>
              Admin
              <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          )}
          <button
            onClick={() => { void logout(); setMobileOpen(false); }}
            className="rounded-xl bg-red-600 px-3 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link className={linkClass("/login")} href="/login" onClick={() => setMobileOpen(false)}>
            Login
            <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
          <Link className={linkClass("/register")} href="/register" onClick={() => setMobileOpen(false)}>
            Register
            <span className="absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
        </>
      )}
    </>
  );

  const mobileLinks = (
    <div className="flex flex-col gap-1 p-3">
      <Link className={mobileLinkClass("/")} href="/" onClick={() => setMobileOpen(false)}>
        Home
      </Link>
      <Link className={mobileLinkClass("/events")} href="/events" onClick={() => setMobileOpen(false)}>
        Upcoming Events
      </Link>
      <Link className={mobileLinkClass("/events/past")} href="/events/past" onClick={() => setMobileOpen(false)}>
        Past Events
      </Link>
      {isAuthenticated ? (
        <>
          <Link className={mobileLinkClass("/dashboard")} href="/dashboard" onClick={() => setMobileOpen(false)}>
            Dashboard
          </Link>
          {user?.role === "ADMIN" && (
            <Link className={mobileLinkClass("/admin")} href="/admin" onClick={() => setMobileOpen(false)}>
              Admin
            </Link>
          )}
          <div className="pt-2 mt-1 border-t border-slate-100">
            <button
              onClick={() => { void logout(); setMobileOpen(false); }}
              className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm text-white shadow-sm transition-all duration-200 hover:bg-red-700 active:scale-95"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 pt-2 mt-1 border-t border-slate-100">
          <Link
            className={mobileLinkClass("/login")}
            href="/login"
            onClick={() => setMobileOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="block rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white text-center transition-all duration-200 hover:bg-slate-800"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Planora
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md">
          {mobileLinks}
        </div>
      )}
    </nav>
  );
}