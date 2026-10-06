import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real seeded experience "The 7 Train to Flushing" anchors this spoke,
// ported from the classic pack. OMNY fare cap detail pulled from the real
// seeded planner_destination_bands.localTravelNote.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, destinationBand } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const sevenTrain = linkedExperiences.find((e) => e.slug.includes("the-7-train-to-flushing"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="public"
      h1="The 7 train is the real answer — plus what to do when it's packed"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The USTA Billie Jean King National Tennis Center sits in Flushing Meadows-Corona Park, Queens. The subway
        gets you there directly on one line from almost anywhere in the city — below is the real route, plus car
        and rideshare guidance for session days specifically.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The fastest real route — by subway</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          The 7 train runs direct to Mets-Willets Point, a 10-minute walk from the grounds — no transfer needed from
          most of Manhattan or Long Island City. OMNY&apos;s automatic weekly fare cap (around $35) means once
          you&apos;ve paid that much in a week, every further ride that week is free, which genuinely changes the
          math on a multi-day Open trip versus buying single rides each time.
        </p>
        <FactRow label="Fastest route" value="7 train to Mets-Willets Point (10-min walk to the gates)" />
      </div>

      {sevenTrain && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={sevenTrain} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Taxi / rideshare</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A taxi or Uber is genuinely slower than the 7 train during peak session hours — the roads around Flushing
          Meadows see real congestion in the hour either side of gates opening and closing. Worth it late after a
          night session when trains run less frequently, or if you&apos;re traveling with young children or heavy
          bags — otherwise the subway is the better call.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Driving &amp; parking</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          On-site parking exists but is limited and genuinely expensive during the tournament, with real congestion
          on the Grand Central Parkway around session start and end times. If you do drive, book parking in advance
          through the official US Open site rather than expecting to find something on arrival.
        </p>
      </div>

      {destinationBand?.localTravelNote && (
        <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting around, cheaply</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.localTravelNote}</p>
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-sm font-bold text-white mb-2">The apps worth having on your phone</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The <strong className="text-white">MYmta</strong> app for real-time subway arrivals and service alerts —
          genuinely useful on a day with a planned service change. <strong className="text-white">Uber</strong> or{" "}
          <strong className="text-white">Lyft</strong> both operate normally for the rideshare option above, with no
          tourist-eligibility restriction on either.
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
