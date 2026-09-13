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
      h1="Paddock Club is sold out — Champions Club and Lusail Hill Lounge are the real remaining top tiers"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The hospitality tiers, transit, and rooftop pick above are all free. What the pack adds is the real, verified contact for Paddock Club's late-release inventory — the one lead that can still get you into a sold-out tier — plus our direct verdict on Champions Club vs. Lusail Hill Lounge for a first-time luxury Lusail weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        A genuinely luxury Qatar Grand Prix weekend is a stack of decisions, not one purchase — which hospitality
        tier, how you actually get to and from the circuit, and where you go once the racing stops for the day. Here&apos;s
        the real range, not just the best-known product.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers — three real options, one already sold out</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {lusailHillLounge && <SpokeExperienceCard experience={lusailHillLounge} isPro={isPro} />}
        {paddockChampions && <SpokeExperienceCard experience={paddockChampions} isPro={isPro} />}
      </div>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Paddock Club, the top tier, sold out as of September 2026 — demand for this race, positioned as the
          penultimate round of the season, ran ahead of supply. Champions Club and Lusail Hill Lounge both still had
          real availability at time of research. Report current availability honestly if you&apos;re checking closer
          to race week — hospitality inventory moves fast in the final weeks before any Grand Prix.
        </p>
      </div>

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
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If Paddock Club is genuinely what you want</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Don&apos;t rely on the main booking page — it&apos;s showing sold out and will keep showing that. Call
            Race Experiences directly at +31 50 205 78 01 or email info@raceexperiences.com and ask specifically
            about late-release or cancellation inventory — this reseller has historically had access to returned
            Paddock Club allocations closer to race week that never make it back onto the public site.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Champions Club vs. Lusail Hill Lounge — our verdict</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Champions Club is the right call if the trophy photo and paddock access genuinely matter to you — the
            guided F1 paddock tour and Saturday grid walk are real, tangible experiences the Lounge doesn&apos;t
            offer at any price. If food quality is the bigger factor, ask the reseller for the exact current menu
            before committing — Champions Club&apos;s food service has varied year to year between canapés-only and
            a fuller sit-down dinner. Lusail Hill Lounge is the better pick if the Turn 1/Turn 2 sightline itself is
            the priority — it sits on genuinely one of the circuit&apos;s best natural viewpoints, at meaningfully
            less than either Champions Club or Paddock Club.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
