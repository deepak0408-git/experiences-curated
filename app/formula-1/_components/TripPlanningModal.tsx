"use client";

import { useState } from "react";
import Link from "next/link";
import CockpitModal from "./CockpitModal";
import GpSelector, { NotifyRow } from "./GpSelector";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

// Card 4 modal — "I'm planning my trip". Three actions: Start a New Trip
// (inline GP selector in THIS modal, no second modal, per spec), Continue
// My Trip Board, Get a Custom Itinerary.
export default function TripPlanningModal({
  open,
  onClose,
  events,
  userEmail,
}: {
  open: boolean;
  onClose: () => void;
  events: CockpitEvent[];
  userEmail: string | null;
}) {
  const [selectedEvent, setSelectedEvent] = useState<CockpitEvent | null>(null);

  return (
    <CockpitModal open={open} onClose={onClose} title="I'm planning my trip">
      <div className="space-y-5">
        <section>
          <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Start a new trip</p>
          <p className="text-xs text-[#6A6A6A] mb-2">Pick your Grand Prix, then open its Event Guide.</p>
          <GpSelector
            events={events}
            userEmail={userEmail}
            onGuideSelected={setSelectedEvent}
          />
          {selectedEvent?.eventGuideAvailable ? (
            <Link
              href={`/event-pack/${selectedEvent.slug}?from=cockpit`}
              className="mt-2.5 inline-flex items-center rounded-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors px-4 py-2 text-sm font-black text-black"
            >
              Explore Event Guide →
            </Link>
          ) : selectedEvent ? (
            // Guide picked but not yet available — notify-me instead of a
            // dead disabled button, which previously gave no feedback at
            // all (worst on mobile, where the selected row's lime
            // highlight scrolls out of view). Founder-flagged, 15 Oct 2026.
            <div className="mt-2.5 space-y-1.5">
              <p className="text-xs text-[#6A6A6A]">The {selectedEvent.name} guide isn&apos;t live yet.</p>
              <NotifyRow event={selectedEvent} userEmail={userEmail} />
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="mt-2.5 inline-flex items-center rounded-sm bg-[#2A2A2A] text-[#6A6A6A] px-4 py-2 text-sm font-black cursor-not-allowed"
            >
              Explore Event Guide →
            </button>
          )}
        </section>

        <section className="pt-4 border-t border-[#2A2A2A]">
          <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Continue my Trip Board</p>
          <p className="text-xs text-[#6A6A6A] mb-2">
            {userEmail
              ? "Pick up where you left off."
              : "Sign in to see your saved experiences."}
          </p>
          <Link
            href={userEmail ? "/trip-board?from=cockpit" : "/sign-in?next=%2Ftrip-board%3Ffrom%3Dcockpit"}
            className="inline-flex items-center rounded-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors px-4 py-2 text-sm font-black text-black"
          >
            {userEmail ? "View Trip Board →" : "Sign in to continue →"}
          </Link>
        </section>

        <section className="pt-4 border-t border-[#2A2A2A]">
          <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Get a custom itinerary</p>
          <p className="text-xs text-[#6A6A6A] mb-2">Tell us your trip, we&apos;ll shape it.</p>
          <Link
            href="/custom-itinerary?from=cockpit"
            className="inline-flex items-center rounded-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors px-4 py-2 text-sm font-black text-black"
          >
            Get a custom itinerary →
          </Link>
        </section>
      </div>
    </CockpitModal>
  );
}
