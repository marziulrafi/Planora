"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  const linkClass = (path: string) =>
    `rounded px-3 py-2 text-sm ${pathname === path ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`;

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-slate-900">
          Planora
        </Link>
        <div className="flex items-center gap-2">
          <Link className={linkClass("/")} href="/">
            Home
          </Link>
          <Link className={linkClass("/events")} href="/events">
            Events
          </Link>
          {isAuthenticated ? (
            <>
              <Link className={linkClass("/dashboard")} href="/dashboard">
                Dashboard
              </Link>
              {user?.role === "ADMIN" && (
                <Link className={linkClass("/admin")} href="/admin">
                  Admin
                </Link>
              )}
              <button onClick={() => void logout()} className="rounded bg-red-600 px-3 py-2 text-sm text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={linkClass("/login")} href="/login">
                Login
              </Link>
              <Link className={linkClass("/register")} href="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
