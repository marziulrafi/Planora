"use client";

import { FormEvent, useMemo, useState } from "react";
import api from "@/src/lib/api";
import Spinner from "@/src/components/Spinner";
import toast from "react-hot-toast";

interface SendInvitationFormProps {
    eventId: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SendInvitationForm({ eventId }: SendInvitationFormProps) {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);

    const trimmedEmail = useMemo(() => email.trim(), [email]);
    const isEmailValid = EMAIL_REGEX.test(trimmedEmail);
    const disabled = sending || !trimmedEmail || !isEmailValid;

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isEmailValid) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setSending(true);
            await api.post("/invitations", { email: trimmedEmail, eventId });
            toast.success("Invitation sent");
            setEmail("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to send invitation");
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={(e) => void onSubmit(e)} className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Send Invitation</p>
            <div className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                />
                <button
                    type="submit"
                    disabled={disabled}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {sending && <Spinner size="sm" className="border-white/40 border-t-white" />}
                    {sending ? "Sending..." : "Send"}
                </button>
            </div>
        </form>
    );
}

