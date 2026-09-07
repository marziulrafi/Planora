import Link from "next/link";
import { notFound } from "next/navigation";
import EventActions from "@/src/components/event/event-actions";
import EventOwnerPanel from "@/src/components/event/event-owner-panel";
import api from "@/src/lib/api";
import type { Event, Participant, Review } from "@/src/lib/types";
import { Calendar, Clock, MapPin, Link2, User, Star, Users, ArrowLeft, ChevronRight } from "lucide-react";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

interface FullEvent extends Event {
  participants?: Participant[];
  reviews?: (Review & { user?: { id: string; name: string; image?: string | null } })[];
  _count?: { participants: number };
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const { id } = await params;

  let event: FullEvent | null = null;
  try {
    event = await api.get<FullEvent>(`/events/${id}`);
  } catch {
    notFound();
  }

  if (!event) notFound();

  const timeZone = "Asia/Dhaka";
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone });
  const eventDayStr = new Date(event.date).toLocaleDateString("en-CA", { timeZone });
  const isPastEvent = eventDayStr < todayStr;
  const backHref = isPastEvent ? "/events/past" : "/events";
  const backLabel = isPastEvent ? "Back to Past Events" : "Back to Upcoming Events";

  const avgRating =
    event.reviews && event.reviews.length > 0
      ? (
        event.reviews.reduce((sum, r) => sum + r.rating, 0) /
        event.reviews.length
      ).toFixed(1)
      : null;

  const participantCount = event._count?.participants ?? 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

        <Link
          href={backHref}
          className="group inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-white hover:text-slate-900 hover:shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          {backLabel}
        </Link>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">

          <div className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            
              <div
                className={`h-1.5 w-full ${event.type === "PUBLIC"
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                    : "bg-gradient-to-r from-amber-400 to-orange-500"
                  }`}
              />

              <div className="p-6 sm:p-8">
             
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${event.type === "PUBLIC"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                          }`}
                      >
                        {event.type}
                      </span>
                      {avgRating && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {avgRating}
                        </span>
                      )}
                    </div>
                    <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                      {event.title}
                    </h1>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-3xl font-bold text-slate-900">
                      {event.fee > 0 ? `BDT ${event.fee}` : "Free"}
                    </p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-sm text-slate-400">
                      <Users className="h-3.5 w-3.5" />
                      {participantCount} joined
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-5 text-base leading-relaxed text-slate-600">
                  {event.description}
                </p>

                {/* Meta grid */}
                <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                  <MetaRow icon={<Calendar className="h-4 w-4" />} label="Date">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </MetaRow>

                  <MetaRow icon={<Clock className="h-4 w-4" />} label="Time">
                    {event.time}
                  </MetaRow>

                  {event.venue && (
                    <MetaRow icon={<MapPin className="h-4 w-4" />} label="Venue">
                      {event.venue}
                    </MetaRow>
                  )}

                  {event.eventLink && (
                    <MetaRow icon={<Link2 className="h-4 w-4" />} label="Online Link">
                      <a
                        href={event.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline"
                      >
                        Join Online
                        <ChevronRight className="h-3 w-3" />
                      </a>
                    </MetaRow>
                  )}

                  <MetaRow icon={<User className="h-4 w-4" />} label="Organizer">
                    {event.owner?.name ?? "Unknown"}
                  </MetaRow>

                  {avgRating && (
                    <MetaRow icon={<Star className="h-4 w-4" />} label="Rating">
                      <span className="flex items-center gap-1">
                        {avgRating} / 5
                        <span className="text-amber-400">
                          {"★".repeat(Math.round(Number(avgRating)))}
                          <span className="text-slate-200">
                            {"★".repeat(5 - Math.round(Number(avgRating)))}
                          </span>
                        </span>
                      </span>
                    </MetaRow>
                  )}
                </div>
              </div>
            </div>

            {event.participants && event.participants.length > 0 && (
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="font-semibold text-slate-900">
                    Participants
                    <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
                      {event._count?.participants ?? event.participants.length}
                    </span>
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {event.participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {((p as any).user?.name ?? p.userId)?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="text-sm font-medium text-slate-800">
                          {(p as any).user?.name ?? p.userId}
                        </span>
                      </div>
                      <ParticipantStatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Sidebar */}
          <aside className="space-y-5">
            {/* Join Card */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div
                className={`h-1.5 w-full ${event.fee > 0
                    ? "bg-gradient-to-r from-blue-500 to-violet-500"
                    : "bg-gradient-to-r from-emerald-400 to-teal-500"
                  }`}
              />
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900">Join This Event</h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Secure your spot and manage participation from your dashboard.
                </p>
                <EventActions event={event} />
              </div>
            </div>

            {/* Quick stats */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Event Stats</h3>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Participants</span>
                  <span className="text-sm font-bold text-slate-900">{participantCount}</span>
                </div>
                {event.reviews && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Reviews</span>
                    <span className="text-sm font-bold text-slate-900">{event.reviews.length}</span>
                  </div>
                )}
                {avgRating && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Avg Rating</span>
                    <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      {avgRating}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Entry</span>
                  <span className="text-sm font-bold text-slate-900">
                    {event.fee > 0 ? `BDT ${event.fee}` : "Free"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <EventOwnerPanel event={event} />

        {event.reviews && event.reviews.length > 0 && (
          <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                Reviews
                <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
                  {event.reviews.length}
                </span>
                {avgRating && (
                  <span className="ml-2 inline-flex items-center gap-1 text-sm text-amber-600">
                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                    {avgRating} avg
                  </span>
                )}
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {event.reviews.map((review) => (
                <div key={review.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {(review.user?.name ?? "A")[0].toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {review.user?.name ?? "Anonymous"}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-100 text-slate-200"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/* ── Helpers ── */

function MetaRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-slate-400">{icon}</span>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800">{children}</p>
      </div>
    </div>
  );
}

function ParticipantStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
    REJECTED: "bg-red-50 text-red-700 ring-red-200",
    BANNED: "bg-slate-100 text-slate-500 ring-slate-200",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${map[status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}>
      {status}
    </span>
  );
}