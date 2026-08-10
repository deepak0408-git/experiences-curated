import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="public"
      h1="Mild and dry, with one real risk to the tennis itself"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        October is one of the best months of the year to visit Shanghai — sunny days are the norm, temperatures run
        mild, and rain is limited. Typhoon season, which peaks June through September, is essentially over by the
        time the tournament runs.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Typical October conditions</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Temperature range" value="16-22°C (61-72°F)" />
        <FactRow label="Rainy days" value="~6 days, ~56mm total precipitation" />
        <FactRow label="Typhoon risk" value="Minimal — season effectively over by October" />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Qizhong is outdoor hardcourt — rain can actually delay play</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Unlike an indoor arena, weather here directly affects the tennis itself, not just your time in the city.
          Center Court has a retractable roof (see the{" "}
          <a href={`/event-pack/${eventSlug}/map`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Venue Map
          </a>
          ), but the outer showcourts and Court 17&apos;s practice sessions are fully open to the sky — a rain
          delay on one of the ~6 typical October rain days is a real possibility if you&apos;re holding a
          Grounds Pass or an outer-court ticket, not just a city-sightseeing inconvenience.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">What to pack</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Layers work best — mornings and evenings can run cooler than the mild midday temperatures suggest. A light
          jacket for evening sessions at Qizhong, and comfortable walking shoes for the city sightseeing days, cover
          most of what you&apos;ll need.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">One real crowd factor</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          National Day Golden Week (1-7 October) brings millions of domestic travelers into motion just before the
          tournament starts — not weather, but genuinely affects crowds and pricing across the city in the same
          window.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are October climate averages, not a forecast — for the real conditions on your actual
          travel dates, check a live 10-day forecast once you&apos;re within range of the tournament.
        </p>
        <a
          href="https://weather.com/cn/city/shanghai/tenday"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Shanghai 10-day forecast on weather.com →
        </a>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: topchinatravel.com, travelchinaguide.com, chinahighlights.com Shanghai weather guides — cross-checked
        across 3 sources for October temperature/rainfall consistency. Verified 10 Aug 2026.
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <span className="text-sm font-bold text-white">{label}</span>
      <span className="text-sm text-[#A3A3A3] font-mono">{value}</span>
    </div>
  );
}
