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
      h1="5 mistakes first-time visitors make at Abu Dhabi"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Abu Dhabi is F1&apos;s season finale, and that changes the texture of the weekend before a single car turns
        a wheel. Since Yas Marina opened in 2009 as the first-ever F1 twilight race — daylight start, floodlit
        finish, powered by roughly 4,700 light fixtures and a 600-million-lumen lighting plan built in under 300
        days — it&apos;s carried a genuine &quot;closing chapter&quot; atmosphere no other round on the calendar
        quite replicates. Titles have been decided here, and the crowd knows it. Here&apos;s what genuinely trips up
        a first-time visitor, drawn from the real detail in this pack rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — treating it like a mid-season round</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Qualifying starts at 18:00 and the race at 17:00 local time, both building through the last part of the
          afternoon into the twilight-to-night transition — and every ticket tier, grandstand or General Admission,
          includes access to the nightly Yasalam after-race concerts. This is genuinely bundled, not a separate
          purchase, and it changes what the day is actually for: a full race day here runs from an afternoon
          session through to a late-night headline set under the same lights, not a few hours at the track and
          home for dinner.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — defaulting to AUH without checking DXB</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          AUH is 8km from Yas Marina Circuit, genuinely the world&apos;s closest international airport to any F1
          venue — but for a lot of long-haul origins, DXB carries better fares and more direct routes, at the cost
          of a roughly 75-minute drive via the E11 instead of a 15-minute one. Booking AUH automatically because
          it&apos;s closer, without checking DXB fares first, is a real and common way to overpay on the single
          biggest line item of the trip.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — underestimating Yas Island&apos;s size</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Between your entry gate, your seat, food and drink, and the concert stage, you can walk significant
          distances across a single day — this isn&apos;t a compact street circuit. Factor this into footwear and
          timing, especially if you&apos;re planning to catch both the race and the full headline concert set on
          the same evening; a tight back-to-back schedule with no walking buffer is the single most common way
          first-timers miss part of the show.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — packing for one temperature</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          &quot;Twilight race&quot; doesn&apos;t mean cool — it means two genuinely different conditions in the same
          seat, in the same day. Race weekend runs warm and dry, around 26°C by day easing to 25°C on race day, with
          a real but moderate cooling after sunset. Packing only for heat means an uncomfortable evening; packing
          only for cold means carrying dead weight through the hottest part of the afternoon. Layer for both, and
          don&apos;t skip sun protection just because the day ends under floodlights.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — not planning around race-day traffic peaks</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The heaviest congestion, both on the roads and on the free shuttle network, hits in the hour before the
          race start and immediately after each night&apos;s headline concert — not evenly across the day. A
          shuttle that&apos;s readily available at 2pm can have a real queue by 5:30pm on race day. Arrive well
          ahead of your session on race day specifically, and build real slack into any same-day departure after
          the closing concerts.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The weekend, at a glance</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Thursday to Sunday</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Qualifying starts at 18:00 and the race at 17:00 local time, both building through the afternoon
              into the twilight-to-night transition.
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

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: yasmarinacircuit.com and Formula1.com (twilight race format, lighting installation, session
        schedule, Yasalam concert bundling), AccuWeather (Yas Marina Circuit climate averages).
      </p>
    </SpokeShell>
  );
}
