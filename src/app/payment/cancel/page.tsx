import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-amber-700">Payment Cancelled</h1>
      <p className="mt-2 text-slate-700">You cancelled the payment session.</p>
      <Link href="/events" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-white">
        Back to Events
      </Link>
    </main>
  );
}
