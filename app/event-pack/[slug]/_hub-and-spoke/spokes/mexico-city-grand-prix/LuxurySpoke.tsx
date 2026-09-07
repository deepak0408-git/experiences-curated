import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const paddockClub = linkedExperiences.find((e) => e.slug.includes("mexico-city-gp-paddock-club-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Mexico City Grand Prix"
      status="teaser"
      h1="A whole trip of luxury decisions, not one hospitality product"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — the hospitality tiers, rooftop scene, and private transit pricing. The pack adds F1's own Paddock Club and Champions Club products in full, plus the actual booking mechanics — real contacts, real lead-time detail, and which tier we'd actually pick for this specific race."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Mexico City GP weekend is a stack of decisions, not one purchase. Beyond the obvious top hospitality
        tier, a genuinely luxury trip here spans a real private-transit market, a rooftop and nightlife scene with a
        genuine F1 afterparty history, and premium hotel options across three very different neighborhoods.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers beyond the top one</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Experiences sells two real hospitality tiers here, not just one: the Champions Club, positioned lower
        than full Paddock Club but still genuinely premium — a 3-day package with hospitality, a guided paddock tour,
        and grid-walk access — and the official F1 Paddock Club and House 44 at F1 Paddock Club™, from
        US$8,502 for the 3-day package. Both include real pit-lane proximity and hospitality service — the difference is suite position and depth
        of access, not one being a watered-down version of the other. Champions Club is sold directly through F1
        Experiences, not the official ticketing site — confirm current pricing there before booking.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-circuit — the rooftop scene</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Mexico City has a genuine rooftop-bar culture that predates the race, and two spots specifically carry real
        pedigree: Area Bar, attached to Hotel Habita on Avenida Presidente Masaryk in Polanco, draws a real
        celebrity-adjacent crowd with a lower VIP terrace and pool; and the rooftop at Hotel CondesaDF (the same
        hotel featured in the Where to Stay guide) looks out over Parque España toward Chapultepec Castle. Polanco&apos;s
        club scene also carries genuine F1 history — one of the neighborhood&apos;s well-known clubs has hosted
        actual Formula 1 afterparties and international-artist concerts in past seasons, not just marketing-copy
        &quot;VIP nights.&quot;
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Private transit</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The circuit sits in the eastern part of the city, a genuine distance from the luxury hotel corridors in
        Polanco and Roma Norte, and race weekend brings real road closures and reversible-lane schemes across the
        city — a private transfer is a real practical upgrade over rideshare here, not just a comfort choice, since
        Uber and DiDi can&apos;t get near the actual gates anyway (see the Getting There guide).
      </p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Real current Mexico City hourly rates for a private car: a sedan runs roughly 600-900 MXN/hour in central
          zones, an SUV roughly 900-1,300 MXN/hour, with airport pickups adding 1,200-1,800 MXN on top. These are
          general Mexico City rates, not race-specific pricing — expect a premium above these figures for race
          weekend itself given genuinely elevated demand.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ultra-luxury stays</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The real new luxury fact worth knowing here: Las Alcobas in Polanco is an intimate, five-star Luxury
        Collection property, formerly a private residence redesigned entirely by Yabu Pushelberg — a genuinely
        different tier of stay from the area&apos;s larger international chain hotels. It gets the full breakdown,
        room types, and booking detail in the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>
        .
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {paddockClub && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: F1 Paddock Club & Champions Club</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                Paddock Club is F1&apos;s own official hospitality product, run the same way at every round — pit-lane
                proximity, daily pit-lane walks, premium open bars, and trackside entertainment. Champions Club sits
                a genuine step below it in price and suite position, but still puts you in a real hospitality
                environment rather than the general crowd.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard experience={paddockClub} isPro={isPro} />
              </div>

              <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
                A grandstand sells you one great view of the racing. Paddock Club or Champions Club sells you the
                whole day around it — food, bars, and real proximity to the sport itself, not just a better seat.
              </p>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Paddock Club and Champions Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Call F1 Experiences directly at +1 718-682-7493 rather than relying only on the online booking flow —
            Mexico City&apos;s overall demand is unusually high for this race, and hospitality inventory has sold
            out before race week in past seasons. A phone call gets you real availability by suite section, which
            the standard website checkout won&apos;t show. Ask about Champions Club as a real fallback in the same
            call if Paddock Club is already tight — it carries real overlap in what you get at a meaningfully lower
            price point.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking private transit</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Book at least a few days ahead of race weekend specifically — demand for private cars spikes across the
            city during the Grand Prix, on top of the same weekend&apos;s Día de Muertos crowds. Confirm your exact
            pickup point, vehicle type, and whether the quoted rate already reflects race-weekend demand before you
            book, since hourly rates can run meaningfully above the general baseline during the event itself.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Rooftop and nightlife access</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            For Area Bar or Polanco&apos;s bigger clubs on the Saturday of race weekend specifically, table or VIP
            bookings are genuinely worth arranging ahead rather than assuming walk-in entry — race weekend nights
            here draw real crowds beyond the usual weekend traffic. Hotel CondesaDF&apos;s rooftop is more accessible
            without a reservation, but arriving before sunset improves your odds of a table with the Chapultepec
            Castle view.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
