import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// Three real, seeded lodging experiences cover this trip's actual spread:
// Hotel Emiliano (Jardins boutique luxury), Budget & Mid-Range Stays
// (Morumbi/Campo Belo, closer to the circuit), and the Jardins/Itaim
// Bibi/Vila Nova Conceição neighborhood guide (self-catered/mid-to-high-end
// apartment stock). No bookingLinks set on any of the three as of 12 Sep
// 2026 — affiliate opportunity not yet actioned, flagged for the curator
// per feedback_affiliate_link_generation.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const hotelEmiliano = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-hotel-emiliano-"));
  const budgetHotels = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-budget-hotels-morumbi-"));
  const neighborhoods = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-jardins-itaim-neighborhoods-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Brazilian Grand Prix"
      status="teaser"
      h1="Jardins luxury, Morumbi value, or a self-catered stay across three neighborhoods"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="You've got the real hotel picks and neighborhood breakdown above — what you don't have yet is our direct verdict on which specific stay to book if Hotel Emiliano is sold out, plus our honest read on Airbnb and hostel options for race week, a gap most guides skip entirely. The pack adds both, plus this same level of tactical detail across all 12 guides — tickets, food, transit, the whole trip planned out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Where to stay for the Brazilian Grand Prix is a genuine tradeoff between polish and proximity. Jardins puts
        you in São Paulo&apos;s most fashionable, food-forward neighborhood, a real transit ride from Interlagos.
        Morumbi and Campo Belo sit much closer to the circuit itself, trading boutique character for a shorter
        commute and a real price break. A self-catered apartment across Jardins, Itaim Bibi, or Vila Nova
        Conceição is the third option, for anyone who wants more space or a longer stay.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hotel Emiliano — Jardins boutique luxury</p>
      {hotelEmiliano && (
        <div className="mb-8">
          <SpokeExperienceCard experience={hotelEmiliano} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Budget & mid-range — Morumbi and Campo Belo</p>
      {budgetHotels && (
        <div className="mb-8">
          <SpokeExperienceCard experience={budgetHotels} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Self-catered — Jardins, Itaim Bibi & Vila Nova Conceição</p>
      {neighborhoods && (
        <div className="mb-8">
          <SpokeExperienceCard experience={neighborhoods} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Race weekend is one of São Paulo&apos;s highest-demand hotel periods of the year — a well-regarded,
          57-room property like Hotel Emiliano books out its best rooms months ahead. Jardins, Itaim Bibi, and Vila
          Nova Conceição&apos;s short-term rental stock also carries a real race-weekend premium across all three
          neighborhoods.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which neighborhood we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Jardins is the right default for a genuine first Interlagos trip — it puts you closest to the
            neighborhood energy that makes São Paulo worth visiting beyond the race, and F1 teams and paddock
            regulars already default to this exact area for a reason. If proximity to the circuit matters more
            than polish, Morumbi is the better trade — a short ride from Interlagos at a real price break, at the
            cost of Jardins&apos; walkability and restaurant scene. For a longer stay or a group, a self-catered
            apartment near Vila Olímpia&apos;s Line 9 station gets you the same no-transfer route to the Autódromo
            stop that Jardins itself doesn&apos;t offer directly. The full transit breakdown for each option lives
            in the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which specific stay we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Within Jardins, Hotel Emiliano is the pack&apos;s own pick — but it&apos;s showing no availability for
            race week itself as of this writing, so don&apos;t assume it&apos;ll still be bookable by the time you
            look. Treat any comparable 5-star nearby (Hotel Fasano, also in Jardins, and Rosewood São Paulo, a
            short walk away in Cidade Matarazzo) as your genuine fallback, not a downgrade — this part of the city
            is dense with real luxury options, so the neighborhood&apos;s own location advantage matters more here
            than which specific 5-star you land in. Within Morumbi, Blue Tree Premium
            Verbo Divino is the better of the two named budget/mid-range picks if you want an actual hotel
            experience; Ibis Budget São Paulo Morumbi is the honest lower-cost option if a basic, functional room is
            all you need.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Airbnb, hostels, and other budget formats</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            None of this pack&apos;s named picks are hostels, and that&apos;s a deliberate gap worth naming rather
            than ignoring: São Paulo&apos;s hostel scene is real and generally well-reviewed, concentrated in Vila
            Madalena and Pinheiros. Viva Hostel Design, a 7-minute walk from Vila Madalena metro station, is a
            genuinely solid named pick — private and shared rooms, a 9.0-rated social bar and lounge, real reviews
            behind it, not just a generic backpacker bunk. Reserva 69 is the other real name worth knowing in the
            same neighborhood, a genuine alternative if Viva is full or doesn&apos;t suit. Race weekend pricing at
            the better-known hostels can still climb close to a budget hotel room once demand spikes — check
            actual current prices before assuming a hostel bed is automatically the cheapest option this
            particular weekend. Airbnb is a genuinely solid middle path if you want your own space without hotel
            prices, especially for a group splitting one apartment — search Jardins, Itaim Bibi, or Vila Nova
            Conceição specifically (per the self-catered neighborhood guide above) and always cross-check the
            exact pin against Line 9 (Esmeralda) proximity before booking, since a listing&apos;s neighborhood name
            alone doesn&apos;t guarantee a direct route to Interlagos.
          </p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Two real hostels in Vila Madalena, both walkable to the metro</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Viva Hostel Design and Reserva 69 are the two named picks worth booking directly rather than
              searching cold — both real, both well-located for Vila Madalena&apos;s nightlife and a Line 2
              (Green) connection into the city.
            </p>
            <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <a
                  href="https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fbr%2Fviva-hostel-design.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Avr2lNUGwAIB0gIkNTc4OTZmOWYtOGRiYy00MWU2LTliOTItNjFjNmY2OTBjM2U02AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D77582504_118486973_0_0_0%252C77582504_118486973_0_0_0%26checkin%3D2026-11-05%26checkout%3D2026-11-09%26dest_id%3D775825%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D77582504_118486973_0_0_0%252C77582504_118486973_0_0_0%26hpos%3D1%26matching_block_id%3D77582504_118486973_0_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D77582504_118486973_0_0_0__30600%252C77582504_118486973_0_0_0__30600%26srepoch%3D1789213573%26srpvid%3D8d7352c1af8600aa%26type%3Dtotal%26ucfs%3D1%26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
                >
                  Viva Hostel Design →
                </a>
                <a
                  href="https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fbr%2Freserva-69-hostel.en-gb.html%3Flabel%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Avr2lNUGwAIB0gIkNTc4OTZmOWYtOGRiYy00MWU2LTliOTItNjFjNmY2OTBjM2U02AIB4AIB%26aid%3D304142%26ucfs%3D1%26arphpl%3D1%26checkin%3D2026-11-05%26checkout%3D2026-11-09%26dest_id%3D775825%26dest_type%3Dhotel%26group_adults%3D2%26req_adults%3D2%26no_rooms%3D1%26group_children%3D0%26req_children%3D0%26ucfac%3D3151"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
                >
                  Reserva 69 →
                </a>
              </div>
              <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate links — we may earn a small commission at no extra cost to you.</p>
            </div>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking windows & timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Whichever Jardins-area luxury stay you land on, book at least 2-3 months ahead — this is a genuinely
            high-demand pocket of the city during race week, and small boutique properties like Emiliano sell out
            their best rooms (and sometimes their whole inventory) well before the date. Morumbi&apos;s Ibis Budget
            property rarely sells out completely given its 378-room scale, so it&apos;s the more forgiving option
            on a shorter lead time. For self-catered stays and Airbnb listings, book earlier than you would for a
            normal São Paulo trip and cross-check any listing&apos;s exact address against the nearest Line 9
            (Esmeralda) station before booking — proximity to that specific line matters more than the neighborhood
            name alone.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
