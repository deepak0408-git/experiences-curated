import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Real content sourced from the seeded Arrival & Queue Guide experience
// (italian-gp-arrival-queue-guide-mu7cja19) and The Fan Zone — Ascari to
// Parabolica (the-fan-zone-ascari-to-parabolica-mrbp88aj), 19 Sep 2026: six
// lettered gates (A-G) each serving different sections, a 15-litre bag
// limit, and — unusually for modern F1 — cameras and tripods are welcomed
// rather than banned. Re-entry is genuinely allowed here, unlike some
// circuits.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const arrivalGuide = linkedExperiences.find((e) => e.slug.includes("italian-gp-arrival-queue-guide-"));
  const fanZone = linkedExperiences.find((e) => e.slug.includes("the-fan-zone-ascari-to-parabolica-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="public"
      h1="Gates open 07:00, six lettered entrances, and — unusually — real cameras are welcome"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Gates open at 07:00 on Friday, Saturday, and Sunday of race weekend, earlier than most fans expect for a
        circuit this size — worth building your morning around if a specific grandstand seat matters to you.
        Monza runs six spectator entrances, lettered A through G, and which one you use actually matters: walking
        up to the wrong gate on a full house day means a long walk around the perimeter instead of a five-minute
        stroll in.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Which gate for which section</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-2">
          <FactRow label="Gate A / B" value="Start line, Grandstand 1, and the Traguardo stands" />
          <FactRow label="Gate B" value="Ascari and Piscina sections, Grandstands 2, 3, and 27-30" />
          <FactRow label="Gate D" value="Lesmo and the Seconda Variante" />
          <FactRow label="Gate G" value="Parabolica end, including Grandstand 17" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Bag policy — simpler than most F1 circuits</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          15 litres, any colour, no clear-bag requirement. Suitcases and oversized luggage aren&apos;t allowed at
          all. Water is capped at 500ml per bottle (plastic or metal); alcohol doesn&apos;t get past the gate.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Cameras & lenses" value="Welcomed for personal use, tripods included with security approval — unusually permissive for modern F1" />
          <FactRow label="Drones, tents, bicycles" value="Banned" />
          <FactRow label="Folding chairs" value="Allowed, as long as they're not wooden" />
          <FactRow label="Power banks" value="Capped at 300 grams" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Re-entry is genuinely allowed</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Unlike some circuits that lock you in for the day once you&apos;re through security, Monza allows
          re-entry. The tradeoff is time — leaving mid-session means queuing again to get back in, and that queue
          can run long during breaks between sessions. If your plan is grandstand in the morning, Fan Zone at
          lunch, grandstand again for the race, budget real time for the second security pass.
        </p>
      </div>

      {arrivalGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={arrivalGuide} isPro={isPro} />
        </div>
      )}

      {fanZone && (
        <div className="mb-8">
          <SpokeExperienceCard experience={fanZone} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Confirm your gate letter against your specific grandstand or GA section before race morning, not on the
          day — the walk-around penalty for the wrong gate on a packed Sunday is real. Because re-entry is
          genuinely allowed here, it&apos;s worth planning a Fan Zone stop into your day rather than treating the
          grandstand as a one-way commitment, but budget real time for the second security queue if you do.
        </p>
      </div>
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
