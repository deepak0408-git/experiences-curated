import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

// Real content sourced from two seeded experiences (japanese-gp-suzuka-
// weather-pack, japanese-gp-cherry-blossoms), 22 Sep 2026: April average
// high 16.8°C/62°F, low 7.9°C/46°F, ~148mm rain over ~15 days (~34% daily
// chance). Cherry blossom window honestly managed — 2027 race weekend
// (9-11 Apr) sits at/just past typical peak-bloom timing, not guaranteed.
// Live forecast link uses AccuWeather per skill §2, confirmed real 10-day
// URL for Suzuka-shi, Mie (location code 218916) via live search 22 Sep
// 2026 — not weather.com.
export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const weatherPack = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-weather-pack"));
  const cherryBlossoms = linkedExperiences.find((e) => e.slug.includes("japanese-gp-cherry-blossoms"));
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
      eventName="Japanese Grand Prix"
      status="public"
      h1="Close to a 1-in-3 daily rain chance and a real morning-to-afternoon swing — pack for both"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Suzuka in early April is genuinely unpredictable, and packing for the average conditions alone will leave
        you underprepared for a real chunk of the weekend. Based on long-term averages, April runs an average
        high around 16.8°C (62°F) and an average low around 7.9°C (46°F) — mild by most standards, but that
        average hides real day-to-day swings across a Friday-to-Sunday span.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatTile label="Avg high" value="16.8°C / 62°F" />
        <StatTile label="Avg low" value="7.9°C / 46°F" />
        <StatTile label="Rain days" value="~15 of 30" />
        <StatTile label="Daily rain chance" value="~34%" />
      </div>

      <a
        href="https://www.accuweather.com/en/jp/suzuka-shi/2-218916_1_al/10-day-weather-forecast/2-218916_1_al"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors mb-8"
      >
        Check the live 10-day forecast (AccuWeather) →
      </a>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Rain is the bigger planning factor</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Close to half the days in April see some rain, and when it does rain, it&apos;s a genuine amount, not a
          light drizzle — expect real, sustained rain rather than a passing shower on the days it happens. Many of
          Suzuka&apos;s grandstands, including popular ones like Q2 and Grandstand G, have no roof at all, so a
          rain jacket that actually works matters more here than at a covered-seating circuit.
        </p>
      </div>

      {weatherPack && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={weatherPack} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <ul className="space-y-2">
          <li className="text-sm text-[#A3A3A3] leading-6 pl-4 -indent-4">• A real waterproof layer — many grandstands are uncovered, and rain here is sustained, not a light shower</li>
          <li className="text-sm text-[#A3A3A3] leading-6 pl-4 -indent-4">• Layers for a genuine morning-to-afternoon temperature swing, especially in an open stand</li>
          <li className="text-sm text-[#A3A3A3] leading-6 pl-4 -indent-4">• Comfortable, broken-in shoes — a large open venue means a lot of walking and standing</li>
          <li className="text-sm text-[#A3A3A3] leading-6 pl-4 -indent-4">• A portable phone charger — expect heavy phone use for navigation and photos</li>
          <li className="text-sm text-[#A3A3A3] leading-6 pl-4 -indent-4">• Cash alongside cards — Japan remains more cash-reliant than many visitors expect, especially at smaller food stalls and fan zone vendors</li>
        </ul>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Cherry blossoms — genuinely possible, not guaranteed</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Peak bloom typically lasts only five to seven days, and the broader window for central Honshu (Tokyo,
          Kyoto, Osaka, Nagoya) runs roughly 29 March to 7 April in a typical year. 2027&apos;s 9-11 April race
          weekend sits right at the tail end of, or just past, that window based on recent years&apos; patterns —
          not squarely inside it. Bloom timing depends on that specific winter and early spring, which
          isn&apos;t predictable this far out.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Treat it as a genuine possible bonus, not a guaranteed feature — check a closer-to-date forecast once
          you&apos;re within a few weeks of travel, and build a loose, checkable viewing stop into a Nagoya or
          Osaka day rather than planning around blossoms that may or may not still be there.
        </p>
      </div>

      {cherryBlossoms && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={cherryBlossoms} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Pack a real rain jacket regardless of the forecast you see a few weeks out — close to 1-in-3 daily odds
          across three days means betting against rain entirely is a real risk, not a reasonable gamble. If bloom
          timing matters to you, keep it a loose, checkable stop in Nagoya rather than the centerpiece of your
          trip.
        </p>
      </div>
    </SpokeShell>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 text-center">
      <p className="text-lg font-black text-[#AAFF00]">{value}</p>
      <p className="text-xs text-[#6A6A6A] mt-1">{label}</p>
    </div>
  );
}
