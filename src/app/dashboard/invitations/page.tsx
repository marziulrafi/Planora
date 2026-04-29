"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api, { ensureSession } from "@/src/lib/api";
import type { Invitation } from "@/src/lib/types";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInvitationId, setActiveInvitationId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      await ensureSession();
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
      setActiveInvitationId(invitation.id);
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
    } finally {
      setActiveInvitationId(null);
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
            <div key={invitation.id} className="rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Event</p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {invitation.event?.title ?? "Untitled Event"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    From: {invitation.sender?.name ?? "Event Owner"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${invitation.status === "PENDING"
                    ? "bg-amber-100 text-amber-700"
                    : invitation.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : "bg-rose-100 text-rose-700"
                    }`}
                >
                  {invitation.status}
                </span>
              </div>

              {invitation.status === "PENDING" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => void act(invitation, "accept")}
                    disabled={activeInvitationId === invitation.id}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {activeInvitationId === invitation.id && (
                      <Spinner size="sm" className="border-white/40 border-t-white" />
                    )}
                    Accept
                  </button>
                  <button
                    onClick={() => void act(invitation, "decline")}
                    disabled={activeInvitationId === invitation.id}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
