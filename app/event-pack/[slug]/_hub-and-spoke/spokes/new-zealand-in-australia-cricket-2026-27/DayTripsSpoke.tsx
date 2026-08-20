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

  const fremantle = linkedExperiences.find((e) => e.slug.includes("fremantle-day-trip-from-perth"));
  const mcLarenVale = linkedExperiences.find((e) => e.slug.includes("mclaren-vale-adelaide-wine-daytrip"));
  const yarraValley = linkedExperiences.find((e) => e.slug.includes("yarra-valley-melbourne-wine-daytrip"));
  const blueMountains = linkedExperiences.find((e) => e.slug.includes("blue-mountains-day-trip-from-sydney"));
  const melbourneCity = linkedExperiences.find((e) => e.slug.includes("melbourne-laneways-coffee-city-day"));
  const sydneyCity = linkedExperiences.find((e) => e.slug.includes("sydney-harbour-beaches-city-day"));
  const wildlife = linkedExperiences.find((e) => e.slug.includes("wildlife-down-under-featherdale-phillip-island"));
  const greatOceanRoad = linkedExperiences.find((e) => e.slug.includes("great-ocean-road-twelve-apostles-daytrip"));

  const cards = [fremantle, mcLarenVale, yarraValley, blueMountains, melbourneCity, sydneyCity, wildlife, greatOceanRoad].filter(Boolean);

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="teaser"
      h1="Eight real day trips across four cities — outward escapes, city days, and one full day away from the cricket entirely"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every day trip here is free to read in full. Unlocking adds our per-leg verdict on which one actually earns a place if you're attending all four Tests, plus a top-3 in-city itinerary for Melbourne and Sydney if you'd rather stay in town than head out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This tour&apos;s five-week span leaves real room for exactly this kind of travel — a wine-region day
        outside each city, plus a genuine city day for Melbourne and Sydney specifically, one wildlife
        experience that spans two of the four legs, and one full 12-13 hour day away from the cricket
        entirely on the Great Ocean Road. None of this needs to be booked as a single package; the tour&apos;s
        own gaps between Tests leave the time for it — though the Great Ocean Road specifically needs a whole
        day sacrificed, not a spare afternoon.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {cards.map((exp, i) =>
          exp ? (
            <div key={exp.id} className={i === cards.length - 1 && cards.length % 2 !== 0 ? "sm:col-span-2" : ""}>
              <SpokeExperienceCard experience={exp} isPro={isPro} />
            </div>
          ) : null
        )}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Our verdict — one per leg, here's which one</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            You genuinely can&apos;t do all eight if you&apos;re attending all four Tests — the gaps between legs
            are real but not endless once you account for domestic flights (see Getting There). Realistically pick
            one day trip per leg, not two, and here&apos;s the one we&apos;d take at each:
          </p>
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Perth:</span>{" "}
              Fremantle — it&apos;s the only real option on this leg, and it earns its place: walkable, a genuine
              change of pace from the CBD, and doesn&apos;t compete against anything else worth doing here.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Adelaide:</span>{" "}
              McLaren Vale — same logic as Fremantle, the only real contender on this leg, and a proper half-day
              wine-region trip rather than a rushed add-on.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Melbourne:</span>{" "}
              The Yarra Valley over the Great Ocean Road — it&apos;s the one genuinely relaxing option in a leg
              that&apos;s otherwise dominated by Boxing Day crowds and logistics. Save the Great Ocean Road for a
              future trip unless you&apos;re willing to sacrifice a full day of play — it&apos;s a 12-13 hour round
              trip, not a half-day option, and doesn&apos;t fit alongside a Test you&apos;re actually trying to
              watch.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Sydney:</span>{" "}
              The Blue Mountains — Sydney&apos;s leg has the most natural slack of all four, and the Blue Mountains
              is the one experience on this whole list you can&apos;t approximate anywhere else on the trip.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you'd rather stay in the city — top 3 in Melbourne and Sydney</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            Not everyone wants a day outside the city — both Melbourne and Sydney genuinely reward a day spent in
            town instead, and here&apos;s what actually earns a spot if that&apos;s your call.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-2">Melbourne</p>
              <ol className="text-sm text-[#A3A3A3] leading-6 list-decimal list-inside space-y-1">
                <li>Royal Botanic Gardens Victoria — free entry, open 7:30am-7:30pm in summer, right on the Yarra
                  and a short walk or tram ride (route 8) from the CBD</li>
                <li>Queen Victoria Market for lunch — a working market since the 1870s (skip Mondays and Wednesday
                  daytime, both closed — check current hours)</li>
                <li>The City Circle Tram — a free heritage tram looping the CBD and Docklands every 12 minutes,
                  9:30am-5pm, with audio commentary past Melbourne Museum, Parliament House, and Federation Square;
                  a good way to link the other two stops without walking the whole day</li>
              </ol>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-2">Sydney</p>
              <ol className="text-sm text-[#A3A3A3] leading-6 list-decimal list-inside space-y-1">
                <li>Circular Quay — the Opera House and Harbour Bridge up close, plus the Royal Botanic Garden
                  and The Rocks</li>
                <li>The Manly ferry from Circular Quay, on a standard Opal fare, for the harbour views and Manly&apos;s
                  own beach</li>
                <li>Or the Bondi to Coogee Coastal Walk — 6km, 2-3 hours, five beaches in sequence (pick this or
                  Manly, not both — each is a full day on its own)</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}
