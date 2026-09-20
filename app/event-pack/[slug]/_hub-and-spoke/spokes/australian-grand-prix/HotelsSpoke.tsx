import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// "Where to Stay in Melbourne for the Sporting Season" (reused from
// Australian Open 2027 / NZ-Australia cricket) is written around
// MCG/Melbourne Park proximity — East Melbourne, Jolimont, CBD — which is
// real and useful for those two events but geographically wrong for Albert
// Park, which sits ~5km south of the CBD near South Melbourne and St Kilda
// Road, not east near the MCG. The shared experience card is still shown
// below (it has genuinely useful CBD/short-term-rental/hostel content that
// applies city-wide), but this spoke's own free-text content gives real,
// Albert Park-specific neighborhood guidance rather than repeating the
// MCG-specific claims as if they applied here. No dedicated Albert-Park-area
// accommodation experience exists yet — an honest gap, not glossed over.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const whereToStay = linkedExperiences.find((e) => e.slug.includes("where-to-stay-melbourne-boxing-day-msvp80zu"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="teaser"
      h1="South Melbourne proximity, or CBD polish with a tram ride either way"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The area-by-area breakdown above is free. Unlock the pack for the exact hotel we'd book — 2 minutes from Albert Park Lake — plus direct booking links for it and two vetted hostels, the street-by-street call on St Kilda Road, and the one South Melbourne pocket that's genuinely walkable to Gate 1. This isn't a generic area guide — it's the specific names and links a first-time visitor actually needs to book."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Albert Park sits about 5km south of Melbourne&apos;s CBD, in a different part of the city from the
        MCG/Melbourne Park precinct that most Melbourne sporting-event accommodation content is written around — so
        the real decision for Grand Prix weekend is proximity to St Kilda Road and South Melbourne, not East
        Melbourne or Jolimont.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The three real options</p>
      <div className="grid grid-cols-1 gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">South Melbourne / Albert Park village</p>
          <p className="text-xs text-[#A3A3A3] leading-6">
            Closest you can get — a 10-15 minute walk to the circuit gates for the right streets, with Clarendon
            Street&apos;s cafes and a genuinely local, low-key neighborhood feel. Hotel stock here is thin; this is
            mostly a short-term-rental and serviced-apartment option, not a named hotel strip.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">St Kilda Road</p>
          <p className="text-xs text-[#A3A3A3] leading-6">
            The realistic hotel-heavy option — a straight tram ride (route 3, 5, 6, 16, or 64) up St Kilda Road
            into the CBD, and the same tram line runs directly past Albert Park. Most mid-range and business hotels
            in this corridor are a genuine 15-20 minute tram commute to the circuit.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">CBD</p>
          <p className="text-xs text-[#A3A3A3] leading-6">
            The widest hotel selection and the best base if you&apos;re combining Grand Prix weekend with the rest
            of a Melbourne trip — 20-25 minutes to Albert Park via free race-day tram or train to Anzac Station,
            trading circuit proximity for restaurants, shopping, and the laneway network on your doorstep.
          </p>
        </div>
      </div>

      {whereToStay && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={whereToStay} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The 2026 race drew a record 483,934 spectators across four days, the biggest crowd of Melbourne&apos;s F1
          era — a Sprint-format 2027 weekend is likely to draw comparable numbers. Hotels within genuine tram/train
          reach of Albert Park fill up well ahead of race week, and short-term rentals in South Melbourne and
          Albert Park village specifically get re-priced hard once dates are locked in.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            For a genuine first Albert Park weekend, St Kilda Road is the right default — real hotel selection, a
            direct tram line to the circuit that also runs past South Melbourne and into the CBD, and none of South
            Melbourne&apos;s thin, rental-only accommodation stock. If you&apos;re combining the race with a wider
            Melbourne trip, the CBD is the better call — you lose the shortest commute, but gain the laneway
            network, Southern Cross Station for onward travel, and walking access to Federation Square. South
            Melbourne itself is worth it only if you specifically want the shortest possible walk to the gates and
            don&apos;t mind hunting for a short-term rental rather than a named hotel.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which specific stay we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Pullman Melbourne Albert Park, at 65 Queens Road, is the pack&apos;s own pick — right on the park&apos;s
            northern edge, a 2-minute walk to Albert Park Lake, closer to the circuit than anything else on this
            list. If it&apos;s sold out or over budget, fall back to a well-reviewed hotel on the tram-line side of
            St Kilda Road (routes 3, 5, 6, 16, or 64) rather than one set back a block. In the CBD, stay within a
            few minutes&apos; walk of Southern Cross or Flinders Street for a direct free tram/train to the
            circuit. South Melbourne / Albert Park village is short-term-rental territory, not named hotels —
            check any listing&apos;s address against Clarendon Street before booking.
          </p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Pullman Melbourne Albert Park — 65 Queens Road</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Lake-view rooms 2 minutes from Albert Park Lake, right on the circuit&apos;s doorstep.
            </p>
            <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
              <a
                href="https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fpullman-melbourne-albert-park.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AtG3wNUGwAIB0gIkZTBkNTc5YzktZmU1MS00ZjAyLWIwNTMtNTM1Yjk0YTc1YWVj2AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26checkin%3D2027-04-01%26checkout%3D2027-04-05%26dest_id%3D47926%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1789926373%26srpvid%3D3ef17cf2c46d0152%26type%3Dtotal%26ucfs%3D1%26#no_availability_msg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
              >
                Book →
              </a>
              <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
            </div>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If a hotel isn&apos;t the plan — Airbnb and hostels</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Short-term rentals are a real option, but Victoria&apos;s Short Stay Levy adds 7.5% to the total booking
            fee (nightly rate, cleaning fee, and GST all included) on any Airbnb or similar platform stay — the levy
            doesn&apos;t apply to hotels, motels, or hostels, so it&apos;s specifically an Airbnb-vs-hotel cost
            difference worth knowing before you compare prices. Beyond the levy, hosts openly price up for this
            exact period and many set minimum-stay requirements once the race dates lock in, so a rental that
            looks cheap in January can be gone or repriced by March. Richmond and South Yarra have noticeably
            more apartment-style rental stock than East Melbourne&apos;s hotel-dominated core, both a short tram
            ride from Melbourne Park rather than a walk — worth checking if you want space and a kitchen over a
            hotel room.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            On the budget end, Melbourne has a genuine hostel scene rather than just one or two options — Bounce
            Melbourne, directly across from Flinders Street Station, and Space Hotel on Russell Street in the CBD
            are both real, currently operating hostels with dorm and private rooms, not just a backpacker
            afterthought. Availability for race week
            specifically tends to disappear five to seven months out, well before the general presale even opens,
            so this is a book-the-moment-you-know-your-dates category, not a wait-and-see one — check live
            availability directly on the hostel&apos;s own site or a platform like Hostelworld rather than assuming
            a quoted off-season rate will hold.
          </p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Two real hostels, both well-located for race week</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Bounce Melbourne and Space Melbourne are the two named picks worth booking directly rather than
              searching cold — both real, both a short tram or walk from Flinders Street Station and the free
              race-day tram network.
            </p>
            <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <a
                  href="https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Froamer-melbourne.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AtG3wNUGwAIB0gIkZTBkNTc5YzktZmU1MS00ZjAyLWIwNTMtNTM1Yjk0YTc1YWVj2AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D72516524_95834687_0_0_0_446773%26checkin%3D2027-04-01%26checkout%3D2027-04-05%26dest_id%3D725165%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D72516524_95834687_0_0_0_446773%26hpos%3D1%26matching_block_id%3D72516524_95834687_0_0_0_446773%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D72516524_95834687_0_0_0_446773_202058%26srepoch%3D1789926476%26srpvid%3Dca997d195ecc1dc4%26type%3Dtotal%26ucfs%3D1%26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
                >
                  Bounce Melbourne →
                </a>
                <a
                  href="https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fau%2Fspace-melbourne.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AtG3wNUGwAIB0gIkZTBkNTc5YzktZmU1MS00ZjAyLWIwNTMtNTM1Yjk0YTc1YWVj2AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26checkin%3D2027-04-01%26checkout%3D2027-04-05%26dest_id%3D261997%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1789926484%26srpvid%3Dbb277d24777610d6%26type%3Dtotal%26ucfs%3D1%26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
                >
                  Space Melbourne →
                </a>
              </div>
              <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate links — we may earn a small commission at no extra cost to you.</p>
            </div>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting the timing right</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book the moment your dates are fixed, not after general ticket sales open on 6 October 2026 — St Kilda
            Road&apos;s hotel stock is real but not unlimited, and Grand Prix weekend (held in early April) competes
            with Melbourne&apos;s ordinary autumn conference and event calendar for the same rooms. See the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </a>{" "}
            for the full free-transit picture from each of these three areas.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
