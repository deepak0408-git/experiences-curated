import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

// Real climate figures sourced during experience research, corroborated
// across multiple independent sources (weatherspark.com, climate-data.org,
// travelchinaguide.com, climatestotravel.com), 23 Sep 2026. AccuWeather link
// confirmed via direct search result, not guessed, per skill standing rule.
export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const weatherGuide = linkedExperiences.find((e) => e.slug.includes("chinese-gp-weather-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Chinese Grand Prix"
      status="public"
      h1="Mild spring temperatures, real rain risk on 10-12 days across the month"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Mid-April in Shanghai sits in a genuine transitional window — past the cold, damp winter but not yet into
        the city&apos;s hot, humid summer. Average temperatures for the month run around 16-17°C, typically climbing
        from the high-teens at the start of April toward the low-20s by month&apos;s end, with daytime highs
        regularly reaching 20°C or warmer.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">Average temperature</p>
          <p className="text-lg font-black text-white">16-17°C</p>
          <p className="text-xs text-[#6A6A6A] mt-1">Climbing through the month</p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">Rainy days</p>
          <p className="text-lg font-black text-white">10-12 days</p>
          <p className="text-xs text-[#6A6A6A] mt-1">~90mm total, mostly light and short</p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">Humidity</p>
          <p className="text-lg font-black text-white">~75%</p>
          <p className="text-xs text-[#6A6A6A] mt-1">Can make mild temps feel heavier</p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The rain detail worth planning around</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          More days than not are dry, but a genuinely wet session is a real possibility across a three-day weekend,
          not a remote one. The rain that does fall tends to be light and short rather than a dramatic downpour, but
          it&apos;s frequent enough that packing for it isn&apos;t optional. Cloud cover is common too — the sky is
          overcast or mostly cloudy more than half the time this month.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Pack for where you're actually sitting</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Grandstand A, H, and K are covered structures, which helps if the forecast turns wet on the days
          you&apos;re seated there. Grandstand B and Grandstand E are both uncovered, and general admission areas
          offer no reliable shelter at all — pack accordingly based on where you&apos;re actually watching from, not
          just the citywide forecast.
        </p>
      </div>

      {weatherGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={weatherGuide} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the live forecast</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          April&apos;s mix of dry and rainy days genuinely varies year to year — a real forecast beats a historical
          average once you&apos;re close enough to the date for one to exist.
        </p>
        <a
          href="https://www.accuweather.com/en/cn/shanghai/106577/10-day-weather-forecast/106577"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Shanghai 10-day forecast on AccuWeather →
        </a>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually pack</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          A light, packable rain layer rather than a full umbrella — the circuit&apos;s own rules for visitors
          specifically ban long-handled or pointed umbrellas at entry, and rain here tends to be light and short
          rather than a dramatic downpour, so a compact layer covers it without the risk of being turned away at
          the gate. Layer for a mild but genuinely variable temperature range across the weekend, and check the
          live AccuWeather forecast in the week before your trip rather than relying on this seasonal guide alone.
        </p>
      </div>
    </SpokeShell>
  );
}
