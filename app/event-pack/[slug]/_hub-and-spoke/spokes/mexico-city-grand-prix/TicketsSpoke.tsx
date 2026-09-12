import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns only — verdict lives in the gated section below.
// Pricing confirmed 6 Sep 2026 directly from tickets.formula1.com/en/f1-4861-mexico
// (screenshots captured by founder — the site 403s a direct fetch), converted
// EUR→USD at 1.1622 (api.frankfurter.dev), and seeded to planner_ticket_tier_cost
// (see the "On pricing" note below — this spoke still shows the same figures
// inline for readability, not a live DB read). GA figure (Grandstand 2A) has
// no official listing on tickets.formula1.com itself — sourced from
// GPDestinations.com (published 20 Mar 2026), 3,900 MXN converted at today's
// real rate (0.05917, api.frankfurter.dev, 6 Sep 2026) = ~US$231, not the
// $191/$215 that source itself quotes. Every grandstand + hospitality product
// is sold as a single 3-day (Friday–Sunday) pass — no single-day option
// exists for this event. There is no separate "Champions Club" tier for
// Mexico City — only Paddock Club and House 44 at F1 Paddock Club™.
const TIERS = [
  {
    name: "General Admission (Grada 2A)",
    shows: "Open zones around the circuit — flexible, no assigned seat",
    seating: "General admission, unreserved, standing/lawn",
    exposure: "No cover — open zones",
    priceBand: "3-day: ~US$231",
  },
  {
    name: "Grandstand (Grandstands 15, 14, 5A)",
    shows: "Lower-tier reserved grandstands around the circuit",
    seating: "Reserved seat",
    exposure: "Mostly uncovered — check individual stand",
    priceBand: "3-day: US$785–1,270",
  },
  {
    name: "Main Grandstand & Premium Grandstands (10, 11)",
    shows: "The main straight and premium reserved sections — the best sightlines on the circuit",
    seating: "Reserved seat",
    exposure: "Main Grandstand partially covered; 10 and 11 mostly uncovered",
    priceBand: "3-day: US$1,640–2,166",
  },
  {
    name: "Paddock Club & House 44 at F1 Paddock Club™",
    shows: "Pit-lane hospitality, garage proximity, pit-lane walks",
    seating: "Hospitality tier — table seating, not a fixed grandstand view",
    exposure: "Fully covered",
    priceBand: "3-day: Paddock Club from US$8,502 · House 44 from US$16,338",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const foroSol = linkedExperiences.find((e) => e.slug.includes("foro-sol-mexico-city-gp-"));
  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("mexico-city-gp-ticket-guide-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Mexico City Grand Prix"
      status="teaser"
      h1="Four real tiers, and a race that sells out in a single day"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The tiers, what they show, and real recent-season pricing are all free above. The pack adds the full Ticket Guide with the complete grandstand-by-grandstand comparison, our direct verdict on Main Grandstand vs. Foro Sol for a first Mexico City GP, and the exact buying window before this notoriously fast-selling race locks you out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Autódromo Hermanos Rodríguez sells a genuine range, from flexible general admission up through full
        pit-lane hospitality. Every ticket covers the standard 3-day (Friday-Sunday) weekend. Mexico City is also
        one of the hardest tickets on the F1 calendar to get — recent editions have sold out within a single day of
        going on sale, so the real decision here is less &quot;which tier&quot; and more &quot;be ready the moment
        tickets open.&quot;
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from the official source first, and be ready the moment sales open — this race has sold out
          within a single day in recent seasons. Every F1 ticket ultimately traces back to the promoter, and buying
          direct means no markup and no risk of a fraudulent listing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1
          Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos; own official
          reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007. Motorsport
          Tickets, sometimes seen advertised for this race, ceased trading and entered liquidation in 2026 — avoid it
          regardless of what a listing claims.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://tickets.formula1.com/en/f1-4861-mexico"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Mexico City GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en/organizer/grand-prix-mexico"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Mexico City GP →
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
              <th className="w-1/3 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows</th>
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-1/5 text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t) => (
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
        {TIERS.map((t) => (
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

      <div className="flex flex-col gap-2 mb-8">
        {TIERS.map((t) => (
          <p key={t.name} className="text-xs text-[#6A6A6A]">
            <span className="text-[#AAFF00]">{t.name}:</span> {t.priceBand}
          </p>
        ))}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">On pricing</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Grandstand and hospitality figures above are confirmed 2026 prices from the official ticketing site.
          General Admission isn&apos;t listed there directly and is estimated from a third-party source instead —
          treat it as a guide rather than an exact figure. Confirm exact current pricing on the official ticketing
          site before buying.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {ticketGuide && (
            <div className="mb-8">
              <SpokeExperienceCard experience={ticketGuide} isPro={isPro} />
            </div>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Mexico City GP, Main Grandstand or Grandstand 10/11 are the sharpest picks if racing
            action and sightlines matter most to you — these sit closest to the main straight and pit lane. If
            atmosphere is the actual reason you&apos;re making this trip, Foro Sol (Grandstands 14 & 15) is the
            honest answer instead: the racing itself is slower through that stadium section, but no other ticket on
            the calendar puts you inside a stadium-sized crowd that sings through Friday practice the way it does
            through the race. General admission is a genuinely reasonable budget entry — you lose a reserved seat,
            not the atmosphere, since GA areas still put you inside the same electric crowd. The full
            grandstand-by-grandstand comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/map`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Venue Map guide
            </a>
            .
          </p>

          {foroSol && (
            <div className="mb-8">
              <SpokeExperienceCard experience={foroSol} isPro={isPro} />
            </div>
          )}

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club and House 44 at F1 Paddock Club™ sit above all of these as a genuinely different product —
            hospitality, not just a seat. Both get the full breakdown, including real booking mechanics and the
            season&apos;s highest-demand risk, in the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy the moment tickets open on the official promoter&apos;s site — this race has genuinely sold out
            within a day in recent years, and there&apos;s no realistic late-buyer path at face value once that
            happens. Set a calendar reminder for the announced release date rather than waiting to hear about it
            secondhand.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
