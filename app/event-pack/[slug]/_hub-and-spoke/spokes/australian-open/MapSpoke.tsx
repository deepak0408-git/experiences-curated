import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const rodLaver = linkedExperiences.find((e) => e.slug.includes("rod-laver-arena-inside-main-court"));
  const otherArenas = linkedExperiences.find((e) => e.slug.includes("margaret-court-john-cain-arenas"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="public"
      h1="Three roofed arenas, dozens of outside courts, one 5-10 minute walking radius"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Melbourne Park is compact by Grand Slam standards — every major arena sits within a 5-10 minute walk of
        every other, so a day spent moving between show courts and the outside courts doesn&apos;t cost much time
        in transit.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Site layout</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Rod Laver Arena" value="The main show court since 1988, retractable roof — the tournament's marquee venue" />
        <FactRow label="Margaret Court Arena" value="Second show court, its own retractable roof, own separate ticket" />
        <FactRow label="John Cain Arena" value="Third roofed venue, general admission grounds access on some tickets, own reserved seating on others" />
        <FactRow label="Show Court 3" value="Included with a Rod Laver Arena reserved seat, alongside every outside court" />
        <FactRow label="Outside Courts 3-15" value="No reserved seating — walk-up only, included with any Ground Pass or higher ticket" />
      </div>

      <div className="relative w-full aspect-[762/554] rounded-sm border border-[#2A2A2A] overflow-hidden mb-2 bg-white">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/australian-open-venue-map.png"
          alt="Melbourne Park precinct map showing Rod Laver Arena, Margaret Court Arena, John Cain Arena, and the outside courts"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">Map: austadiums.com</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {rodLaver && <SpokeExperienceCard experience={rodLaver} isPro={isPro} />}
        {otherArenas && <SpokeExperienceCard experience={otherArenas} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Facilities across the grounds</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food and drink</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Grand Slam Oval and the food village between Rod Laver and Margaret Court Arena carry real Melbourne
            restaurant names, not just stadium catering — see the{" "}
            <a href={`/event-pack/${eventSlug}/where-to-eat`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Eat guide
            </a>
            .
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Ticket-tier entry</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A Rod Laver Arena reserved ticket also covers John Cain Arena, Show Court 3, and every outside court
            on the same day — but not Margaret Court Arena, which needs its own separate ticket regardless of what
            else you&apos;re holding.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A first-timer's guide to the outside courts</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Numbered courts 3-15 are the cheapest, most flexible way to see close-up tennis at the Open — no
          reserved seat, walk up and sit wherever there&apos;s room. See the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>{" "}
          for the real grounds-pass strategy.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Facilities &amp; accessibility</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Step-free throughout the precinct</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Melbourne Park is built for it — ramps, lifts, wide entry gates, and priority access lanes at every
            main entrance. Rod Laver, Margaret Court, and John Cain Arenas all have dedicated wheelchair seating,
            ease-of-access seating for limited mobility, enhanced-vision seating, and seating near hearing loops.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Accessible toilets</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Located near Doors 3, 13, 16, and 20 at Rod Laver Arena, plus inside Railyards and the Upper Deck —
            and throughout the wider grounds, not only near accessible-seating entrances.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Sensory rooms</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Dedicated sensory rooms at AO Ballpark, John Cain Arena, Margaret Court Arena, and Rod Laver Arena,
            plus complimentary sensory kits and communication boards at information points.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Hearing loops and live captions</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Hearing loops are fitted in key venues, and live captions run on screens around Melbourne Park during
            the tournament.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 sm:col-span-2">
          <p className="text-sm font-bold text-white mb-1">Booking accessible tickets and a Companion Card seat</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Accessible tickets can only be bought through the AO Accessibility Line on 1300 308 999 (Mon-Sun,
            9am-5pm AEDT) or by emailing accessibletickets@ticketmaster.com.au — not through general sale. A
            current Companion Card is required for a Companion Card ticket, and you&apos;ll need to carry it with
            you at entry.
          </p>
        </div>
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">
        Source: ausopen.com/accessibility, Ticketmaster Australia accessible ticketing.
      </p>

    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
