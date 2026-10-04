import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns sourced from seeded experience content (Grandstands
// A/B/E/H/K, General Admission, Paddock Club, Ticket Guide experiences —
// chinese-gp-grandstand-a/b/e/h/k-, chinese-gp-general-admission-,
// chinese-gp-paddock-club-, chinese-gp-ticket-guide-), 23 Sep 2026. Prices
// added 23 Sep 2026 from planner_ticket_tier_cost — real 2026 on-sale
// figures, shown as a proxy pending 2027 pricing (F1 hasn't published any
// 2027 ticket tier yet). Grandstand E is a real 2026 tier grouped with H/K
// on price. Grandstand E now has a dedicated written experience, seeded
// 2 Oct 2026 (chinese-gp-grandstand-e-) — added to this spoke's card grid
// alongside A/B/H/K.
const TIER_META = [
  {
    tierKey: "ga",
    name: "General Admission",
    shows: "Open zones spread around the lap — no fixed seat, walk the perimeter across the weekend",
    seating: "Standing, roaming",
    exposure: "No cover",
    price: "US$67",
  },
  {
    tierKey: "b",
    name: "Grandstand B",
    shows: "The opening corner sequence, Turns 1-3 — first-lap incidents and overtaking attempts",
    seating: "Reserved, uncovered",
    exposure: "No cover",
    price: "US$309-464",
  },
  {
    tierKey: "h-k",
    name: "Grandstand H / K",
    shows: "The hairpin at the end of the circuit's longest straight — H sees the braking attempt, K sees the exit",
    seating: "Reserved, covered",
    exposure: "Covered",
    price: "US$224-238",
  },
  {
    tierKey: "e",
    name: "Grandstand E",
    shows: "The Turn 11-13 complex on the run toward the back straight — the circuit's newest stand, priced in the same band as H/K",
    seating: "Reserved seating unconfirmed",
    exposure: "No cover",
    price: "US$224",
  },
  {
    tierKey: "a",
    name: "Grandstand A (High Gold)",
    shows: "Main straight — start, finish, podium, and pit lane, the fullest single-seat view of the race",
    seating: "Reserved, covered, two tiers",
    exposure: "Covered",
    price: "US$309-464",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("chinese-gp-ticket-guide-"));
  const grandstandA = linkedExperiences.find((e) => e.slug.includes("chinese-gp-grandstand-a-"));
  const grandstandK = linkedExperiences.find((e) => e.slug.includes("chinese-gp-grandstand-k-"));
  const grandstandB = linkedExperiences.find((e) => e.slug.includes("chinese-gp-grandstand-b-"));
  const grandstandH = linkedExperiences.find((e) => e.slug.includes("chinese-gp-grandstand-h-"));
  const grandstandE = linkedExperiences.find((e) => e.slug.includes("chinese-gp-grandstand-e-"));
  const generalAdmission = linkedExperiences.find((e) => e.slug.includes("chinese-gp-general-admission-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Chinese Grand Prix"
      status="teaser"
      h1="Five grandstands, one roaming ticket — priced here at 2026's real rates, pending 2027"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The five tiers and what each one actually shows you are free above. The pack unlocks seating and weather detail plus 2026's real proxy pricing for every tier, our full written guide to each grandstand and General Admission, the F1 Paddock Club breakdown, and our direct verdict on which grandstand to book for a first Shanghai weekend, including the real trade-off between H and K."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Shanghai International Circuit sells both a roaming General Admission ticket and named reserved
        grandstands — A, B, E, H, and K — each with a genuinely different view. Formula 1 hasn&apos;t published 2027
        pricing for any tier yet, including the F1 Paddock Club, so every ticket type is currently a pre-sale
        waitlist, not a live purchase. The prices below are real 2026 on-sale figures, shown as the best available
        estimate for what 2027 will likely cost — not confirmed 2027 numbers.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from the official source first. Every 2027 ticket type, from General Admission through the
          F1 Paddock Club, is currently a pre-sale waitlist on Formula 1&apos;s own ticketing site — registering now
          means priority access once tickets actually go on sale, at no cost or commitment.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          For hospitality packages specifically, F1 Experiences — the sport&apos;s official hospitality and travel
          partner — is already taking deposits for 2027&apos;s Starter, Hero, and Podium | A tiers ahead of full
          pricing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1
          Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos; own official
          reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://ticketing.formula1.com/china/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Chinese GP ticket waitlist →
          </a>
          <a
            href="https://f1experiences.com/2027-chinese-grand-prix"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            F1 Experiences — Chinese GP packages →
          </a>
          <a
            href="https://www.p1travel.com/en-GB/motorsports/formula-1/chinese-gp-2027-fri-sat-sun"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Chinese GP packages →
          </a>
        </div>
      </div>

      {ticketGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={ticketGuide} isPro={isPro} />
        </div>
      )}

      <p className="hidden md:block text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <p className="md:hidden text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Options compared</p>
      <div className="hidden md:block overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/4 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Tier</th>
              <th className={isUnlocked ? "w-2/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]" : "w-3/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]"}>What it shows</th>
              {isUnlocked && (
                <>
                  <th className="w-[15%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
                  <th className="w-[15%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
                  <th className="w-[15%] text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">2026 price*</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {TIER_META.map((t) => (
              <tr key={t.name} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{t.name}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.shows}</td>
                {isUnlocked && (
                  <>
                    <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.seating}</td>
                    <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.exposure}</td>
                    <td className="py-3 text-[#AAFF00] font-mono align-top">{t.price}</td>
                  </>
                )}
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
              {isUnlocked && (
                <>
                  <p className="text-sm text-[#A3A3A3] leading-6">
                    <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating: </span>
                    {t.seating}
                  </p>
                  <p className="text-sm text-[#A3A3A3] leading-6">
                    <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover: </span>
                    {t.exposure}
                  </p>
                  <p className="text-sm text-[#A3A3A3] leading-6">
                    <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">2026 price*: </span>
                    <span className="text-[#AAFF00] font-mono">{t.price}</span>
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isUnlocked && (
        <>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">*On pricing</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Formula 1 hasn&apos;t published 2027 pricing for any tier at this circuit as of this writing — every
              ticket type shown above is a pre-sale waitlist. The prices above are real, per-person, 3-day figures from
              the 2026 race, shown as the best available proxy for what 2027 will likely cost — treat them as a
              realistic estimate, not a confirmed 2027 number. Register now for priority access, and check back on
              formula1.com as the event approaches for confirmed pricing and on-sale dates. The F1 Paddock Club priced
              at US$17,145 per person for the 3-day 2026 event — its full breakdown, including real booking mechanics,
              is in the Luxury Guide.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {generalAdmission && <SpokeExperienceCard eventSlug={eventSlug} experience={generalAdmission} isPro={isPro} />}
            {grandstandA && <SpokeExperienceCard eventSlug={eventSlug} experience={grandstandA} isPro={isPro} />}
            {grandstandB && <SpokeExperienceCard eventSlug={eventSlug} experience={grandstandB} isPro={isPro} />}
            {grandstandH && <SpokeExperienceCard eventSlug={eventSlug} experience={grandstandH} isPro={isPro} />}
            {grandstandK && <SpokeExperienceCard eventSlug={eventSlug} experience={grandstandK} isPro={isPro} />}
            {grandstandE && <SpokeExperienceCard eventSlug={eventSlug} experience={grandstandE} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            The F1 Paddock Club sits above all of these as a genuinely different product — hospitality, not just a
            seat. It gets the full breakdown, including real booking mechanics, in the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which grandstand we&apos;d pick</p>
            <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
              For a genuine first Shanghai weekend, Grandstand K is the sharpest pick if racing action is the actual
              priority — Formula 1&apos;s own race guide names it the best seat for overtaking, facing the exit of
              the circuit&apos;s signature hairpin at the end of the calendar&apos;s longest straight, and at 2026&apos;s
              pricing it sat in the more affordable US$224-238 tier alongside H, not the pricier A/B bracket. If
              you&apos;d rather watch the braking-zone attempt itself than the resolution, Grandstand H sits directly
              across the same corner at the same price point — a genuinely different half of the same move, not an
              inferior substitute. If a single complete view of the whole race weekend matters more than one
              corner&apos;s drama, Grandstand A on the main straight is the honest step-up: start, pit strategy, and
              finish, all from one seat, for roughly US$309-464 by 2026&apos;s pricing.
            </p>

            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
            <p className="text-sm text-[#A3A3A3] leading-7">
              Register on the official waitlist the moment you know you&apos;re going — F1&apos;s own ticketing site
              gives pre-sale priority to registered members before general on-sale, and premium grandstands and
              hospitality have historically sold out ahead of race week at other circuits on the calendar. There is
              no realistic late-buyer path once a popular stand sells through at face value.
            </p>
          </div>
        </>
      )}
    </SpokeShell>
  );
}
