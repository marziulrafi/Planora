"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGetArray, apiPatch, apiPost } from "@/src/lib/api";
import type { Invitation } from "@/src/lib/types";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setInvitations(await apiGetArray<Invitation>("/invitations/my"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invitations");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const act = async (invitation: Invitation, action: "accept" | "decline") => {
    try {
      if (action === "accept" && (invitation.event?.fee || 0) > 0) {
        const res = await apiPost<{ url?: string; paymentUrl?: string; gatewayUrl?: string }>("/payment/init", { eventId: invitation.eventId });
        window.location.href = res.gatewayUrl || res.url || res.paymentUrl || "/dashboard/invitations";
        return;
      }
      await apiPatch(`/invitations/${invitation.id}/${action}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-semibold">Invitations</h1>
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="space-y-2">
        {invitations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No data found.
          </p>
        ) : invitations.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200 p-4 text-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <p className="mr-auto">
              {item.event?.title || item.eventId}
              <span className={`ml-2 rounded-full px-2 py-1 text-xs ${
                item.status === "APPROVED" ? "bg-blue-100 text-blue-700" : item.status === "PENDING" ? "bg-gray-100 text-gray-700" : "bg-red-100 text-red-700"
              }`}>{item.status}</span>
            </p>
            <button className="rounded-xl bg-green-600 px-3 py-1.5 text-xs text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95" onClick={() => void act(item, "accept")}>
              {(item.event?.fee || 0) > 0 ? "Pay & Accept" : "Accept"}
            </button>
            <button className="rounded-xl bg-red-600 px-3 py-1.5 text-xs text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95" onClick={() => void act(item, "decline")}>Decline</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
