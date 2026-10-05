import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

// Real seasonal averages (currentresults.com, freetoursbyfoot.com) and the
// genuinely distinctive Ashe-vs-Armstrong roof-sealing fact (ESPN's
// Hurricane Ida 2021 coverage) — researched fresh for this migration, not
// ported from the classic pack, which had no dedicated weather content.
export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const weatherExp = linkedExperiences.find((e) => e.slug.includes("us-open-weather-packing"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="public"
      h1="Low 80s and real humidity, with one stadium's roof more rain-proof than the other"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The US Open runs through the tail end of a New York summer — hot and humid rather than genuinely dangerous,
        but the humidity is the part most visitors underestimate. Late August afternoon highs typically sit in the
        low-to-mid 80s°F, cooling to upper 70s by early September, with overnight lows in the mid-to-upper 60s.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Typical conditions</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Day high" value="Low-to-mid 80s°F (upper 70s by early Sep)" />
        <FactRow label="Overnight low" value="Mid-to-upper 60s°F" />
        <FactRow label="Rain" value="Afternoon thunderstorms a real, recurring feature of a NY late summer" />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The roof gap — Ashe vs. Armstrong</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Arthur Ashe and Louis Armstrong Stadiums both have retractable roofs, but they are not equally weatherproof.
          Armstrong&apos;s roof, added in 2018, is naturally ventilated by design, with intentional gaps left for
          air circulation — functional for cooling, but it means rain can genuinely blow in sideways during a hard
          storm, which happened during Hurricane Ida&apos;s remnants in 2021 and forced a match to relocate to Ashe
          mid-way through. Ashe&apos;s roof seals more completely. The outer courts have no roof at all, so real rain
          stops play there outright until it clears.
        </p>
      </div>

      {weatherExp && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={weatherExp} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Clothing</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Breathable, lightweight layers for the humidity. A cap or sun hat for outer-court days with little
            shade. Comfortable, broken-in walking shoes — the grounds cover real distance, and a night session runs
            noticeably cooler than the day.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Wet weather</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A compact umbrella — closed during play, since the US Open&apos;s guest code prohibits holding one open
            during a point. A light rain jacket for an outer-court day with no roof overhead.
          </p>
        </div>
        <div className="sm:col-span-2 rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">On the grounds — what&apos;s allowed</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Bags are capped at 12&quot;W x 12&quot;H x 16&quot;L, one per guest, with backpacks barred (very limited
            exceptions). Metal or plastic water bottles up to 24oz are the one real exception — bring one rather
            than buying water repeatedly across a long, humid day.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are seasonal norms, not a forecast — check a live forecast once you&apos;re within range
          of your travel dates.
        </p>
        <a
          href="https://www.accuweather.com/en/us/flushing/11354/weather-forecast/2622414"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather forecast for Flushing →
        </a>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Weather.com, ESPN (Armstrong roof/Hurricane Ida), currentresults.com (NY climate normals).
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <span className="text-sm font-bold text-white shrink-0">{label}</span>
      <span className="text-sm text-[#A3A3A3] font-mono sm:text-right">{value}</span>
    </div>
  );
}
