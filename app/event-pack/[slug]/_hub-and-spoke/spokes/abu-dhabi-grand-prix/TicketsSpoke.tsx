import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns only — verdict lives in the gated section below.
// priceBand populated from real seeded planner_ticket_tier_cost rows.
const STANDS = [
  {
    slug: "abu-dhabi-hill-general-admission",
    name: "Abu Dhabi Hill (GA)",
    shows: "Open zones around the circuit — flexible, move between vantage points",
    seating: "General admission, unreserved",
    exposure: "No cover — open zones",
    tier: "tier1" as const,
  },
  {
    slug: "west-grandstand-yas-marina",
    name: "West Grandstand",
    shows: "Turns 6-7 — the circuit's main braking/overtaking zone",
    seating: "Reserved seat",
    exposure: "Fully covered",
    tier: "tier3" as const,
  },
  {
    slug: "main-grandstand-yas-marina",
    name: "Main Grandstand",
    shows: "Grid, pit lane, start & podium — the whole arc of the event",
    seating: "Reserved seat",
    exposure: "Fully covered",
    tier: "tier3" as const,
  },
  {
    slug: "f1-paddock-club-yas-marina",
    name: "F1 Paddock Club & Hero Seats",
    shows: "Pit-lane hospitality, garage access, pit-lane walks",
    seating: "Hospitality tier — table seating, not a fixed grandstand view",
    exposure: "Fully covered",
    tier: "tier4" as const,
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const tierByKey = new Map(tickets.map((t) => [t.tier, t]));
  const priceBandFor = (tierKey: (typeof STANDS)[number]["tier"]) => {
    const t = tierByKey.get(tierKey);
    return t ? `4-day: ${formatMoneyRange(Math.round(Number(t.costLow)), Math.round(Number(t.costHigh)))}` : "4-day: pricing unavailable";
  };

  const stands = STANDS.map((s) => ({ ...s, exp: linkedExperiences.find((e) => e.slug.includes(s.slug)), priceBand: priceBandFor(s.tier) }));
  const hillStand = linkedExperiences.find((e) => e.slug.includes("abu-dhabi-hill-general-admission"));
  const westGrandstand = linkedExperiences.find((e) => e.slug.includes("west-grandstand-yas-marina"));
  const mainGrandstand = linkedExperiences.find((e) => e.slug.includes("main-grandstand-yas-marina"));
  const paddockClub = linkedExperiences.find((e) => e.slug.includes("f1-paddock-club-yas-marina"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="teaser"
      h1="Four real tiers, from open general admission to Paddock Club"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The tiers, what they show, and real 4-day pricing are all free above. The pack adds our actual verdict — which grandstand we'd pick for a season-finale weekend and why — plus the real, experience-level detail for each option, not just a summary."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Yas Marina Circuit sells a genuine range, from a flexible general-admission ticket up through full pit-lane
        hospitality — this isn&apos;t a single grandstand-vs-grandstand choice. Every ticket covers the standard
        4-day (Thursday-Sunday) weekend, and every tier — GA included — comes bundled with access to the Yasalam
        after-race concerts.
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
            href="https://tickets.formula1.com/en/f1-3312-abu-dhabi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Abu Dhabi GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-abu-dhabi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Abu Dhabi GP →
          </a>
        </div>
      </div>

      <p className="hidden md:block text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <p className="md:hidden text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Options compared</p>
      <div className="hidden md:block overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Tier</th>
              <th className="w-2/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows</th>
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-1/5 text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
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

      <div className="relative w-full aspect-[2400/1325] rounded-sm border border-[#2A2A2A] overflow-hidden mb-8 bg-[#141414]">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/abu-dhabi-grand-prix-grandstand-map.jpg"
          alt="Yas Marina Circuit map showing Main, West, West Straight, North, North Straight, Marina, South grandstands, and the Abu Dhabi Hill general admission zone positioned around the track"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>

      <div className="flex flex-col gap-2 mb-8">
        {stands.map((s) => (
          <p key={s.slug} className="text-xs text-[#6A6A6A]">
            <span className="text-[#AAFF00]">{s.name}:</span> {s.priceBand}
          </p>
        ))}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">4-day pricing, confirmed</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Figures above are real 4-day pricing for this race, spanning the full grandstand range. Several
          mid-tier grandstands (Marina, North, South, North Straight) fall in the same price band as the tier2
          range shown here — see the Venue Map guide for exactly which grandstand sits where on the circuit.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Abu Dhabi GP, West Grandstand ({priceBandFor("tier3")}) is the sharpest pick — real,
            repeated racing at Turns 6-7, fully covered, and priced below Main Grandstand for a very similar quality
            of seat. If the start, podium, and ceremony matter more to you than the racing itself, Main Grandstand
            (same price band) is the right call instead — it&apos;s the one seat that covers the whole arc of the
            event in a single sightline. Abu Dhabi Hill ({priceBandFor("tier1")}) is a genuinely good budget option
            here specifically because every tier, GA included, comes with the same Yasalam concert access — you&apos;re
            not trading away the headline entertainment by going cheap on the seat. We wouldn&apos;t spend the jump
            from GA straight into a mid-tier grandstand just for a marginally better daytime view; the real value
            step is moving into a genuinely covered stand (West or Main), not incrementally better GA positioning.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {hillStand && <SpokeExperienceCard experience={hillStand} isPro={isPro} />}
            {westGrandstand && <SpokeExperienceCard experience={westGrandstand} isPro={isPro} />}
            {mainGrandstand && (
              <div className="sm:col-span-2">
                <SpokeExperienceCard experience={mainGrandstand} isPro={isPro} />
              </div>
            )}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club sits above all three of these as a genuinely different product — hospitality, not just a
            seat. It gets the full breakdown, including real booking timing and sell-out risk for the season
            finale, in the{" "}
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
                  { title: "Abu Dhabi Hill", summary: "The value seat — genuinely mobile, open zones, same concert access as every other tier.", detail: hillStand?.whyItsSpecial },
                  { title: "West Grandstand", summary: "The racing seat — Turns 6-7, real overtaking, fully covered.", detail: westGrandstand?.whyItsSpecial },
                  { title: "Main Grandstand", summary: "The ceremony seat — grid, pit stops, podium, all from one spot.", detail: mainGrandstand?.whyItsSpecial },
                  { title: "F1 Paddock Club", summary: "The hospitality seat — proximity to the sport itself, not just a better view.", detail: paddockClub?.whyItsSpecial },
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

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy only through Formula1.com&apos;s official ticket portal — this is the calendar&apos;s
            highest-demand weekend as the season finale, and resale/social-media listings carry real risk. Tickets
            are digital-only, delivered via the Abu Dhabi GP Tickets app closer to race weekend.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
