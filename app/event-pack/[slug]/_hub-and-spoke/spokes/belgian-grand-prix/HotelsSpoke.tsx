import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// Two real, seeded lodging experiences cover the inside-area vs. outside-
// area tradeoff: Van der Valk Hotel Spa — Place Royale (Spa town, 13km from
// the circuit, the city base most fans use) and Romantik Hotel Le Val
// d'Amblève (Stavelot, 5km, closest to circuit entrances). 12 Oct 2026.
// Budget/splurge alternatives (Malmedy/Liège) named 13 Oct 2026 — MY Hotel
// Malmedy and Van der Valk Sélys Liège Hotel & Spa, both verified
// real/trading via Google Places lookup, named as "or similar" with real
// off-peak baseline pricing (race-weekend rates run well above these).
// Never hardcode the Google rating number in body copy — it drifts; link to
// the live Maps page instead, same pattern as the Camping experience body.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const vanDerValk = linkedExperiences.find((e) => e.slug.includes("van-der-valk-hotel-spa-"));
  const romantikHotel = linkedExperiences.find((e) => e.slug.includes("romantik-hotel-le-val-dambleve-"));
  const camping = linkedExperiences.find((e) => e.slug.includes("camping-at-the-circuit-belgian-gp-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Belgian Grand Prix"
      status="teaser"
      h1="Spa town for restaurants and hotel stock, or Stavelot for a shorter walk to the gates"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Both real options are free above. The pack adds our direct verdict on which town actually suits your race weekend, plus three things most guides skip entirely: a named budget pick in Malmedy and a named splurge pick in Liège (both real, with live ratings and off-peak pricing), the full on-site camping breakdown — all four zones, the separate camping-vs-circuit ticket mechanic, and which premium pre-erected tent operators are worth it — and the exact booking window before Stavelot's small room count sells through."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Where to stay for the Belgian Grand Prix comes down to a genuine tradeoff between two small Ardennes
        towns: Spa itself, 13km out, with the area&apos;s best hotel and restaurant range; and Stavelot, 5km out,
        smaller and quieter, closest to the circuit entrances. Most first-time visitors choose Spa for the wider
        range of places to eat and stay; regulars who prioritise a short commute often prefer Stavelot.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Spa — the wider base, 13km from the circuit</p>
      {vanDerValk && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={vanDerValk} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Stavelot — closest to the gates, 5km from the circuit</p>
      {romantikHotel && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={romantikHotel} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Race weekend is the Ardennes&apos; highest-demand hotel period of the year — both towns&apos; limited
          stock comes under real pressure well ahead of the date, and Stavelot in particular has far fewer rooms
          to begin with than Spa.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Spa is the right default for most first-time visitors — a genuinely wider range of restaurants and
            hotel stock, and the 13km to the circuit is a short, straightforward drive or shuttle ride, not a real
            burden. Stavelot is the honest exception, not a downgrade: if a short walk or quick drive to the gates
            matters more than evening options, it&apos;s the sharper pick, and Romantik Hotel Le Val d&apos;Amblève
            specifically puts you close to both the circuit and Stavelot&apos;s own abbey and circuit museum. Full
            transit detail for both lives in the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting to the Circuit guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Budget and splurge alternatives</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            Malmedy, 6km from the circuit, is the practical budget alternative to Spa — a mid-size town with a
            genuinely wider hotel price range than Stavelot&apos;s small stock, at a similar commute distance. MY
            Hotel Malmedy (or similar) is the name to know here: a 4-star property with an indoor pool and spa
            access included, from roughly €90-165/night off-peak — race weekend runs significantly above that
            baseline, so book early.{" "}
            <a
              href="https://maps.google.com/?cid=16994290342177523354"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              See live rating and reviews on Google Maps
            </a>
            .
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Liège, roughly 50km out, is the splurge option: a real city with the Ardennes region&apos;s best hotel
            selection and a direct shuttle connection, worth considering if you want city amenities and don&apos;t
            mind the longer commute on race days. Van der Valk Sélys Liège Hotel &amp; Spa (or similar) is the pick
            — a 4.5-star converted-castle property with a full spa, rooftop terrace, and restaurant, from roughly
            €90-130/night off-peak before race-weekend premiums.{" "}
            <a
              href="https://maps.google.com/?cid=11251836528318959483"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              See live rating and reviews on Google Maps
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">On-site camping — the fourth option</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Circuit de Spa-Francorchamps is one of the few F1 venues that lets you sleep inside the fence. The
            on-site campsite runs across four zones — Green (closest, 5-10 min walk from the Combes entrance,
            where the Dutch fan community gathers), Yellow (quieter, family-aimed, near La Source), Young Village
            (17-27 only, DJ stage, near the Stavelot gate), and Masta (shuttle-served overflow). A camping ticket
            and a circuit ticket are two separate purchases — book both together at spagrandprix.com the day
            grandstand tickets release, since Green Zone sells out first. Premium pre-erected options (GPtents,
            IntentsGP) solve the no-tent-to-transport problem while keeping the inside-the-fence proximity.
          </p>
          {camping && (
            <div className="mb-8">
              <SpokeExperienceCard eventSlug={eventSlug} experience={camping} isPro={isPro} />
            </div>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking windows &amp; timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book Spa or Stavelot at least 2-3 months ahead of race weekend — this is the Ardennes&apos; busiest
            weekend of the year, and Stavelot&apos;s small room count in particular is the first to sell through.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
