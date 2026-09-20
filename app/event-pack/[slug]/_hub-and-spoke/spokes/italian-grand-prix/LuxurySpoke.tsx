import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Real content sourced from the seeded Paddock Club & Champions Club — F1
// Hospitality at Monza experience (paddock-club-champions-club-hospitality-
// mrbsb3a1), 19 Sep 2026, and the Trackside Corner Lounges & Villas
// experience (trackside-corner-lounges-villas-mu9idbfc), 20 Sep 2026. Hotel
// de la Ville referenced from HotelsSpoke's existing experience rather than
// duplicated here as its own card, per the established sibling-event
// pattern (each experience card appears in exactly one spoke).
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const hospitality = linkedExperiences.find((e) => e.slug.includes("paddock-club-champions-club-hospitality-"));
  const cornerLounges = linkedExperiences.find((e) => e.slug.includes("trackside-corner-lounges-villas-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="teaser"
      h1="Three real hospitality tiers, above the Tifosi's home race"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — the three real hospitality tiers, the four trackside corner lounges, and Monza's one luxury hotel. The pack adds F1's own Paddock Club and Champions Club products in full, plus the four corner lounges' own booking contact and brochure route, for a race that sells its top tier out faster than almost anywhere else on the calendar."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Italian Grand Prix weekend stacks a genuine hospitality decision on top of an already loaded race
        weekend — this is Ferrari&apos;s home race, and demand for every premium product here runs higher than
        almost anywhere else on the F1 calendar.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers — open bar, a paddock tour, a driver at your table</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Paddock Club sits above the team garages on the main straight, looking down at pit lane and the
        start-finish line — an open bar, a guided paddock tour, and a scheduled appearance from an F1 insider.
        Champions Club sits one tier below and isn&apos;t a diluted version of it — its own genuine draw is an
        exclusive Grid Walk paired with a Championship Trophy photo op, plus a guided Paddock tour of its own. Both
        products are sold directly through F1 Experiences, not the official ticketing site.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The trackside alternative — four corner lounges</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Paddock Club and Champions Club both sit on the start-finish straight. Monza also runs four separate
        hospitality lounges built around specific corners instead — Dolce Vita at the Parabolica exit, Garden Lounge
        overlooking the grid-to-First-Chicane run, Ultimate Lounge between the Ascari chicane and Curva Alboreto with
        its own dedicated grandstand, and Green House overlooking Curva Lesmo 2. Full breakdown of all four, including
        which one actually has a built-in grandstand seat, below.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A genuine luxury stay</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Hotel de la Ville, opposite the Villa Reale and 2km from the circuit, is Monza&apos;s only luxury hotel —
        and where the F1 teams themselves stay for race weekend. It gets the full breakdown, room types, and
        booking detail in the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>
        .
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Grandstand 1 — the premium seat that isn't hospitality</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Worth naming here even though it&apos;s a grandstand ticket, not a hospitality product: Grandstand 1, the
        Centrale, opposite the start line, is historically the most expensive reserved seat at Monza — the seat F1
        has protected longest, and the one that&apos;s watched every version of this race since 1938. It gets the
        full breakdown in the{" "}
        <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Ticket Guide
        </a>
        .
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {hospitality && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: F1 Paddock Club & Champions Club</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                Champions Club isn&apos;t simply &quot;Paddock Club but cheaper&quot; — it&apos;s built around one
                standout moment (the Grid Walk and Trophy photo) rather than Paddock Club&apos;s all-weekend access
                and daily pit lane walks. Pick based on which specific experience you actually want, not price
                alone.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={hospitality} isPro={isPro} />
              </div>

              <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
                A grandstand sells you one great view of the racing. Paddock Club or Champions Club sells you the
                whole day around it — food, bars, and real proximity to the sport itself, at the one race on the
                calendar where that proximity means standing near a team that&apos;s racing in front of its own
                home crowd.
              </p>
            </>
          )}

          {cornerLounges && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The four corner lounges, in full</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                Not another straight-side product — each of these four is built around a specific corner, and they
                don&apos;t all offer the same thing. Only one has its own dedicated grandstand seat built in.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={cornerLounges} isPro={isPro} />
              </div>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Paddock Club and Champions Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Treat the on-sale window as the real deadline, not a date to check back closer to race weekend —
            Ferrari&apos;s home race consistently draws the heaviest hospitality demand of the F1 calendar, and
            Paddock Club in particular has a track record of selling out well ahead of other rounds. Champions
            Club is the realistic fallback if Paddock Club is unavailable, sold directly through{" "}
            <a
              href="https://f1experiences.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              f1experiences.com
            </a>
            .
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
