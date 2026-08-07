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
      eventName="Singapore Grand Prix"
      status="public"
      h1="F1's first official heat hazard race"
      question="What's the weather like at the Singapore GP, and what should I pack?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Singapore was declared F1&apos;s first-ever official &quot;heat hazard&quot; race — real, current
        recognition of how demanding the heat and humidity genuinely are here, not exaggerated race-weekend colour.
        The race itself runs at night under floodlights, but the heat and humidity from the day linger long after
        dark, and October sits right at the start of Singapore&apos;s monsoon season.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The real numbers</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Average high 31°C (88°F), average low 24°C (75°F), humidity averaging 84% and regularly peaking near 95%.
          October brings rain on roughly 16 of the month&apos;s 31 days, about 194mm total, as the monsoon season
          begins — short, heavy tropical showers rather than all-day rain, but frequent enough to plan around. Full
          day-by-day forecasts closer to race week:{" "}
          <a
            href="https://weather.com/weather/monthly/l/cf803d0e77746d052e0b78d26bd86538c8b4c3563e653d010de0b185ae1d7cf0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AAFF00] hover:text-[#BBFF33] underline"
          >
            Weather.com — Singapore monthly forecast ↗
          </a>
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Your grandstand&apos;s actual exposure</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every grandstand at Marina Bay is uncovered — only Paddock Club and hospitality packages (Turn 3&apos;s
          Green Room being the cheapest of these) have real shelter. Because the race itself runs at night, direct
          sun isn&apos;t the grandstand concern it would be at a daytime race — it&apos;s the afternoon heat while
          queuing and arriving, and the real chance of rain, that matter most. Stamford, Connaught, and Esplanade
          face east, so the setting sun sits behind you rather than in your eyes during the pre-race hours, a small
          but genuine comfort difference over a long afternoon. For rain specifically, the sheltered section at the
          very back of the Esplanade grandstand, near the Coffee Bean, is a real option if a shower hits mid-session
          — covered, with an unobstructed view of the track. <span className="text-[#AAFF00]">Large and golf-style
          umbrellas are banned inside every grandstand</span> — a small, compact umbrella is technically permitted,
          but you can only open it during a genuinely heavy downpour, not casually, since it blocks the view behind
          you. A poncho is the more practical default for exactly that reason, and Singapore has genuinely had a
          race disrupted by rain before (2017), so this isn&apos;t theoretical.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to actually bring</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Hydration</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Bring a reusable water bottle, refill stations are placed throughout the circuit. A neck fan is a small
            thing that makes a genuine difference over a full day.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Clothing</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Light, breathable clothing. Appropriate footwear matters more than people expect, there&apos;s
            significantly more walking involved between gates, stands, and stages than a typical race weekend.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Rain</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            When it rains in Singapore, it properly rains. Pack a poncho as the default — large and golf-style
            umbrellas are banned in every grandstand, and even a permitted small one can only be opened in a
            genuinely heavy downpour, not casually, since it blocks the view behind you.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Pace yourself</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The heat and humidity can be genuinely draining if you try to pack too much into one day. Most vendors take
          cards, but carry some cash too, not every stall does.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: BBC Sport, malaymail.com (heat hazard designation), weather-atlas.com and currentresults.com
        (October climate averages), weather.com (forecast link), oversteer48.com (grandstand shade/rain exposure),
        thef1spectator.com (Esplanade shelter, umbrella policy). Verified 3 Aug 2026.
      </p>
    </SpokeShell>
  );
}
