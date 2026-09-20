import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns sourced from the seeded experience content (Fangio,
// Piastri, Vettel, Brabham grandstands, General Admission, Ticket Guide
// experiences), 20 Sep 2026. Albert Park sells both a General Admission
// tier (Park Pass) and reserved grandstands, unlike Interlagos' grandstand-
// only structure. Real prices seeded to planner_ticket_tier_cost same
// session.
const TIER_META = [
  {
    tierKey: "tier1",
    name: "Park Pass (General Admission)",
    shows: "Walk the whole 5.3km circuit — Turn 2, Turn 8, and Brocky's Hill at Turn 9 are the three elevated, guaranteed-sightline mounds",
    seating: "No reserved seat — 14 numbered track-level zones (D-N) plus grass mounds",
    exposure: "No cover",
  },
  {
    tierKey: "tier2",
    name: "Vettel or Brabham Grandstand",
    shows: "Vettel: Turn 11's braking battle off the DRS zone. Brabham: Turns 1-2's first-lap chaos, opposite Jones",
    seating: "Reserved, uncovered bleacher seating",
    exposure: "No cover",
  },
  {
    tierKey: "tier3",
    name: "Fangio or Piastri Grandstand",
    shows: "Main straight — start-finish line, pit lane, and the podium, with Turn 1 and the final corner blocked by fencing",
    seating: "Reserved — standard uncovered rows plus a premium covered upper tier",
    exposure: "Partial cover (premium rows only)",
  },
  {
    tierKey: "tier4",
    name: "F1 Paddock Club / Trackside Hospitality",
    shows: "Above the pit lane and start-finish straight, plus a rooftop deck over the Walker Straight and city skyline",
    seating: "Hospitality — table seating, guided pit lane walk included",
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

  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("ausgp-ticket-guide-grandstands-park-pass-mu9ccj0n"));
  const vettel = linkedExperiences.find((e) => e.slug.includes("vettel-stand-turns-11-12-mu9bzrti"));
  const brabham = linkedExperiences.find((e) => e.slug.includes("brabham-grandstand-turns-1-2-mu9c1dch"));
  const fangio = linkedExperiences.find((e) => e.slug.includes("fangio-grandstand-albert-park-mu9bxaeb"));
  const piastri = linkedExperiences.find((e) => e.slug.includes("piastri-grandstand-albert-park-mu9bykxi"));
  const generalAdmission = linkedExperiences.find((e) => e.slug.includes("general-admission-park-pass-hills-mu9c2qyt"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="teaser"
      h1="A genuine General Admission tier, plus four grandstands with real trade-offs"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The four tiers and what each one actually shows you are free above. The pack adds the full grandstand-by-grandstand comparison — including Jones, Stewart, Lauda, Waite, and the other stands not shown here — our direct verdict on Vettel vs. Brabham for a first Albert Park weekend, and which stand to move on first before it sells out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Albert Park is one of the few circuits left on the F1 calendar that still sells a genuine walk-around General
        Admission ticket alongside its grandstands — the Park Pass. That's a real structural difference from a
        grandstand-only venue like Interlagos: the cheapest way to attend is a wristband, not a fixed seat, and it
        comes with real trade-offs of its own (see the comparison below).
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from the official Australian Grand Prix Corporation site first. Tickets go on sale in stages —
          Circuit Club members get first access from 1 October 2026, American Express cardholders get a presale
          window from 2 October, and general public sales open 6 October 2026. The 2026 race drew a record 483,934
          spectators across four days, the biggest crowd of Melbourne's F1 era — a new Sprint-format 2027 weekend is
          likely to see comparable or higher demand, so buying inside the first general-sale window is the safer call
          for any popular grandstand.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1
          Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos; own official
          reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.grandprix.com.au/en/tickets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Australian GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en-GB/motorsports/formula-1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Formula 1 →
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
          Prices above are current planner-tier figures. Confirm current availability directly before buying — the
          Piastri Grandstand, given the home-crowd connection to Melbourne&apos;s own F1 driver, is one of the
          stands most likely to sell out earliest.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {ticketGuide && (
            <div className="mb-8">
              <SpokeExperienceCard eventSlug={eventSlug} experience={ticketGuide} isPro={isPro} />
            </div>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which grandstand we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Albert Park weekend, the Vettel Stand at Turn 11 ({tier2 && `US$${Math.round(Number(tier2.costLow))}-${Math.round(Number(tier2.costHigh))}`}) is the sharpest pick if racing action
            matters most — a DRS straight feeding a genuinely slow corner, one of the circuit&apos;s real overtaking
            spots, with cars braking hard right in front of you. Brabham at Turns 1-2 ({tier2 && `US$${Math.round(Number(tier2.costLow))}-${Math.round(Number(tier2.costHigh))}`}) is the honest alternative if you
            want the opening-lap chaos instead — a pack of 20 cars still bunched together, jostling for position
            right off the main straight.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {vettel && <SpokeExperienceCard eventSlug={eventSlug} experience={vettel} isPro={isPro} />}
            {brabham && <SpokeExperienceCard eventSlug={eventSlug} experience={brabham} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Fangio ({tier3 && `US$${Math.round(Number(tier3.costLow))}-${Math.round(Number(tier3.costHigh))}`}) and Piastri ({tier3 && `US$${Math.round(Number(tier3.costLow))}-${Math.round(Number(tier3.costHigh))}`}) sit a tier above — both on the main straight, both trading Turn
            1 and the final corner (blocked by safety fencing) for the start-finish line, pit lane, and podium. If
            watching pit stops and the finish matters more to you than watching a corner, that trade is worth making
            — and Piastri specifically carries a home-crowd story neither Fangio nor any other stand at Albert Park
            can match.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {fangio && <SpokeExperienceCard eventSlug={eventSlug} experience={fangio} isPro={isPro} />}
            {piastri && <SpokeExperienceCard eventSlug={eventSlug} experience={piastri} isPro={isPro} />}
          </div>

          {generalAdmission && (
            <div className="mb-8">
              <SpokeExperienceCard eventSlug={eventSlug} experience={generalAdmission} isPro={isPro} />
            </div>
          )}

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            F1 Paddock Club and trackside hospitality ({tier4 && `US$${Math.round(Number(tier4.costLow))}-${Math.round(Number(tier4.costHigh))}`}) sit above all of these as a genuinely different product —
            hospitality, not just a seat, with a guided pit lane walk included. It gets the full breakdown, including
            real booking mechanics, in the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy the moment general sales open on 6 October 2026 if a specific stand matters to you — Piastri in
            particular has a real chance of selling out earliest given the home-crowd connection. There&apos;s no
            realistic late-buyer path at face value once a popular stand sells through.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
