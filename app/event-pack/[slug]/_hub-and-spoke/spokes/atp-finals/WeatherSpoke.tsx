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
      eventName="Nitto ATP Finals"
      status="public"
      h1="Turin in November — cold, wet, and worth packing for properly"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        November is genuinely Turin's wettest month, and by the time the tournament runs (15-22 Nov), the city is
        deep into its cold, dark, damp late-autumn stretch. This isn't marginal weather to shrug off — plan for it
        properly.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to expect</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-2">
          <FactRow label="Daytime high" value="Around 12°C early in the month, cooling toward 8°C by month's end" />
          <FactRow label="Nighttime low" value="Roughly 2-5°C — sources vary, but genuinely cold after dark either way" />
          <FactRow label="Rainfall" value="Averaging 139mm across the month, roughly 11 days of rain" />
          <FactRow label="Daylight" value="Only ~3.5 hours of sunshine per day on average — November is the darkest stretch of Turin's year" />
          <FactRow label="Humidity" value="Around 80% average relative humidity" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A genuine waterproof layer, not just a light jacket — with 11 rainy days average across the month, you'll
          likely hit at least one during your trip. Layer for the temperature swing between daytime highs and
          overnight lows. Comfortable, weatherproof footwear matters more here than in most tennis-trip destinations,
          since you're walking Turin's historic centre and connecting via tram, not staying in air-conditioned
          comfort throughout.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Indoors either way</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Inalpi Arena itself is fully indoors — unlike an outdoor Grand Slam, weather doesn't affect the tennis
          itself. It's your time in the city between sessions where the forecast actually matters.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check closer to your trip</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are November climate averages, not a forecast — for the real conditions on your actual
          travel dates, check a live 10-day forecast once you&apos;re within range of the tournament.
        </p>
        <a
          href="https://weather.com/it/piedmont/city/turin/tenday"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
        >
          Turin 10-day forecast on weather.com →
        </a>
      </div>

      <p className="text-xs text-[#6A6A6A]">
        Sources: weather-and-climate.com and weather-atlas.com (November climate averages for Turin).
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
