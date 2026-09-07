import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const packingGuide = linkedExperiences.find((e) => e.slug.includes("mexico-city-weather-packing-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Mexico City Grand Prix"
      status="public"
      h1="Warm days, cold nights, real rain risk — and an altitude that changes how the sun hits you"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Mexico City sits at roughly 2,240 meters above sea level — higher than Denver, the &quot;Mile-High
        City.&quot; Race weekend falls at the October-November boundary, and the daily temperature swing is the
        thing most first-time visitors underestimate: daytime highs typically run 18-22°C, genuinely pleasant, but
        nights and early mornings drop to 8-12°C — cold enough that a T-shirt alone leaves you cold in an early
        grandstand queue.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast before you pack</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Race weekend is close enough now that a specific forecast is more useful than any seasonal average.
        </p>
        <a
          href="https://www.accuweather.com/en/mx/mexico-city/242560/10-day-weather-forecast/242560"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — Mexico City 10-day forecast →
        </a>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack — by category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <PackCard label="Daytime layers" detail="Short sleeves or a light long-sleeve shirt for the mild daytime highs (18-22°C) — comfortable, not hot." />
        <PackCard label="Evening layer" detail="A real jacket or sweater for early grandstand arrivals and evening hours — the drop to 8-12°C is a genuine cold, not a mild cooling." />
        <PackCard label="Sun protection" detail="Sunscreen and a hat — the altitude means UV exposure is meaningfully stronger than the air temperature suggests, especially in an uncovered grandstand." />
        <PackCard label="Rain gear" detail="A compact umbrella or light rain jacket — October still sees real afternoon showers, arriving as short but sometimes heavy bursts." />
      </div>

      {packingGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={packingGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest weather takeaway</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Packing for &quot;warm&quot; alone or &quot;cool&quot; alone both fail here — the honest advice is to pack
          for a wider daily range than the average temperature implies, because the average is exactly what you
          won&apos;t experience at any single point in the day. Layer rather than commit to one outfit.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually bring</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            A genuinely packable jacket beats a heavier coat — the evening drop is real but not extreme (8-12°C, not
            freezing), so over-packing for cold wastes bag space you&apos;ll want for the day&apos;s warmer hours.
            If you feel unusually tired or short of breath in your first day or two, that&apos;s normal altitude
            adjustment, not a sign something&apos;s wrong — pace your first day&apos;s walking and hydrate more than
            usual rather than pushing through at your normal-elevation pace.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">Sources: AccuWeather, Weather-and-Climate.com, Volaris Blog.</p>
    </SpokeShell>
  );
}

function PackCard({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
