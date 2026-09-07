import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const zocalo = linkedExperiences.find((e) => e.slug.includes("mexico-city-zocalo-cathedral-templo-mayor-"));
  const chapultepec = linkedExperiences.find((e) => e.slug.includes("mexico-city-chapultepec-anthropology-"));
  const fridaMuseum = linkedExperiences.find((e) => e.slug.includes("mexico-city-frida-kahlo-museum-"));
  const teotihuacan = linkedExperiences.find((e) => e.slug.includes("mexico-city-teotihuacan-day-trip-"));
  const xochimilco = linkedExperiences.find((e) => e.slug.includes("mexico-city-xochimilco-"));
  const diaDeMuertos = linkedExperiences.find((e) => e.slug.includes("mexico-city-dia-de-muertos-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Mexico City Grand Prix"
      status="teaser"
      h1="Aztec ruins, ancient pyramids, and a parade that only happens this once"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every site and travel time above is real and free. The pack adds the actual day-by-day sequencing we'd run across a 3-day race weekend — which day to do Teotihuacán, how to fit the Día de Muertos parade around your sessions, and the one combination that genuinely doesn't fit."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Mexico City is the destination here, not a satellite town near the circuit — which means the &quot;day
        trips&quot; question is really about how to use the time around your race sessions well. That spans the
        historic center&apos;s layered Aztec-and-colonial history, a green district built around one of the world&apos;s
        great anthropology museums, an hour-long trip to genuinely ancient pyramids, a floating canal party, and —
        this year specifically — one of the country&apos;s biggest cultural celebrations happening at the same time
        as the race.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">In the city — history and culture</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {zocalo && <SpokeExperienceCard experience={zocalo} isPro={isPro} hideProCtas />}
        {chapultepec && <SpokeExperienceCard experience={chapultepec} isPro={isPro} hideProCtas />}
      </div>
      {fridaMuseum && (
        <div className="mb-8">
          <SpokeExperienceCard experience={fridaMuseum} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Out of the city — real day trips</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {teotihuacan && <SpokeExperienceCard experience={teotihuacan} isPro={isPro} hideProCtas />}
        {xochimilco && <SpokeExperienceCard experience={xochimilco} isPro={isPro} hideProCtas />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">This year only — Día de Muertos</p>
      {diaDeMuertos && (
        <div className="mb-8">
          <SpokeExperienceCard experience={diaDeMuertos} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest logistics</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Zócalo/Cathedral/Templo Mayor and Chapultepec/Anthropology Museum stops are both genuine half-day
          commitments in the city itself — don&apos;t try to do both plus the Frida Kahlo Museum in a single day.
          Teotihuacán is a real day trip (roughly 6 hours round trip including 3-4 hours on site) — don&apos;t treat
          it as a quick add-on to another plan. The Día de Muertos parade runs Saturday 31 October from roughly
          midday to mid-afternoon, directly inside race weekend — plan around it rather than assuming you can fit it
          in around a full day of track sessions with no adjustment.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a standard Friday-Sunday race weekend, Thursday (before track action starts) is the natural day for
            Teotihuacán — leave early to beat both the heat and the crowds, and you&apos;ll be back in the city with
            a full evening still ahead of you. Friday, before or after practice, is the right window for the Zócalo/
            Cathedral/Templo Mayor loop — it&apos;s a compact, walkable half-day that doesn&apos;t demand a full
            day&apos;s commitment. Saturday is the day the parade actually happens this year — build your schedule
            around catching part of it before or after qualifying, since it runs midday, not evening. Save Chapultepec/
            Anthropology Museum and the Frida Kahlo Museum for whichever day has the lightest track commitment, and
            treat Xochimilco as a genuine half-to-full-day commitment for whenever your schedule has real flexibility,
            since rushing it defeats the point.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The one combination that genuinely doesn&apos;t fit: don&apos;t try to do Teotihuacán and the Día de
            Muertos parade on the same day. Teotihuacán alone eats most of a day including travel, and the parade
            demands real time on the ground to actually experience rather than catch a glimpse of in passing. Pick
            one per day, not both.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
