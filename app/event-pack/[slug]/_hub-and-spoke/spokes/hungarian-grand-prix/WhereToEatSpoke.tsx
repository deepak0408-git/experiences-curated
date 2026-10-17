import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Two real, seeded dining experiences cover this trip's actual range: Gettó
// Gulyás (Jewish Quarter, traditional goulash) and Stand25 Bisztró (Buda,
// Michelin Bib Gourmand). 16 Oct 2026.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettoGulyas = linkedExperiences.find((e) => e.slug.includes("getto-gulyas-jewish-quarter-"));
  const stand25 = linkedExperiences.find((e) => e.slug.includes("stand25-bisztro-"));
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
      eventName="Hungarian Grand Prix"
      status="teaser"
      h1="Real goulash in the Jewish Quarter, or a Bib Gourmand across the river in Buda"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Both real picks are free above. The pack adds the real booking window before race-week reservations fill, and our actual sequencing for fitting both into a weekend built around session times."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Budapest does the heavy lifting for race-weekend dining — the circuit itself has limited food options
        beyond the Fan Zone stalls, and the city rewards the short commute back for dinner. Two real picks cover
        the range: traditional Hungarian comfort food in the Jewish Quarter, and a Michelin-recognised kitchen
        across the river in Buda.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gettó Gulyás — goulash done properly, in the Jewish Quarter</p>
      {gettoGulyas && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={gettoGulyas} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Stand25 Bisztró — a market stall that earned a Bib Gourmand</p>
      {stand25 && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={stand25} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Race weekend is one of Budapest&apos;s busier dining periods of the year, especially in the Jewish
          Quarter — both of these fill up on weekend evenings during race week, worth a reservation rather than a
          walk-in attempt.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Save Stand25 for a non-session evening if you can — it&apos;s a genuine destination meal worth
            unhurried time, and Buda&apos;s quieter pace across the river suits a slower dinner better than
            squeezing it in after a late qualifying session. Gettó Gulyás works well straight after a session day,
            since the Jewish Quarter is an easy walk or short ride from most Pest hotel bases and the food itself
            is built for exactly that kind of evening.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The booking detail that actually matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Call ahead for Gettó Gulyás rather than walking in, especially on weekend evenings when the Jewish
            Quarter crowd is out in force — and book Stand25 as early as you book your grandstand ticket, since
            race week pushes an already-popular Bib Gourmand kitchen into genuinely tight availability.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
