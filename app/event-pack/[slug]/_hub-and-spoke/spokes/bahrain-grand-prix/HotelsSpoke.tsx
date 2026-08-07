import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const klGuide = linkedExperiences.find((e) => e.slug.includes("staying-in-kuala-lumpur"));
  const samaSama = linkedExperiences.find((e) => e.slug.includes("sama-sama-hotel"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Bahrain Grand Prix"
      status="teaser"
      h1="Kuala Lumpur vs staying near the airport"
      question="Where should I stay for the Bahrain GP in Malaysia?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every hotel and rating above is real and free. The pack adds our single recommendation for your specific priorities, plus the booking-timing detail that matters most for a race weekend with unusually high pent-up demand."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This is genuinely a two-way decision, not a default — stay in Kuala Lumpur for the actual city, or stay
        right at the airport for the shortest possible race-morning commute. Sepang&apos;s own hotel stock is thin
        and mostly airport-transit-oriented, so &quot;stay near the circuit&quot; effectively means one specific,
        very good hotel, not a neighbourhood of options. What KL actually buys you: all four hotels below sit close
        enough to walk to the Petronas Twin Towers, and three of the four (Banyan Tree, JW Marriott, Hotel Capitol)
        are within a few minutes of Pavilion KL, Sungei Wang, or Lot 10 Mall — real shopping and dining on foot, not
        a taxi ride away. Every hotel also sits within walking distance of a KLCC or Bukit Bintang monorail/MRT
        station, so the KLIA Ekspres connection to Sepang on race morning is a short, uncomplicated hop rather than
        a cross-city trek.
      </p>

      {/* KL guide's own experience page carries the real, live per-hotel
          rating breakdown (multi-venue jump-link pattern) — this spoke
          just needs the card, not a duplicate hotel-by-hotel list.
          Removed 7 Aug 2026 per explicit feedback: the ratings are already
          one click away on the card's own page. */}
      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Kuala Lumpur — KLCC &amp; Bukit Bintang (45-60 min from Sepang)</p>
      {klGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={klGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Right at the airport</p>
      {samaSama && (
        <div className="mb-8">
          <SpokeExperienceCard experience={samaSama} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3 mt-6">Prefer an Airbnb or homestay instead?</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Hotels aren&apos;t the only option — Kuala Lumpur has a large short-let market, and for a multi-night race
          weekend a self-catered apartment can genuinely beat a hotel room on space and price. If you&apos;re
          searching Airbnb or a homestay platform rather than booking a hotel directly, these are the neighbourhoods
          worth filtering for:
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-white mb-1">Bukit Bintang &amp; KLCC</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The same areas as the hotels above, and for the same reasons — walkable to Pavilion KL, Jalan Alor, and
              the Twin Towers, with a KLCC or Bukit Bintang monorail/MRT station nearby for the KLIA Ekspres
              connection on race morning. The most listings on Airbnb of any KL neighbourhood, but also the highest
              nightly rates.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Bangsar</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A genuinely different feel from the tourist core — a residential, café-and-bar neighbourhood locals
              actually live in, with its own MRT station. Slightly further out and about the same ~50-55 minute
              journey to Sepang as central KL, so you&apos;re not trading commute time for the change of pace.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Chinatown (Petaling Street)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The cheapest of the four, heritage shophouse buildings, a growing café scene alongside the market
              stalls. Pasar Seni LRT station is one stop and about 4 minutes from KL Sentral, so the KLIA Ekspres
              connection is arguably the simplest of any neighbourhood here — worth it if budget matters more than
              being in the KLCC/Bukit Bintang mall district.
            </p>
          </div>
        </div>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Malaysian GP, Kuala Lumpur is the right call for almost everyone — you get a real, world-class
            city for the two-thirds of the trip you&apos;re not at the track, and the KLIA Ekspres commute on race
            morning is short enough that it barely counts against the tradeoff. Sama-Sama is the right call
            specifically if your trip is tight and circuit-focused — fly in, watch the race, fly out — where minimising
            travel-day friction matters more than city time. It&apos;s also genuinely worth one night either side of a
            long-haul flight even if you base in KL for the rest of the trip.
          </p>

          {/* Per-hotel booking cards — direct website link per hotel, using
              the individual URLs already in klGuide.practicalInfo.website
              (comma-separated, same order as the 4 hotels covered in the KL
              guide card above) rather than one generic paragraph telling
              the reader to "book directly with each hotel." Moved here
              (unlocked-only) 1 Aug 2026 — putting real booking detail and
              the full experience-page links in the free section above
              undercut the whole reason to unlock the pack. */}
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; contacts</p>
          <div className="flex flex-col gap-3 mb-6">
            <HotelBookingCard name="Mandarin Oriental" url="https://www.mandarinoriental.com/kuala-lumpur" note="Book directly for the best room-selection flexibility — request an upper-floor Twin Towers View room if the Petronas view matters, since lower floors have been noted by guests as less spectacular." />
            <HotelBookingCard name="Banyan Tree" url="https://www.banyantree.com/malaysia/kuala-lumpur" note="Book directly or via Booking.com. Race weekend will drive demand across all of KL, not just Sepang-adjacent stock — confirm dates and book as early as possible." />
            <HotelBookingCard name="JW Marriott" url="https://www.marriott.com/en-us/hotels/kuldt-jw-marriott-hotel-kuala-lumpur/overview/" note="Book direct via Marriott.com for loyalty-programme benefits, or via Booking.com. Central Bukit Bintang stock fills fast on race weekends." />
            <HotelBookingCard name="Hotel Capitol" url="https://capitol.com.my/" note="Book directly for the best rate on this budget-tier pick — its Bukit Bintang location fills quickly given the price point." />
            <HotelBookingCard
              name="Sama-Sama Hotel"
              url="https://www.samasamahotels.com"
              note="Book direct at samasamahotels.com, or via Booking.com — specify the landside Sama-Sama Hotel KLIA (sky bridge, 5-min walk to terminal), not the airside Sama-Sama Express transit hotels, if booking a multi-night stay."
            />
          </div>
          {klGuide?.insiderTips?.[1] && (
            <p className="text-sm text-[#A3A3A3] leading-7">{klGuide.insiderTips[1]}</p>
          )}
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: rome2rio.com (Bangsar–Sepang journey time/fare), klsentral.info and Pasar Seni station transit data
        (Chinatown LRT access), Airbnb neighbourhood listing data for Bukit Bintang/KLCC/Bangsar/Chinatown.
      </p>
    </SpokeShell>
  );
}

function HotelBookingCard({ name, url, note }: { name: string; url: string; note: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
        <p className="text-sm font-bold text-white">{name}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
          Book direct ↗
        </a>
      </div>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
    </div>
  );
}
