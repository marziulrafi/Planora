"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiPatch } from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  // Initialize fields AFTER user loads from session (async)
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiPatch("/auth/profile", { name, phone });
      await refreshUser();
      setMessage({ text: "Profile updated successfully.", ok: true });
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to update profile",
        ok: false,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-semibold">Profile Settings</h1>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Avatar / name header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-600">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold">{user?.name ?? "—"}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span
              className={`mt-0.5 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                user?.role === "ADMIN"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form className="mt-6 space-y-4" onSubmit={save}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Display Name
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
              value={user?.email ?? ""}
              disabled
            />
            <p className="mt-1 text-xs text-slate-400">
              Email cannot be changed.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1XXX XXXXXX"
            />
          </div>

          {message && (
            <p
              className={`rounded px-3 py-2 text-sm ${
                message.ok
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </section>
    </motion.div>
  );
}
