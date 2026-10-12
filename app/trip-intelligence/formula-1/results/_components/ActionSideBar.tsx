import Link from "next/link";
import EventGuideCta from "./EventGuideCta";

// Mirrors app/ticket-intelligence/[slug]/_components/TicketIntelligenceSidebar.tsx's
// "This Event" box exactly (title, item set, Event Guide CTA as the
// highlighted bottom button) plus one additional item — "Find your seat",
// linking to Ticket Intelligence for this race — per founder instruction
// (10 Oct 2026): same sidebar items as Ticket Intelligence, with just the
// one extra for Trip Intelligence's own context. The Event Guide CTA uses
// the same real get-notified flow as Ticket Intelligence (EventGuideCta.tsx)
// rather than static unclickable "coming soon" text — founder request, 10
// Oct 2026.
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
        href={`/?sport=${sport}#on-the-calendar`}
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🏆</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">See upcoming Formula 1 events</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Don&apos;t miss the next one</span>
        </span>
      </Link>

      {ticketIntelligenceSlug && (
        <Link
          href={`/ticket-intelligence/${ticketIntelligenceSlug}`}
          className="flex items-center gap-2.5 py-3 mb-4 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Find your seat</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Match the right grandstand or zone</span>
          </span>
        </Link>
      )}

      <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport={sport} isBuilt={isBuilt} userEmail={userEmail} />
    </div>
  );
}
