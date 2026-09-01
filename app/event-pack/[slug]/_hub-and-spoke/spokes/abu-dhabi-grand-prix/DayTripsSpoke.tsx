import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const mosque = linkedExperiences.find((e) => e.slug.includes("sheikh-zayed-mosque-qasr-al-watan"));
  const louvreThemeParks = linkedExperiences.find((e) => e.slug.includes("louvre-abu-dhabi-yas-theme-parks"));
  const burjKhalifa = linkedExperiences.find((e) => e.slug.includes("burj-khalifa-dubai-day-trip"));
  const dubaiMall = linkedExperiences.find((e) => e.slug.includes("dubai-mall-day-trip"));
  const dubaiNight = linkedExperiences.find((e) => e.slug.includes("dubai-by-night"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="teaser"
      h1="Stay in Abu Dhabi, or make the 90-minute run to Dubai"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every attraction and travel time above is real and free. The pack adds the actual day-by-day sequencing we'd run — which day to do Dubai, how to fit both a culture day and a thrills day into a 4-day weekend, and the one combination that genuinely doesn't fit."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Abu Dhabi&apos;s season-finale weekend genuinely supports two different kinds of day trip: staying in the
        city itself for real cultural landmarks, or making the roughly 90-minute run to Dubai — close enough to be
        a real, common choice for fans basing part of their trip around DXB&apos;s stronger flight connectivity in
        the first place.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Staying in Abu Dhabi — culture and thrills</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {mosque && <SpokeExperienceCard experience={mosque} isPro={isPro} hideProCtas />}
        {louvreThemeParks && <SpokeExperienceCard experience={louvreThemeParks} isPro={isPro} hideProCtas />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Making the run to Dubai</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {burjKhalifa && <SpokeExperienceCard experience={burjKhalifa} isPro={isPro} hideProCtas />}
        {dubaiMall && <SpokeExperienceCard experience={dubaiMall} isPro={isPro} hideProCtas />}
      </div>
      {dubaiNight && (
        <div className="mb-8">
          <SpokeExperienceCard experience={dubaiNight} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest logistics</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Burj Khalifa, Dubai Mall, and Dubai by Night all sit within walking distance of each other in Downtown
          Dubai — a single day trip realistically covers all three rather than needing separate visits. The
          Sheikh Zayed Grand Mosque and Louvre Abu Dhabi/theme parks pairing is a genuinely separate,
          in-city day — don&apos;t try to combine an Abu Dhabi city day with a Dubai run in the same 24 hours on a
          4-day race weekend; the travel time alone makes it a poor trade against the race sessions themselves.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a standard Thursday-Sunday race weekend, Thursday (before track action starts) is the natural day
            for the Abu Dhabi city half — mosque, Qasr Al Watan, and Louvre in the morning and early afternoon,
            leaving the evening free. If you&apos;re flying in via DXB anyway, build the Dubai day trip around your
            actual arrival or departure day rather than carving out a separate day from the race weekend itself —
            you&apos;re already making the drive one direction, so a few extra hours in Downtown Dubai before
            continuing to Abu Dhabi is a genuinely efficient use of a travel day that would otherwise be dead time.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The one combination that genuinely doesn&apos;t fit: don&apos;t try to do both the Abu Dhabi city day
            and a full Dubai day trip within the same 4-day window as three or four race-day sessions — something
            will feel rushed, and it&apos;s almost always the day trips that suffer for it. If your schedule is
            genuinely tight, pick one city-day theme (culture in Abu Dhabi, or Downtown Dubai) rather than trying
            to do a version of both.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
