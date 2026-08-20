import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "luxury";

export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const mcgBoxes = linkedExperiences.find((e) => e.slug.includes("mcg-corporate-boxes-boxing-day"));
  const adelaideClub = linkedExperiences.find((e) => e.slug.includes("adelaide-oval-stadium-club-deck"));
  const scgLuxury = linkedExperiences.find((e) => e.slug.includes("scg-luxury-invincibles-lounge-members-pavilion"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="teaser"
      h1="Three real hospitality products, one heritage changeroom experience no other ground on this tour has"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real hospitality tiers and where to book each one are free above. Unlocking adds our verdict on which of the three is genuinely worth the money, the exact contact and current pricing for MCG boxes and Adelaide Oval's Stadium Club, and the real Melbourne premium-hotel fact that pairs with a Boxing Day hospitality day."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Luxury on this tour is a stack of decisions across three different cities, not one single purchase — each
        of the three legs with real hospitality products (Melbourne, Adelaide, Sydney) offers a genuinely different
        kind of premium day, and Sydney specifically has a product no other ground on this tour can match.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Three real hospitality products</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {mcgBoxes && <SpokeExperienceCard experience={mcgBoxes} isPro={isPro} />}
        {adelaideClub && <SpokeExperienceCard experience={adelaideClub} isPro={isPro} />}
        {scgLuxury && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard experience={scgLuxury} isPro={isPro} />
          </div>
        )}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Perth — no dedicated hospitality product found</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Unlike Melbourne, Adelaide, and Sydney, Perth Stadium doesn&apos;t have a distinct, publicly-documented
          cricket hospitality tier separate from the venue&apos;s general rooftop tour experiences — we won&apos;t
          invent one. If a luxury day at the series opener matters to you, the closest real option is Perth
          Stadium&apos;s own guided rooftop tour, which is a stadium-experience product, not match-day hospitality.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Premium hotel — one real fact beyond the Hotels guide</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Melbourne&apos;s splurge-tier hotel options (see the{" "}
          <Link href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Where to Stay guide
          </Link>
          ) run genuinely elevated pricing during Boxing Day week specifically — this is the one leg of the tour
          where paying up for a splurge-tier room during the Test itself is a real, deliberate luxury decision, not
          just a marginal upgrade, given how much the city's own hotel demand spikes independent of cricket.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which of the three is actually worth it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The SCG&apos;s Members Pavilion changeroom experience is the single most distinctive product across all
            four venues — a genuinely rare, capped-at-12-guests heritage experience nothing else on this tour
            comes close to. If you can only justify one splurge across the whole series, that&apos;s the one to
            chase, not the bigger-capacity Invincibles Lounge. For Boxing Day specifically, an MCG corporate box is
            the pick if you&apos;re a group of 8 or more and want a private space for the biggest single day of the
            tour — for 2-4 people, Adelaide Oval&apos;s Stadium Club offers a genuinely better view-to-price
            tradeoff, with the Hill and cathedral spire both in your eyeline.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Real contacts and current pricing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            MCG corporate boxes: Dynamic Business Events, 1300 660 509 — real day-1-vs-day-3 pricing gap confirmed
            live, book earlier in the Test for better value. Adelaide Oval Stadium Club: The Golden Ticket, 0437 490
            507 — live per-day pricing runs from roughly $350 down to $195 across the five days, so a mid-week day
            is genuinely better value than day one. SCG Luxury tiers are Enquire-Now only with no published pricing
            — see the SCG Luxury experience above for the real contact details.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        See the three hospitality experiences above for full sourcing and current pricing per venue.
      </p>
    </SpokeShell>
  );
}
