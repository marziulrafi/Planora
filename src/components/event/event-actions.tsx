"use client";

import { useState } from "react";
import { apiPost } from "@/src/lib/api";
import type { Event } from "@/src/lib/types";

export default function EventActions({ event }: { event: Event }) {
  const [message, setMessage] = useState("");

  const buttonText =
    event.type === "PUBLIC" && event.fee <= 0
      ? "Join"
      : event.type === "PUBLIC" && event.fee > 0
        ? "Pay & Join"
        : event.type === "PRIVATE" && event.fee <= 0
          ? "Request"
          : "Pay & Request";

  const onAction = async () => {
    try {
      setMessage("");
      if (event.fee > 0) {
        const res = await apiPost<{ gatewayUrl?: string; paymentUrl?: string; url?: string }>("/payment/init", { eventId: event.id });
        const redirectUrl = res.gatewayUrl || res.paymentUrl || res.url;
        if (redirectUrl) window.location.href = redirectUrl;
        return;
      }
      if (event.type === "PUBLIC") {
        await apiPost("/participants", { eventId: event.id, action: "join" });
        setMessage("Successfully joined this event.");
      } else {
        await apiPost(`/participants/${event.id}/request`);
        setMessage("Request sent successfully.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed");
    }
  };

  return (
    <div className="mt-4">
      <button onClick={() => void onAction()} className="rounded bg-slate-900 px-4 py-2 text-white">
        {buttonText}
      </button>
      {message ? <p className="mt-3 text-sm">{message}</p> : null}
    </div>
  );
}
