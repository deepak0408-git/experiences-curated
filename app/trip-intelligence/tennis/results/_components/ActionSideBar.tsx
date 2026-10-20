import Link from "next/link";
import EventGuideCta from "../../../formula-1/results/_components/EventGuideCta";

// Adapted from app/trip-intelligence/formula-1/results/_components/ActionSideBar.tsx.
// Reuses EventGuideCta as-is (generic, no F1-specific logic).
//
// "Find your ticket" (20 Oct 2026) — same pattern as F1's "Find your seat"
// link: shown only when ticketIntelligenceSlug is non-null (the caller
// resolves this from GrandSlamDisplayInfo.hasTicketIntelligence, itself
// sourced from hasTennisTicketIntelligence's fail-closed gate — never a
// hardcoded per-event check), sits directly above the Event Guide CTA.
//
// When there are 2+ co-leading winners, there's no single "best fit event"
// to point the sidebar's event-guide CTA at — showEventGuide=false omits
// that section entirely, and each co-leader card shows its own guide CTA
// inline instead (same AlternativeGuideCta pattern runner-up/3rd-place
// cards already use).
export default function ActionSideBar({
  eventSlug,
  eventId,
  isBuilt,
  userEmail,
  showEventGuide = true,
  ticketIntelligenceSlug,
}: {
  eventSlug: string;
  eventId: string;
  isBuilt: boolean;
  userEmail: string | null;
  showEventGuide?: boolean;
  ticketIntelligenceSlug?: string | null;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">Your Best Fit Event</p>

      <Link
        href="/planner"
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
        href="/?sport=tennis#on-the-calendar"
        className={
          ticketIntelligenceSlug || showEventGuide
            ? "flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
            : "flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
        }
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🏆</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">See upcoming tennis events</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Don&apos;t miss the next one</span>
        </span>
      </Link>

      {ticketIntelligenceSlug && (
        <Link
          href={`/ticket-intelligence/tennis/${ticketIntelligenceSlug}`}
          className={
            showEventGuide
              ? "flex items-center gap-2.5 py-3 mb-4 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
              : "flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
          }
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Find your ticket</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Match the arena and ticket option</span>
          </span>
        </Link>
      )}

      {showEventGuide && (
        <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport="tennis" isBuilt={isBuilt} userEmail={userEmail} />
      )}
    </div>
  );
}
