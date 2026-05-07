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
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded-2xl border bg-white p-10 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">⚠️</span>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-red-700">
          Payment Failed
        </h1>
        <p className="mt-2 text-slate-600">
          Your payment was not completed. Please try again.
        </p>

        {tranId && (
          <p className="mt-3 rounded bg-slate-50 px-4 py-2 font-mono text-xs text-slate-500">
            Transaction ID: {tranId}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href={eventId ? `/events/${eventId}` : "/events"}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            {eventId ? "Try Again" : "Browse Events"}
          </Link>
          <Link
            href="/dashboard/my-events"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            My Events
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
        </main>
      }
    >
      <FailContent />
    </Suspense>
  );
}