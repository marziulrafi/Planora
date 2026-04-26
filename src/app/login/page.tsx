"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { apiPost } from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const signInPromise = apiPost("/auth/sign-in/email", { email, password });
      await toast.promise(signInPromise, {
        loading: "Signing in...",
        success: "Login successful",
        error: (err) =>
          err instanceof Error ? err.message : "Invalid email or password",
      });

      await refreshUser();
      router.push("/dashboard");
    } catch {
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
      <h1 className="text-4xl font-bold">Login</h1>
      <form
        className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        onSubmit={onSubmit}
      >
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
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95 disabled:opacity-60"
        >
          {loading ? <Spinner size="sm" className="border-white/40 border-t-white" /> : null}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="mt-3 text-sm text-slate-600">
        No account?{" "}
        <Link className="font-medium underline" href="/register">
          Register
        </Link>
      </p>
    </motion.main>
  );
}
