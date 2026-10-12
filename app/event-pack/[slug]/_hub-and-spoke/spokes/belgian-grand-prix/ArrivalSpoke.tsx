import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Real content sourced from the seeded Fan Zone at Raidillon and Camping at
// the Circuit experiences, 12 Oct 2026. Gate times and bag-policy facts
// drawn from the event row's own preTripBriefLines where available;
// remaining facts kept general rather than invented where no Spa-specific
// source exists for them.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const fanZone = linkedExperiences.find((e) => e.slug.includes("fan-zone-raidillon-"));
  const camping = linkedExperiences.find((e) => e.slug.includes("camping-at-the-circuit-belgian-gp-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Belgian Grand Prix"
      status="public"
      h1="Gates open early, and the Fan Zone at Raidillon is worth building real time around"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa&apos;s scale means arrival logistics matter more here than at a compact circuit — knowing where
        you&apos;re headed and what you can bring before you set off saves real time on a crowded race morning.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gates and general bag policy</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Circuit gates open from around 06:00 on each race day — early enough that building your morning around
          this time, rather than a more leisurely breakfast-first schedule, genuinely matters if a specific
          fence-side position is the goal. Check the official Formula 1 app for confirmed daily timings, since
          these can shift session to session.
        </p>
      </div>

      {fanZone && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={fanZone} isPro={isPro} />
        </div>
      )}

      {camping && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={camping} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Arrive early for a fence-side spot</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          On race Sunday, popular General Admission positions like the Kemmel Straight bank fill by around 09:30 —
          genuinely early for a race that doesn&apos;t start until mid-afternoon. If a specific fence-side view
          matters to you, plan your morning around that cutoff, not a more relaxed start.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Build your race-morning schedule around the 09:30 fence-side cutoff if you&apos;re on General
          Admission, and check the official app the evening before for any gate-time or schedule changes. If
          you&apos;re camping on-site, you skip the worst of the arrival crush entirely — a genuine advantage on
          race morning specifically.
        </p>
      </div>
    </SpokeShell>
  );
}
