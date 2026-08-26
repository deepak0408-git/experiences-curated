import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// The Where to Stay experience already covers East Melbourne (walk to the
// precinct) vs. the CBD (restaurants, wider city) — this spoke wraps that
// real content with real planner_hotel_tier_cost numbers rather than
// duplicating the neighbourhood picks.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const stayGuide = linkedExperiences.find((e) => e.slug.includes("where-to-stay-melbourne-boxing-day"));
  const moderateHotel = hotels.find((h) => h.tier === "moderate");

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="teaser"
      h1="East Melbourne for the walk, the CBD for the city — no bad choice, one real deadline"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real East Melbourne-vs-CBD tradeoff is free above. Unlocking adds our verdict on which area actually suits a first-time visitor, the booking window that matters most, and where the Airbnb and hostel scene actually fits if a hotel isn't the plan."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Unlike a venue built on the edge of a city, Melbourne Park sits close enough to the CBD that both a
        precinct-adjacent stay and a central-city stay are genuinely walkable or a short tram ride — this is a
        real lifestyle choice, not a proximity compromise either way.
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
            A solid 4-star hotel in central Melbourne runs roughly{" "}
            {formatMoneyRange(Number(moderateHotel.costLow), Number(moderateHotel.costHigh))}/night outside the
            summer sporting peak — see the full{" "}
            <a href={`/event-pack/${eventSlug}/cost`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Cost Guide
            </a>{" "}
            for every tier.
          </p>
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Summer sporting calendar pricing trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Late December through late January is one of the most in-demand accommodation stretches Melbourne sees
          all year — the Australian Open draws well over a million visitors across its own fortnight, and it
          follows directly on from the Boxing Day Test and New Year&apos;s stretch in December. Book months ahead,
          not weeks.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Australian Open, book East Melbourne over the CBD. Melbourne&apos;s January weather is
            genuinely volatile — a 15-20°C swing inside a single day is normal, and heatwave spikes above 35°C
            happen — so a short walk back to your room if a session gets interrupted or the heat turns matters more
            here than at most Grand Slams. The CBD is the better call specifically if you&apos;re planning to
            spend real time on Collins Street&apos;s restaurant scene or want to be close to Federation Square and
            the wider city for non-tennis days — see the{" "}
            <a href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Day Trips guide
            </a>
            .
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If a hotel isn&apos;t the plan — Airbnb and hostels</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Short-term rentals are a real option, but Victoria&apos;s Short Stay Levy adds 7.5% to the total booking
            fee (nightly rate, cleaning fee, and GST all included) on any Airbnb or similar platform stay — the levy
            doesn&apos;t apply to hotels, motels, or hostels, so it&apos;s specifically an Airbnb-vs-hotel cost
            difference worth knowing before you compare prices. Beyond the levy, hosts openly price up for this
            exact period and many set minimum-stay requirements once the tournament dates lock in, so a rental that
            looks cheap in October can be gone or repriced by December. Richmond and South Yarra have noticeably
            more apartment-style rental stock than East Melbourne&apos;s hotel-dominated core, both a short tram
            ride from Melbourne Park rather than a walk — worth checking if you want space and a kitchen over a
            hotel room.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            On the budget end, Melbourne has a genuine hostel scene rather than just one or two options — Bounce
            Melbourne, directly across from Flinders Street Station, and Space Hotel on Russell Street in the CBD
            are both real, currently operating hostels with dorm and private rooms, not just a backpacker
            afterthought. Availability for AO week
            specifically tends to disappear five to seven months out, well before the general presale even opens,
            so this is a book-the-moment-you-know-your-dates category, not a wait-and-see one — check live
            availability directly on the hostel&apos;s own site or a platform like Hostelworld rather than assuming
            a quoted off-season rate will hold.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book before the Boxing Day Test week hits in December — the same accommodation stock that fills up for
            cricket fans is what you&apos;re competing for a few weeks later for the Open, and Melbourne&apos;s
            summer sporting calendar means rates rise in steps as December progresses rather than jumping all at
            once. Booking early isn&apos;t excessive caution here, it&apos;s the difference between a normal rate
            and paying double.
          </p>
        </div>
      )}

    </SpokeShell>
  );
}
