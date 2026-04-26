"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/src/lib/api";
import type { Invitation } from "@/src/lib/types";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      const response = await api.get<Invitation[]>("/invitations/my");
      setInvitations(response);
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
        const res = await api.post<{ url?: string; paymentUrl?: string; gatewayUrl?: string }>("/payment/init", { eventId: invitation.eventId });
        window.location.href = res.gatewayUrl || res.url || res.paymentUrl || "/dashboard/invitations";
        return;
      }
      await api.patch(`/invitations/${invitation.id}/${action}`);
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
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No invitations found.</p>
        ) : (
          invitations.map((invitation) => (
            <div key={invitation.id}>
              {/* Render invitation details */}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
