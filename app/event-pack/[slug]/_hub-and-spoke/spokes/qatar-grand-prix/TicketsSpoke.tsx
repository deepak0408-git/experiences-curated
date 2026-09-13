import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns sourced from the seeded experience content (Ticket
// Guide, Main Grandstand, North Grandstand, Lusail Hill GA, Lusail Hill
// Lounge, Paddock Club & Champions Club experiences), 13 Sep 2026. Prices
// seeded to planner_ticket_tier_cost from the founder's live screenshot of
// tickets.formula1.com plus EUR->USD conversion for hospitality — see
// project memory. GA (tier1) sold out on the official platform by late Aug
// 2026 — its price is founder-recalled, not confirmed live, flagged
// explicitly per skill §2a-3.
const TIER_META = [
  {
    tierKey: "tier1",
    name: "General Admission — Lusail Hill",
    shows: "Elevated grass banking above the Turn 1 gravel trap — a sightline running almost the length of the front straight",
    seating: "No reserved seat — grass banking, first-come",
    exposure: "No cover",
  },
  {
    tierKey: "tier2",
    name: "North Grandstand",
    shows: "Start line and Turn 1 braking zone, opposite the pit lane exit",
    seating: "Not assigned — eight sections, claim on arrival",
    exposure: "Uncovered",
  },
  {
    tierKey: "tier3",
    name: "Lusail Hill Lounge",
    shows: "Turn 1 and Turn 2, plus a long look back down the main straight — the circuit's best natural viewpoint, with real seating added",
    seating: "Tiered open-air terrace — day lounges, tables and chairs, cabana seating",
    exposure: "Partial — shade structures, not fully enclosed",
  },
  {
    tierKey: "tier4",
    name: "Champions Club / Paddock Club",
    shows: "Champions Club: Turn 1 exterior, Premiere Hospitality building. Paddock Club: directly above the team garages, down pit lane to the start-finish line",
    seating: "Hospitality tier — suite/table seating",
    exposure: "Fully covered",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");

  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("qatar-gp-ticket-guide-"));
  const mainGrandstand = linkedExperiences.find((e) => e.slug.includes("qatar-gp-main-grandstand-"));
  const northGrandstand = linkedExperiences.find((e) => e.slug.includes("qatar-gp-north-grandstand-"));
  const gaLusailHill = linkedExperiences.find((e) => e.slug.includes("qatar-gp-lusail-hill-general-admission-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="teaser"
      h1="General Admission is gone — Main and North Grandstand are now the entry-level seats"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The tiers and what each one actually shows you are free above. The pack adds the full Ticket Guide with the real Main-vs-North comparison for a first Lusail weekend, the zone-and-row detail that changes what Main Grandstand actually shows you, and which stand still has genuine availability now that GA is gone."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Lusail runs at night, and where you sit decides how much of that you actually get. General Admission (Lusail
        Hill) reportedly sold out on the official platform by late Aug 2026 — the cheapest ticket still available is
        now North Grandstand, a real shift from Qatar&apos;s reputation as one of the calendar&apos;s more affordable
        stops.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from the official source first, and be ready to move — GA&apos;s sellout by late Aug 2026 is
          real evidence this race no longer has a guaranteed late-buyer path. Every F1 ticket ultimately traces back
          to the promoter, and buying direct means no markup and no risk of a fraudulent listing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out for the tier you want, or you want a package with hospitality, hotel, or
          shuttle bundled in, P1 Travel is a genuine authorized F1 ticket partner — named directly on multiple
          circuits&apos; own official reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in
          business since 2007. Motorsport Tickets, sometimes seen advertised for this race, ceased trading and
          entered liquidation in 2026 — avoid it regardless of what a listing claims.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://tickets.formula1.com/en/f1-56257-qatar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Qatar GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en/series/formula-1-2026?organizers=grand-prix-qatar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Qatar GP →
          </a>
        </div>
      </div>

      <p className="hidden md:block text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <p className="md:hidden text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Options compared</p>
      <div className="hidden md:block overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/4 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Tier</th>
              <th className="w-2/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows</th>
              <th className="w-[17.5%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-[17.5%] text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
            </tr>
          </thead>
          <tbody>
            {TIER_META.map((t) => (
              <tr key={t.name} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{t.name}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.shows}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.seating}</td>
                <td className="py-3 text-[#A3A3A3] align-top">{t.exposure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-4">
        {TIER_META.map((t) => (
          <div key={t.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-2">{t.name}</p>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows: </span>
                {t.shows}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating: </span>
                {t.seating}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover: </span>
                {t.exposure}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">On pricing</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          North Grandstand, Lusail Hill Lounge, and Champions Club/Paddock Club prices above are confirmed 2026
          figures. General Admission&apos;s $219–265 range is the founder&apos;s recalled figure from before it sold
          out — the official site no longer lists it for sale, so treat this one number as an estimate, not a
          current price.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {ticketGuide && (
            <div className="mb-8">
              <SpokeExperienceCard experience={ticketGuide} isPro={isPro} />
            </div>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which grandstand we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Lusail weekend now that GA is gone, North Grandstand
            ({tier2 && `$${Math.round(Number(tier2.costLow))}`}) is the sharper value pick — the start line and Turn 1
            braking zone, at a real discount to Main Grandstand across the straight, if you&apos;re willing to arrive
            early and claim your own spot in an unassigned stand. Main Grandstand&apos;s real advantage is the
            assigned zone-and-row seating itself: Zone A puts you closest to the finish line and podium, while Zones D
            and E angle furthest toward Turn 1 for braking-zone action Zone A can&apos;t see at all — worth the
            premium if the scramble at North Grandstand isn&apos;t for you.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {northGrandstand && <SpokeExperienceCard experience={northGrandstand} isPro={isPro} />}
            {mainGrandstand && <SpokeExperienceCard experience={mainGrandstand} isPro={isPro} />}
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What GA used to get you</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            General Admission on Lusail Hill is worth understanding even sold out — it&apos;s the tier every
            remaining option is now measured against. The elevated grass banking above the Turn 1 gravel trap gave a
            sightline running almost the length of the front straight, by some accounts better than several of the
            circuit&apos;s actual grandstands. If a resale or late-release GA ticket surfaces before race week, it&apos;s
            still a genuinely strong seat, not a consolation prize.
          </p>

          {gaLusailHill && (
            <div className="mb-8">
              <SpokeExperienceCard experience={gaLusailHill} isPro={isPro} />
            </div>
          )}

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Lusail Hill Lounge ({tier3 && `$${Math.round(Number(tier3.costLow))}–${Math.round(Number(tier3.costHigh))}`}) and Champions Club/Paddock Club
            ({tier4 && `$${Math.round(Number(tier4.costLow))}–${Math.round(Number(tier4.costHigh))}`}) sit above both grandstands as a genuinely different
            product — hospitality, not just a seat. Both get the full breakdown, including real booking mechanics, in
            the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy on the official promoter&apos;s site the moment a specific stand matters to you — GA&apos;s sellout
            already proved this race doesn&apos;t have unlimited late-buyer inventory, and there&apos;s no realistic
            path back to a sold-out tier at face value once it&apos;s gone.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
