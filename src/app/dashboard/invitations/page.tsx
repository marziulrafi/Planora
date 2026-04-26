"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/src/lib/api";
import type { Invitation } from "@/src/lib/types";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const response = await api.get<Invitation[]>("/invitations/my");
      setInvitations(response);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load invitations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const act = async (invitation: Invitation, action: "accept" | "decline") => {
    try {
      if (action === "accept" && (invitation.event?.fee || 0) > 0) {
        const paymentPromise = api.post<{
          url?: string;
          paymentUrl?: string;
          gatewayUrl?: string;
        }>("/payment/init", { eventId: invitation.eventId });
        const res = await toast.promise(paymentPromise, {
          loading: "Redirecting to payment...",
          success: "Payment initiated",
          error: (err) => (err instanceof Error ? err.message : "Payment failed"),
        });
        window.location.href = res.gatewayUrl || res.url || res.paymentUrl || "/dashboard/invitations";
        return;
      }
      await toast.promise(api.patch(`/invitations/${invitation.id}/${action}`), {
        loading: "Processing invitation...",
        success: action === "accept" ? "Invitation accepted" : "Invitation declined",
        error: (err) => (err instanceof Error ? err.message : "Action failed"),
      });
      await load();
    } catch {
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
      <div className="space-y-2">
        {loading ? (
          <Spinner centered />
        ) : invitations.length === 0 ? (
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
