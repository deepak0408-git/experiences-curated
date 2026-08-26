import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real seeded planner_ticket_tier_cost rows (4 tiers: Ground Pass,
// Grandstand, Show Court Reserved, Hospitality — seeded 22 Jul 2026) drive
// the price table. The 3 experiences most relevant to a ticket-buying
// decision (AO Ticket Guide, Outside Courts grounds-pass strategy, Where to
// Sit seating comparison) all live here — Corporate Hospitality/AO Reserve
// has its own dedicated home in the Luxury spoke instead, cross-linked.
export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("ao-ticket-guide-grounds-session-finals"));
  const outsideCourts = linkedExperiences.find((e) => e.slug.includes("outside-courts-grounds-pass-strategy"));
  const seatingGuide = linkedExperiences.find((e) => e.slug.includes("rod-laver-arena-seating-comparison"));

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
      eventName="Australian Open"
      status="teaser"
      h1="Four tiers, a real presale calendar, and one ticket that opens the whole grounds"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real ticket structure and presale calendar are free above. Unlocking adds our curated tier recommendation for a first Australian Open, plus whether to buy a day or night session — the answer changes depending on which week of the tournament you're going."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Australian Open sells four genuinely different products, not just cheap-vs-expensive versions of the
        same seat. A Rod Laver Arena reserved ticket also grants access to Melbourne Arena (John Cain Arena), Show
        Court 3, and every outside court on the same day — but not Margaret Court Arena, which needs its own
        separate ticket.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket types</p>
      <div className="flex flex-col gap-3 mb-8">
        {tier1 && (
          <TicketRow
            label={tier1.eventTierLabel ?? "Ground Pass"}
            detail="Access to every outside court and the grounds — no reserved seat, walk-up only. The cheapest ticket at the Open, and often the best for close-up access to top players in the first week."
            price={`US$${Math.round(Number(tier1.costLow))}`}
          />
        )}
        {tier2 && (
          <TicketRow
            label={tier2.eventTierLabel ?? "Grandstand"}
            detail="A numbered seat at John Cain Arena or Kia Arena — price varies by round and session."
            price={`US$${Math.round(Number(tier2.costLow))}-${Math.round(Number(tier2.costHigh))}`}
          />
        )}
        {tier3 && (
          <TicketRow
            label={tier3.eventTierLabel ?? "Show Court Reserved Seating (Rod Laver Arena & Margaret Court Arena)"}
            detail="A numbered seat at Rod Laver or Margaret Court Arena — price climbs steeply as the draw narrows toward the second week."
            price={`US$${Math.round(Number(tier3.costLow))}-${Math.round(Number(tier3.costHigh))}`}
          />
        )}
        {tier4 && (
          <TicketRow
            label={tier4.eventTierLabel ?? "Hospitality"}
            detail="AO Reserve hospitality — see the Luxury Guide for the full tier breakdown."
            price={`US$${Math.round(Number(tier4.costLow))}-${Math.round(Number(tier4.costHigh))}`}
          />
        )}
      </div>
      <p className="text-xs text-[#6A6A6A] -mt-4 mb-8">
        Single-session prices from the most recently published Australian Open pricing. See the{" "}
        <a href={`/event-pack/${eventSlug}/cost`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Cost Guide
        </a>{" "}
        for the full trip breakdown, and the{" "}
        <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Luxury Guide
        </a>{" "}
        for AO Reserve.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Presale windows open six months out</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          For the 2027 tournament: an Accessibility presale opened 28 July 2026, a Mastercard presale followed 5
          August, the AO Extras presale ran 6-12 August, and general public on-sale opened 13 August 2026. If
          you&apos;re reading this after those dates, best availability — especially for finals sessions — is
          already behind you; check the official AO resale marketplace linked from ausopen.com/tickets before any
          third-party reseller.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {ticketGuide && <SpokeExperienceCard experience={ticketGuide} isPro={isPro} />}
        {outsideCourts && <SpokeExperienceCard experience={outsideCourts} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Australian Open, a Ground Pass for most of your trip plus one Grandstand or Show
            Court Reserved seat for a single marquee session is the sharpest combination. The Ground Pass gets you
            a full day of tennis across every outside court — often with top-20 players warming up close enough to
            hear the ball off the strings — and one reserved-seat session buys the real arena atmosphere without
            paying for it every day. Prices climb hard as the draw narrows: book your reserved seat for the first
            week if price matters, or accept the second-week premium if a specific quarterfinal or later match is
            the whole point of your trip.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Day session or night session?</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            This isn&apos;t just a cost question — see the{" "}
            <a href={`/event-pack/${eventSlug}/cost`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Cost Guide
            </a>{" "}
            for how the price actually flips between the two — it also decides what kind of session you get. Night
            session tickets only exist at Rod Laver Arena, so buying one locks you into that single arena for the
            evening, whereas a day session ticket at any reserved arena still leaves the rest of the grounds open to
            you beforehand. Early in the tournament, when a night session isn&apos;t guaranteed to carry a big name,
            a day session is usually the better pick precisely because it doesn&apos;t narrow your options. Once the
            draw thins from the quarterfinals on, night sessions are where the marquee matches sit — that&apos;s the
            point to switch your one reserved-seat session to a night ticket if seeing a specific star matters more
            than value.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to sit if you buy a reserved seat</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The full seating breakdown — where the sun sits through a January afternoon session, and which sections
            are worth the upgrade.
          </p>
          {seatingGuide && (
            <div className="mt-6">
              <SpokeExperienceCard experience={seatingGuide} isPro={isPro} />
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
