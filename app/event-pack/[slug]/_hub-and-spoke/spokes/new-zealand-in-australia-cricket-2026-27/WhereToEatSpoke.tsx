import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const diningGuide = linkedExperiences.find((e) => e.slug.includes("where-nz-fans-actually-eat-city-guide"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="teaser"
      h1="Four cities, four real food scenes — where we'd actually eat at each leg"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Each city's real food identity is free above, in the dining guide. Unlocking adds our specific named pick for where to actually eat in each of the four cities, our match-day eating verdict for each ground, plus the exact Melbourne laneway sequence that works if coffee culture is genuinely part of why you're excited about that leg."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Each of the four cities on this tour has its own real, distinct food identity — Perth&apos;s built on cheap,
        excellent Asian cooking; Adelaide runs through its historic Central Market; Melbourne&apos;s laneway coffee
        culture is a genuine reason travellers build extra time into that leg; and Sydney&apos;s SCG leg means
        looking to Paddington, not the ground itself, for a proper meal.
      </p>

      {diningGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={diningGuide} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually eat, city by city</p>
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Perth:</span>{" "}
              Tak Chee House in Northbridge for laksa and Hainanese chicken rice — walkable from the CBD, or a short
              Swan River ferry/rideshare from Perth Stadium.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Adelaide:</span>{" "}
              Lucia&apos;s at the Central Market for honest Italian pizza and pasta, run by the same family since
              1957; Ying Chow on nearby Gouger Street for tea-smoked duck if you want Chinatown instead. The market
              itself is closed Sunday and Monday — plan around the Tuesday-Saturday window, not a rest day that
              happens to fall on a Sunday.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Melbourne:</span>{" "}
              Brother Baba Budan on Little Bourke Street, one of the laneway-coffee movement&apos;s actual
              originators — expect it to be full by mid-morning. Dukes Coffee Roasters on Flinders Lane is the
              reliable backup with more seats.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Sydney:</span>{" "}
              The Village Inn in Paddington, a 5-minute walk from the SCG — the regularly recommended pre- or
              post-match pub, since the ground itself sits in Moore Park with no real food precinct of its own.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Match-day eating, ground by ground</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Every one of the four grounds has real, decent concourse food — don&apos;t plan around it as an
            afterthought, but don&apos;t expect it to be the highlight of the day either. The MCG&apos;s food
            offering genuinely improves the closer you get to Boxing Day itself, since that&apos;s when the venue
            runs its fullest vendor lineup. Adelaide Oval&apos;s concourse sits closest in character to the
            city&apos;s own food culture of any of the four grounds — worth actually eating at rather than saving
            your appetite for after.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A real Melbourne laneway coffee sequence</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Start at Brother Baba Budan on Little Bourke Street, then step next door into Rankins Lane itself —
            a genuinely colourful laneway in its own right, home to Manchester Press if you want a stuffed bagel
            alongside your coffee. From there it&apos;s a 10-15 minute walk down to Degraves Street and Centre
            Place near Flinders Street Station — Melbourne&apos;s most famous laneway strip, with Fieldwork Coffee
            and Degraves Espresso both worth a stop if Brother Baba Budan already has you sold. Finish at Hosier
            Lane, a 3-minute walk from Degraves, for the street art the laneways are equally known for. Budget a
            full morning for this, not a single stop — the walking between laneways is genuinely the point, not
            a detour from it. See the A Day in Melbourne guide for how this pairs with the rest of a city day.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Laneway coffee sequence sources: What&apos;s On Melbourne and Walk Melbourne (Rankins Lane, Degraves
        Street/Centre Place, Hosier Lane walking route).
      </p>
    </SpokeShell>
  );
}
