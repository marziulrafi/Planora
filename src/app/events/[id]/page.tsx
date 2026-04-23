import Link from "next/link";
import { notFound } from "next/navigation";
import EventActions from "@/src/components/event/event-actions";
import type { Event } from "@/src/lib/types";

interface EventPageProps {
  params: { id: string };
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const res = await fetch(`${baseUrl}/events/${params.id}`, { cache: "no-store" });
  if (!res.ok) {
    notFound();
  }
  const payload = await res.json();
  const event = (payload?.data ?? payload) as Event | null;
  if (!event) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/events" className="text-sm text-slate-600 hover:underline">Back</Link>
      <section className="mt-4 rounded border bg-white p-6">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <p className="mt-2 text-slate-700">{event.description}</p>
        <p className="mt-3 text-sm text-slate-600">Date: {new Date(event.date).toLocaleString()}</p>
        <p className="text-sm text-slate-600">Organizer: {event.owner?.name || event.ownerId}</p>
        <p className="text-sm text-slate-600">Fee: {event.fee > 0 ? `BDT ${event.fee}` : "Free"}</p>
        <EventActions event={event} />
      </section>
    </main>
  );
}
