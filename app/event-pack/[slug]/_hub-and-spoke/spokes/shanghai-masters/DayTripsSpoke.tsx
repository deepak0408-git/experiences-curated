import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const theBund = linkedExperiences.find((e) => e.slug.includes("the-bund-shanghai-dusk"));
  const yuGarden = linkedExperiences.find((e) => e.slug.includes("yu-garden-old-city-shanghai"));
  const frenchConcession = linkedExperiences.find((e) => e.slug.includes("french-concession-tianzifang-shanghai"));
  const lujiazui = linkedExperiences.find((e) => e.slug.includes("lujiazui-skyline-shanghai"));
  const hangzhou = linkedExperiences.find((e) => e.slug.includes("hangzhou-west-lake-day-trip"));
  const suzhou = linkedExperiences.find((e) => e.slug.includes("suzhou-classical-gardens-day-trip"));

  const inCityHighlights = [theBund, yuGarden, frenchConcession, lujiazui].filter((e): e is NonNullable<typeof e> => !!e);
  const outOfCityTrips = [hangzhou, suzhou].filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="teaser"
      h1="Four city sights, plus two real trips out on the bullet train"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every sight below is free to read. Unlocking adds our recommended pairing — which two to combine in one day, and which one deserves its own full day alone."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Shanghai itself has real sightseeing depth worth a spare day between sessions, and two genuine trips out of
        the city sit within a fast train ride — Hangzhou&apos;s West Lake and Suzhou&apos;s classical gardens are
        both feasible in a single day without rushing.
      </p>

      {inCityHighlights.length > 0 && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">In the city</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {inCityHighlights.map((exp, i) => (
              <div key={exp.slug} className={inCityHighlights.length % 2 === 1 && i === inCityHighlights.length - 1 ? "sm:col-span-2" : undefined}>
                <SpokeExperienceCard experience={exp} isPro={isPro} />
              </div>
            ))}
          </div>
        </>
      )}

      {outOfCityTrips.length > 0 && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Out of the city (bullet train)</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {outOfCityTrips.map((exp, i) => (
              <div key={exp.slug} className={outOfCityTrips.length % 2 === 1 && i === outOfCityTrips.length - 1 ? "sm:col-span-2" : undefined}>
                <SpokeExperienceCard experience={exp} isPro={isPro} />
              </div>
            ))}
          </div>
        </>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d pair these</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The Bund and Yu Garden pair well in a single day — both sit in the older, walkable core of the city.
            French Concession and Lujiazui each deserve their own half-day given the walking involved. Of the two
            out-of-city trips, Suzhou is the faster round trip (as little as 21 minutes each way) if you only have
            time for one.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The one that deserves its own full day</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Hangzhou is the pick if you can only give one destination a genuinely full day, not a rushed half. West
            Lake&apos;s Su Causeway, Leifeng Pagoda, and Lingyin Temple each reward real time on their own — a single
            day realistically only covers the causeway as your anchor plus one of the other two properly, not all
            three. Trying to also fit in a city sight or the tennis the same day means shortchanging one of them;
            give Hangzhou the full day it actually needs. See the{" "}
            <a href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Trip Schedule
            </a>{" "}
            for suggested itineraries built around this.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
