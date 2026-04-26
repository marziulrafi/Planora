"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/src/lib/api";
import type { Event, Participant } from "@/src/lib/types";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [owned, joined] = await Promise.all([
        api.get<Event[]>("/events/my"),
        api.get<Participant[]>("/participants/my-events"),
      ]);
      setMyEvents(owned);
      setJoinedEvents(joined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Events</h1>

      {/* My Created Events */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="font-medium">Created Events ({myEvents.length})</h2>
        {loading ? (
          <div className="mt-2">
            <Spinner />
          </div>
        ) : myEvents.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            You haven&apos;t created any events yet.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {myEvents.map((ev) => (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="block rounded-lg border p-3 text-sm transition hover:bg-slate-50"
              >
                <p className="font-medium">{ev.title}</p>
                <p className="text-xs text-slate-500">
                  {new Date(ev.date).toLocaleDateString()} ·{" "}
                  {ev.fee > 0 ? `BDT ${ev.fee}` : "Free"} · {ev.type}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Joined Events */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="font-medium">Joined Events ({joinedEvents.length})</h2>
        {loading ? (
          <div className="mt-2">
            <Spinner />
          </div>
        ) : joinedEvents.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            You haven&apos;t joined any events yet.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {joinedEvents.map((p) => (
              <Link
                key={p.id}
                href={`/events/${p.eventId}`}
                className="flex flex-wrap items-center justify-between rounded-lg border p-3 text-sm transition hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium">
                    {(p as any).event?.title ?? p.eventId}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(p as any).event?.date
                      ? new Date((p as any).event.date).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    p.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : p.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {p.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
