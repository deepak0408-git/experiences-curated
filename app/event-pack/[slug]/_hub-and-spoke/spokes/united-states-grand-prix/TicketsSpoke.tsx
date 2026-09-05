import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns only — verdict lives in the gated section below.
// Pricing sourced from planner_ticket_tier_cost (see
// scripts/seed-us-gp-ticket-tiers.mjs) — real 3-day (Fri-Sun) prices from
// tickets.formula1.com, 5 Sep 2026, EUR->USD at 1 EUR = 1.1622 USD.
const STANDS = [
  {
    slug: "us-gp-general-admission",
    name: "General Admission",
    shows: "Flexible — move between vantage points around the whole circuit",
    seating: "General admission, unreserved",
    exposure: "No cover — open zones",
    tier: "tier1",
  },
  {
    slug: "us-gp-turn-1-big-red",
    name: "Turn 1 \"Big Red\"",
    shows: "The 11% climb into COTA's signature blind hairpin, plus the start-finish straight",
    seating: "Reserved seat",
    exposure: "No cover — fully open",
    tier: "tier3",
  },
  {
    slug: "us-gp-turn-15-stadium",
    name: "Turn 15 — Stadium Section",
    shows: "Five corners in one sightline — Turns 12-15, plus the back straight",
    seating: "Reserved seat",
    exposure: "No cover — fully open",
    tier: "tier2",
  },
  {
    slug: "us-gp-main-grandstand",
    name: "Main Grandstand",
    shows: "Grid, pit lane, start & podium — the whole arc of the event",
    seating: "Reserved seat (Lower/Mezzanine/Club tiers)",
    exposure: "Partially covered — Club Level only",
    tier: "tier3",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const tierCost = (tierId: string) => tickets.find((t) => t.tier === tierId);
  const stands = STANDS.map((s) => {
    const cost = tierCost(s.tier);
    return {
      ...s,
      exp: linkedExperiences.find((e) => e.slug.includes(s.slug)),
      costNote: cost
        ? `${formatMoneyRange(Math.round(Number(cost.costLow)), Math.round(Number(cost.costHigh)))} for the 3-day pass`
        : "Pricing not yet published",
    };
  });
  const tier1 = tierCost("tier1");
  const tier2 = tierCost("tier2");
  const tier3 = tierCost("tier3");
  const tier4 = tierCost("tier4");
  const generalAdmission = linkedExperiences.find((e) => e.slug.includes("us-gp-general-admission"));
  const turn1 = linkedExperiences.find((e) => e.slug.includes("us-gp-turn-1-big-red"));
  const turn15 = linkedExperiences.find((e) => e.slug.includes("us-gp-turn-15-stadium"));
  const mainGrandstand = linkedExperiences.find((e) => e.slug.includes("us-gp-main-grandstand"));
  const paddockClub = linkedExperiences.find((e) => e.slug.includes("us-gp-paddock-club"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="United States Grand Prix"
      status="teaser"
      h1="Four real tiers, from General Admission to trackside hospitality"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="The tiers, what they actually show, and every confirmed price are all free above. The pack adds a full, detailed breakdown of every ticket tier plus our real verdict — which grandstand we'd pick for a first Austin GP and why — and the tactical detail for Paddock Club's early-access booking window, not just a summary of the public page."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Circuit of the Americas sells a genuine range, from a flexible general-admission ticket up through full
        pit-lane hospitality — this isn&apos;t a single grandstand-vs-grandstand choice. Every ticket covers the
        standard 3-day (Friday-Sunday) weekend, and every tier — GA included — comes bundled with access to the
        Germania Insurance Super Stage concerts on the same ticket.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from the official source first. Every F1 ticket ultimately traces back to the promoter, and
          buying direct means no markup and no risk of a fraudulent listing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in,
          P1 Travel is a genuine authorized F1 ticket partner — named directly on Yas Marina Circuit&apos;s own
          official reseller list and confirmed as Singapore GP&apos;s own Authorised Partner, not a random resale
          site. It&apos;s rated 4.7 from over 10,000 reviews on Trustpilot, and has been in business since 2007.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Steer clear of anything else claiming to be &quot;official&quot; without that kind of direct
          confirmation — ticket fraud is real at every high-demand Grand Prix, and a listing that looks legitimate
          isn&apos;t the same as one a circuit has actually named.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://tickets.formula1.com/en/f1-3320-united-states"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official US GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-usa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — US GP →
          </a>
        </div>
      </div>

      <p className="hidden md:block text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <p className="md:hidden text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Options compared</p>
      <div className="hidden md:block overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-[20%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Tier</th>
              <th className="w-[30%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows</th>
              <th className="w-[30%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-[20%] text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
            </tr>
          </thead>
          <tbody>
            {STANDS.map((s) => (
              <tr key={s.slug} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{s.name}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{s.shows}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{s.seating}</td>
                <td className="py-3 text-[#A3A3A3] align-top">{s.exposure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-8">
        {STANDS.map((s) => (
          <div key={s.slug} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-2">{s.name}</p>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows: </span>
                {s.shows}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating: </span>
                {s.seating}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover: </span>
                {s.exposure}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 mb-8">
        {stands.map((s) => (
          <p key={s.slug} className="text-xs text-[#6A6A6A]">
            <span className="text-[#AAFF00]">{s.name}:</span> {s.costNote}
          </p>
        ))}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Real, published pricing</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every price above is the real, published 2026 3-day (Friday-Sunday) rate from tickets.formula1.com — not
          an estimate. A separate, cheaper Sunday race-day-only ticket also exists for each stand, starting from
          roughly US$310 for General Admission, if you only want to attend race day itself.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Austin GP, Turn 15&apos;s stadium section
            ({turn15 && tier2 && formatMoneyRange(Math.round(Number(tier2.costLow)), Math.round(Number(tier2.costHigh)))}{" "}for the 3-day pass) is arguably the best value seat at the track — five corners in one sightline. The Main
            Grandstand ({tier3 && formatMoneyRange(Math.round(Number(tier3.costLow)), Math.round(Number(tier3.costHigh)))}{" "}for the 3-day pass) is the sharpest all-round pick if budget allows — it&apos;s the only
            seat that covers the grid, the pit stops, and the podium ceremony in a single sightline, and Club Level
            specifically is the one fully covered tier at the entire circuit. Turn 1 &quot;Big Red&quot;, at the same
            price tier, is the more dramatic choice instead — an 11% climb into a blind hairpin, genuinely unlike
            anything else at COTA — but you&apos;ll trade the podium view for it. General Admission
            ({tier1 && formatMoneyRange(Math.round(Number(tier1.costLow)), Math.round(Number(tier1.costHigh)))}{" "}for the 3-day pass) is a real, legitimate way
            to do your first COTA weekend on a budget — every tier here gets the same concert access, so going
            cheap on the seat costs you nothing on the evening entertainment.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {mainGrandstand && <SpokeExperienceCard experience={mainGrandstand} isPro={isPro} />}
            {turn1 && <SpokeExperienceCard experience={turn1} isPro={isPro} />}
            {turn15 && <SpokeExperienceCard experience={turn15} isPro={isPro} />}
            {generalAdmission && <SpokeExperienceCard experience={generalAdmission} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club and Champions Club sit above all four of these as a genuinely different product —
            hospitality, not just a seat.{" "}
            {paddockClub?.practicalInfo?.bookingMethod && paddockClub.practicalInfo.bookingMethod}
            {" "}Both get the full breakdown, including real booking contacts and
            sell-out timing, in the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What each is actually like</p>
          <div className="overflow-x-auto rounded-sm border border-[#2A2A2A] mb-6">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {[
                  { title: "Main Grandstand", summary: "The ceremony seat — grid, pit stops, podium, but only three corners of the lap are visible.", detail: mainGrandstand?.whyItsSpecial },
                  { title: "Turn 1 \"Big Red\"", summary: "The drama seat — an 11% climb to a blind hairpin, named for the man who built the track.", detail: turn1?.whyItsSpecial },
                  { title: "Turn 15 — Stadium Section", summary: "The value seat — five corners in one sightline, at the mid-tier grandstand price.", detail: turn15?.whyItsSpecial },
                  { title: "General Admission", summary: "The flexible seat — move around the whole circuit, same concert access as every reserved tier.", detail: generalAdmission?.whyItsSpecial },
                ]
                  .filter((row) => row.detail)
                  .map((row, i) => (
                    <tr key={row.title} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                      <td className="px-4 py-3 align-top w-1/4">
                        <p className="text-sm font-bold text-white">{row.title}</p>
                        <p className="text-xs text-[#6A6A6A] mt-1">{row.summary}</p>
                      </td>
                      <td className="px-4 py-3 text-[#A3A3A3] leading-6 align-top">{row.detail}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: tickets.formula1.com, circuitoftheamericas.com.
      </p>
    </SpokeShell>
  );
}
