"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiGet } from "@/src/lib/api";
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
        <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {labels[participantStatus] ?? participantStatus}
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-4">
        <button
          onClick={() => router.push(`/login`)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95"
        >
          Login to Join
        </button>
      </div>
    );
  }

  const isPublicFree = event.type === "PUBLIC" && event.fee <= 0;
  const isPrivateFree = event.type === "PRIVATE" && event.fee <= 0;
  const isPaid = event.fee > 0;

  const buttonLabel = isPublicFree
    ? "Join Free"
    : isPaid
      ? `Pay BDT ${event.fee} & Join`
      : "Request to Join";

  const onAction = async () => {
    try {
      setBusy(true);
      setMessage("");

      if (isPaid) {
        try {
          const res = await apiPost<{ gatewayUrl?: string; paymentUrl?: string; url?: string }>(
            "/payment/init",
            { eventId: event.id }
          );
          const redirectUrl = res.gatewayUrl ?? res.paymentUrl ?? res.url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            setMessage("Failed to get payment URL. Please try again.");
          }
        } catch (err) {
          setMessage(err instanceof Error ? err.message : "Failed to initiate payment. Please try again.");
        }
        return;
      }

      if (isPublicFree) {
        await apiPost("/participants", { eventId: event.id, action: "join" });
        setParticipantStatus("APPROVED");
        setMessage("✅ Successfully joined this event!");
      } else if (isPrivateFree) {
        await apiPost("/participants", { eventId: event.id, action: "request" });
        setParticipantStatus("PENDING");
        setMessage("⏳ Request sent! Waiting for host approval.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => void onAction()}
        disabled={busy}
        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95 disabled:opacity-60"
      >
        {busy ? "Processing…" : buttonLabel}
      </button>
      {message ? (
        <p className="mt-2 text-sm text-slate-700">{message}</p>
      ) : null}
    </div>
  );
}
