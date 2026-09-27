import Link from "next/link";

// Shared sidebar — used on the quiz entry page (TicketQuiz.tsx), the
// already-purchased teaser reveal (TeaserResult.tsx), and the result page
// (result/page.tsx), per founder direction 27 Sep 2026. Moved out of
// result/_components (where it started as ResultActionSidebar) into this
// shared _components folder once the quiz page needed it too.
//
// Two stacked boxes, same flex flex-col gap-5 wrapper as the blog's
// ArticleActionSidebar: "This Event" (4-action model — Budget your trip /
// See it on the calendar / Build a custom itinerary / Get the Event Guide,
// matching SpokeActionSidebar/ArticleActionSidebar/ExperienceActionSidebar)
// plus a second "Your Personalized Seat Match" box added 27 Sep 2026,
// pointing at /ticket-intelligence (the event picker) — same slot as the
// blog sidebar's "More '{category}' Pieces" box.
//
// No retake action in the first box — FullResult already has its own
// inline "Retake the quiz" link right below its h1, and the quiz page
// itself IS the retake flow, so a retake link here would be redundant on
// both pages it renders on.
export default function TicketIntelligenceSidebar({ eventSlug }: { eventSlug: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
          This Event
        </p>

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
          href={`/event-pack/${eventSlug}`}
          className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
          <span className="flex-1">
            <span className="block text-sm font-black text-black">Get the event guide</span>
            <span className="block text-xs text-black/65 mt-0.5">Trip costs, curated picks, booking detail</span>
          </span>
        </Link>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
          Your Personalized Seat Match
        </p>
        <Link
          href="/ticket-intelligence"
          className="flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Explore more events</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Match your ticket at every live event</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
