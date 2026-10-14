import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Real content sourced from the seeded Paddock Club — Belgian Grand Prix
// experience, 12 Oct 2026. Whole-trip luxury coverage (hotel referenced
// from HotelsSpoke rather than duplicated, per the one-experience-one-spoke
// rule).
// Rewritten 13 Oct 2026 — circuit_seating_profile has 6 real, sourced
// hospitality rows for this event (seat_type='hospitality'), not just
// Paddock Club: Ardennes Club, Champions Club Eau Rouge, Champions Club
// Business Tower, VIP Loges Raidillon, VIP Mezzanines. Only Paddock Club
// has a full seeded experience (body/why-it's-special/howToBook) — the
// other 5 get a comparison table with real inclusions from a light
// research pass (F1 Experiences' own package pages, spagrandprix.com),
// not full narrative sections, since no seed script has written copy for
// them. No sold-out/bookable status column — that's transient and goes
// stale the moment it's written; sourcing footnote stays general instead.
const HOSPITALITY_TIERS = [
  {
    name: "Paddock Club",
    price: "US$5,500 (3-day)",
    location: "Pit lane buildings — terrace directly over pit lane, distant views to Eau Rouge/Raidillon",
    inclusions: "All-inclusive bars, pit lane walk, paddock tour, driver/team talks, open-top circuit bus tour",
  },
  {
    name: "Champions Club — Business Tower",
    price: "US$5,299 (3-day)",
    location: "Before Turn 2, elevated view over Eau Rouge/Raidillon",
    inclusions: "Canapés and curated lunch, open bar, F1 insider appearances, trophy photo, paddock tour",
  },
  {
    name: "Champions Club — Eau Rouge",
    price: "US$4,599 (3-day)",
    location: "Eau Rouge, paired with Gold 5 grandstand seating",
    inclusions: "Guided paddock tour, F1 insider appearances, championship trophy photo",
  },
  {
    name: "Ardennes Club",
    price: "US$3,999 (4-day, Thu-Sun)",
    location: "Outside the downhill straight between La Source and Eau Rouge, unreserved Gold 2 grandstand access",
    inclusions: "All-day food and drink, pit lane walk, guided track tour by flatbed truck, trophy photo",
  },
  {
    name: "VIP — Loges Raidillon",
    price: "€2,495 (weekend)",
    location: "Private suite in the Gold 3 grandstand, Eau Rouge/Raidillon view",
    inclusions: "Covered private box, VIP parking/shuttle, breakfast + gastronomic meal, open bar, Support Paddock access",
  },
  {
    name: "VIP — Mezzanines",
    price: "€1,995 (weekend)",
    location: "Foot of Raidillon, private terrace over the Endurance pit lane",
    inclusions: "Private mezzanine (40-60 people or by unit), Support Paddock access, breakfast + gastronomic meal, open bar",
  },
];
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const paddockClub = linkedExperiences.find((e) => e.slug.includes("paddock-club-belgian-gp-"));

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
      h1="Six real hospitality tiers at Spa, from Mezzanines to Paddock Club"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="All six real hospitality tiers are compared free above, with real pricing and inclusions. The pack adds F1's own Paddock Club product in full, plus our direct verdict on whether the hospitality premium is worth it for a first Spa weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Belgian Grand Prix weekend stacks a genuine hospitality decision on top of an already large race
        weekend — Spa&apos;s own scale means a premium product that includes transport, food, and proximity to the
        action matters more here than at a compact stadium circuit. Six real hospitality products sell around this
        circuit, at six different price points and locations — not just one.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Every real hospitality tier, compared</p>
      <div className="hidden md:block overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Tier</th>
              <th className="w-[15%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Price</th>
              <th className="w-[35%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Location</th>
              <th className="w-[30%] text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Inclusions</th>
            </tr>
          </thead>
          <tbody>
            {HOSPITALITY_TIERS.map((t) => (
              <tr key={t.name} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{t.name}</td>
                <td className="py-3 pr-4 text-[#AAFF00] font-bold align-top">{t.price}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.location}</td>
                <td className="py-3 text-[#A3A3A3] align-top">{t.inclusions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-3 mb-4">
        {HOSPITALITY_TIERS.map((t) => (
          <div key={t.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-2">{t.name}</p>
            <p className="text-sm text-[#AAFF00] font-bold mb-2">{t.price}</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-1">
              <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Location: </span>
              {t.location}
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Includes: </span>
              {t.inclusions}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">
        Pricing and inclusions sourced directly from F1 Experiences and spagrandprix.com — confirm current
        availability before booking, since premium hospitality allocations shift fastest of any ticket type at
        Spa. Only Paddock Club has a full written guide in this pack, below.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paddock Club — the only one with a full guide here</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Paddock Club sits above the team garages, with real proximity to the sport itself — an open bar, food,
        and the kind of access a grandstand ticket simply doesn&apos;t offer. Sold directly through F1
        Experiences, not the official circuit ticketing site. Full breakdown below.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gold 1 — the premium seat that isn't hospitality</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Worth naming here even though it&apos;s a grandstand ticket, not a hospitality product: Gold 1, the Pit
        Grandstand, covers pit lane activity and the start/finish straight with full cover — a genuine premium
        seat at a fraction of Paddock Club&apos;s price. Full breakdown in the{" "}
        <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Ticket Guide
        </a>
        .
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A genuine luxury stay</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa and Stavelot both have real hotel options, though neither town runs a dedicated five-star property the
        way a major city host would — the full breakdown of both areas&apos; strongest picks lives in the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>
        .
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Luxury transit — real, but modest here</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa-Francorchamps is a rural circuit, not a city venue, and the honest picture reflects that: Liège Airport
        is the most practical arrival point for a private jet, with Brussels as the alternative if you need more
        hotel depth or airline connectivity. Circuit access has no kiss-and-ride zone and heavy traffic on both
        race days, so a pre-arranged chauffeur is genuinely worth it here — rental cars and ride-hailing both
        struggle with the actual approach roads. No helicopter transfer service to the circuit itself is confirmed
        to exist; private aviation handlers route guests through one of the two airports above and into a timed
        ground transfer instead. There is no verified official after-party or dedicated night event tied to this
        race — Spa&apos;s two Fan Zones (Raidillon and the newer Combes zone) run live music and DJ sets through
        each evening of race weekend, but that is a free, on-circuit experience, not a separate luxury product.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {paddockClub && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paddock Club, in full</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                A grandstand sells you one great view of the racing. Paddock Club sells you the whole day around
                it — food, bars, and real proximity to the sport itself, at the circuit most drivers themselves
                call their favourite on the calendar.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={paddockClub} isPro={isPro} />
              </div>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Paddock Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Treat the on-sale window as the real deadline, not a date to check back closer to race weekend — the
            top hospitality tier at any F1 race has a track record of selling out well ahead of other tiers, sold
            directly through{" "}
            <a
              href="https://f1experiences.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              f1experiences.com
            </a>
            .
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
