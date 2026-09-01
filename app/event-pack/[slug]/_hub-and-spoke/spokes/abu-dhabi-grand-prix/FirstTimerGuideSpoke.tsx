import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const orientation = linkedExperiences.find((e) => e.slug.includes("first-timer-orientation-abu-dhabi"));
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
      h1="Why the season finale feels different from any mid-season round"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Abu Dhabi is F1&apos;s season finale, and that changes the texture of the weekend before a single car turns
        a wheel. Since Yas Marina opened in 2009 as the first-ever F1 twilight race — daylight start, floodlit
        finish, powered by roughly 4,700 light fixtures and a 600-million-lumen lighting plan built in under 300
        days — it&apos;s carried a genuine &quot;closing chapter&quot; atmosphere no other round on the calendar
        quite replicates. Titles have been decided here, and the crowd knows it.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The weekend, at a glance</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Thursday to Sunday</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both qualifying and the race run at 16:00 local time, building through the afternoon into the
              twilight-to-night transition.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Every ticket includes the concerts</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The Yasalam after-race concerts run each night of the weekend, and every ticket tier — grandstand or
              General Admission — includes access. This is genuinely bundled, not a separate purchase.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Dress code is relaxed</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Comfortable, breathable clothing suited to the heat is the norm across every ticket tier, hospitality
              included — this is a practical outdoor event, not a formal occasion.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for your first trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Abu Dhabi GP Tickets app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Your ticket is digital-only — install this before you travel, not on arrival.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Careem or Uber</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both operate widely and are typically the most reliable way to move around Yas Island and between
              Abu Dhabi and Dubai outside of race-day shuttle windows.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">F1 official app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Live timing and session schedules, genuinely useful if you're moving between sessions and fan zones
              across a large venue.
            </p>
          </div>
        </div>
      </div>

      {orientation && (
        <div className="mb-8">
          <SpokeExperienceCard experience={orientation} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The genuine first-timer trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Don&apos;t underestimate how large Yas Island is as a physical space. Between your entry gate, your seat,
          food and drink, and the concert stage, you can walk significant distances across a single day — factor
          this into footwear and timing, especially if you&apos;re planning to catch both the race and the full
          concert on the same evening.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Plan your evening around catching the headline concert act specifically — most first-timers don&apos;t
            realize until they&apos;re already there that it&apos;s bundled into every ticket tier, and it&apos;s a
            genuine part of the Abu Dhabi identity, not an optional add-on. If you&apos;re also chasing the full
            race-day experience, build in real walking-time buffers between your seat, amenities, and the concert
            stage rather than a tight back-to-back schedule — a rushed transition is the single most common way
            first-timers miss part of the show.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
