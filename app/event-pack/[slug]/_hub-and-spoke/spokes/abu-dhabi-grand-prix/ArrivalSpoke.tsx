import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingAround = linkedExperiences.find((e) => e.slug.includes("getting-around-yas-island-race-day"));
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
      h1="Free shuttles cover the island — traffic peaks around the race and the concerts"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Exact 2026 gate-opening times haven&apos;t been published yet — expect roughly 2-3 hours before each day&apos;s
        first session, based on the confirmed session schedule. What&apos;s already reliable is the traffic and
        shuttle pattern: this is a genuinely high-traffic weekend, and knowing exactly when it peaks matters more
        than a blanket arrival rule.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Two free shuttle systems</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Circuit Circular Shuttle runs continuously between all major grandstand entrances. The Yas Courtesy
          Shuttle covers other key points across the island — hotels, the mall, the theme parks. Both are free with
          any event ticket, no separate booking needed.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">When traffic actually peaks</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The heaviest congestion, both on the roads and on the shuttle network, hits in the hour before the race
          start and immediately after each night&apos;s headline concert — not evenly throughout the day. A shuttle
          that&apos;s readily available at 2pm can have a real queue by 5:30pm on race day. If you&apos;re staying
          on Yas Island itself at a genuinely walkable hotel (Crowne Plaza or the W), walking to your grandstand
          during these peak windows is often faster than waiting for a shuttle.
        </p>
      </div>

      {gettingAround && (
        <div className="mb-8">
          <SpokeExperienceCard experience={gettingAround} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest gap here</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Abu Dhabi hasn&apos;t published exact 2026 gate-opening times yet, and we won&apos;t invent a specific
          hour. What&apos;s reliable is the traffic pattern above — build your arrival around avoiding the two real
          peak windows (pre-race, post-concert), not just the session schedule. Confirm exact gate times via
          abudhabi.gp closer to race week.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            For race day specifically — the single heaviest-traffic day of the weekend — arrive several hours
            before lights-out rather than just before, both if you&apos;re driving in from off-island and if
            you&apos;re relying on the shuttle network. If commuting from off-island (Downtown Abu Dhabi or Dubai),
            leave real buffer time beyond what worked on Friday or Saturday — race-day congestion around Yas
            Island&apos;s approach roads is meaningfully heavier than any practice or qualifying day.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
