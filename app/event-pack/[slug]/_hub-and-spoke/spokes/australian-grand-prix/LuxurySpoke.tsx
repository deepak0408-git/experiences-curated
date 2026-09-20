import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Real content sourced from the seeded F1 Paddock Club & Trackside
// Hospitality experience (f1-paddock-club-trackside-hospitality-mu9c506w),
// 20 Sep 2026: Champions Club, The Albert Hospitality Suite, The Laneway,
// and Chicane Pavilion — Lower, all with real US$ price points. Premium
// transit (Microflite's official F1-branded helicopter transfer service,
// plus the AGP Corporation's own "Helicopter Joy Flight" package) and the
// off-circuit venue (Strato Melbourne, 40th-floor rooftop, Southbank —
// genuinely closer to Albert Park than most CBD rooftop venues) both
// verified via web search 20 Sep 2026, not invented. No luxury-hotel fact
// beyond what's already in the Hotels spoke exists for this specific
// St Kilda Road/CBD corridor yet — an honest gap, not forced.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const hospitality = linkedExperiences.find((e) => e.slug.includes("f1-paddock-club-trackside-hospitality-mu9c506w"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="teaser"
      h1="A whole trip of luxury decisions, not one hospitality product"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — the full hospitality tier stack, the helicopter option, and the rooftop pick for a night off the circuit. The pack adds the direct verdict on which hospitality tier is actually worth the price jump for a first Albert Park trip, plus the real booking-window detail for Paddock Club before it sells out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Albert Park weekend is a stack of decisions, not one purchase. Beyond the top hospitality tier, a
        genuinely luxury trip here spans a deeper hospitality stack than most Grands Prix offer, a real premium
        transit option, and a rooftop night off the circuit.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers — a deeper stack than most circuits</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Paddock Club sits directly above the pit lane at Albert Park, overlooking the start/finish straight —
        the single most expensive and complete way to experience the weekend, with a guided pit lane walk every
        day, all-day grazing menus built around seasonal Australian produce, free-flowing champagne and wine, and a
        rooftop tiered viewing deck over the Walker Straight and city skyline. Below it, Albert Park runs a
        genuinely deep hospitality stack — more tiers than most Grand Prix venues offer. Champions Club and The
        Albert Hospitality Suite both sit on the Main Straight around US$5,500-5,600 for the three-day weekend,
        trading Paddock Club&apos;s pit lane walk for a still-premium trackside position at a meaningfully lower
        price. The Laneway, at the top end outside Paddock Club itself, runs closer to US$7,250. At the more
        accessible end, Chicane Pavilion — Lower runs around US$3,900 for an outdoor balcony with unreserved
        grandstand-style seating, a genuine entry point into hospitality rather than reserved grandstand seating.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit — helicopter over car on race day</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Microflite, Victoria&apos;s established helicopter charter operator, runs an official Formula 1-branded
        transfer service for race weekend — shuttle and exclusive flights from Melbourne Heliport, Melbourne
        Airport, and Moorabbin Heliport direct to Albert Park, avoiding the road-closure gridlock that builds
        around the circuit on session days. The Australian Grand Prix Corporation&apos;s own travel site also
        sells a shorter &quot;Helicopter Joy Flight&quot; — a 6-8 minute scenic flight over the circuit, Melbourne&apos;s
        skyline, and Port Phillip Bay, bookable alongside a Park Pass or hospitality ticket. Neither publishes a
        fixed race-weekend charter rate — treat &quot;get a quote&quot; as the honest next step rather than a number
        we&apos;d invent here.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A real off-circuit night: Strato Melbourne</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Strato Melbourne, the 40th-floor rooftop bar and restaurant atop Oakwood Premier Melbourne in Southbank
        (40/202 Normanby Rd), is the genuine off-circuit luxury pick for a night away from the race — 360-degree
        skyline views, and a genuinely closer location to Albert Park than most of the CBD&apos;s other rooftop
        venues, since Southbank sits between the circuit and the river rather than across it. Call (03) 7003 8104
        to check availability for the night you want — race weekend is a real demand spike for the city&apos;s
        best-known rooftops.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {hospitality && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: which hospitality tier</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                Champions Club and The Albert Hospitality Suite aren&apos;t simply &quot;Paddock Club but cheaper&quot;
                — they trade the pit lane walk and top-tier grazing menu for a genuinely different, still-premium
                trackside position at roughly a third of the price. If the pit lane walk and being physically above
                the garages is the actual reason you&apos;re paying for hospitality, Paddock Club is worth the jump.
                If a great trackside position with a real open bar is enough, Champions Club or The Albert
                Hospitality Suite is the smarter buy. Chicane Pavilion — Lower is the honest entry point if you want
                a taste of hospitality without the full price tag.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={hospitality} isPro={isPro} />
              </div>

              <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
                A grandstand sells you one great view of the racing. Any of Albert Park&apos;s hospitality tiers
                sells you the whole day around it — food, bars, and real proximity to the sport itself, not just a
                better seat.
              </p>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking the top tiers</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Given the home-crowd demand a Sprint-format 2027 weekend is likely to draw, treat the general on-sale
            window opening 6 October 2026 as the real deadline for Paddock Club and The Laneway rather than waiting
            to check closer to the date — both are priced and positioned as the scarcest products in the stack.
            Champions Club, The Albert Hospitality Suite, and Chicane Pavilion have historically stayed bookable
            longer, but shouldn&apos;t be assumed available right up to race week.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
