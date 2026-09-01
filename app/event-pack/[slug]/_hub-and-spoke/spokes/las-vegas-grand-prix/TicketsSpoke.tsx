import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const mainGrandstand = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-main-grandstand"));
  const turn3 = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-turn3-grandstand"));
  const westHarmon = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-west-harmon-grandstand"));
  const flamingo = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-flamingo-ga"));
  const tmobile = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-tmobile-sphere"));
  const practiceQualifying = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-practice-qualifying"));

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="teaser"
      h1="Five real ticket tiers, one genuine budget move"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every tier and price above is real and free — the pack doesn't unlock more numbers, it unlocks the decision. Which single tier we'd actually book for a first Las Vegas GP and why, the single-day qualifying move that beats race day on value, and exactly how early Main Grandstand sells out so you're not caught buying the wrong tier too late."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Las Vegas sells a genuinely wide spread of tickets, from standing-room general admission to a five-figure
        hospitality tier — and unlike most Grands Prix, the difference between tiers here is about which part of
        the race weekend you actually want, not just how close you sit.
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
            href="https://www.f1lasvegasgp.com/tickets/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Las Vegas GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-las-vegas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Las Vegas GP →
          </a>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The four real tiers</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {tier1 && (
          <TierCard label="Flamingo Zone GA" price={`${formatMoneyRange(Math.round(Number(tier1.costLow)), Math.round(Number(tier1.costHigh)))} 3-day`} note="Standing room, Koval Straight toward Turn 5G braking zone" />
        )}
        {tier2 && (
          <TierCard label="T-Mobile Zone at Sphere / West Harmon / Turn 3" price={formatMoneyRange(Math.round(Number(tier2.costLow)), Math.round(Number(tier2.costHigh)))} note="Real assigned grandstand seating, genuine racing views" />
        )}
        {tier3 && (
          <TierCard label="Heineken Silver Main Grandstand" price={formatMoneyRange(Math.round(Number(tier3.costLow)), Math.round(Number(tier3.costHigh)))} note="Start/finish line, pit lane views, the full ceremony" />
        )}
        {tier4 && (
          <TierCard label="Paddock Club" price={formatMoneyRange(Math.round(Number(tier4.costLow)), Math.round(Number(tier4.costHigh)))} note="Garage-level hospitality, restricted paddock tour" />
        )}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Every grandstand and zone, in detail</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {mainGrandstand && <SpokeExperienceCard experience={mainGrandstand} isPro={isPro} />}
        {turn3 && <SpokeExperienceCard experience={turn3} isPro={isPro} />}
        {westHarmon && <SpokeExperienceCard experience={westHarmon} isPro={isPro} />}
        {flamingo && <SpokeExperienceCard experience={flamingo} isPro={isPro} />}
        {tmobile && <SpokeExperienceCard experience={tmobile} isPro={isPro} />}
        {practiceQualifying && <SpokeExperienceCard experience={practiceQualifying} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The real budget move</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Single-day tickets exist for every session, and the price gap between them is enormous: Thursday practice
              starts around US$50, Friday qualifying around US$99, Saturday&apos;s race around US$393. Qualifying
              delivers genuine competitive intensity under the same night lights as the race, for roughly a quarter of
              race day&apos;s price — a real, underused way into the weekend on a tighter budget.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Las Vegas GP, Heineken Silver Main Grandstand is the strongest single seat —
            start/finish, pit lane, the full ceremony, and nowhere else on the circuit replicates that specific view.
            If real racing matters more than the ceremony, West Harmon or Turn 3 delivers a sharper price-to-action
            ratio: Turn 3&apos;s real selling point is the Koval Straight DRS zone into the Turn 5G braking zone,
            genuine overtaking territory, not just a cheaper seat.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Flamingo Zone GA isn&apos;t a compromise pick, it&apos;s the honest budget move: standing room on the
            same Koval Straight/Turn 5G braking zone Turn 3 Grandstand looks onto, at a fraction of any seated
            tier&apos;s price. T-Mobile Zone at Sphere is a genuinely different product, not a cheaper grandstand —
            you&apos;re buying a standing view with the Sphere itself as the backdrop, plus a real concert stage
            each night of race weekend (Two Friends, Disclosure, Sean Paul, and a Backstreet Boys afterparty at the
            Sphere in past years). Worth knowing either way: General Admission tickets are single-zone-locked — a
            Flamingo Zone ticket doesn&apos;t let you wander into T-Mobile Zone on the same day, so pick the zone
            whose specific view (and lineup) matters most to you, not just the cheapest one.
          </p>
          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4">
            <p className="text-sm font-bold text-white mb-1.5">Book early — this circuit sells out grandstands fast</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Main Grandstand has historically been the first stand to sell out given its start/finish and pit-lane
              view. Buy only via f1lasvegasgp.com or tickets.formula1.com directly — avoid resellers.
            </p>
            <a
              href="https://www.f1lasvegasgp.com/tickets/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              f1lasvegasgp.com/tickets →
            </a>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function TierCard({ label, price, note }: { label: string; price: string; note: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-lg font-black text-[#AAFF00] mb-1">{price}</p>
      <p className="text-xs text-[#6A6A6A]">{note}</p>
    </div>
  );
}
