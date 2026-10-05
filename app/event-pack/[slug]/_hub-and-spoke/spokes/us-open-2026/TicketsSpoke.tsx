import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real seeded planner_ticket_tier_cost rows (4 tiers, seeded 20 Jul 2026)
// drive the price table. Ported from the classic pack's ticketing content,
// restructured into the French Open-style tier comparison. Arthur Ashe,
// Louis Armstrong, and The Night Sessions experience cards live here.
export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const ashe = linkedExperiences.find((e) => e.slug.includes("arthur-ashe-stadium"));
  const armstrong = linkedExperiences.find((e) => e.slug.includes("louis-armstrong-stadium"));
  const nightSessions = linkedExperiences.find((e) => e.slug.includes("us-open-night-sessions"));

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
      eventName="US Open"
      status="teaser"
      h1="Four real ticket tiers, from a Grounds Pass to Arthur Ashe hospitality"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real ticket tiers and prices are free above. Unlocking adds the exact combination we'd buy for a first US Open trip — whether a Grounds Pass week beats a single Ashe night, and which days of the two-week draw are genuinely the best value."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The US Open sells four genuinely different products. A Grounds Admission pass gets you onto every court
        except Arthur Ashe — including Louis Armstrong and the Grandstand's general-admission sections. A reserved
        seat at Ashe or Armstrong is its own separate purchase, priced by session and day. Official hospitality sits
        above both.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket types</p>
      <div className="flex flex-col gap-3 mb-8">
        {tier1 && (
          <TicketRow
            label={tier1.eventTierLabel ?? "Grounds Admission (GA) Pass Only"}
            detail="Access to every court except Arthur Ashe — outer courts, Louis Armstrong and Grandstand's GA sections, practice courts, and the full grounds. No reserved seat, first-come. The cheapest real way in."
            price={`US$${Math.round(Number(tier1.costLow))}`}
          />
        )}
        {tier2 && (
          <TicketRow
            label={tier2.eventTierLabel ?? "Grandstand (Day session)"}
            detail="A reserved seat at the Grandstand court — smaller than Ashe or Armstrong, genuinely close to the action."
            price={`US$${Math.round(Number(tier2.costLow))}-${Math.round(Number(tier2.costHigh))}`}
          />
        )}
        {tier3 && (
          <TicketRow
            label={tier3.eventTierLabel ?? "Arthur Ashe / Louis Armstrong (Day & Evening)"}
            detail="A reserved seat at one of the two show stadiums — price climbs steeply by day of the tournament and by session."
            price={`US$${Math.round(Number(tier3.costLow))}-${Math.round(Number(tier3.costHigh))}`}
          />
        )}
        {tier4 && (
          <TicketRow
            label={tier4.eventTierLabel ?? "Hospitality"}
            detail="Official USTA Premier hospitality — see the Luxury Guide for the real tier breakdown."
            price={`US$${Math.round(Number(tier4.costLow))}-${Math.round(Number(tier4.costHigh))}`}
          />
        )}
      </div>
      <p className="text-xs text-[#6A6A6A] -mt-4 mb-8">
        Single-session prices from the most recently published US Open pricing. See the{" "}
        <a href={`/event-pack/${eventSlug}/cost`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Cost Guide
        </a>{" "}
        for the full trip breakdown, and the{" "}
        <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Luxury Guide
        </a>{" "}
        for hospitality.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">How to actually buy a ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Unlike Wimbledon or Roland-Garros, the US Open runs on a first-come-first-served sale, not a ballot — tickets
          go on sale in waves starting in the spring, with the main draw's best sessions selling out fastest. Buy only
          through usopen.org or Ticketmaster, the tournament's official resale partner — any other "resale" site is
          unverified and carries real risk of invalid tickets. Grounds Admission passes are sold for specific days and
          don't guarantee entry if the grounds reach capacity, so buy early in the day if you're flexible on dates.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {ashe && <SpokeExperienceCard eventSlug={eventSlug} experience={ashe} isPro={isPro} />}
        {armstrong && <SpokeExperienceCard eventSlug={eventSlug} experience={armstrong} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first US Open, a Grounds Pass for most of your trip plus one Ashe or Armstrong day for a
            single marquee session is the sharpest combination. The Grounds Pass covers the practice courts and
            every outer court, often with better access to rising players than a reserved seat gets you, and one
            show-stadium day buys the real Grand Slam atmosphere without paying for it every day. Target the first
            week if price matters more than who&apos;s playing — the draw hasn&apos;t thinned and GA tickets are
            meaningfully cheaper than finals-weekend pricing.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Day session or night session?</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            A night session at Ashe is the signature US Open experience — loud, late, built around one or two
            marquee matches — but it commits the whole evening and tends to price higher than an equivalent day
            session. Early in the tournament, a day session gets you more actual tennis per dollar since multiple
            matches rotate through across several hours. Save the night session for a date when a match you
            specifically want to see is scheduled there.
          </p>
          {nightSessions && (
            <div className="mt-6">
              <SpokeExperienceCard eventSlug={eventSlug} experience={nightSessions} isPro={isPro} />
            </div>
          )}
        </div>
      )}
    </SpokeShell>
  );
}

function TicketRow({ label, detail, price }: { label: string; detail: string; price: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-sm text-[#AAFF00] font-mono">{price}</p>
      </div>
      <p className="text-xs text-[#A3A3A3] leading-5">{detail}</p>
    </div>
  );
}
