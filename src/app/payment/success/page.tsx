"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/src/lib/api";

function SuccessContent() {
  const params = useSearchParams();
  const tranId = params.get("tran_id");
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    const confirmAndFetch = async () => {
      if (!tranId) {
        setError("Missing transaction id.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const confirmQuery = sessionId
          ? `?tran_id=${encodeURIComponent(tranId)}&session_id=${encodeURIComponent(sessionId)}`
          : `?tran_id=${encodeURIComponent(tranId)}`;

        await api.get<any>(`/payment/success${confirmQuery}`);

        const data = await api.get<any>(`/payment/verify?tran_id=${encodeURIComponent(tranId)}`);
        if (!data || data.status !== "SUCCESS") {
          throw new Error("Payment is not completed yet. Please wait a moment and refresh.");
        }
        setPayment(data);
      } catch (err: any) {
        setError(err?.message || "Failed to verify payment.");
      } finally {
        setLoading(false);
      }
    };

    confirmAndFetch();
  }, [tranId, sessionId]);

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="rounded-2xl border bg-white p-10 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="mt-5 text-2xl font-bold text-green-700">
          Payment Successful!
        </h1>
        <p className="mt-2 text-slate-600">
          Event joined (pending approval).
        </p>

        {loading && (
          <p className="mt-4 text-sm text-slate-500 animate-pulse">
            Verifying your payment with Stripe...
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {payment && (
          <div className="mt-4 space-y-1">
            <p className="rounded bg-slate-50 px-4 py-2 font-mono text-xs text-slate-500">
              Transaction ID: {payment.tranId}
            </p>
            <p className="text-xs text-slate-500">
              Status:{" "}
              <span className="font-semibold text-green-600">{payment.status}</span>
            </p>
            {payment.event && (
              <p className="text-xs text-slate-500">
                Event:{" "}
                <span className="font-semibold">{payment.event.title}</span>
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/my-events"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
          >
            My Events
          </Link>
          <Link
            href="/events"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Browse More Events
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="h-48 animate-pulse rounded-2xl bg-slate-100" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}