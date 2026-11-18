"use client";

import { useState } from "react";
import type { ActionTag, Seat, SeatType } from "../_lib/types";

// SEO-only content block below the quiz's submit button — Issue 2
// investigation, 18 Nov 2026: Ticket Intelligence pages had no crawlable
// substance beyond a one-line templated title/description, since the real
// content lives entirely behind the quiz interaction. This renders a
// short, generic, data-driven summary of the circuit's seat-type mix
// (never a specific seat name, rationale, or price — that stays behind
// the $10 quiz) inside a closed-by-default <details> element: real HTML a
// crawler indexes either way, visually a single collapsed line a visitor
// never sees unless they scroll past the entire quiz. Founder-approved 18
// Nov 2026 after a visual mockup
// (https://claude.ai/artifact/CYWeabA7cvJwvYS1rbALwu); placement moved
// from above the quiz questions to below the submit button the same day,
// per founder request, so the page's initial viewport is completely
// unchanged from before this was built.
//
// No env-var kill switch — founder direction, 18 Nov 2026: this stays on
// permanently, no toggle needed.
//
// F1 only for now (circuitSeatingProfile's seatType/actionTags shape).
// Tennis Ticket Intelligence uses a structurally different data model
// (arena/stage/session, not seat type/action tags) — a tennis equivalent
// would need its own template, not a reuse of this one.

const SEAT_TYPE_LABEL: Record<SeatType, { plural: string; nounSingular: string; nounPlural: string }> = {
  grandstand: { plural: "grandstand", nounSingular: "stand", nounPlural: "stands" },
  festival_lawn: { plural: "general admission", nounSingular: "zone", nounPlural: "zones" },
  hospitality: { plural: "hospitality", nounSingular: "suite", nounPlural: "suites" },
};

const SEAT_TYPE_BLURB: Record<SeatType, string> = {
  grandstand: "fixed seats with a named view",
  festival_lawn: "flexible, walk-around general admission",
  hospitality: "catered, covered, premium access",
};

const ACTION_TAG_LABEL: Record<ActionTag, string> = {
  overtaking: "overtaking zones",
  start_grid: "the start/grid",
  high_speed: "high-speed sections",
  technical_corner: "technical corners",
  pit_lane: "the pit lane",
  podium_atmosphere: "the podium",
};

// Natural seatType display order — grandstand first (always the largest,
// most-recognizable category), then lawn, then hospitality, regardless of
// which order rows happen to come back from the DB in.
const TYPE_ORDER: SeatType[] = ["grandstand", "festival_lawn", "hospitality"];

function topActionTags(seats: Seat[], max = 2): string[] {
  const counts = new Map<ActionTag, number>();
  for (const s of seats) {
    for (const tag of s.actionTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([tag]) => ACTION_TAG_LABEL[tag]);
}

function joinWithOr(labels: string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  return `${labels[0]} or ${labels[1]}`;
}

export default function SeatingPrimer({ eventName, seats }: { eventName: string; seats: Seat[] }) {
  const [open, setOpen] = useState(false);

  if (seats.length === 0) return null;

  const byType = new Map<SeatType, Seat[]>();
  for (const seat of seats) {
    const list = byType.get(seat.seatType) ?? [];
    list.push(seat);
    byType.set(seat.seatType, list);
  }
  const presentTypes = TYPE_ORDER.filter((t) => byType.has(t));
  if (presentTypes.length === 0) return null;

  const circuitName = eventName.replace(/\s*\d{4}$/, "").trim();
  const typeListLabel = presentTypes.map((t) => SEAT_TYPE_LABEL[t].plural).join(presentTypes.length === 3 ? ", " : " and ");

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="mt-6"
    >
      <summary className="flex items-center gap-2 text-[13px] text-[#6A6A6A] cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <span className={`text-[10px] transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
        About seating at {circuitName}
      </summary>
      <div className="mt-2 text-[13px] text-[#8a8a8a] leading-relaxed">
        <p className="mt-3 mb-2">
          {circuitName} splits into {presentTypes.length} seating type{presentTypes.length === 1 ? "" : "s"}:{" "}
          {typeListLabel}.
        </p>
        <ul className="space-y-1.5 mb-2">
          {presentTypes.map((type) => {
            const typeSeats = byType.get(type)!;
            const tags = topActionTags(typeSeats);
            const tagClause = tags.length > 0 ? `, typically facing ${joinWithOr(tags)}` : "";
            return (
              <li key={type}>
                — {SEAT_TYPE_LABEL[type].plural.replace(/^./, (c) => c.toUpperCase())} ({typeSeats.length}{" "}
                {typeSeats.length === 1 ? SEAT_TYPE_LABEL[type].nounSingular : SEAT_TYPE_LABEL[type].nounPlural}) —{" "}
                {SEAT_TYPE_BLURB[type]}
                {tagClause}.
              </li>
            );
          })}
        </ul>
        <p className="mt-2">
          Which one actually suits you also depends on weather cover, reserved vs. unreserved seating, and your
          group — that&apos;s what the quiz below works out.
        </p>
      </div>
    </details>
  );
}
