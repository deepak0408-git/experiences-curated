"use client";

import { useState } from "react";
import Link from "next/link";
import { notifyMe } from "@/app/planner/_lib/actions";

// Mirrors app/ticket-intelligence/[slug]/_components/TicketIntelligenceSidebar.tsx's
// "This Event" box exactly (title, item set, Event Guide CTA as the
// highlighted bottom button) — founder direction, 20 Oct 2026. Originally
// omitted F1's second "Your Personalized Seat Match" box (no tennis picker
// page existed yet, 20 Oct 2026) — added once /ticket-intelligence/tennis
// (the tennis picker) shipped later the same day.
function EventGuideCta({
  eventSlug,
  eventId,
  sport,
  isBuilt,
  userEmail,
}: {
  eventSlug: string;
  eventId: string;
  sport: string;
  isBuilt: boolean;
  userEmail: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (isBuilt) {
    return (
      <Link
        href={`/event-pack/${eventSlug}`}
        className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
        <span className="flex-1">
          <span className="block text-sm font-black text-black">Get the event guide</span>
          <span className="block text-xs text-black/65 mt-0.5">Trip costs, curated picks, booking detail</span>
        </span>
      </Link>
    );
  }

  if (status === "done") {
    return (
      <div className="py-4 px-5 -mx-5 -mb-5 mt-0">
        <p className="text-xs text-[#AAFF00]">You&apos;re on the list.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 w-[calc(100%+2.5rem)] text-left hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🔔</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Guide coming soon</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Get notified when it&apos;s ready</span>
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
          await notifyMe(
            email,
            {
              sports: [sport],
              budgetMin: 0,
              budgetMax: 100000,
              timeWindow: "flexible",
              tripLengthDays: 0,
              originMarket: "unspecified",
            },
            [],
            eventId
          );
          setStatus("done");
        } catch {
          setStatus("error");
        }
      }}
      className="flex items-center gap-2 py-4 px-5 -mx-5 -mb-5 mt-0"
    >
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Get notified when this guide is live"
        className="flex-1 min-w-0 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] px-2.5 py-1.5 text-xs text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex-shrink-0 rounded-sm bg-[#AAFF00] text-black text-xs font-black px-3 py-1.5 hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Notify me"}
      </button>
    </form>
  );
}

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  football: "Football",
  rugby: "Rugby",
  golf: "Golf",
  formula_one: "Formula 1",
  cycling: "Cycling",
  athletics: "Athletics",
  other: "Sport",
};

export default function TennisTicketIntelligenceSidebar({
  eventSlug,
  eventId,
  sport,
  isBuilt,
  userEmail,
  showBudgetLink,
}: {
  eventSlug: string;
  eventId: string;
  sport: string;
  isBuilt: boolean;
  userEmail: string | null;
  showBudgetLink: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">This Event</p>

        {showBudgetLink && (
          <Link
            href={`/price-radar/${eventSlug}`}
            className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
          >
            <span className="text-base flex-shrink-0 w-5 text-center">💰</span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-[#A3A3A3]">Budget your trip</span>
              <span className="block text-xs text-[#6A6A6A] mt-0.5">Real flight, hotel and ticket costs</span>
            </span>
          </Link>
        )}

        <Link
          href="/calendar"
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">📅</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">See it on the calendar</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Dates, venue, full fixture</span>
          </span>
        </Link>

        <Link
          href="/custom-itinerary"
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🧭</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Build a custom itinerary</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Tell us your trip, we&apos;ll shape it</span>
          </span>
        </Link>

        <Link
          href={`/?sport=${sport}#on-the-calendar`}
          className="flex items-center gap-2.5 py-3 mb-4 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🏆</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">
              See upcoming {SPORT_LABELS[sport] ?? sport} events
            </span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Don&apos;t miss the next one</span>
          </span>
        </Link>

        <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport={sport} isBuilt={isBuilt} userEmail={userEmail} />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
          Your Personalized Ticket Match
        </p>
        <Link
          href="/ticket-intelligence/tennis"
          className="flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Explore more events</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Match your ticket at every live Grand Slam</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
