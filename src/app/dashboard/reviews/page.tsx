"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/src/lib/api";
import type { Participant, Review } from "@/src/lib/types";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Participant[]>([]);
  const [form, setForm] = useState({ eventId: "", rating: 5, comment: "" });
  const [editing, setEditing] = useState<{ id: string; comment: string; rating: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [myReviews, participants] = await Promise.all([
        api.get<Review[]>("/reviews/my"),
        api.get<Participant[]>("/participants/my-events"),
      ]);
      setReviews(myReviews);
      setJoinedEvents(participants.filter((p) => p.status === "APPROVED"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const reviewedEventIds = new Set(reviews.map((r) => r.eventId));

  const eligibleEvents = joinedEvents.filter(
    (p) => !reviewedEventIds.has(p.eventId)
  );

  const createReview = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.post("/reviews", { ...form, rating: Number(form.rating) });
      setForm({ eventId: "", rating: 5, comment: "" });
      setSuccess("Review submitted ✓");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setError(null);
    try {
      await api.patch(`/reviews/${editing.id}`, {
        rating: Number(editing.rating),
        comment: editing.comment,
      });
      setEditing(null);
      setSuccess("Review updated ✓");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">My Reviews</h1>

      {error ? (
        <p className="rounded bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded bg-green-50 px-4 py-2 text-sm text-green-700">
          {success}
        </p>
      ) : null}

      {/* Create Review Form */}
      {eligibleEvents.length > 0 && (
        <section className="rounded-xl border bg-white p-5">
          <h2 className="font-medium">Write a Review</h2>
          <form className="mt-4 space-y-3" onSubmit={createReview}>
            {/* Dropdown instead of raw ID input */}
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Select Event *
              </label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={form.eventId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, eventId: e.target.value }))
                }
                required
              >
                <option value="">-- Choose an event --</option>
                {eligibleEvents.map((p) => (
                  <option key={p.eventId} value={p.eventId}>
                    {(p as any).event?.title ?? p.eventId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: n }))}
                    className={`h-9 w-9 rounded-lg text-lg transition ${
                      form.rating >= n
                        ? "bg-amber-400 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Comment *
              </label>
              <textarea
                className="w-full rounded border px-3 py-2 text-sm"
                placeholder="Share your experience…"
                rows={3}
                value={form.comment}
                onChange={(e) =>
                  setForm((p) => ({ ...p, comment: e.target.value }))
                }
                required
              />
            </div>

            <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700">
              Submit Review
            </button>
          </form>
        </section>
      )}

      {/* Edit Review Modal */}
      {editing && (
        <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="font-medium text-blue-900">Edit Review</h2>
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEditing((e) => e && { ...e, rating: n })}
                  className={`h-9 w-9 rounded-lg text-lg transition ${
                    editing.rating >= n
                      ? "bg-amber-400 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded border px-3 py-2 text-sm"
              rows={3}
              value={editing.comment}
              onChange={(e) =>
                setEditing((ed) => ed && { ...ed, comment: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button
                onClick={() => void saveEdit()}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(null)}
                className="rounded border px-4 py-2 text-sm hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Existing Reviews */}
      <section className="rounded-xl border bg-white p-5">
        <h2 className="font-medium">
          Submitted Reviews ({reviews.length})
        </h2>
        {loading ? (
          <p className="mt-2 animate-pulse text-sm text-slate-400">Loading…</p>
        ) : reviews.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No reviews yet.{" "}
            {eligibleEvents.length === 0
              ? "Join and get approved for events to write reviews."
              : "Pick an event above to write your first review."}
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">
                      {(review as any).event?.title ?? review.eventId}
                    </p>
                    <span className="text-amber-500 text-sm">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <p className="mt-1 text-sm text-slate-600">
                      {review.comment}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      className="rounded bg-slate-100 px-2 py-1 text-xs hover:bg-slate-200"
                      onClick={() =>
                        setEditing({
                          id: review.id,
                          comment: review.comment,
                          rating: review.rating,
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      onClick={() => void deleteReview(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
