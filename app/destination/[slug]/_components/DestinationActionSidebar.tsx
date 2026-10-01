import Link from "next/link";

// One sidebar per event, placed directly alongside its card in the same
// row — founder-confirmed 1 Oct 2026 (e.g. London gets 3 rows: Wimbledon,
// Ashes, British Grand Prix), with each row using the same lg:grid-cols-3
// split as the page's outer main/aside wrapper so the sidebar's edges line
// up with "At a glance" further down. Label is generic "This event" (not
// the event name) per founder correction, since the card right next to it
// already names the event. Same 4-action model as ExperienceActionSidebar,
// minus the "Get the full guide" CTA (the event card itself is already that
// CTA) and minus the notify-me state (EventNotifyRow on the card already
// covers the not-yet-linkable case).
export default function DestinationActionSidebar({
  eventSlug,
  eventFormat,
  showTicketIntelligenceLink,
}: {
  eventSlug: string;
  eventFormat: string | null;
  // F1-only, gated by real seeded Ticket Intelligence data — same gate as
  // ExperienceActionSidebar's showTicketIntelligenceLink, computed by the
  // page from event.sport + hasTicketIntelligence(event.id).
  showTicketIntelligenceLink: boolean;
}) {
  const canPlanCosts = eventFormat === "hub_and_spoke";
  return (
    <div className="h-full rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
        This event
      </p>
      <Link
        href={canPlanCosts ? `/price-radar/${eventSlug}` : "/planner"}
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">💰</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Budget your trip</span>
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

      {showTicketIntelligenceLink && (
        <Link
          href={`/ticket-intelligence/${eventSlug}`}
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Find your perfect seat</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Answer 6 questions, get matched to a seat</span>
          </span>
        </Link>
      )}

      <Link
        href="/custom-itinerary"
        className="flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🧭</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Build a custom itinerary</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Tell us your trip, we&apos;ll shape it</span>
        </span>
      </Link>
    </div>
  );
}
