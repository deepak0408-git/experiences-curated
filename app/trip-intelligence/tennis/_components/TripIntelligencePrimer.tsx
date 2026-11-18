"use client";

import { useState } from "react";

// SEO-only content block below the quiz's submit button — tennis
// counterpart to app/trip-intelligence/formula-1/_components/
// TripIntelligencePrimer.tsx. Same reasoning: Trip Intelligence is
// entirely free, so this is a genuinely substantial static primer, not a
// thin template — see that file's header comment for the full rationale.
// Written with its own copy reflecting this quiz's actual question
// themes (heritage vs. modern spectacle, show courts vs. outside courts),
// not a reskin of the F1 version.
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
          Each Grand Slam has its own personality, not just its own surface. Some lean into timeless tradition and
          iconic rituals, others feel more like a modern entertainment spectacle. Some fans want marquee matches on
          the big show courts; others would rather wander the outside courts, catch a practice session, and
          discover players away from the main stadium. The atmosphere shifts too — high-energy crowds and passionate
          reactions at one tournament, a calmer, more focused watching experience at another.
        </p>
        <p className="mt-2">
          There&apos;s no single &quot;best&quot; Grand Slam — the right one depends on what you&apos;re actually
          weighing: tennis-only focus versus exploring the host city, convenience versus a willingness to navigate
          crowds, budget versus the right experience at any price. This quiz compares every Grand Slam against
          those trade-offs and matches you to the one that fits what you told us, free, with no signup required.
        </p>
      </div>
    </details>
  );
}
