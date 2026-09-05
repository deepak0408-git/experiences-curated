import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingToCota = linkedExperiences.find((e) => e.slug.includes("us-gp-getting-to-cota"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="United States Grand Prix"
      status="public"
      h1="15 miles from downtown, and the exit is the part nobody warns you about"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Circuit of the Americas sits about 15 miles (24km) southeast of downtown Austin and roughly 12 miles from
        Austin-Bergstrom International Airport (AUS) — genuinely close on paper, and genuinely slow in practice
        once race weekend traffic sets in.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">From the airport</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          15-20 minutes in normal traffic — treat that as a floor, not an estimate, during the event itself.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Distance to circuit" value="~12 miles, 15-20 min in normal traffic" />
          <FactRow label="Rideshare (normal)" value="~$25-40" />
          <FactRow label="Taxi (normal)" value="~$45-50" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The official shuttle</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The most reliable way in and out, running continuously from two pickup points — Downtown at Waterloo
          Park and the Travis County Expo Center — about 30 minutes with no traffic, well over an hour on race day
          itself. It&apos;s popular enough that seats sell out before race day, so book this in advance rather than
          deciding the morning of.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Rideshare on race day</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          COTA Blvd is restricted to permitted vehicles during the event, so Uber and Lyft pickup and drop-off
          happens from the McAngus lot — a genuine 20-30 minute walk from the main gates, not a curbside drop at
          the entrance. Post-race waits of 2-3 hours are standard, with surge pricing commonly hitting $150-300+
          back to downtown.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Pickup point" value="McAngus lot — 20-30 min walk from gates" />
          <FactRow label="Post-race surge" value="Commonly $150-300+, 2-3 hr wait" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The single best exit tactic</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The worst congestion window runs roughly 1-2 hours after the chequered flag. Leaving your seat about 30
          minutes before the race actually ends, or deliberately staying on-site for 45 minutes after the crowd
          starts moving — food, fan shop, no rush — both beat the bulk of that window. Racing to be first out the
          gate is, by every account, the worst possible strategy.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Uber or Lyft</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both operate widely across Austin — genuinely useful for airport transfers and getting around the
              city, though remember the McAngus lot pickup point applies to both on race day.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Official F1 USA / COTA app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Your ticket lives here for most grandstand tiers, and it&apos;s the fastest way to find food and
              beverage stalls across a circuit large enough that wandering to find something specific wastes real
              time. Install it before you travel.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">CapMetro</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Austin&apos;s own transit app — useful for getting around downtown and South Congress even though it
              doesn&apos;t reach the circuit itself.
            </p>
          </div>
        </div>
      </div>

      {gettingToCota && (
        <div className="mb-8">
          <SpokeExperienceCard experience={gettingToCota} isPro={isPro} />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: grandprixpal.com.
      </p>
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
