import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { linkedExperiences, event } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const circuitHistory = linkedExperiences.find((e) => e.slug.includes("sepang-circuit-history"));
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const month = new Date(event.startDate).toLocaleDateString("en-GB", { month: "long" });

  return (
    <SpokeShell eventSlug={eventSlug} eventId={event.id} eventCurrency={event.packCurrency} spokeId={SPOKE_ID} justPurchased={justPurchased} eventName="Bahrain Grand Prix" status="public" h1={`Sepang weather in ${month} — what to pack`} question="What's the weather like at Sepang, and what should I pack?" heroImageUrl={heroImageUrl} isUnlocked={isUnlocked}>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Sepang in October sits deep in Malaysia&apos;s wet season, and it&apos;s worth planning around that honestly
        rather than hoping for a dry weekend. Expect highs around 30°C and lows around 25°C — consistently hot and
        humid regardless of rain — with roughly a 70% chance of rain on any given day and an average of 27 rainy days
        across the month. Mornings are more often dry than afternoons, so an early gate arrival isn&apos;t just about
        sightlines, it&apos;s your best shot at a dry first session too.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">This isn&apos;t hypothetical</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang&apos;s rain doesn&apos;t build gradually the way it does in cooler climates. In 2009, a clear
          afternoon turned into a monsoon so heavy the race was red-flagged after 31 of 56 laps, with Jenson Button
          eventually declared winner from pole. It&apos;s still one of the sport&apos;s defining wet-weather races —
          and a genuine preview of how fast conditions here can change.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to actually pack</p>
      <div className="flex flex-col gap-2 mb-8">
        <PackRow label="Rain gear" value="A proper rain jacket, not just an umbrella — Sepang's downpours come with wind, and a stand-mounted canopy (Hill Stand) covers only part of the seating." />
        <PackRow label="Sun protection" value="Sunscreen and a hat for the mornings — the same humidity that builds into afternoon rain starts the day genuinely strong and direct." />
        <PackRow label="Light, breathable clothing" value="Heat and humidity are constant regardless of rain — think tropical trip, not just race-day gear." />
        <PackRow label="A dry bag or sealed pouch" value="For phones and electronics — useful at any open-air stand, essential at general admission areas like the Hill Stand." />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which stand handles rain best</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Main Grandstand, K1, and Grandstand F are all fully covered — a real practical reason to weight your
        seat choice around weather, not just sightlines, given how likely an afternoon shower actually is across a
        three-day weekend. The Hill Stand (C2) has a canopy running along part of the embankment, but it&apos;s
        partial cover, not full — know where the covered ground is before the session starts, not after the sky
        turns, and bring your own umbrella as backup.
      </p>

      {circuitHistory?.insiderTips?.[1] && (
        <p className="text-sm text-[#A3A3A3] leading-7 mb-8">{circuitHistory.insiderTips[1]}</p>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check closer to your trip</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are October climate averages, not a forecast — for the real conditions on your actual
          travel dates, check a live 10-day forecast once you&apos;re within range of race weekend.
        </p>
        <a
          href="https://weather.com/weather/tenday/l/3bfc386d344b6066ffe6a4fabefe0f2b0975dedc3822e8d7a75092a54cb48ac2"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
        >
          Sepang 10-day forecast on weather.com →
        </a>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: wanderlog.com and holiday-weather.com (October climate averages for Sepang), BBC Sport/ESPN Africa
        and Wikipedia (2009 red-flagged race).
      </p>
    </SpokeShell>
  );
}

function PackRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
