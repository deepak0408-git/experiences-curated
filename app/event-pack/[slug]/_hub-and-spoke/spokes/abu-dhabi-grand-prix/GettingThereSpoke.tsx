import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const airportGuide = linkedExperiences.find((e) => e.slug.includes("auh-vs-dxb-getting-there"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="public"
      h1="AUH is closest, DXB often flies cheaper — check both before booking"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Abu Dhabi is one of the very few Grand Prix venues in the world where the honest advice is to check two
        different airports before booking flights — and which one is right for you depends entirely on where
        you&apos;re flying from.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">AUH — Abu Dhabi International</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm font-bold text-white mb-1">The world&apos;s closest international airport to any F1 venue</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Just 8km from Yas Marina Circuit — a taxi takes 10-15 minutes and costs around AED 112. If you&apos;re
          staying at any Yas Island hotel, a free shuttle runs from opposite Arrivals Door 3 (bring your hotel
          booking voucher to board).
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Distance to circuit" value="8km, ~15 min taxi" />
          <FactRow label="Taxi fare" value="~AED 112" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">DXB — Dubai International</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Roughly 77 miles and about 75 minutes&apos; drive to Yas Marina via the E11. For many long-haul origins,
          DXB carries far more direct routes and better fares than AUH — the extra ground-transport time is a
          reasonable trade for a meaningfully better flight. Public transport (bus/metro) between DXB and the
          circuit runs 3.5+ hours — fine for a leisurely arrival day, not realistic for race day itself.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Distance to circuit" value="~77 miles, ~75 min drive via E11" />
          <FactRow label="Self-drive/taxi" value="$13-20 (self-drive) to $100-130 (taxi/transfer)" />
          <FactRow label="Public transport" value="3.5+ hours — impractical for race day" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest framing</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          AUH wins on pure convenience if your routing supports it. DXB wins on route choice and often on fare —
          check both before booking rather than defaulting to AUH just because it&apos;s closer to the circuit. For
          a lot of long-haul origins, the extra 60 minutes of ground transport from Dubai is a small price for a
          meaningfully better flight.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Careem or Uber</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both operate widely across Abu Dhabi and Dubai — genuinely useful for airport transfers and getting
              around either city, and typically cheaper than a street-hailed taxi for a comparable ride.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Abu Dhabi GP Tickets app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Your ticket is digital-only and delivered here closer to race weekend — install it before you travel
              rather than scrambling at the gate.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Darb (Abu Dhabi toll/parking) or RTA Dubai</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              If you&apos;re self-driving or renting a car at any point, the relevant emirate&apos;s official app
              handles toll top-ups and parking payment — worth having installed before you pick up a rental.
            </p>
          </div>
        </div>
      </div>

      {airportGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={airportGuide} isPro={isPro} />
        </div>
      )}
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
