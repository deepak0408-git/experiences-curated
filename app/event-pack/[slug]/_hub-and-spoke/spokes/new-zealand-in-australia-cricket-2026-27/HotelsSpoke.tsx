import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const perth = linkedExperiences.find((e) => e.slug.includes("where-to-stay-perth-first-test"));
  const adelaide = linkedExperiences.find((e) => e.slug.includes("where-to-stay-adelaide-city-vs-north"));
  const melbourne = linkedExperiences.find((e) => e.slug.includes("where-to-stay-melbourne-boxing-day"));
  const sydney = linkedExperiences.find((e) => e.slug.includes("where-to-stay-sydney-fourth-test"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="teaser"
      h1="Four cities, four different hotel decisions — none of them work the same way"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real neighbourhood-by-neighbourhood tradeoffs are free above, city by city. Unlocking adds our specific pick per city given a genuine first-timer's priorities, and the one booking-timing call that matters most across the whole series — Melbourne's Boxing Day week."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This series asks a different accommodation question in every city. Perth splits between walking to the
        ground and basing in the CBD. Adelaide is a genuine choice between proximity to the Oval and North Adelaide&apos;s
        quieter character. Melbourne runs into the city&apos;s single highest hotel-demand week of the year. Sydney
        splits between Paddington&apos;s village feel and a CBD hotel with harbour access. None of the four cities
        share the same tradeoff, so treat each leg as its own decision rather than applying one rule across all
        four.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {perth && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Perth — First Test</p>
            <SpokeExperienceCard experience={perth} isPro={isPro} />
          </div>
        )}
        {adelaide && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Adelaide — Second Test</p>
            <SpokeExperienceCard experience={adelaide} isPro={isPro} />
          </div>
        )}
        {melbourne && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Melbourne — Boxing Day Test</p>
            <SpokeExperienceCard experience={melbourne} isPro={isPro} />
          </div>
        )}
        {sydney && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Sydney — Fourth Test</p>
            <SpokeExperienceCard experience={sydney} isPro={isPro} />
          </div>
        )}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book, city by city</p>
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Perth:</span>{" "}
              base in the CBD near the InterContinental unless
              a resort day between sessions genuinely matters to you — the train from Perth Stadium station removes
              almost all the walkability advantage Crown Towers otherwise has.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Adelaide:</span>{" "}
              North Adelaide for a quieter, more
              residential stay if you&apos;re there for more than the match days; City for walkable access to
              everything else the trip needs.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Melbourne:</span>{" "}
              East Melbourne (Pullman East Melbourne, across the road from the MCG) over the CBD (Sofitel Melbourne
              on Collins) — Melbourne&apos;s December weather is the most changeable of the four cities, and being a
              short walk from the ground matters more than being close to Collins Street&apos;s restaurants if a
              session gets interrupted or the heat spikes. Book the moment your dates are fixed regardless of
              which you pick — this is the one leg where waiting costs you real money, not just choice.
            </p>
          </div>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-6">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The Boxing Day pricing trap</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Melbourne&apos;s hotel demand peaks during Boxing Day week regardless of cricket — it&apos;s the
              city&apos;s busiest week of the summer, driven by the post-Christmas domestic travel rush as much as
              the Test. Book this leg&apos;s accommodation earliest of all four, even before you&apos;ve decided on
              the other three.
            </p>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Sydney:</span>{" "}
              Paddington for the village feel and proximity
              to the SCG itself; the CBD if harbour access and Sydney&apos;s wider sights matter more to your trip
              than being close to the ground.
            </p>
          </div>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing across the series</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Melbourne first, by a real margin — book that leg before anything else. Sydney&apos;s Fourth Test sits
            in the first week of January, overlapping the tail end of Australia&apos;s own summer holiday travel
            season, so treat it as a secondary priority, not an afterthought. Perth and Adelaide carry the least
            competing demand of the four and can reasonably wait until closer to your trip.
          </p>
        </div>
      )}

    </SpokeShell>
  );
}
