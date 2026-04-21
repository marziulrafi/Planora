"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const result = await apiPost<{ user: unknown; token: string }>("/auth/login", { email, password }, true);
      localStorage.setItem("accessToken", result.token);
      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">Login</h1>
      <form className="mt-4 space-y-3 rounded border bg-white p-4" onSubmit={onSubmit}>
        <input className="w-full rounded border px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full rounded border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded bg-slate-900 px-3 py-2 text-white">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p className="mt-3 text-sm">No account? <Link className="underline" href="/register">Register</Link></p>
    </main>
  );
}
