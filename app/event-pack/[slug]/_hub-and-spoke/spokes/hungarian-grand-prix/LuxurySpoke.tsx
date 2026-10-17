import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Covers the whole trip per the hub-and-spoke-event-pack skill §2i, not just
// the top hospitality product: F1 Fan Lounge + Paddock Club/Champions Club
// (real seeded experiences), a real sourced private-transfer price
// (mytransfers.com, Budapest Airport-Hungaroring route — the closest real
// sourced figure found for ground transport in this market, cited as one
// illustrative example, not a guaranteed race-weekend rate), High Note
// SkyBar as a real, sourced off-venue luxury pick (welovebudapest.com,
// lonelyplanet.com), and one new Four Seasons Gresham Palace fact
// (cross-referencing Hotels rather than re-listing it). 16 Oct 2026.
//
// Updated 17 Oct 2026: added Pickup Hungary (pickuphungary.com), a real
// named operator with a dedicated F1 Hungaroring Transfer page, alongside
// mytransfers.com as a second named/linked transfer option. High Note
// SkyBar now links its real site (ariahotelbudapest.com) and its real
// Google Places rating (4.4, 2,865 reviews, verified via
// scripts/_places-lookup.mjs per the Google-ratings-always-Places-API
// CLAUDE.md rule) rather than naming it with no link or number.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const fanLounge = linkedExperiences.find((e) => e.slug.includes("f1-fan-lounge-hungaroring-"));
  const paddockChampions = linkedExperiences.find((e) => e.slug.includes("paddock-club-hungaroring-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Hungarian Grand Prix"
      status="teaser"
      h1="Three real hospitality tiers, a private transfer, and a rooftop view over the Danube"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — the three hospitality tiers, a real transfer price, and a genuine off-venue pick. The pack adds F1's own Paddock Club and Champions Club products in full, plus the real booking contact and lead-time detail for a race that sells its top tier out well ahead of weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Hungarian Grand Prix weekend is a stack of real decisions, not one purchase — which hospitality
        tier, how you actually get to the circuit, and what you do with Budapest itself once the sessions end.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers — three real products, not one with a markup</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Fan Lounge sits a step below Paddock Club and Champions Club in F1&apos;s own tiers, built around the
        same idea at a more accessible price — an air-conditioned lounge, a buffet and open bar, paired with a
        reserved, covered seat in the main grandstand for all three days. Paddock Club sits above the team
        garages with a daily Pit Lane Walk, the genuine centrepiece no other ticket tier can replicate. Champions
        Club trades that daily access for one concentrated moment — the actual starting grid, walked, with a
        professional Championship Trophy photo, on the Saturday of your package.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A private transfer, skip the M2 and HÉV entirely</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Most fans reach the Hungaroring via metro, suburban rail, and a free shuttle — a genuinely workable route,
        but not a private one. A private sedan transfer from Budapest Airport runs roughly €125 one way (a private
        SUV roughly €137.50), covering the full ~31km route in about 30 minutes via{" "}
        <a
          href="https://www.mytransfers.com/en/destination/hungary/budapest-airport-bud/hungaroring/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#AAFF00] hover:text-[#BBFF33] underline"
        >
          mytransfers.com
        </a>{" "}
        — a real baseline figure, not a guaranteed race-weekend rate, which typically runs higher given demand.
        Pickup Hungary runs a dedicated F1 Hungaroring Transfer service — pre-booked private cars and corporate
        chauffeur service with English-speaking drivers, bookable directly rather than through a third-party
        aggregator, via{" "}
        <a
          href="https://pickuphungary.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#AAFF00] hover:text-[#BBFF33] underline"
        >
          pickuphungary.com
        </a>
        . A private helicopter transfer landing at the circuit&apos;s own VIP helipad is the genuine top-end option,
        cutting the trip to roughly 10 minutes from central Budapest.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A genuine luxury stay</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Four Seasons Gresham Palace, a restored Art Nouveau landmark directly on the Danube, is the standout among
        Budapest&apos;s luxury hotels — ask for a river-facing room specifically when booking, and consider the
        Royal Suite if the trip is a genuine splurge. It gets the full room-type and booking breakdown in the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>
        .
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">An off-venue evening — High Note SkyBar</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        High Note SkyBar, atop the Aria Hotel beside St. Stephen&apos;s Basilica, is Budapest&apos;s upscale
        rooftop pick — an elegant two-level indoor-outdoor space with the cathedral&apos;s dome close enough to
        feel within reach, open year-round. A genuine alternative to the louder 360 Bar scene on Andrássy út, worth
        booking ahead for a sunset table, especially during race week when demand across the city&apos;s rooftop
        bars runs higher than usual. Book via{" "}
        <a
          href="https://www.ariahotelbudapest.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#AAFF00] hover:text-[#BBFF33] underline"
        >
          ariahotelbudapest.com
        </a>
        .{" "}
        <a
          href="https://maps.google.com/?cid=1231243245169375730&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#AAFF00] hover:text-[#BBFF33] underline"
        >
          See live rating and reviews on Google Maps
        </a>
        .
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {fanLounge && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">F1 Fan Lounge, in full</p>
              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={fanLounge} isPro={isPro} />
              </div>
            </>
          )}

          {paddockChampions && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paddock Club & Champions Club, in full</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                Champions Club isn&apos;t simply &quot;Paddock Club but cheaper&quot; — it&apos;s built around one
                standout Saturday moment rather than Paddock Club&apos;s all-weekend pit lane access. Pick based on
                which specific experience you actually want, not price alone.
              </p>
              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={paddockChampions} isPro={isPro} />
              </div>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Paddock Club and Champions Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Treat the on-sale window as the real deadline, not a date to check back closer to race weekend —
            Hungary&apos;s affordability reputation doesn&apos;t extend to its hospitality tiers, and both sell
            through months ahead. Both are sold directly through{" "}
            <a
              href="https://www.f1experiences.com/2027-hungarian-grand-prix"
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
