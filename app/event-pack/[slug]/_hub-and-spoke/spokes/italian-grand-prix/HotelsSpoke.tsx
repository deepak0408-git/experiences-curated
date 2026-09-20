import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// Two real, seeded lodging experiences cover this trip's actual choice:
// Hotel de la Ville (Monza's only luxury hotel, 2km from the circuit,
// where the F1 teams stay) and Staying in Milan (the city-base strategy
// most fans actually use — 9 minutes by train to Monza). 19 Sep 2026.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const hotelDeLaVille = linkedExperiences.find((e) => e.slug.includes("hotel-de-la-ville-monza-"));
  const stayingInMilan = linkedExperiences.find((e) => e.slug.includes("staying-in-milan-city-base-strategy-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="teaser"
      h1="Milan as a 9-minute city base, or Monza's one luxury hotel"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Both real options are free above. The pack adds our direct verdict on which Milan neighborhood to actually book, which specific hotel to pick within it, our honest read on whether Hotel de la Ville is worth booking over a Milan base, plus real hostel and Airbnb options for a race weekend on a tighter budget — a gap most guides skip entirely. The pack adds all of this, plus this same level of tactical detail across all 12 guides — tickets, food, transit, the whole trip planned out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Where to stay for the Italian Grand Prix is a genuinely simple choice compared to most F1 weekends: Milan,
        a real city with everything a race weekend needs, a 9-minute train ride from Monza; or Monza itself, a
        small town with exactly one luxury hotel and otherwise limited stock. Most visiting fans choose Milan, and
        for good reason.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Milan — the city base most fans actually use</p>
      {stayingInMilan && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={stayingInMilan} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hotel de la Ville — Monza's only luxury hotel</p>
      {hotelDeLaVille && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={hotelDeLaVille} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Race weekend is one of Milan and Monza&apos;s highest-demand hotel periods of the year — this is
          Ferrari&apos;s home race, and both Milan hotel stock and Hotel de la Ville&apos;s limited room count come
          under real pressure well ahead of the date.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Milan is the right default for almost every visiting fan — you get a real city to return to each
            evening, a genuinely wider hotel and dining range at every budget, and a train commute short enough
            that it barely counts as a tradeoff. Hotel de la Ville is the honest exception, not a downgrade: if
            waking up 2km from the circuit and staying in the same hotel as the F1 teams themselves is the point
            of the trip, it&apos;s worth the premium and the smaller-town evenings that come with it. The full
            transit breakdown for the Milan option lives in the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which Milan neighborhood we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Porta Garibaldi is the pack&apos;s own pick within Milan — it&apos;s the direct departure point for the
            S8/S9/S11 suburban trains to Monza, so you&apos;re not adding a metro transfer on top of the already
            short rail journey on race mornings. Central Milan around the Duomo trades a slightly longer walk or
            tram ride to Porta Garibaldi for genuinely easier access to the rest of the city&apos;s sightseeing and
            dining on non-session days.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which specific stay we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Within Porta Garibaldi itself, Hyatt Centric Milan Centrale and Hilton Milan are both genuine 4-star
            options that put you within a short walk or tram ride of the S8/S9/S11 departure point — Hyatt Centric
            trades slightly on price for its Milano Centrale-adjacent location, Hilton Milan is the steadier,
            more consistently available pick of the two on a shorter booking lead time. If you want a real price
            break without leaving the Porta Garibaldi corridor, BB Hotels Smarthotel Re Milano Nord in Sesto San
            Giovanni is the honest budget option — meaningfully cheaper than either 4-star, at the cost of sitting
            further out from the city center itself (still workable for a race-weekend base focused on the Monza
            commute, less workable if you also want easy evening access to central Milan).
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Airbnb, hostels, and other budget formats</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            None of this pack&apos;s named picks are hostels, and that&apos;s a deliberate gap worth naming rather
            than ignoring: Milan has a genuine, well-reviewed hostel scene, and the strongest named options sit
            close to the exact transit corridor this pack already recommends.
          </p>
          <ul className="flex flex-col gap-3 mb-4">
            <li className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white">MEININGER Milano Garibaldi</p>
              <p className="text-sm text-[#A3A3A3] leading-6 mt-1">
                The standout — a short walk from Porta Garibaldi station itself, real 3-star hotel-grade rooms in
                hostel format.{" "}
                <a
                  href="https://maps.google.com/?cid=10642958313042623602"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#AAFF00] hover:text-[#BBFF33] underline"
                >
                  See live rating and reviews on Google Maps
                </a>
                .
                <br />
                <a
                  href="https://www.jdoqocy.com/click-101774030-12319504?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fit%2Fmeininger-milano-garibaldi.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AvijvtUGwAIB0gIkN2UzZGQ0N2ItMDFlYi00YjczLTlhMWItNjk1MTYxNzgyNWU02AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D271668602_106261093_0_2_0_496217%26checkin%3D2027-09-02%26checkout%3D2027-09-06%26dest_id%3D2716686%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D271668602_106261093_0_2_0_496217%26hpos%3D1%26matching_block_id%3D271668602_106261093_0_2_0_496217%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D271668602_106261093_0_2_0_496217_179640%26srepoch%3D1789891115%26srpvid%3Dbdc3381465af00b6%26type%3Dtotal%26ucfs%3D1%26"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-[#AAFF00] hover:text-[#BBFF33] underline"
                >
                  Book -&gt;
                </a>
              </p>
            </li>
            <li className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white">MEININGER Milano Lambrate</p>
              <p className="text-sm text-[#A3A3A3] leading-6 mt-1">
                Opposite Lambrate railway station, the other real MEININGER option in the city — further from the
                Porta Garibaldi corridor than Garibaldi&apos;s own property.{" "}
                <a
                  href="https://maps.google.com/?cid=6330223598530321082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#AAFF00] hover:text-[#BBFF33] underline"
                >
                  See live rating and reviews on Google Maps
                </a>
                .
                <br />
                <a
                  href="https://www.kqzyfj.com/click-101774030-12319504?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fit%2Fmeininger-milano-lambrate.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AvijvtUGwAIB0gIkN2UzZGQ0N2ItMDFlYi00YjczLTlhMWItNjk1MTYxNzgyNWU02AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D350395702_117675704_0_2_0_496119%26checkin%3D2027-09-02%26checkout%3D2027-09-06%26dest_id%3D3503957%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D350395702_117675704_0_2_0_496119%26hpos%3D1%26matching_block_id%3D350395702_117675704_0_2_0_496119%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D350395702_117675704_0_2_0_496119_215640%26srepoch%3D1789891207%26srpvid%3Dbf3c3842690e0d33%26type%3Dtotal%26ucfs%3D1%26"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-[#AAFF00] hover:text-[#BBFF33] underline"
                >
                  Book -&gt;
                </a>
              </p>
            </li>
            <li className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white">B&amp;B Best Hostel Milano</p>
              <p className="text-sm text-[#A3A3A3] leading-6 mt-1">
                At Piazzale Loreto (10 meters from Loreto metro, M1 &amp; M2) — the genuine budget pick of the
                three, a metro ride rather than a direct rail link to Porta Garibaldi.{" "}
                <a
                  href="https://maps.google.com/?cid=9018007700200747868"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#AAFF00] hover:text-[#BBFF33] underline"
                >
                  See live rating and reviews on Google Maps
                </a>
                .
                <br />
                <a
                  href="https://www.tkqlhce.com/click-101774030-12319504?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fit%2Fb-amp-b-best-hostel-milano.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AvijvtUGwAIB0gIkN2UzZGQ0N2ItMDFlYi00YjczLTlhMWItNjk1MTYxNzgyNWU02AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D115331212_88477150_0_0_0%252C115331212_88477150_0_0_0%26checkin%3D2027-09-02%26checkout%3D2027-09-06%26dest_id%3D1153312%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D115331212_88477150_0_0_0%252C115331212_88477150_0_0_0%26hpos%3D1%26matching_block_id%3D115331212_88477150_0_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D115331212_88477150_0_0_0__16482%252C115331212_88477150_0_0_0__16482%26srepoch%3D1789891239%26srpvid%3Df5bc385270aa0ecf%26type%3Dtotal%26ucfs%3D1%26"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-[#AAFF00] hover:text-[#BBFF33] underline"
                >
                  Book -&gt;
                </a>
              </p>
            </li>
          </ul>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            Race weekend pricing at all three can climb closer to a budget hotel room once demand spikes — check
            actual current prices before assuming a hostel bed is automatically the cheapest option this
            particular weekend. Airbnb is a genuinely solid middle path if you want your own space without hotel
            prices, especially for a group splitting one apartment — search the Porta Garibaldi or central Milan
            area specifically and always cross-check the exact pin against S8/S9/S11 departure-point proximity
            before booking, since a listing&apos;s neighborhood name alone doesn&apos;t guarantee a short commute
            to Monza.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking windows & timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book your Milan hotel or Hotel de la Ville at least 2-3 months ahead of race weekend — this is
            Ferrari&apos;s home race, historically the highest-demand weekend of the year for both cities&apos;
            hotel stock, and Hotel de la Ville&apos;s room count in particular is small enough to sell through
            well before the date.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
