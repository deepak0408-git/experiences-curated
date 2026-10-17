import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns sourced from the Ticket Intelligence build's 18-seat
// inventory (circuit_seating_profile, 16 Oct 2026) and the 5 real standalone
// grandstand experiences + Chicane piece seeded that same session. Zone/
// corner detail cross-checked against the official Hungaroring circuit map
// (gpticketshop.hu, founder-supplied screenshots) and F1's 2025 corner-naming
// announcement (Piquet = Turn 1, Szisz = Turn 14, etc). Pricing: real
// planner_ticket_tier_cost rows, category-based tiers (GA only / standard
// grandstands / premium main-straight grandstands / hospitality — founder-
// directed structure, 16 Oct 2026), not price-ordinal like sibling events.
const TIER_META = [
  {
    name: "General Admission",
    shows: "Open hillside, Gates 3/4/5 — the outer loop spanning roughly Turn 8 (Buda) through Turn 13 (Senna)",
    seating: "Open hillside, no assigned seat",
    exposure: "Uncovered",
  },
  {
    name: "Chicane 1, 2 & 4",
    shows: "Turns 6-7, the Driving Centre chicane — three adjacent stands at different heights along the same complex",
    seating: "Fixed, numbered seat",
    exposure: "Uncovered",
  },
  {
    name: "Grid 1 & Grid 2",
    shows: "The starting grid itself, pre-race ceremony — Grid 2 adds a real view of Turn 14 (Szisz), Grid 1 doesn't",
    seating: "Fixed, numbered seat",
    exposure: "Uncovered",
  },
  {
    name: "Pit Exit 1",
    shows: "Cars rejoining from the pit lane, alongside Turn 1 (Piquet)'s braking zone",
    seating: "Fixed, numbered seat",
    exposure: "Uncovered",
  },
  {
    name: "T1",
    shows: "Turn 1 (Piquet) — the circuit's one reliable overtaking zone, site of Piquet's 1986 pass on Senna",
    seating: "Fixed, numbered seat",
    exposure: "Uncovered",
  },
  {
    name: "Hungaroring & Hungaroring Platinum",
    shows: "The main straight, start line, podium and pit lane — the only roofed seat at the circuit",
    seating: "Fixed, numbered seat",
    exposure: "Covered",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const hungaroringGrandstand = linkedExperiences.find((e) => e.slug.includes("hungaroring-grandstand-both-tiers-"));
  const t1 = linkedExperiences.find((e) => e.slug.includes("t1-grandstand-piquet-corner-"));
  const grid1 = linkedExperiences.find((e) => e.slug.includes("grid-1-grandstand-starting-grid-view-"));
  const grid2 = linkedExperiences.find((e) => e.slug.includes("grid-2-grandstand-final-corner-view-"));
  const pitExit1 = linkedExperiences.find((e) => e.slug.includes("pit-exit-1-grandstand-"));
  const chicane = linkedExperiences.find((e) => e.slug.includes("the-chicane-hungaroring-"));
  const ga = linkedExperiences.find((e) => e.slug.includes("general-admission-fan-zone-hungaroring-"));
  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("hungarian-gp-ticket-guide-"));

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Hungarian Grand Prix"
      status="teaser"
      h1="The calendar's cheapest General Admission, and the circuit's only roof"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every real stand and what it shows you is free above. The pack adds our direct verdict on which grandstand actually suits a first Hungaroring trip, the Sector/row-level seat picks inside each stand worth paying extra for, and which one to move on first before it sells out — the covered main grandstand has a track record of going first given it's the circuit's only weather-proof seat."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Hungaroring is the calendar&apos;s affordability outlier — a General Admission ticket here is a
        fraction of the same tier at Spa or Monza, and the natural bowl terrain genuinely gives GA real sightlines
        across multiple corners, not a grass bank with an obstructed view. Every grandstand was rebuilt and renamed
        ahead of the 2025 race — the names below are the current ones. We cover the real options fans actually ask
        about below, not every numbered sector at the circuit.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from the official reseller gpticketshop.hu or tickets.formula1.com. The covered main
          grandstand — Hungaroring and Hungaroring Platinum — has historically sold out first given it&apos;s the
          circuit&apos;s only weather-proof seat. Every F1 ticket ultimately traces back to the promoter, and
          buying direct means no markup and no risk of a fraudulent listing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in,
          P1 Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos; own
          official reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.gpticketshop.hu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Hungarian GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en-GB/motorsports/formula-1/hungarian-gp-2027-fri-sat-sun"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Hungarian GP →
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

      {tier1 || tier2 || tier3 || tier4 ? (
        <div className="mb-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">2027 ticket prices</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {[
              { t: tier1, title: "General Admission", unit: "3-day" },
              { t: tier2, title: "Standard grandstands", unit: "Chicane, Fan, Apex, Grand Prix, Pit Exit, Grid — 3-day" },
              { t: tier3, title: "Premium main-straight grandstands", unit: "T1, Hungaroring, Hungaroring Platinum — 3-day" },
              { t: tier4, title: "Hospitality", unit: "F1 Fan Lounge, Champions Club, Paddock Club — 3-day" },
            ]
              .filter((x) => x.t)
              .map((x) => (
                <div key={x.title} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{x.title}</p>
                  <p className="text-lg font-black text-[#AAFF00]">
                    {formatMoneyRange(Math.round(Number(x.t!.costLow)), Math.round(Number(x.t!.costHigh)))}
                  </p>
                  <p className="text-xs text-[#6A6A6A] mt-1">{x.unit}</p>
                </div>
              ))}
          </div>
          <p className="text-xs text-[#6A6A6A]">
            Figures above are real, sourced 2027 pricing, gpticketshop.hu&apos;s official 3-day rates.
          </p>
        </div>
      ) : null}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mt-4">
        <p className="text-sm font-bold text-white mb-1.5">Not sure which seat fits you?</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-2">
          Our Ticket Intelligence tool scores every real seat at the Hungaroring against what you actually want to
          watch — a 7-question quiz, a few minutes, a genuine recommendation.
        </p>
        <a
          href={`/ticket-intelligence/${eventSlug}`}
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Find your seat →
        </a>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which seat we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Hungaroring weekend on a grandstand budget, T1 is the strongest all-round pick —
            Turn 1, officially Piquet corner since 2025, is the one place on this circuit where overtakes reliably
            stick, and the stand carries real first-lap stakes most Hungaroring seats don&apos;t. If weather
            matters more than drama, the main Hungaroring grandstand is the honest splurge, the only roofed seat at
            the circuit. On a General Admission budget, the hillside genuinely competes here — book a spot near
            Turn 8-13 for real elevated sightlines most flatter circuits can&apos;t offer at this price.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {t1 && <SpokeExperienceCard eventSlug={eventSlug} experience={t1} isPro={isPro} />}
            {hungaroringGrandstand && <SpokeExperienceCard eventSlug={eventSlug} experience={hungaroringGrandstand} isPro={isPro} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {grid1 && <SpokeExperienceCard eventSlug={eventSlug} experience={grid1} isPro={isPro} />}
            {grid2 && <SpokeExperienceCard eventSlug={eventSlug} experience={grid2} isPro={isPro} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {pitExit1 && <SpokeExperienceCard eventSlug={eventSlug} experience={pitExit1} isPro={isPro} />}
            {chicane && <SpokeExperienceCard eventSlug={eventSlug} experience={chicane} isPro={isPro} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {ga && <SpokeExperienceCard eventSlug={eventSlug} experience={ga} isPro={isPro} />}
            {ticketGuide && <SpokeExperienceCard eventSlug={eventSlug} experience={ticketGuide} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club and Champions Club sit above all of these as a genuinely different product —
            hospitality, not just a seat. Both get the full breakdown, including real booking mechanics, in the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy early on gpticketshop.hu if a specific stand matters to you — the covered main grandstand in
            particular has a track record of selling out ahead of the rest of the circuit, since it&apos;s the
            only weather-proof option at an event that regularly sees a July storm.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
