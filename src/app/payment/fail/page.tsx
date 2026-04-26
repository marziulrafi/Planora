"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet } from "@/src/lib/api";

export default function PaymentFailPage() {
  const params = useSearchParams();
  const tranId = params.get("tran_id");
  const [eventId, setEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!tranId) return;
      try {
        const payment = await apiGet<any>(`/payment/verify?tran_id=${encodeURIComponent(tranId)}`);
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
