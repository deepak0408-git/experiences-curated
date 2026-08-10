import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// Deepened 10 Aug 2026 — the free section's single-card layout is real,
// not a gap: Shanghai currently has only 2 accommodation-type experiences
// (Where to Stay, Luxury Shanghai), and Luxury already has its own
// dedicated cross-linked home in the isUnlocked section below plus its
// own full spoke, so a forced second free-section card would just
// duplicate that. The real gap the ATP Finals comparison found was the
// locked verdict's thinness — deepened below to match ATP's decision-tree
// depth (day-trip vs. no-day-trip reasoning), using the real seeded
// planner_hotel_tier_cost data now available.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const stayGuide = linkedExperiences.find((e) => e.slug.includes("where-to-stay-shanghai-masters"));
  const luxuryGuide = linkedExperiences.find((e) => e.slug.includes("luxury-shanghai-peninsula-bulgari"));
  const moderateHotel = hotels.find((h) => h.tier === "moderate");

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="teaser"
      h1="Central Shanghai vs. near-venue Minhang — no venue-walkable option exists"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real central-vs-near-venue tradeoff is free above. Unlocking adds our verdict on which area to actually book — central Shanghai near Hongqiao Station if a day trip is part of your plan, near-venue Minhang if it isn't — plus the exact date you need to book by before Golden Week's pricing spike hits."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        No hotel in Shanghai is walking distance from Qizhong — the venue sits 27-30km southwest in Minhang District,
        a 45-90 minute door-to-gate journey regardless of where you stay. That means choosing where to stay is really
        about which strategy suits your trip, not about venue proximity.
      </p>

      {stayGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={stayGuide} isPro={isPro} />
        </div>
      )}

      {moderateHotel && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
          <p className="text-sm font-bold text-white mb-2">Real prices, 4-star tier</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A solid 4-star hotel in central Shanghai runs roughly{" "}
            {formatMoneyRange(Number(moderateHotel.costLow), Number(moderateHotel.costHigh))}/night outside Golden
            Week — see the full{" "}
            <a href={`/event-pack/${eventSlug}/cost`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Cost Guide
            </a>{" "}
            for every tier.
          </p>
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Golden Week pricing trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          China&apos;s National Day Golden Week (1-7 October) runs immediately before this tournament starts on 5
          October. Book your hotel before that window's demand spike, not after.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If you&apos;re planning a Suzhou or Hangzhou day trip (see the{" "}
            <a href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Day Trips guide
            </a>
            ), book central — near Hongqiao Railway Station specifically, since that&apos;s the primary departure
            point for both the Suzhou and Hangzhou high-speed lines. A near-venue Minhang hotel saves you time getting to Qizhong on match days but adds a
            genuine cross-city trip on your day-trip morning, which is the wrong tradeoff to make on your earliest,
            most time-pressured day. If a day trip isn&apos;t on your itinerary, the calculation flips: a near-venue
            Minhang stay cuts your daily shuttle time meaningfully across a multi-day tennis-only trip, at real
            savings over central hotel rates — see the Cost Guide&apos;s hotel tiers for exactly how much.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book before National Day Golden Week (1-7 October) demand hits, not after — this isn&apos;t a soft
            recommendation, it&apos;s a real, dated pricing event that spikes rates and tightens availability across
            Shanghai in the exact week before this tournament starts. Waiting until closer to your trip dates means
            booking into that spike rather than ahead of it.
          </p>
        </div>
      )}

      {isUnlocked && luxuryGuide && (
        <div className="mt-8 pt-8 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Splurging? Here&apos;s where</p>
          <SpokeExperienceCard experience={luxuryGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: answers.travelchinaguide.com, tripadvisor.com Shanghai Region forum, businesstravelnews.com,
        chinahighlights.com Golden Week guide. Hotel tier prices from planner_hotel_tier_cost, seeded 9 Aug 2026.
      </p>
    </SpokeShell>
  );
}
