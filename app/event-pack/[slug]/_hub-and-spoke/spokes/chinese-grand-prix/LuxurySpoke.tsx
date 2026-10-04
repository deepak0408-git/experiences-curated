import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Real content sourced from the seeded Paddock Club/Hospitality experience
// (chinese-gp-paddock-club-), 23 Sep 2026. Per §2i: covers hospitality
// tiers beyond just Paddock Club (Starter/Hero/Podium via F1 Experiences)
// and cross-references Hotels for the luxury lodging angle. Paddock Club
// price added 23 Sep 2026 from planner_ticket_tier_cost — a real 2026
// on-sale figure (US$17,145pp, 3-day), shown as a proxy pending 2027
// Paddock Club pricing, which still isn't published. F1 Experiences'
// Starter/Hero/Podium tiers remain genuinely unpriced for 2027 — no proxy
// applied to those, since they're a separate product from Paddock Club.
//
// Mr & Mrs Bund card removed 4 Oct 2026 — it's already the featured card in
// WhereToEatSpoke, and every experience card should render in exactly one
// spoke (same rule Brazilian GP's MapSpoke comment documents for its own
// Ticket Guide card). The "What we haven't confirmed yet" placeholder this
// left behind was comparatively thin next to Brazilian GP's researched
// Premium Transit and off-circuit VIP sections — resolved the same way
// Brazilian GP's was: real research, not invented filler. Helicopter
// charter between Pudong/Hongqiao and Jiading is a genuine, named service
// (Sino Jet, Deer Jet) with approved helipads including one in Jiading
// itself, WebSearch-confirmed 4 Oct 2026 — no fixed race-weekend pricing
// published by any operator, stated honestly as "get a quote" rather than
// invented, same pattern as Brazilian GP's helicopter section. FLAIR
// Rooftop at the Ritz-Carlton Shanghai Pudong (58th floor, address/phone/
// hours WebSearch-confirmed directly 4 Oct 2026) is the real off-circuit
// VIP night pick — the highest rooftop bar in China, a genuinely verified
// standing venue, not a generic "nice rooftop bar" claim.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const paddockClub = linkedExperiences.find((e) => e.slug.includes("chinese-gp-paddock-club-"));

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
      h1="A whole trip of luxury decisions, not one hospitality product — Paddock Club priced here at 2026's real rate"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real hospitality ladder and 2026's Paddock Club price as a proxy are free above. The pack adds the genuine helicopter-charter route around Jiading's road traffic, FLAIR's full booking detail — China's highest rooftop bar, with the direct reservation line — our verdict on which hospitality tier to actually book, and why the top tiers won't stay available for long once 2027 pricing lands."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Chinese Grand Prix weekend is a stack of decisions, not one purchase. Beyond the top hospitality
        tier, a genuinely luxury trip here spans a real ladder of F1 Experiences packages, a premium way to beat
        Jiading&apos;s road traffic, and a proper night out downtown. Most of 2027&apos;s specific package pricing
        isn&apos;t published yet, but the F1 Paddock Club has a real 2026 price to work from — shown below as the
        best available proxy, not a confirmed 2027 figure.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers — a real ladder, not one product</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Experiences, the sport&apos;s official hospitality and travel partner, has already published three
        package tiers for 2027: Starter (Grandstand B or H/K, plus a pit lane walk, guided track tour, and trophy
        photo), Hero (Grandstand A or B, adding &quot;Inside F1&quot; access), and Podium | A (Grandstand A plus
        genuine F1 podium access, paddock insider entry, and an FIA Safety Car inspection). The true top tier, the
        F1 Paddock Club itself — a panoramic suite above the pits, with a dedicated Gordon Ramsay dining concept
        built specifically for this race — hasn&apos;t published its own 2027 package pricing yet. The 2026 race
        priced it at US$17,145 per person for the 3-day weekend, the real figure we&apos;re using as a proxy below.
      </p>

      {paddockClub && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={paddockClub} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        For the luxury-hotel angle — where a high-spend fan should actually stay — see the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>
        , which covers the real Jiading-vs-downtown trade-off this pack is built around.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Premium transit — helicopter over road traffic</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Jiading sits roughly an hour from central Shanghai by road even without race-weekend traffic — a
            genuine helicopter charter market exists here, with providers like Sino Jet and Deer Jet running
            services between Pudong or Hongqiao and approved helipads, including one in Jiading itself. No operator
            publishes fixed race-weekend pricing, so treat &quot;get a quote&quot; as the honest next step rather
            than a number we&apos;d invent here. If you&apos;re driving instead, book a premium car service with an
            experienced local driver who knows the circuit&apos;s access roads, rather than a standard rideshare
            that struggles the same way everyone else&apos;s does once race-weekend traffic builds.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A real off-circuit VIP night: FLAIR</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            FLAIR, the rooftop restaurant and bar on the 58th floor of the Ritz-Carlton Shanghai Pudong, is the
            genuine off-circuit VIP venue for a night away from the race — the highest rooftop bar in China, with
            face-to-face views of the Oriental Pearl Tower and the full sweep of the Bund and Huangpu River below.
            Reservations are strongly recommended well ahead, since the venue&apos;s limited seating fills fast —
            call +86 21 2020 1717 directly to check the night you actually want.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Podium | A is the sharpest pick among F1 Experiences&apos; three tiers for a genuine once-in-a-lifetime
            first Chinese Grand Prix — real podium access and an FIA Safety Car inspection go well beyond what
            Starter or Hero offer, and Grandstand A&apos;s main-straight seat is already the fullest single view of
            the race on its own. If the full F1 Paddock Club experience is the actual goal, its 2026 price of
            US$17,145 per person is a realistic budget line for 2027 — register on the official hospitality
            waitlist now, since pre-sale priority historically matters more for this tier than for any grandstand.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book the moment pricing lands</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Premium hospitality tiers at other rounds on the calendar have historically sold out within weeks once
            pricing actually goes live — the same pattern is a reasonable bet here, given how quickly F1 Experiences
            is already taking deposits ahead of a full on-sale. Don&apos;t wait to see how the season shapes up
            before deciding; by the time results make the decision easier, the top tiers may already be gone.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
