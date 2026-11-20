"use client";

import Link from "next/link";
import EventGuideCta from "./EventGuideCta";
import { phEvent } from "@/lib/posthog-events";

// Mirrors app/ticket-intelligence/[slug]/_components/TicketIntelligenceSidebar.tsx's
// "This Event" box (same remaining item set below the primary CTAs) plus
// one additional item — "Find your seat", linking to Ticket Intelligence
// for this race — per founder instruction (10 Oct 2026). The Event Guide
// CTA uses the same real get-notified flow as Ticket Intelligence
// (EventGuideCta.tsx) rather than static unclickable "coming soon" text —
// founder request, 10 Oct 2026.
//
// CTA hierarchy per the approved UX Journey Map spec (20 Nov 2026,
// corrected same day — a two-CTA lime-on-lime pair read poorly): "Find
// your seat" is this screen's single primary action, lime-highlighted and
// standalone at the top of the box. "Get the event guide" sits in the
// plain secondary list directly below it, first among the rest. This is a
// deliberate deviation from TicketIntelligenceSidebar.tsx's own layout
// (Event Guide as sole highlighted bottom button), which is a different
// screen and out of scope for this change.
export default function ActionSideBar({
  eventSlug,
  eventId,
  sport,
  isBuilt,
  userEmail,
  ticketIntelligenceSlug,
}: {
  eventSlug: string;
  eventId: string;
  sport: string;
  isBuilt: boolean;
  userEmail: string | null;
  ticketIntelligenceSlug: string | null;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">Your Best Fit Event</p>

      {ticketIntelligenceSlug && (
        <Link
          href={`/ticket-intelligence/${ticketIntelligenceSlug}`}
          onClick={() => phEvent.sidebarCtaClicked({ page: "trip_intelligence_f1", cta: "ticket_intelligence", slug: eventSlug })}
          className="flex items-center gap-2.5 py-4 px-5 rounded-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors mb-4"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-black text-black">Find your seat</span>
            <span className="block text-xs text-black/65 mt-0.5">Match the right grandstand or zone</span>
          </span>
        </Link>
      )}

      <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport={sport} isBuilt={isBuilt} userEmail={userEmail} sidebarPage="trip_intelligence_f1" variant="list" />

      <Link
        href="/planner"
        onClick={() => phEvent.sidebarCtaClicked({ page: "trip_intelligence_f1", cta: "budget_trip", slug: eventSlug })}
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">💰</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Budget this trip</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Real flight, hotel and ticket costs</span>
        </span>
      </Link>

      <Link
        href="/calendar"
        onClick={() => phEvent.sidebarCtaClicked({ page: "trip_intelligence_f1", cta: "calendar", slug: eventSlug })}
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
        onClick={() => phEvent.sidebarCtaClicked({ page: "trip_intelligence_f1", cta: "custom_itinerary", slug: eventSlug })}
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
        onClick={() => phEvent.sidebarCtaClicked({ page: "trip_intelligence_f1", cta: "see_upcoming_events", slug: eventSlug })}
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🏆</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">See upcoming Formula 1 events</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Don&apos;t miss the next one</span>
        </span>
      </Link>

      {/* Last item — founder direction, 28 Oct 2026: every Trip/Ticket
          Intelligence sidebar (F1 and tennis, both surfaces) links to its
          sport's own Travel Planning Cockpit (/formula-1 or /tennis). */}
      <Link
        href="/formula-1"
        onClick={() => phEvent.sidebarCtaClicked({ page: "trip_intelligence_f1", cta: "visit_cockpit", slug: eventSlug })}
        className="flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🗺️</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Visit Travel Planning Cockpit</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Discover, compare and plan F1 trips</span>
        </span>
      </Link>
    </div>
  );
}
