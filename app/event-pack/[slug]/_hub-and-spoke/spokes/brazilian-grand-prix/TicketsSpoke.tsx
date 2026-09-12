import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns sourced from the seeded experience content (Ticket
// Guide, Grandstand A, Grandstand M, Paddock Club & Champions Club
// experiences — see brazilian-gp-ticket-guide-mtx6r39p and siblings), 12 Sep
// 2026. Interlagos sells no General Admission tier — every ticket is a
// reserved grandstand letter, unlike most other F1 circuits. Real prices
// seeded to planner_ticket_tier_cost 12 Sep 2026 (founder-supplied and
// founder-verified directly, official source validated by Claude at
// tickets.formula1.com/en/f1-3325-brazil) — see project memory.
const TIER_META = [
  {
    tierKey: "tier1",
    name: "Grandstand A / Grandstand G",
    shows: "Back straight or the banked entry into the start-finish straight — bowl-shaped infield sightline",
    seating: "Uncovered, bleacher-style",
    exposure: "No cover — Grandstand A is the loudest, most social stand at the circuit",
  },
  {
    tierKey: "tier2",
    name: "Grandstand M / Grandstand R",
    shows: "M at Turn 1 (the downhill first-lap fight); R near Turn 3 and the DRS zone",
    seating: "Covered, numbered reserved seating",
    exposure: "Covered",
  },
  {
    tierKey: "tier3",
    name: "Heineken Village",
    shows: "Trackside fan-zone hospitality — entertainment and activations alongside real racing views",
    seating: "Semi-hospitality — standing and lounge areas, not a fixed grandstand seat",
    exposure: "Mostly covered",
  },
  {
    tierKey: "tier4",
    name: "Orange Tree Club / F1 Paddock Experience",
    shows: "Hospitality above or alongside the team garages — pit lane and start-finish views",
    seating: "Hospitality tier — table seating",
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

  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-ticket-guide-"));
  const grandstandA = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-grandstand-a-"));
  const grandstandM = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-grandstand-m-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Brazilian Grand Prix"
      status="teaser"
      h1="No General Admission — every seat here is a fixed grandstand letter"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The tiers and what each one actually shows you are free above. The pack adds the full Ticket Guide with the real grandstand-by-grandstand comparison (including G, R, H, D, and B — not just the four tiers shown here), our direct verdict on M vs. A for a first Interlagos weekend, and which stand to move on first before it sells out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Interlagos doesn&apos;t sell general admission — every ticket is grandstand-specific, and that letter is
        where you sit for all three days. This is different from circuits like Silverstone or Spa, where a GA
        wristband lets you wander the grounds; here the decision matters more than it does almost anywhere else on
        the calendar, because there&apos;s no fallback once you&apos;ve bought.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from the official source first, and be ready early — several stands, including Turn 1&apos;s
          Grandstand M, have sold out months ahead of the 2026 race. Every F1 ticket ultimately traces back to the
          promoter, and buying direct means no markup and no risk of a fraudulent listing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1
          Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos; own official
          reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007. Motorsport
          Tickets, sometimes seen advertised for this race, ceased trading and entered liquidation in 2026 — avoid
          it regardless of what a listing claims.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://tickets.formula1.com/en/f1-3325-brazil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Brazilian GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en/series/formula-1-2026?organizers=grand-prix-brasil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Brazilian GP →
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
          Prices above are confirmed 2026 figures from the official ticketing site. Confirm current availability
          directly before buying — several stands, including Grandstand M and Grandstand A, have historically sold
          out well ahead of race weekend.
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
            For a genuine first Interlagos weekend, Grandstand M at Turn 1 ({tier2 && `$${Math.round(Number(tier2.costLow))}–${Math.round(Number(tier2.costHigh))}`}) is the sharpest pick if racing action and
            sightlines matter most — covered, numbered, reserved seating, with a clean view of the downhill
            first-lap fight into the circuit&apos;s best overtaking spot. If atmosphere is the actual reason
            you&apos;re making this trip, Grandstand A ({tier1 && `$${Math.round(Number(tier1.costLow))}–${Math.round(Number(tier1.costHigh))}`}) is the honest answer instead: uncovered and without a
            backrest, but by wide agreement the loudest, most social grandstand at the venue.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {grandstandM && <SpokeExperienceCard experience={grandstandM} isPro={isPro} />}
            {grandstandA && <SpokeExperienceCard experience={grandstandA} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Heineken Village ({tier3 && `$${Math.round(Number(tier3.costLow))}–${Math.round(Number(tier3.costHigh))}`}) and the Orange Tree Club / F1 Paddock Experience ({tier4 && `$${Math.round(Number(tier4.costLow))}–${Math.round(Number(tier4.costHigh))}`}) sit above all of these as a genuinely different product — hospitality,
            not just a seat. Both get the full breakdown, including real booking mechanics, in the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy the moment tickets open on the official promoter&apos;s site if a specific stand matters to you —
            Grandstand M in particular has a track record of selling out early precisely because Turn 1 is this well
            known. There&apos;s no realistic late-buyer path at face value once a stand sells through.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
