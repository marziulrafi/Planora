"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { apiPost } from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      /**
       * Use Better Auth native sign-up endpoint.
       * Server creates user + session and sets cookie automatically.
       */
      await apiPost(
        "/auth/sign-up/email",
        { name, email, password },
        true // skip 401 redirect on this call
      );

      // Refresh user state from session cookie
      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-md px-6 py-16"
    >
      <h1 className="text-4xl font-bold">Create Account</h1>
      <form
        className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={onSubmit}
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            placeholder="Min. 8 characters"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-3 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
      <p className="mt-3 text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-medium underline" href="/login">
          Login
        </Link>
      </p>
    </motion.main>
  );
}
