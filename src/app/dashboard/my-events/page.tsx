"use client";

import { FormEvent, useEffect, useState } from "react";
import api, {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";
import type { Event, Participant } from "@/src/lib/types";
import toast from "react-hot-toast";
import Spinner from "@/src/components/Spinner";

const emptyForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  type: "PUBLIC",
  fee: 0,
  venue: "",
  eventLink: "",
};

export default function MyEventsPage() {
  const { user } = useAuth();

  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Participant[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, fee: Number(form.fee) };
      if (editingId) {
        await toast.promise(apiPatch(`/events/${editingId}`, payload), {
          loading: "Updating event...",
          success: "Event updated",
          error: (err) =>
            err instanceof Error ? err.message : "Failed to save event",
        });
        setEditingId(null);
      } else {
        await toast.promise(apiPost("/events", payload), {
          loading: "Creating event...",
          success: "Event created",
          error: (err) =>
            err instanceof Error ? err.message : "Failed to save event",
        });
      }
      setForm(emptyForm);
      await load();
    } catch {
    }
  };

  const startEdit = (ev: Event) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date.split("T")[0],
      time: ev.time,
      type: ev.type,
      fee: ev.fee,
      venue: ev.venue ?? "",
      eventLink: ev.eventLink ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const removeEvent = async (eventId: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await toast.promise(apiDelete(`/events/${eventId}`), {
        loading: "Deleting event...",
        success: "Event deleted",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to delete event",
      });
      await load();
    } catch {
    }
  };

  const loadParticipants = async (eventId: string) => {
    setSelectedEventId(eventId);
    try {
      const list = await api.get<Participant[]>(`/participants/${eventId}`);
      setParticipants(list);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load participants"
      );
    }
  };

  const moderate = async (
    eventId: string,
    userId: string,
    action: "approve" | "reject" | "ban"
  ) => {
    const actionLabel: Record<"approve" | "reject" | "ban", string> = {
      approve: "approved",
      reject: "rejected",
      ban: "banned",
    };
    try {
      await toast.promise(
        apiPatch(`/participants/${eventId}/participants/${userId}/${action}`),
        {
          loading: "Updating participant...",
          success: `Participant ${actionLabel[action]}`,
          error: (err) => (err instanceof Error ? err.message : "Action failed"),
        }
      );
      await loadParticipants(eventId);
    } catch {
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Events</h1>

      {/* Create / Edit Form */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="font-medium">
          {editingId ? "Edit Event" : "Create New Event"}
        </h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Venue"
            value={form.venue}
            onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))}
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            required
          />
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Time (e.g. 6:00 PM)"
            value={form.time}
            onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
            required
          />
          <select
            className="rounded border px-3 py-2 text-sm"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
          <input
            className="rounded border px-3 py-2 text-sm"
            type="number"
            min={0}
            placeholder="Fee (0 = Free)"
            value={form.fee}
            onChange={(e) =>
              setForm((p) => ({ ...p, fee: Number(e.target.value) }))
            }
          />
          <input
            className="col-span-full rounded border px-3 py-2 text-sm md:col-span-2"
            placeholder="Event link (optional)"
            value={form.eventLink}
            onChange={(e) =>
              setForm((p) => ({ ...p, eventLink: e.target.value }))
            }
          />
          <textarea
            className="rounded border px-3 py-2 text-sm md:col-span-2"
            placeholder="Description *"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            required
          />
          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
            >
              {editingId ? "Update Event" : "Create Event"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

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
              <div
                key={ev.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm"
              >
                <div className="mr-auto">
                  <p className="font-medium">{ev.title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(ev.date).toLocaleDateString()} ·{" "}
                    {ev.fee > 0 ? `BDT ${ev.fee}` : "Free"} · {ev.type}
                  </p>
                </div>
                <button
                  className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200"
                  onClick={() => void loadParticipants(ev.id)}
                >
                  Participants
                </button>
                <button
                  className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                  onClick={() => startEdit(ev)}
                >
                  Edit
                </button>
                <button
                  className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                  onClick={() => void removeEvent(ev.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Participants Panel */}
      {selectedEventId && (
        <section className="rounded-xl border bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Manage Participants</h2>
            <button
              className="text-xs text-slate-500 hover:underline"
              onClick={() => setSelectedEventId("")}
            >
              Close
            </button>
          </div>
          {participants.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No participants yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm"
                >
                  <div className="mr-auto">
                    <p className="font-medium">
                      {(p as any).user?.name ?? p.userId}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        p.status === "APPROVED"
                          ? "text-green-600"
                          : p.status === "PENDING"
                            ? "text-amber-600"
                            : "text-red-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  {p.status === "PENDING" && (
                    <button
                      className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                      onClick={() => void moderate(selectedEventId, p.userId, "approve")}
                    >
                      Approve
                    </button>
                  )}
                  {p.status !== "REJECTED" && (
                    <button
                      className="rounded bg-yellow-500 px-2 py-1 text-xs text-white hover:bg-yellow-600"
                      onClick={() => void moderate(selectedEventId, p.userId, "reject")}
                    >
                      Reject
                    </button>
                  )}
                  {p.status !== "BANNED" && (
                    <button
                      className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      onClick={() => void moderate(selectedEventId, p.userId, "ban")}
                    >
                      Ban
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

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
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between rounded-lg border p-3 text-sm"
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
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
