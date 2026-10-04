import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isRealAffiliateLink } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// One real, seeded lodging experience covers this trip's core trade-off:
// Where to Stay — Jiading vs. Downtown Shanghai (Courtyard Shanghai Jiading,
// Hyatt Regency Shanghai Jiading, plus Campanile/Okura Garden/Waldorf
// Astoria on the Bund covering the 3 downtown budget tiers), 23 Sep/2 Oct
// 2026. bookingLinks added 4 Oct 2026 — all 5 hotels now have real,
// founder-supplied Booking.com affiliate links, closing the gap flagged
// per feedback_affiliate_link_generation. Crowne Plaza Shanghai Anting
// (mentioned in prose below as a third Jiading backup) isn't part of this
// experience and has no dedicated write-up — its affiliate link is inline
// here instead, same pattern as the Suju Apartment link below it.
//
// Short-term rental section added 4 Oct 2026 — Airbnb has no domestic
// China home-sharing platform since its 2022 exit, so this names the real
// local alternatives (Tujia, Xiaozhu, Ctrip homestays) instead of pointing
// to Airbnb the way every other event's Hotels spoke does. Tujia/Xiaozhu
// aren't English-searchable for specific verifiable listings, so the one
// named pick (Suju Hotel Apartment Shanghai Jiading) is a Booking.com
// serviced apartment instead, with a real founder-supplied affiliate link
// (anrdoezrs.net). A second candidate (Ketangjian Hotel Apartment, Nanxiang)
// was dropped — no usable affiliate link and a thin review base.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const whereToStay = linkedExperiences.find((e) => e.slug.includes("chinese-gp-where-to-stay-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Chinese Grand Prix"
      status="teaser"
      h1="An hour each way, twice a day — the real cost of staying downtown"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real trade-off and the two Jiading hotel picks are free above. The pack adds our direct verdict on which one to book, a third named backup if both sell out, exactly how to sequence a downtown stay around race days without losing sleep on a day that matters, how early to actually book in this genuinely small hotel market, and a real bookable short-term-rental pick plus the two domestic apps to search yourself."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Where to stay for the Chinese Grand Prix comes down to one real number: roughly 60 minutes each way on
        Shanghai Metro Line 11 between central Shanghai and the circuit, confirmed directly on Formula 1&apos;s own
        event page. That&apos;s not a minor detail on a three-day race weekend — it&apos;s an hour you either spend
        twice a day commuting, or spend once, settling near the circuit and taking a single longer trip downtown on
        a rest day instead.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Jiading vs. downtown Shanghai</p>
      {whereToStay && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={whereToStay} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">There's no wrong answer, but there is a wrong assumption</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Don&apos;t book downtown assuming the circuit is a quick hop away — an hour each way, twice a day, across
          three session days, adds up to real fatigue by Sunday. If the race is the priority, Jiading cuts that
          friction out entirely. If Shanghai as a city is the real point of the trip, downtown makes genuine sense
          and the commute is a reasonable price to pay.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which specific stay we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            Courtyard Shanghai Jiading is the pack&apos;s primary pick — a real, well-attested international brand
            with a solid review base behind it, and genuinely convenient if race day is the priority. Hyatt Regency
            Shanghai Jiading is the step-up option in the same general area, a real higher-end property, though its
            current review count is smaller — treat it as a promising lead worth checking closer to booking rather
            than a fully confirmed recommendation on review strength alone. If both are full for your dates, search
            the broader Jiading hotel market directly — Crowne Plaza Shanghai Anting is a third named international
            brand in the same area worth checking, though we haven&apos;t independently verified its current rating
            to the same bar as the two primary picks.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            <HotelBookingCard
              name="Courtyard & Hyatt Regency Shanghai Jiading"
              note="Both sit in the same general Jiading area, closest to the circuit."
              links={(whereToStay?.bookingLinks as Array<{ platform: string; label?: string; url: string }> | undefined)?.filter((l) => l.label?.includes("Jiading")) ?? []}
            />
            <HotelBookingCard
              name="Crowne Plaza Shanghai Anting"
              note="The third named backup if both Jiading primary picks are full for your dates."
              links={[
                {
                  platform: "booking.com",
                  label: "Crowne Plaza Shanghai Anting",
                  url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fcn%2Fcrowne-plaza-anting-golf.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-dcce4d69-20d5-4c9f-93b4-04e79de8b6f0%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D44644324_94467926_2_34_0%26checkin%3D2027-04-15%26checkout%3D2027-04-19%26dest_id%3D446443%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D44644324_94467926_2_34_0%26hpos%3D1%26matching_block_id%3D44644324_94467926_2_34_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D44644324_94467926_2_34_0__413400%26srepoch%3D1791134401%26srpvid%3Db5d115f14e680e951ac06b7cbdbd08f7%26type%3Dtotal%26ucfs%3D1%26",
                },
              ]}
            />
            <HotelBookingCard
              name="Downtown — Campanile, Okura Garden & Waldorf Astoria on the Bund"
              note="Budget, moderate, and luxury picks respectively, all covered in full in the Where to Stay guide above."
              links={(whereToStay?.bookingLinks as Array<{ platform: string; label?: string; url: string }> | undefined)?.filter((l) => !l.label?.includes("Jiading")) ?? []}
            />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How to sequence a downtown stay</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            If you do choose downtown, don&apos;t treat every session day the same. Plan a dedicated Metro Line 11
            trip out to the circuit on practice day (Friday) specifically, to scout the real journey time and
            station layout before the stakes and crowds are higher on qualifying and race day. Build your one
            proper downtown day — the Bund, French Concession, a real Shanghai dinner — around the day before or
            after the race weekend itself, not squeezed between sessions, so the commute never costs you sleep on a
            day that actually matters.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking windows &amp; timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Book Jiading-area hotels as early as you can once your dates are confirmed — this is a genuinely
            limited hotel market compared to central Shanghai, with far fewer rooms overall, so race-weekend demand
            has more room to bite even at international-brand properties. Downtown Shanghai has vastly more hotel
            stock and more flexibility on booking timing, but that flexibility is exactly why it doesn&apos;t solve
            the actual commute problem — more choice of hotel doesn&apos;t shorten the ride to the circuit.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If a hotel isn&apos;t the plan — short-term rentals</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            Tujia (途家) and Xiaozhu (小猪), China&apos;s two largest short-term rental platforms, plus homestay
            listings inside the Ctrip/Trip.com app itself, are the real way to search for a self-catered stay here.
            Expect all three to be mostly or entirely in Chinese, and go in expecting to use a translation app for
            booking and check-in — these platforms were not built with an international visitor in mind. Foreign
            guests are required to register their stay with local police within 24 hours of arrival; a hotel
            handles this automatically at check-in, but a short-term rental host may not, so confirm directly with
            the host before booking that they&apos;ll handle registration, not assume it.
          </p>
          <HotelBookingCard
            name="Suju Hotel Apartment Shanghai Jiading"
            note="A serviced-apartment alternative to the two hotel picks above, bookable directly in English — a real studio with its own kitchenette, steps from Nanxiang Metro Station on Line 11, the same line that runs to the circuit."
            links={[
              {
                platform: "booking.com",
                label: "Suju Hotel Apartment",
                url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fcn%2Fsuju-apartment-shanghai-jiading-near-guyi-garden-amp-nanxiang-metro-station-line.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-96274d28-8bd4-4e98-ae8f-c0b1fec492f0%26sid%3D10739545d173fb9cf268f24fa0055875%26checkin%3D2027-04-15%26checkout%3D2027-04-19%26dest_id%3D14820928%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1791112739%26srpvid%3Da59640942d0ab330f86b2ae35595090d%26type%3Dtotal%26ucfs%3D1%26",
              },
            ]}
          />
        </div>
      )}
    </SpokeShell>
  );
}

function HotelBookingCard({
  name,
  note,
  links = [],
}: {
  name: string;
  note: string;
  links?: Array<{ platform: string; label?: string; url: string }>;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
      {links.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {links.map((link, i) => (
              <a
                key={link.url ?? i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
              >
                {link.label ?? link.platform} →
              </a>
            ))}
          </div>
          {links.some((link) => isRealAffiliateLink(link.url)) && (
            <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
          )}
        </div>
      )}
    </div>
  );
}
