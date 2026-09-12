import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Real content sourced from the seeded Paddock Club & Champions Club
// hospitality experience (brazilian-gp-hospitality-paddock-club-mtx6t3tb) and
// Heineken Village (brazilian-gp-heineken-village-mtxwby4o), 12 Sep 2026.
// Heineken Village added as the mid-tier hospitality product alongside
// Paddock/Champions Club, matching how TicketsSpoke already groups it with
// the other hospitality-tier products rather than the grandstands.
// "Still researching" placeholder (private-transit pricing, off-circuit VIP
// venue) resolved 12 Sep 2026: helicopter transfer from central São Paulo
// (Interlagos has its own helipad; ~15min air vs up to 90min road) verified
// via tracksideculture.com's Brazilian GP VIP guide and flyflapper.com — no
// operator publishes fixed race-weekend pricing, so that's stated honestly
// rather than invented. Skye rooftop bar at Hotel Unique (Av. Brigadeiro
// Luís Antônio) verified directly via hotelunique.com — phone, hours, and
// the real non-guest first-come-first-served-after-7:30pm access rule.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const hospitality = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-hospitality-paddock-club-"));
  const heinekenVillage = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-heineken-village"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Brazilian Grand Prix"
      status="teaser"
      h1="A whole trip of luxury decisions, not one hospitality product"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — the two real hospitality tiers and Jardins' luxury hotel scene. The pack adds F1's own Paddock Club and Champions Club products in full, plus the actual booking mechanics for a race that's already sold out its top tier."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Interlagos weekend is a stack of decisions, not one purchase. Beyond the top hospitality tier, a
        genuinely luxury trip here spans a real choice between two hospitality products and a boutique luxury
        hotel scene most F1 teams already default to.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers — three real products, not one</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Paddock Club sits directly above the team garages on the main straight, looking straight down at pit
        lane and the start-finish line — curated local menus, an open bar, a guided paddock tour, a daily pit lane
        walk, and a scheduled appearance from an F1 insider. It&apos;s already sold out well ahead of the 2026
        race. Champions Club sits one tier below and isn&apos;t a diluted version of it — gourmet canapés, a proper
        lunch service, an open bar, and two things worth naming specifically: an exclusive Grid Walk paired with a
        Championship Trophy photo op on Friday or Saturday, plus a one-time guided Paddock tour led by an expert
        host. Below both sits Heineken Village — a genuinely different kind of premium, trading the pit-lane view
        for a 30,000-square-metre infield festival with an open bar, DJs, and its own vantage of Sector 3.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ultra-luxury stays</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Hotel Emiliano on Rua Oscar Freire is the real luxury-hotel fact worth knowing here — just 57 rooms, the
        exact neighborhood F1 teams and paddock regulars already choose when they&apos;re in town for the weekend.
        It gets the full breakdown, room types, and booking detail in the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>
        .
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit — helicopter over car on race day</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Interlagos has its own helipad, and helicopter transfer from central São Paulo (Jardins, Itaim Bibi, Faria
        Lima) is the real, established premium option here — roughly 15 minutes in the air versus up to 90 minutes
        by road once race-weekend traffic builds, which is why it&apos;s standard practice for VVIPs and corporate
        guests rather than a novelty add-on. No operator publishes fixed race-weekend pricing (it varies by
        provider and demand), so treat "get a quote" as the honest next step rather than a number we&apos;d invent
        here — Flapper is the largest on-demand charter platform serving this route. If you&apos;re driving
        instead, book a premium black-car service with an experienced local driver rather than a standard
        rideshare, which struggles badly with the same congestion.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A real off-circuit VIP night: Skye</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Skye, the rooftop restaurant and bar atop Hotel Unique on Avenida Brigadeiro Luís Antônio, is the genuine
        off-circuit VIP venue for a night away from the race — 360-degree skyline views, a red rooftop pool, and
        the kind of design-hotel pedigree that shows up on most "best of São Paulo" lists for a reason. Hotel
        guests get priority reservations for dinner until 7:30pm; if you&apos;re not staying there, dinner runs
        first-come-first-served after that and the room does fill, so arrive early rather than assume a walk-in
        table late. Call +55 (11) 3055-4700 directly to check the night you actually want.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {hospitality && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: F1 Paddock Club & Champions Club</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                Champions Club isn&apos;t simply &quot;Paddock Club but cheaper&quot; — it&apos;s a genuinely
                different package built around one standout moment (the Grid Walk and Trophy photo) rather than
                Paddock Club&apos;s all-weekend access and daily pit lane walks. Pick based on which specific
                experience you actually want, not price alone.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard experience={hospitality} isPro={isPro} />
              </div>

              <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
                A grandstand sells you one great view of the racing. Paddock Club or Champions Club sells you the
                whole day around it — food, bars, and real proximity to the sport itself, not just a better seat.
              </p>
            </>
          )}

          {heinekenVillage && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The mid-luxury alternative: Heineken Village</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                If Paddock Club&apos;s sold-out status and Champions Club&apos;s price both put those two out of
                reach, Heineken Village is the real third option — not a grandstand seat, but a proper premium
                product in its own right, with the Star (Estrela) sector&apos;s open bar and finger food closer in
                spirit to a hospitality package than to standing on a lawn.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard experience={heinekenVillage} isPro={isPro} />
              </div>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Paddock Club and Champions Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            F1 Paddock Club for Brazil 2026 was already showing sold out on F1 Experiences&apos; own site well
            ahead of the race — if this tier matters to you, treat the on-sale window as the real deadline for
            next year&apos;s edition rather than waiting to check closer to the date. Champions Club is the
            realistic fallback if Paddock Club is unavailable, sold directly through{" "}
            <a
              href="https://f1experiences.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              f1experiences.com
            </a>
            , not the official ticketing site.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
