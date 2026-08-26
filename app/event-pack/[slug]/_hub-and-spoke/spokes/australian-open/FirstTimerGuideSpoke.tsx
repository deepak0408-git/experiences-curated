import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Essential mobile apps live here per hub-and-spoke skill §2g — PTV/myki for
// transit, plus the AO app itself for order of play. The Grand Slam Oval
// Party experience also lives here (AO Live's festival culture is exactly
// the kind of "what makes this different" orientation a first-timer needs),
// per the founder-agreed spoke mapping.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const etiquetteGuide = linkedExperiences.find((e) => e.slug.includes("first-timers-guide-etiquette-crowd-culture"));
  const aoLive = linkedExperiences.find((e) => e.slug.includes("grand-slam-oval-party-live-music"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="public"
      h1="The Happy Slam is genuinely more relaxed — day vs. night is the real decision"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        If you know nothing else about the Australian Open before you go: it markets itself as the &quot;Happy
        Slam&quot; for a real reason, not just a slogan. The crowds are louder and more willing to get behind an
        underdog than at most Grand Slams, there&apos;s a genuine live-music program running alongside the tennis,
        and the whole event reads more like a summer festival than a formal tournament.
      </p>

      {etiquetteGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={etiquetteGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Day session vs. night session</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">Day session</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Runs late morning through early evening, across every court. More matches, more players to see, real
            heat exposure — pack accordingly (see the{" "}
            <a href={`/event-pack/${eventSlug}/weather`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Weather guide
            </a>
            ).
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">Night session</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Rod Laver Arena or Margaret Court Arena, from around 7pm — cooler, and often the tournament&apos;s most
            atmospheric session. Real risk of a very late finish — see the{" "}
            <a href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Trip Schedule
            </a>{" "}
            for the real history of AO late finishes.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gates open ahead of the first match</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          For day sessions, gates have most recently opened at 9:45am ahead of an 11am start — worth being through
          security with time to walk to your first court, not just arriving as play begins. For night sessions,
          gates have opened at 4:45pm ahead of the roughly 7pm start, so there&apos;s a real window to grab food and
          find your seat before the marquee match. These are the most recently confirmed times, not a locked-in
          2027 schedule — exact gate times are published by Tennis Australia closer to the tournament each year.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Mistakes most first-timers make</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Buying a single reserved seat for their whole trip and never using a Ground Pass — the outside courts on a
          Ground Pass day are where you actually get close to players, and skipping that entirely for one arena
          session misses most of what makes a first visit worth it. Underestimating the heat and treating sun
          protection as optional — see the{" "}
          <a href={`/event-pack/${eventSlug}/weather`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Weather guide
          </a>{" "}
          for why that&apos;s a real logistics problem here, not just comfort. Not checking which arena a match is
          actually in before planning a day around it — a Rod Laver reserved seat doesn&apos;t cover Margaret Court
          Arena, and assuming otherwise is one of the most common ticketing mix-ups. Booking a night session
          expecting an early finish — see the{" "}
          <a href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Trip Schedule
          </a>{" "}
          before planning an early flight or a tight morning the next day. And skipping the AO Live program
          entirely because it sounds like a distraction from the tennis — it&apos;s included with your ticket and
          genuinely part of what makes this tournament different from the other three majors.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">PTV / myki</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The official Victorian public transport app — journey planning, and the myki top-up you&apos;ll need
            for anything beyond the free match-day tram. See the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </a>
            .
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">The official AO app</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Live order of play, match scores, and grounds maps — genuinely useful for deciding which outside court
            to head to next on a Ground Pass day.
          </p>
        </div>
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The AO Live program is a real part of what makes this tournament different from the other three majors —
        stages across Grand Slam Oval and Garden Square run throughout the day, included with any ground pass or
        higher ticket, alongside separately-ticketed headline shows at John Cain Arena.
      </p>
      {aoLive && (
        <div className="mb-8">
          <SpokeExperienceCard experience={aoLive} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What to bring, what to leave behind</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Outside food and non-alcoholic drink is generally allowed in reasonable quantities — a real difference
          from many stadium sports. Check ausopen.com&apos;s current prohibited items list before you go, since
          bag-size and specific item rules are set and updated by the tournament each year.
        </p>
      </div>

    </SpokeShell>
  );
}
