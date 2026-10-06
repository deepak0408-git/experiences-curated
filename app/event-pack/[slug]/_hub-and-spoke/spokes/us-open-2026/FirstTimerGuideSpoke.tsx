import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real sourced facts: no formal dress code (contrast with Wimbledon),
// deliberately loud between-point music culture (CNN, ESPN coverage),
// real enforced rules (bag policy, umbrella-in-play ban). Researched
// fresh for this migration using French Open's First-Timer's Guide as
// the structural template but with US Open-specific content throughout.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const firstTimerExp = linkedExperiences.find((e) => e.slug.includes("us-open-first-timer-guide"));
  const whenPlayStops = linkedExperiences.find((e) => e.slug.includes("when-play-stops-us-open"));

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
      h1="No dress code, no silence — the least formal Grand Slam"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The US Open doesn&apos;t ask you to behave like you&apos;re at Wimbledon, and that&apos;s deliberate, not an
        oversight. Knowing what makes this Slam different before you arrive changes the whole trip from &quot;am I
        allowed to do this&quot; to &quot;oh, this is the point.&quot;
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What makes this tournament different</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">There&apos;s no formal spectator dress code</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The tournament&apos;s own guidance is closer to &quot;dress up if you want to&quot; — shirts and shoes
            stay on, nothing offensive gets worn, and everything from tennis-core polish to shorts and a t-shirt
            reads as fine.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Music plays between points, on purpose</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Most Grand Slams expect real quiet during points, with stewards actively enforcing it. The US Open runs
            the opposite philosophy — between-point music and a loud, active crowd are the intended experience,
            especially on Ashe at night, not a breach of etiquette.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Real rules still exist, and still get enforced</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Bags capped at 12&quot;x12&quot;x16&quot;, backpacks barred, umbrellas can&apos;t be held open during
            play. Moving around the stands or extended filming during a point has led to real match stoppages —
            the looseness has a ceiling even on the loudest Slam.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Mistakes most first-timers make</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Showing up without checking the Schedule of Play and missing a specific player&apos;s practice session —
          see the{" "}
          <a href={`/event-pack/${eventSlug}/arrival`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Arrival Guide
          </a>{" "}
          for the real timing. Treating the grounds as a one-stadium visit and skipping the outer courts, where some
          of the closest, best-value tennis actually happens. Wearing shoes that aren&apos;t built for a full day of
          walking real distances between courts. And underestimating New York&apos;s late-summer humidity — see the
          Weather guide for the real numbers.
        </p>
      </div>

      {firstTimerExp && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={firstTimerExp} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What happens when play stops</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Rain, heat, and darkness all genuinely affect the schedule across a two-week Slam — worth knowing the real
        rules before a delay catches you off guard.
      </p>
      <div className="mb-8">
        {whenPlayStops && <SpokeExperienceCard eventSlug={eventSlug} experience={whenPlayStops} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">The official US Open app</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Schedule of Play, live scores, IBM SlamTracker, and grounds navigation — genuinely the single most
            useful free tool for planning each day on-site.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">MYmta</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Real-time subway arrivals and service alerts for the 7 train — matters on a day with a planned service
            change.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Uber</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The real fallback once a night session lets out and the 7 train gets packed — Flushing Meadows gets a
            surge of demand at the same few minutes every night, so request early rather than waiting for the crowd
            to thin.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A few things worth knowing upfront</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The US Open deliberately plays music between points and tolerates a louder crowd than any other Grand Slam
          — join in rather than holding back. A Grounds Admission pass is a genuinely great first-timer day, not a
          consolation prize. And the city around the tournament is half the reason to make this trip, not a
          distraction from it.
        </p>
      </div>
    </SpokeShell>
  );
}
