"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";
import type { Event, Participant } from "@/src/lib/types";

interface Props {
  event: Event;
}

export default function EventActions({ event }: Props) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [participantStatus, setParticipantStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const participants = (event as any).participants as Participant[] | undefined;
    if (participants) {
      const myEntry = participants.find((p) => p.userId === user.id);
      setParticipantStatus(myEntry?.status ?? null);
    }
  }, [user, isAuthenticated, event]);

  if (loading) return null;

  if (isAuthenticated && user?.id === event.ownerId) {
    return (
      <div className="mt-4">
        <button
          onClick={() => router.push("/dashboard/my-events")}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-200 hover:shadow-md active:scale-95"
        >
          Manage Event →
        </button>
      </div>
    );
  }

  if (participantStatus) {
    const labels: Record<string, string> = {
      APPROVED: "✅ You are a confirmed participant",
      PENDING: "⏳ Your request is pending approval",
      REJECTED: "❌ Your request was rejected",
      BANNED: "🚫 You have been banned from this event",
    };
    return (
      <div className="mt-4">
        <p>{labels[participantStatus]}</p>
      </div>
    );
  }

  const handleJoin = async (action: "join" | "request") => {
    try {
      setBusy(true);
      setMessage("");
      if (action === "join" && event.fee > 0) {
        const res = await api.post<{ gatewayUrl?: string; paymentUrl?: string; url?: string }>(
          "/participants",
          { eventId: event.id, action: "join" }
        );
        window.location.href = res.gatewayUrl || res.url || res.paymentUrl || "/dashboard/my-events";
        return;
      }
      await api.post("/participants", { eventId: event.id, action });
      setMessage("Request sent successfully");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to join event");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => void handleJoin("request")}
        disabled={busy}
        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95 disabled:opacity-60"
      >
        {busy ? "Processing…" : "Request to Join"}
      </button>
      {message ? (
        <p className="mt-2 text-sm text-slate-700">{message}</p>
      ) : null}
    </div>
  );
}
