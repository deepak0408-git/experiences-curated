"use client";

import { useState } from "react";

// SEO-only content block below the quiz's submit button — Trip
// Intelligence counterpart to Ticket Intelligence's SeatingPrimer.tsx
// pattern, built 18 Nov 2026. Unlike Ticket Intelligence, Trip
// Intelligence is entirely free (no paywalled personalization to protect),
// so this can be a genuinely substantial static primer rather than a thin
// generic template — there's nothing commercially sensitive to withhold.
// Same mechanism: closed-by-default <details>, plain text (no card/border
// styling per founder direction on the Ticket Intelligence primers),
// placed after the submit button so the page's initial viewport is
// unchanged.
//
// No env-var kill switch — founder direction, 18 Nov 2026: this stays on
// permanently, no toggle needed.

export default function TripIntelligencePrimer() {
  const [open, setOpen] = useState(false);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="mt-6"
    >
      <summary className="flex items-center gap-2 text-[13px] text-[#6A6A6A] cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <span className={`text-[10px] transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
        How this match works
      </summary>
      <div className="mt-2 text-[13px] text-[#8a8a8a] leading-relaxed">
        <p className="mt-3">
          Every Grand Prix is a different trip, not just a different race. Some circuits are built for the racing
          itself — legendary corners and pure motorsport history. Others are street-circuit spectacles with a city
          skyline and a night-race atmosphere, or glamour-first weekends built around exclusive experiences as much
          as the track action. Some suit fans who want everything easy — convenient transport, predictable weather,
          minimal planning — while others reward the fans happy to go further for the right race.
        </p>
        <p className="mt-2">
          There&apos;s no single &quot;best&quot; Grand Prix — the right one depends on what you&apos;re actually
          optimizing for: trackside views versus exploring the city, cost versus experience, comfort versus
          adventure. This quiz compares every real Grand Prix on the calendar against those trade-offs and matches
          you to the one that actually fits what you told us, free, with no signup required.
        </p>
      </div>
    </details>
  );
}
