import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Three real, seeded dining experiences cover this trip's actual range:
// Eating in Milan (a fourth-generation trattoria and a Michelin star, ten
// minutes apart by taxi), Eating in Monza (risotto, luganega, and the
// Brianza table), and Aperitivo Before the Race (Campari's home city and its
// pre-dinner ritual). 19 Sep 2026.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const eatingInMilan = linkedExperiences.find((e) => e.slug.includes("eating-in-milan-serious-italians-"));
  const eatingInMonza = linkedExperiences.find((e) => e.slug.includes("eating-in-monza-risotto-luganega-"));
  const aperitivo = linkedExperiences.find((e) => e.slug.includes("aperitivo-before-the-race-milan-ritual-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="teaser"
      h1="A fourth-generation trattoria, a Michelin star, and the ritual Campari built"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every pick above is real and free. What's gated is the tactical detail that actually gets you a table — the real booking window, which night to save for the splurge, and our real sequencing across a food-focused evening off from the circuit."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Milan is one of Italy&apos;s genuine food capitals, and race weekend is a real excuse to run its range —
        a fourth-generation trattoria, a Michelin-starred kitchen a short taxi ride away, the aperitivo ritual
        Campari itself was invented for, and Monza&apos;s own quieter Brianza table for anyone staying closer to
        the circuit.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Milan — a trattoria and a Michelin star, ten minutes apart</p>
      {eatingInMilan && (
        <div className="mb-8">
          <SpokeExperienceCard experience={eatingInMilan} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Aperitivo — the Milan ritual before you head to the race</p>
      {aperitivo && (
        <div className="mb-8">
          <SpokeExperienceCard experience={aperitivo} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Monza — risotto, luganega, and the Brianza table</p>
      {eatingInMonza && (
        <div className="mb-8">
          <SpokeExperienceCard experience={eatingInMonza} isPro={isPro} hideProCtas />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d actually sequence a food-focused evening</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Do aperitivo in Milan before a session-free evening rather than after — it&apos;s built as a pre-dinner
            ritual, not a nightcap, and doing it in the right order sets up the rest of the night properly. Save
            the Michelin-starred pick for one of your earlier Milan evenings rather than your last, since a room at
            this level fills up well ahead on weekend nights. If you&apos;re staying closer to the circuit in
            Monza itself, the Brianza risotto-and-luganega table is the honest local alternative to a Milan
            reservation you didn&apos;t manage to book in time.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The booking detail that actually matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book the Michelin-starred pick as early as you book your grandstand ticket — race weekend is one of
            Milan&apos;s highest-demand dining periods of the year, and a genuinely small, well-regarded room fills
            first. The fourth-generation trattoria is the more forgiving reservation on shorter notice, but still
            worth booking rather than walking in cold on a Friday or Saturday night during race week.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
