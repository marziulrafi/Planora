"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/src/lib/api";
import { useAuth } from "@/src/hooks/useAuth";
import Spinner from "@/src/components/Spinner";
import type { Event, Participant } from "@/src/lib/types";
import toast from "react-hot-toast";

interface EventOwnerPanelProps {
    event: Event;
}

type UpdateForm = {
    title: string;
    description: string;
    date: string;
    time: string;
    type: "PUBLIC" | "PRIVATE";
    fee: number;
    venue: string;
    eventLink: string;
};

export default function EventOwnerPanel({ event }: EventOwnerPanelProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const isOwner = user?.id === event.ownerId;

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [activeUserId, setActiveUserId] = useState<string | null>(null);
    const [updatingEvent, setUpdatingEvent] = useState(false);
    const [deletingEvent, setDeletingEvent] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const initialForm: UpdateForm = useMemo(
        () => ({
            title: event.title,
            description: event.description,
            date: event.date.split("T")[0] ?? "",
            time: event.time,
            type: event.type,
            fee: event.fee,
            venue: event.venue ?? "",
            eventLink: event.eventLink ?? "",
        }),
        [event]
    );
    const [form, setForm] = useState<UpdateForm>(initialForm);

    const loadParticipants = async () => {
        if (!isOwner) return;
        try {
            setLoadingParticipants(true);
            const list = await api.get<Participant[]>(`/participants/${event.id}`);
            setParticipants(list);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to load participants");
        } finally {
            setLoadingParticipants(false);
        }
    };

    useEffect(() => {
        if (!loading && isOwner) {
            void loadParticipants();
        }
    }, [loading, isOwner]);

    const moderate = async (participant: Participant, action: "approve" | "reject" | "ban") => {
        try {
            setActiveUserId(participant.userId);
            await api.patch(`/participants/${event.id}/participants/${participant.userId}/${action}`);
            toast.success(`Participant ${action}d`);
            await loadParticipants();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update participant");
        } finally {
            setActiveUserId(null);
        }
    };

    const updateEvent = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setUpdatingEvent(true);
            await api.patch(`/events/${event.id}`, {
                ...form,
                fee: Number(form.fee),
            });
            toast.success("Event updated");
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update event");
        } finally {
            setUpdatingEvent(false);
        }
    };

    const deleteEvent = async () => {
        if (!confirm("Delete this event? This action cannot be undone.")) return;
        try {
            setDeletingEvent(true);
            await api.delete(`/events/${event.id}`);
            toast.success("Event deleted");
            router.push("/events");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete event");
        } finally {
            setDeletingEvent(false);
        }
    };

    if (loading || !isOwner) return null;

    return (
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Owner Panel</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        {isEditing ? "Close Edit" : "Edit Event"}
                    </button>
                    <button
                        onClick={() => void deleteEvent()}
                        disabled={deletingEvent}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        {deletingEvent && <Spinner size="sm" className="border-white/40 border-t-white" />}
                        Delete Event
                    </button>
                </div>
            </div>

            {isEditing && (
                <form onSubmit={(e) => void updateEvent(e)} className="mt-4 grid gap-3 md:grid-cols-2">
                    <input
                        required
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Title"
                    />
                    <input
                        value={form.venue}
                        onChange={(e) => setForm((prev) => ({ ...prev, venue: e.target.value }))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Venue"
                    />
                    <input
                        required
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                    <input
                        required
                        value={form.time}
                        onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Time"
                    />
                    <select
                        value={form.type}
                        onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as "PUBLIC" | "PRIVATE" }))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>
                    <input
                        type="number"
                        min={0}
                        value={form.fee}
                        onChange={(e) => setForm((prev) => ({ ...prev, fee: Number(e.target.value) }))}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Fee"
                    />
                    <input
                        value={form.eventLink}
                        onChange={(e) => setForm((prev) => ({ ...prev, eventLink: e.target.value }))}
                        className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Event link"
                    />
                    <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        placeholder="Description"
                    />
                    <button
                        type="submit"
                        disabled={updatingEvent}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
                    >
                        {updatingEvent && <Spinner size="sm" className="border-white/40 border-t-white" />}
                        Save Changes
                    </button>
                </form>
            )}

            <div className="mt-6">
                <h3 className="text-base font-semibold">Participants</h3>
                {loadingParticipants ? (
                    <div className="mt-3">
                        <Spinner />
                    </div>
                ) : participants.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-500">No participants yet.</p>
                ) : (
                    <div className="mt-3 space-y-2">
                        {participants.map((participant) => (
                            <div
                                key={participant.id}
                                className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-3"
                            >
                                <div className="mr-auto">
                                    <p className="text-sm font-medium">{participant.user?.name ?? participant.userId}</p>
                                    <p className="text-xs text-slate-500">{participant.user?.email ?? ""}</p>
                                    <p className="text-xs font-semibold text-slate-700">
                                        Status: {participant.status}
                                        {participant.joinedViaInvitation ? " · invited" : " · request"}
                                    </p>
                                </div>

                                {participant.status === "PENDING" && !participant.joinedViaInvitation && (
                                    <button
                                        onClick={() => void moderate(participant, "approve")}
                                        disabled={activeUserId === participant.userId}
                                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                                    >
                                        Approve
                                    </button>
                                )}
                                {participant.status === "PENDING" && (
                                    <button
                                        onClick={() => void moderate(participant, "reject")}
                                        disabled={activeUserId === participant.userId}
                                        className="rounded-md bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-yellow-600 disabled:opacity-60"
                                    >
                                        Reject
                                    </button>
                                )}
                                {participant.status === "APPROVED" && (
                                    <button
                                        onClick={() => void moderate(participant, "ban")}
                                        disabled={activeUserId === participant.userId}
                                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                                    >
                                        Ban
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
