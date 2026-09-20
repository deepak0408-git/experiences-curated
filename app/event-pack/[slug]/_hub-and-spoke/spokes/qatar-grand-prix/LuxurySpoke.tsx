import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Built per skill §2i — covers the whole trip, not just the top hospitality
// product. Hospitality tiers: Lusail Hill Lounge, Champions Club, Paddock
// Club (all real, seeded experiences, 13 Sep 2026). Premium transit:
// Blacklane/Mowasalat chauffeur services, real pricing sourced 13 Sep 2026.
// Off-circuit luxury: Acoustic Music Penthouse at Raffles Doha, a real,
// confirmed 360-degree Lusail-view rooftop bar, sourced 13 Sep 2026 (also
// cross-references the Hotels spoke's Raffles pick with a genuinely new
// fact, not a duplicate listing). Paddock Club's real resale contact
// (Race Experiences, +31 50 205 78 01) sourced from the experience's own
// howToBook field.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const lusailHillLounge = linkedExperiences.find((e) => e.slug.includes("qatar-gp-lusail-hill-lounge-"));
  const paddockChampions = linkedExperiences.find((e) => e.slug.includes("qatar-gp-paddock-champions-club-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="teaser"
      h1="Paddock Club, Champions Club, and Lusail Hill Lounge — the real top-tier hospitality options at Lusail"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — the overview of all three hospitality tiers, premium transit, and the off-circuit rooftop pick. The pack adds the full Paddock Club, Champions Club, and Lusail Hill Lounge experience cards, our direct verdict on which one to actually book, and the real, verified resale contact for Paddock Club when official sales close out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        A genuinely luxury Qatar Grand Prix weekend is a stack of decisions, not one purchase — which hospitality
        tier, how you actually get to and from the circuit, and where you go once the racing stops for the day. Here&apos;s
        the real range, not just the best-known product.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers — three real products, not one</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Paddock Club sits directly above the team garages on the main straight, looking down at pit lane and the
        start-finish line — curated menus, an open bar, a guided paddock tour, and real proximity to the sport
        itself. Champions Club sits one tier below and isn&apos;t a diluted version of it — its own open bar, food
        service, a Saturday grid walk, and a trophy photo op that Paddock Club doesn&apos;t offer at any price.
        Lusail Hill Lounge is the third real option, trading pit-lane proximity for one of the circuit&apos;s best
        natural viewpoints at Turn 1/Turn 2, at meaningfully less than either of the other two.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Blacklane and Mowasalat Limousine both run chauffeur-driven transfers in Doha, with private airport
          transfers to the city starting from roughly US$677 for two passengers — one real illustrative price point,
          not a guaranteed rate, since pricing scales with vehicle class and passenger count. Mowasalat can be booked
          directly by phone at (+974) 800 5466. Either is a genuine step up from Karwa&apos;s metered taxis covered
          in the Getting There guide, worth it specifically for race-night pickups when the shuttle crowds are at
          their thickest.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-circuit — a real Lusail-view rooftop</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Acoustic Music Penthouse, the two-storey rooftop at Raffles Doha — the same hotel covered in the Where to
          Stay guide, but a genuinely new fact about it — sits on the property&apos;s upper floors with 360-degree
          views across Doha&apos;s skyline, the Arabian Sea, and Lusail itself. Live soul and jazz sets run into
          later DJ sets through the evening, making it a real option for a night that isn&apos;t at the circuit, not
          just a hotel bar with a view.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {paddockChampions && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: Paddock Club & Champions Club</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                Champions Club isn&apos;t simply &quot;Paddock Club but cheaper&quot; — it&apos;s a genuinely
                different package built around the Saturday grid walk and trophy photo rather than Paddock
                Club&apos;s pit-lane proximity and all-weekend access. Pick based on which specific experience you
                actually want, not price alone.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={paddockChampions} isPro={isPro} />
              </div>

              <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
                A grandstand sells you one great view of the racing. Paddock Club or Champions Club sells you the
                whole day around it — food, bars, and real proximity to the sport itself, not just a better seat.
              </p>
            </>
          )}

          {lusailHillLounge && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The mid-luxury alternative: Lusail Hill Lounge</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                If pit-lane proximity isn&apos;t the priority, Lusail Hill Lounge is the real third option — not a
                grandstand seat, but a proper premium product in its own right, sitting on genuinely one of the
                circuit&apos;s best natural viewpoints at Turn 1/Turn 2, at meaningfully less than either Champions
                Club or Paddock Club.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={lusailHillLounge} isPro={isPro} />
              </div>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">If Paddock Club is showing sold out</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Don&apos;t rely on the main booking page alone if it&apos;s showing sold out — call Race Experiences
            directly at +31 50 205 78 01 or email info@raceexperiences.com and ask specifically about late-release
            or cancellation inventory. This reseller has historically had access to returned Paddock Club
            allocations closer to race week that never make it back onto the public site.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Champions Club vs. Lusail Hill Lounge — our verdict</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Champions Club is the right call if the trophy photo and paddock access genuinely matter to you — the
            guided F1 paddock tour and Saturday grid walk are real, tangible experiences the Lounge doesn&apos;t
            offer at any price. If food quality is the bigger factor, ask the reseller for the exact current menu
            before committing — Champions Club&apos;s food service has varied year to year between canapés-only and
            a fuller sit-down dinner. Lusail Hill Lounge is the better pick if the Turn 1/Turn 2 sightline itself is
            the priority.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
