"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";
import type { Event, Participant } from "@/src/lib/types";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

interface Props {
  event: Event;
}

export default function EventActions({ event }: Props) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
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
          onClick={() => router.push("/login")}
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

      if (isPaid) {
        const res = await toast.promise(
          api.post<{ gatewayUrl?: string; paymentUrl?: string; url?: string }>(
            "/payment/initiate",
            { eventId: event.id }
          ),
          {
            loading: "Redirecting to payment...",
            success: "Payment initiated",
            error: (err) => err instanceof Error ? err.message : "Failed to initiate payment",
          }
        );
        const redirectUrl = res.gatewayUrl ?? res.paymentUrl ?? res.url;
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          toast.error("Failed to get payment URL. Please try again.");
        }
        return;
      }

      if (isPublicFree) {
        await toast.promise(
          api.post(`/participants/${event.id}/join`, {}),
          {
            loading: "Joining event...",
            success: "✅ Successfully joined this event!",
            error: (err) => err instanceof Error ? err.message : "Failed to join event",
          }
        );
        setParticipantStatus("APPROVED");
        return;
      }

      if (isPrivateFree) {
        await toast.promise(
          api.post(`/participants/${event.id}/request`, {}),
          {
            loading: "Sending request...",
            success: "⏳ Request sent! Waiting for host approval.",
            error: (err) => err instanceof Error ? err.message : "Failed to send request",
          }
        );
        setParticipantStatus("PENDING");
        return;
      }

    } catch {
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => void onAction()}
        disabled={busy}
        className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md active:scale-95 disabled:opacity-60"
      >
        {busy && <Spinner size="sm" className="border-white/40 border-t-white" />}
        {busy ? "Processing…" : buttonLabel}
      </button>
    </div>
  );
}