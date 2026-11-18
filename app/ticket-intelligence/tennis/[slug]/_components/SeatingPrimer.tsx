"use client";

import { useState } from "react";
import type { TicketOption } from "../_lib/types";

// SEO-only content block below the quiz's submit button — tennis
// counterpart to F1's app/ticket-intelligence/[slug]/_components/
// SeatingPrimer.tsx, but deliberately shallower. Founder correction, 18
// Nov 2026: an earlier court-by-court draft (arena name + per-court
// category count + seating-block labels, e.g. "Centre Court — 9
// categories: blocks A-T, U-Z, ZA-ZF") was rejected — TeaserResult.tsx
// blurs exactly that level of detail (arena/court name + category) behind
// the $10 paywall, so surfacing it for free in this primer would
// materially substitute for the paid answer, not just describe the
// tournament's general shape. This version stays at the tournament level
// only: how many courts exist and that both reserved and unreserved
// options exist — never a court name, category count, or seating-block
// label. No arena-level grouping of `options` is done here on purpose.
// Placement below the submit button (not above the quiz questions) is the
// same founder request as F1's — the page's initial viewport stays
// unchanged; this is only visible once a visitor scrolls past the quiz.
//
// No env-var kill switch — founder direction, 18 Nov 2026: this stays on
// permanently, no toggle needed.

export default function SeatingPrimer({ eventName, options }: { eventName: string; options: TicketOption[] }) {
  const [open, setOpen] = useState(false);

  if (options.length === 0) return null;

  const tournamentName = eventName.replace(/\s*\d{4}$/, "").trim();
  const courtCount = new Set(options.filter((o) => o.arenaCode !== "GP").map((o) => o.arenaName)).size;
  const hasGroundPass = options.some((o) => o.arenaCode === "GP");

  if (courtCount === 0) return null;

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="mt-6"
    >
      <summary className="flex items-center gap-2 text-[13px] text-[#6A6A6A] cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <span className={`text-[10px] transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
        About tickets at {tournamentName}
      </summary>
      <div className="mt-2 text-[13px] text-[#8a8a8a] leading-relaxed">
        <p className="mt-3">
          {tournamentName} spreads ticketed play across {courtCount} main court{courtCount === 1 ? "" : "s"}, each
          with its own range of reserved seating categories and price points
          {hasGroundPass ? ", plus an unreserved grounds-access option that moves between courts rather than a fixed seat" : ""}.
          Which court, category, and session actually suits you depends on how you want to watch and which rounds
          you&apos;re attending — that&apos;s what the quiz below works out.
        </p>
      </div>
    </details>
  );
}
