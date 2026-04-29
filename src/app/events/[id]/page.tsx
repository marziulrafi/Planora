import Link from "next/link";
import { notFound } from "next/navigation";
import EventActions from "@/src/components/event/event-actions";
import EventOwnerPanel from "@/src/components/event/event-owner-panel";
import api from "@/src/lib/api";
import type { Event, Participant, Review } from "@/src/lib/types";


interface EventPageProps {
  params: Promise<{ id: string }> | { id: string };
}

interface FullEvent extends Event {
  participants?: Participant[];
  reviews?: (Review & { user?: { id: string; name: string; image?: string | null } })[];
  _count?: { participants: number };
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const { id } = await Promise.resolve(params);

  let event: FullEvent | null = null;
  try {
    event = await api.get<FullEvent>(`/events/${id}`);
  } catch {
    notFound();
  }

  if (!event) notFound();

  const avgRating =
    event.reviews && event.reviews.length > 0
      ? (
        event.reviews.reduce((sum, r) => sum + r.rating, 0) /
        event.reviews.length
      ).toFixed(1)
      : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/events"
        className="text-sm text-slate-500 hover:underline"
      >
        ← Back to Events
      </Link>

      {/* Main Event Card */}
      <section className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span
                className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${event.type === "PUBLIC"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {event.type}
              </span>
              <h1 className="mt-2 text-4xl font-bold">{event.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">
                {event.fee > 0 ? `BDT ${event.fee}` : "Free"}
              </p>
              <p className="text-sm text-slate-500">
                {event._count?.participants ?? 0} participants
              </p>
            </div>
          </div>

          <p className="mt-4 text-base leading-relaxed text-slate-700">{event.description}</p>

          <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>
              📅{" "}
              <span className="font-medium">Date:</span>{" "}
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              🕐 <span className="font-medium">Time:</span> {event.time}
            </p>
            {event.venue && (
              <p>
                📍 <span className="font-medium">Venue:</span> {event.venue}
              </p>
            )}
            {event.eventLink && (
              <p>
                🔗{" "}
                <span className="font-medium">Link:</span>{" "}
                <a
                  href={event.eventLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Join Online
                </a>
              </p>
            )}
            <p>
              👤 <span className="font-medium">Organizer:</span>{" "}
              {event.owner?.name ?? "Unknown"}
            </p>
            {avgRating && (
              <p>
                ⭐ <span className="font-medium">Rating:</span> {avgRating} / 5
              </p>
            )}
          </div>

        </div>
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Join This Event</h2>
          <p className="mt-2 text-sm text-slate-600">
            Secure your spot and manage participation from your dashboard.
          </p>
          {/* Action buttons */}
          <EventActions event={event} />
        </aside>
      </section>

      {/* Participant List */}
      {event.participants && event.participants.length > 0 && (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">
            Participants ({event._count?.participants ?? event.participants.length})
          </h2>
          <div className="mt-3 space-y-2">
            {event.participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <span>{(p as any).user?.name ?? p.userId}</span>
                <span className="text-xs font-semibold text-slate-600">{p.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Owner controls */}
      <EventOwnerPanel event={event} />

      {/* Reviews */}
      {event.reviews && event.reviews.length > 0 && (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold">
            Reviews ({event.reviews.length}) · Avg {avgRating}/5
          </h2>
          <div className="mt-3 space-y-3">
            {event.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">
                    {review.user?.name ?? "Anonymous"}
                  </p>
                  <span className="text-sm font-semibold text-amber-600">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
