import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Spa-Francorchamps sells Bronze (General Admission, roams most of the
// circuit), Silver and Gold grandstands (fixed seat + cover at specific
// corners), and Hospitality (Paddock Club). Real factual columns sourced
// from the 8 seeded grandstand/ticket experiences, 12 Oct 2026. Pricing:
// real planner_ticket_tier_cost rows for edition_year 2027, real 2027
// pricing (sourced in a separate Ticket Intelligence session).
const TIER_META = [
  {
    tierKey: "Bronze GA",
    name: "Bronze — General Admission",
    shows: "Roams most of the 7km circuit — the Kemmel Straight bank, the Pouhon mound, the Fan Zone at Raidillon",
    seating: "Standing / grass bank, no fixed seat",
    exposure: "Uncovered",
  },
  {
    tierKey: "Silver 3",
    name: "Pouhon Corner — Silver 3",
    shows: "The double-left where cars hold sustained lateral load — stark driver differences without race traffic",
    seating: "Fixed, reserved seat",
    exposure: "Covered",
  },
  {
    tierKey: "Gold 3",
    name: "Eau Rouge / Raidillon — Gold 3",
    shows: "The most famous corner sequence on the calendar — the uphill compression every driver rates as the toughest on the lap",
    seating: "Fixed, reserved seat",
    exposure: "Covered",
  },
  {
    tierKey: "Gold 1",
    name: "Gold 1 — Pit Grandstand",
    shows: "Pit lane activity and the start/finish straight",
    seating: "Fixed, reserved seat",
    exposure: "Covered",
  },
  {
    tierKey: "Les Combes",
    name: "Les Combes — Grandstands 1-4",
    shows: "The tight uphill chicane after the Kemmel Straight, where braking mistakes under pressure are most visible",
    seating: "Fixed, reserved seat (cover varies by stand — Combes 2 and 3 covered, 1 and 4 open)",
    exposure: "Mixed — check specific stand",
  },
  {
    tierKey: "La Source",
    name: "La Source Hairpin — Gold 7/8/9",
    shows: "The slowest corner on the lap, beside the starting grid — the one place to watch a full overtaking move in real time",
    seating: "Fixed, reserved seat (7, 8, 9 covered; 7 bis/ter and 9 bis open)",
    exposure: "Mixed — check specific stand",
  },
  {
    tierKey: "Bus Stop",
    name: "Bus Stop Chicane — Gold 6 & Gold 11",
    shows: "The final chicane before the pit straight — a last chance to overtake or defend before the line",
    seating: "Fixed, reserved seat (Gold 11 Premium covered, Gold 6 bis open)",
    exposure: "Mixed — check specific stand",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const euRouge = linkedExperiences.find((e) => e.slug.includes("eau-rouge-raidillon-gold3-"));
  const pouhon = linkedExperiences.find((e) => e.slug.includes("pouhon-corner-silver3-"));
  const kemmel = linkedExperiences.find((e) => e.slug.includes("kemmel-straight-general-admission-"));
  const gold1 = linkedExperiences.find((e) => e.slug.includes("gold1-pit-grandstand-"));
  const lesCombes = linkedExperiences.find((e) => e.slug.includes("les-combes-grandstands-"));
  const laSource = linkedExperiences.find((e) => e.slug.includes("la-source-hairpin-grandstands-"));
  const busStop = linkedExperiences.find((e) => e.slug.includes("bus-stop-chicane-grandstands-"));
  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("belgian-gp-ticket-guide-"));

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
      eventName="Belgian Grand Prix"
      status="teaser"
      h1="A US$215 roaming Bronze pass, or a fixed seat at the corner that matters most to you"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every real option and what it shows you is free above. The pack unlocks our full written guide to all 7 grandstands — Raidillon, Pouhon, the Pit straight, Les Combes, La Source, the Bus Stop Chicane, and Kemmel — plus which one actually suits a first Spa trip, the Bronze-roaming strategy that works across a 7km circuit, and which stand to move on first before it sells — Gold 3 at Raidillon is historically the first to go."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa-Francorchamps is 7 kilometres long, and that length shapes the real ticket decision here more than at
        almost any other circuit on the calendar. A Bronze General Admission pass gets you into most of the
        circuit to roam between viewing spots across the weekend — genuinely strong given how much ground there is
        to cover. Silver and Gold grandstands trade that mobility for a fixed, reserved seat with cover at one
        specific corner. We cover the main options below — the ones fans actually ask us about, representing the
        full length of the lap from the start/finish straight to the final chicane.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from spagrandprix.com, the circuit&apos;s own official ticketing platform. Gold 3 at
          Raidillon has historically been the first grandstand to sell out, typically in the autumn the year
          before — every F1 ticket ultimately traces back to the promoter, and buying direct means no markup and
          no risk of a fraudulent listing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in,
          P1 Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos; own
          official reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.spagrandprix.com/en/billetterie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Belgian GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en/organizer/grand-prix-belgium"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Belgian GP →
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
              { t: tier1, title: "Bronze — General Admission", unit: "3-day, Friday–Sunday" },
              { t: tier2, title: "Silver Grandstand", unit: "3-day reserved seat" },
              { t: tier3, title: "Gold Grandstand", unit: "3-day reserved seat" },
              { t: tier4, title: "Hospitality — Paddock Club", unit: "3-day" },
            ]
              .filter((x) => x.t)
              .map((x) => (
                <div key={x.title} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{x.title}</p>
                  <p className="text-lg font-black text-[#AAFF00]">
                    {Math.round(Number(x.t!.costLow)) === Math.round(Number(x.t!.costHigh))
                      ? `US$${Math.round(Number(x.t!.costLow)).toLocaleString("en-US")}`
                      : formatMoneyRange(Math.round(Number(x.t!.costLow)), Math.round(Number(x.t!.costHigh)))}
                  </p>
                  <p className="text-xs text-[#6A6A6A] mt-1">{x.unit}</p>
                </div>
              ))}
          </div>
          <p className="text-xs text-[#6A6A6A]">
            Figures above are real, confirmed 2027 USD pricing.
          </p>
        </div>
      ) : null}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which seat we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Spa weekend, Gold 3 at Raidillon is the strongest all-round pick — the most
            famous corner sequence on the calendar, covered, and the first grandstand that sells out for good
            reason. On a Silver budget, Pouhon is the sharper technical choice: every car attacks the double-left
            individually, and the driver differences are stark without race traffic in the way. On a Bronze
            budget, roam Friday to find your preferred spots — the Kemmel Straight bank and the Fan Zone at
            Raidillon are the two most popular General Admission anchors, but Bronze genuinely unlocks most of the
            circuit, not just those two.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {euRouge && <SpokeExperienceCard eventSlug={eventSlug} experience={euRouge} isPro={isPro} />}
            {pouhon && <SpokeExperienceCard eventSlug={eventSlug} experience={pouhon} isPro={isPro} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {kemmel && <SpokeExperienceCard eventSlug={eventSlug} experience={kemmel} isPro={isPro} />}
            {gold1 && <SpokeExperienceCard eventSlug={eventSlug} experience={gold1} isPro={isPro} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {lesCombes && <SpokeExperienceCard eventSlug={eventSlug} experience={lesCombes} isPro={isPro} />}
            {laSource && <SpokeExperienceCard eventSlug={eventSlug} experience={laSource} isPro={isPro} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {busStop && <SpokeExperienceCard eventSlug={eventSlug} experience={busStop} isPro={isPro} />}
            {ticketGuide && <SpokeExperienceCard eventSlug={eventSlug} experience={ticketGuide} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club sits above all of these as a genuinely different product — hospitality, not just a seat.
            It gets the full breakdown, including real booking mechanics, in the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy early on spagrandprix.com if a specific stand matters to you — Gold 3 in particular has a track
            record of selling out well ahead of race weekend, and Bronze GA shuttle bookings fill before the
            tickets themselves do.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
