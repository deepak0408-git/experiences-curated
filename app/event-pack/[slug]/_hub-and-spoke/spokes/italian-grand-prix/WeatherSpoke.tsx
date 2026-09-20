import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

// No dedicated Weather & What to Pack experience exists among Italian GP's
// 20 seeded experiences (unlike Brazilian GP's sibling spoke, which had one)
// — this spoke has no linked SpokeExperienceCard, an honest gap rather than
// inventing a source experience. September climate figures (Milan/Monza,
// early September averages) are general public-record seasonal data, not
// specific enough to need a per-experience citation the way pricing or venue
// facts do; consistent with how sibling events without a dedicated packing
// experience handle this spoke. Umbrella note sourced directly from the
// seeded Arrival & Queue Guide experience's practicalInfo/body content
// (umbrellas without a metal tip allowed — an exception worth flagging
// since most F1 circuits ban them outright).
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
      eventName="Italian Grand Prix"
      status="public"
      h1="Early September in Lombardy — warm days, a real chance of a fast-moving storm"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Early September in the Lombardy plain typically runs warm — daytime highs commonly in the high 20s Celsius
        (mid-to-high 70s to low 80s Fahrenheit), with mornings and evenings noticeably cooler. This is late-summer
        weather, not the deep heat of an August race, but the region does see genuine late-summer thunderstorms
        that can move in quickly on an otherwise clear day, so don&apos;t assume a sunny morning rules out rain by
        the afternoon session.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast before you pack</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Race weekend is close enough now that a specific forecast is more useful than any seasonal average.
        </p>
        <a
          href="https://www.accuweather.com/en/it/monza/214047/10-day-weather-forecast/214047"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — Monza 10-day forecast →
        </a>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack — by category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <PackCard label="A small rain umbrella, if you like" detail="Monza is unusually permissive here — a small umbrella without a metal tip is allowed through the gate, unlike most F1 circuits, which ban them outright. A packable rain layer is still the safer backup if you're in an uncovered stand or GA section." />
        <PackCard label="Sun protection" detail="Late-summer sun in Lombardy is still strong across a full day outdoors, especially in an uncovered GA section like Lesmo or Curva Grande." />
        <PackCard label="A light layer for mornings and evenings" detail="Early September mornings can run noticeably cooler than the afternoon high — worth layering rather than dressing for the day's peak temperature alone." />
        <PackCard label="Comfortable walking shoes" detail="Monza sits inside a genuinely large park — grandstands, gates, and the Fan Zone are spread across real distance, more so than a purpose-built stadium circuit." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest weather takeaway</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          A warm, clear September morning in Lombardy doesn&apos;t guarantee the whole day stays that way — check
          the short-range forecast the morning of each session rather than relying purely on seasonal averages, and
          keep a rain layer in your bag regardless of how the sky looks when gates open.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually bring</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          A genuinely packable rain layer even though a small umbrella is technically allowed — juggling an
          umbrella in a packed grandstand or GA crowd is its own kind of hassle, and a jacket keeps both hands
          free. Sunscreen and a hat matter just as much as the rain plan on a clear day, particularly in one of the
          uncovered General Admission sections.
        </p>
      </div>
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
