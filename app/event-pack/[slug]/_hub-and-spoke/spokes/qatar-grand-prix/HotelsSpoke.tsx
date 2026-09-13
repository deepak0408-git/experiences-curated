import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// Four real, seeded lodging experiences cover this trip's actual spread:
// Raffles/Fairmont Doha (Lusail Marina, closest to the circuit), Staybridge
// Suites Lusail (same neighborhood, apartment-style value), Marsa Malaz
// Kempinski (The Pearl, resort/beach base), and Four Seasons Doha (West
// Bay, city-Corniche base). No bookingLinks set on any of the four as of
// 13 Sep 2026 — affiliate opportunity not yet actioned, flagged for the
// curator per feedback_affiliate_link_generation.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const marinaHotels = linkedExperiences.find((e) => e.slug.includes("qatar-gp-lusail-marina-hotels-"));
  const staybridge = linkedExperiences.find((e) => e.slug.includes("qatar-gp-staybridge-suites-lusail-"));
  const pearlHotel = linkedExperiences.find((e) => e.slug.includes("qatar-gp-pearl-hotel-"));
  const westBayHotel = linkedExperiences.find((e) => e.slug.includes("qatar-gp-west-bay-hotel-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="teaser"
      h1="Lusail Marina for proximity, The Pearl for a resort, West Bay for the city"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="You've got the real hotel picks and neighborhood breakdown above — what you don't have yet is our direct verdict on which specific stay to book, plus our honest read on Airbnb and budget apartment options for race week, a gap most guides skip entirely. The pack adds both, plus this same level of tactical detail across all 12 guides — tickets, food, transit, the whole trip planned out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Where to stay for the Qatar Grand Prix is a genuine choice between four different kinds of trip. Lusail
        Marina puts you closest to the circuit itself. The Pearl trades that proximity for a real resort holiday.
        West Bay puts you in the actual city, on Doha&apos;s central Corniche. All four are real, bookable hotels —
        this isn&apos;t a one-size guide.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Raffles & Fairmont Doha — Lusail Marina, closest to the circuit</p>
      {marinaHotels && (
        <div className="mb-8">
          <SpokeExperienceCard experience={marinaHotels} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Staybridge Suites Lusail — the value play, same neighborhood</p>
      {staybridge && (
        <div className="mb-8">
          <SpokeExperienceCard experience={staybridge} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Marsa Malaz Kempinski — The Pearl, a real resort base</p>
      {pearlHotel && (
        <div className="mb-8">
          <SpokeExperienceCard experience={pearlHotel} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Four Seasons Doha — West Bay, the city base</p>
      {westBayHotel && (
        <div className="mb-8">
          <SpokeExperienceCard experience={westBayHotel} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Race weekend is one of Doha&apos;s highest-demand hotel periods of the year — expect Doha&apos;s highest
          rates of the year at Lusail Marina&apos;s five-star towers specifically, per the hotels&apos; own listed
          guidance. Book as far ahead as you can, especially if a specific property or room category matters to you.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which neighborhood we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Lusail Marina is the right default for a genuine first Lusail weekend — it&apos;s the shortest real
            trip to the circuit of any of the four areas, and Raffles/Fairmont&apos;s shared tower puts you steps
            from the marina&apos;s own restaurant scene for evenings when you&apos;re not at the track. If budget
            matters more than polish, Staybridge Suites sits in the same neighborhood at a real discount — full
            kitchens and apartment-style rooms make it the better call for a group splitting one unit. The Pearl and
            West Bay both trade circuit proximity for something else: The Pearl for an actual beach-resort trip,
            West Bay for Doha&apos;s real city center on the Corniche. Both are a genuine taxi ride from Lusail, not
            a quick hop — see the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </a>{" "}
            for real transit times from each.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which specific stay we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Within the Lusail Marina tower, Raffles&apos; all-suite floors (132 suites, no standard rooms, a
            personal butler with every stay) are the pick if the trip is a genuine splurge — its 4.6/1,848-review
            Google rating and #2-of-12 TripAdvisor ranking in Lusail both back that up. Fairmont, sharing the same
            building, is the more standard five-star option one price tier down if Raffles is sold out or above
            budget. At The Pearl, Marsa Malaz Kempinski&apos;s private-island setting and nearly 500-foot beach are
            the real draw over any comparable Doha resort — book the beach-facing room category specifically if a
            resort holiday is the actual point of the stay.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Airbnb and budget apartment options</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            None of this pack&apos;s named picks are hostels or short-term rentals, and that&apos;s a real gap
            worth naming: Doha&apos;s hostel scene is genuinely thin compared to a city like São Paulo or Bangkok,
            so a hostel bed isn&apos;t the reliable budget fallback here it is elsewhere. Airbnb is the more
            realistic budget-and-space option instead, concentrated in West Bay and Msheireb Downtown apartment
            towers — search those two areas specifically for genuine self-catered stock, and always cross-check a
            listing&apos;s actual building against Doha Metro Gold Line access before booking, since West Bay&apos;s
            towers vary meaningfully in walking distance to a station. Race-weekend pricing on Doha&apos;s Airbnb
            listings climbs the same way hotel rates do, so book earlier than you would for a normal Doha trip.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking windows & timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Whichever area you land on, book Lusail Marina&apos;s five-star towers earliest — the hotels&apos; own
            listed guidance already flags Doha&apos;s highest race-weekend rates here specifically, which points to
            genuine demand pressure on inventory, not just price. The Pearl and West Bay properties, being larger
            and further from the circuit, tend to hold availability slightly longer, but book at least 2-3 months
            ahead regardless — this is a real high-demand weekend across the whole city, not just around Lusail.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
