"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PackFeedbackThanks() {
  const searchParams = useSearchParams();
  const rating = parseInt(searchParams.get("rating") ?? "0", 10);
  const eventId = searchParams.get("eventId") ?? "";
  const email = searchParams.get("email") ?? "";

  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [autoFired, setAutoFired] = useState(false);

  // For sub-4 ratings, auto-fire the comment POST silently on mount
  if (rating > 0 && rating < 4 && !autoFired) {
    setAutoFired(true);
    fetch("/api/pack-feedback/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, eventId, comment: null, displayConsent: false }),
    }).catch(() => {});
  }

  const handleSubmit = () => {
    startTransition(async () => {
      await fetch("/api/pack-feedback/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, eventId, comment, displayConsent: consent }),
      });
      setSubmitted(true);
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <p className="text-sm font-black tracking-widest uppercase text-[#6A6A6A] mb-8">
          Experiences | Curated
        </p>

        <div className="text-3xl mb-4">
          {[1,2,3,4,5].map((s) => (
            <span key={s} className={s <= rating ? "text-[#AAFF00]" : "text-[#2A2A2A]"}>★</span>
          ))}
        </div>

        <h1 className="text-2xl font-black text-white mb-3">
          Thanks for the feedback.
        </h1>

        {rating >= 4 && !submitted && (
          <>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-6">
              What did you love most about the pack? (optional)
            </p>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="The Queue tip alone was worth it…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-sm border border-[#2A2A2A] bg-[#141414] text-sm text-white placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#AAFF00] transition-colors resize-none mb-4"
            />

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 flex-shrink-0 accent-[#AAFF00]"
              />
              <span className="text-xs text-[#6A6A6A] leading-5">
                Experiences | Curated can share my comment and star rating on their website and marketing materials.
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] disabled:opacity-40 transition-colors mb-4"
            >
              {isPending ? "Submitting…" : "Submit"}
            </button>
          </>
        )}

        {(rating < 4 || submitted) && (
          <p className="text-sm text-[#A3A3A3] leading-6 mb-6">
            Your feedback helps us improve the pack for next year.
          </p>
        )}

        <Link
          href="/"
          className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
        >
          Back to Experiences | Curated
        </Link>
      </div>
    </div>
  );
}

export default function PackFeedbackThanksPage() {
  return (
    <Suspense>
      <PackFeedbackThanks />
    </Suspense>
  );
}
