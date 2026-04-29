"use client";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/src/lib/api";

function FailContent() {
  const params = useSearchParams();
  const tranId = params.get("tran_id");
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!tranId) return;
      try {
        const payment = await api.get<any>(`/payment/verify?tran_id=${encodeURIComponent(tranId)}`);
        setEventId(payment?.event?.id || null);
      } catch {
        setEventId(null);
      }
    };
    fetchEvent();
  }, [tranId]);

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-red-700">Payment Failed</h1>
      <p className="mt-2 text-slate-700">Your payment was not completed.</p>
      <Link
        href={eventId ? `/events/${eventId}` : "/events"}
        className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white"
      >
        Back to Event
      </Link>
    </main>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
        </main>
      }
    >
      <FailContent />
    </Suspense>
  );
}
