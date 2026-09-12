import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Real content sourced from the seeded Arrival & Queue Guide experience
// (brazilian-gp-arrival-queue-guide-mtx6vx00), 12 Sep 2026: gates open 08:00
// Fri/Sat/Sun, bag checks at every entrance, no re-entry once inside — the
// single rule that most changes first-timer behavior here.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const arrivalGuide = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-arrival-queue-guide-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Brazilian Grand Prix"
      status="public"
      h1="Gates open 08:00, bag checks at every entrance, and no re-entry once you're in"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Gates at Interlagos open at 08:00 on Friday, Saturday, and Sunday, across multiple entrances positioned
        around the circuit. Every entrance runs a bag check, and F1&apos;s own visitor guidance is blunt about it:
        pack light, because refusing a search can get you turned away without a refund. There&apos;s no getting
        around this line — showing up with less means clearing security faster and getting to your seat before the
        crowd bottleneck builds near session start.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Prohibited items</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Beyond the obvious (weapons, explosives, sharp objects, glass containers), the list also bans professional
          cameras, drones, bicycles, tents, and folding chairs — longer than most first-timers expect, and worth
          checking against your own packing list before you leave the hotel.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Professional cameras & drones" value="Banned outright, no exceptions" />
          <FactRow label="Bicycles, tents, folding chairs" value="Banned" />
          <FactRow label="Umbrellas" value="Banned — bring a rain jacket instead" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">There's no re-entry</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Interlagos&apos; no-re-entry policy is the one rule here that changes behavior, not just your bag
          contents — it forces a decision most first-timers don&apos;t think to make in advance: are you staying
          for the whole day, and have you actually brought what you need for that? Don&apos;t plan on stepping out
          mid-day for any reason.
        </p>
      </div>

      {arrivalGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={arrivalGuide} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Because bag checks happen at every entrance with no fast-track beyond packing light, arrive with your
            gates-open target in mind rather than session-start time — an 08:00 gate opening with security lines
            building fast means getting there right at open is genuinely worth the earlier morning, especially on
            race day when the crowd is at its largest all weekend.
          </p>
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
