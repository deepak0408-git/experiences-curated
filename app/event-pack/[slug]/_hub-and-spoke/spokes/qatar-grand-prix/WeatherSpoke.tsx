import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

// Real, sourced seasonal figures for Doha in late November (multiple
// aggregators cross-checked, 13 Sep 2026): daytime highs 79-93°F/26-31°C,
// overnight lows 60-73°F/18-22°C, ~9 hours of sunshine, negligible rainfall
// (avg 3mm, usually no rain days). Qatar races entirely at night, which
// matters more here than almost anywhere else on the calendar — the
// daytime heat visitors worry about isn't the real story.
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
      eventName="Qatar Grand Prix"
      status="public"
      h1="Race weekend runs after dark — the desert heat most visitors worry about isn't actually the issue"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Late November in Doha is genuinely mild by Qatar&apos;s own standards — this isn&apos;t the punishing summer
        heat the country is known for. And because every session runs at night, the daytime numbers below matter
        less than what happens after the sun goes down.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <FactCard label="Daytime high" value="79-93°F (26-31°C)" />
        <FactCard label="Overnight low" value="60-73°F (18-22°C)" />
        <FactCard label="Sunshine" value="~9 hours a day" />
        <FactCard label="Rainfall" value="~3mm average — usually no rain days at all" />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Pack a layer for after dark</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Temperatures cool as the month goes on — by late November, overnight lows can dip into the high teens
          Celsius. On Lusail Hill or in an uncovered grandstand, that&apos;s genuinely cool once the sun&apos;s been
          down for a few hours, especially into the small hours after a late finish. A light jacket or hoodie matters
          more here than sunscreen once the race itself starts.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast closer to race week</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are seasonal averages, not a forecast for this specific race weekend. Check the real
          10-day outlook once you&apos;re within range of the trip.
        </p>
        <a
          href="https://www.accuweather.com/en/qa/doha/271669/10-day-weather-forecast/271669"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — Doha 10-day forecast →
        </a>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually pack</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Light layers you can add and remove through the evening — a t-shirt is genuinely fine for the early
            support races, but a packable jacket earns its space in your bag once the main event and post-race
            concert run into the cooler small hours. Sunscreen still matters for the daytime hours around the
            circuit and any museum or souq visits, just not for the race itself.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">{label}</p>
      <p className="text-sm text-white font-bold">{value}</p>
    </div>
  );
}
