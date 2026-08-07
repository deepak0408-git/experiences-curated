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

  const piedmontese = linkedExperiences.find((e) => e.slug.includes("atp-finals-piedmontese-dining"));
  const bicerin = linkedExperiences.find((e) => e.slug.includes("atp-finals-caffe-bicerin"));
  const aperitivo = linkedExperiences.find((e) => e.slug.includes("atp-finals-aperitivo-vermouth"));
  const gianduja = linkedExperiences.find((e) => e.slug.includes("atp-finals-gianduja-chocolate"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="teaser"
      h1="Agnolotti, bicerin, vermouth, and gianduja — the real food trail"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real restaurant names and food traditions are all free above. The Event Pack adds our actual verdict — which of the three Piedmontese restaurants to book for your specific trip length, and how to sequence a bicerin, an aperitivo, and a proper dinner across one genuinely good food day without overdoing it."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Turin is the birthplace of the Slow Food movement, and that shows up directly in the city's food identity —
        this isn't generic "Italian food," it's a specific, deep regional cuisine with its own pasta shapes, its own
        chocolate tradition, and a drinking culture (vermouth, aperitivo) that started here before it spread anywhere
        else in Italy.
      </p>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
        Agnolotti del plin and tajarin at Scannabue, Ristorante Consorzio, or Razzo. The original bicerin at Caffè Al
        Bicerin, since 1763. Vermouth and a proper aperitivo buffet — Turin invented the tradition in 1786. Gianduja
        chocolate from a real historic chocolatier, not a tourist-shop version.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {piedmontese && <SpokeExperienceCard experience={piedmontese} isPro={isPro} />}
        {bicerin && <SpokeExperienceCard experience={bicerin} isPro={isPro} />}
        {aperitivo && <SpokeExperienceCard experience={aperitivo} isPro={isPro} />}
        {gianduja && <SpokeExperienceCard experience={gianduja} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we'd sequence one food day</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Start with Caffè Al Bicerin mid-morning, before the day's crowds build. Save aperitivo for early evening
            at a Piazza San Carlo café ahead of an evening session — it fits the tournament's own schedule naturally.
            Book Razzo specifically if you only have one proper dinner to spend on Piedmontese food during your
            trip — Scannabue or Consorzio if you want two more relaxed meals instead of one tasting-menu evening.
            Pick up gianduja as a portable souvenir rather than trying to fit a dedicated chocolate-shop visit into
            an already full day.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
