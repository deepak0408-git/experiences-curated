"use client";

import { useState, useTransition } from "react";
import { rateEventPack } from "../actions";

// Compact 1-5 star widget next to ShareGuideButton. Writes into the same
// event_pack_feedback table as the post-trip email rating flow (upsert on
// email+sportingEventId) — see rateEventPack in actions.ts for why this
// intentionally never fires the curator notification email that the
// comment-flow route sends.
export default function RateGuideButton({
  sportingEventId,
  slug,
  initialRating,
}: {
  sportingEventId: string;
  slug: string;
  initialRating: number | null;
}) {
  const [rating, setRating] = useState(initialRating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [isPending, startTransition] = useTransition();

  const rate = (value: number) => {
    setRating(value);
    startTransition(async () => {
      await rateEventPack(sportingEventId, slug, value);
    });
  };

  const display = hovered || rating;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#2A2A2A] text-xs font-medium text-[#6A6A6A]"
      onMouseLeave={() => setHovered(0)}
    >
      <span>{rating > 0 ? "Your rating" : "Rate guide"}</span>
      <span className="flex" role="radiogroup" aria-label="Rate this guide">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={s === rating}
            aria-label={`${s} star${s > 1 ? "s" : ""}`}
            disabled={isPending}
            onMouseEnter={() => setHovered(s)}
            onClick={() => rate(s)}
            className={`leading-none text-sm px-0.5 transition-colors disabled:opacity-50 ${
              s <= display ? "text-[#AAFF00]" : "text-[#3A3A3A] hover:text-[#AAFF00]/60"
            }`}
          >
            ★
          </button>
        ))}
      </span>
    </div>
  );
}
