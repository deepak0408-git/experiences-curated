import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "day-trips";

export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const gardens = linkedExperiences.find((e) => e.slug.includes("singapore-gp-gardens-by-the-bay"));
  const sentosa = linkedExperiences.find((e) => e.slug.includes("singapore-gp-sentosa"));
  const waterfront = linkedExperiences.find((e) => e.slug.includes("singapore-gp-waterfront-walk"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="Real daytime, thanks to the night race"
      question="How should I spend the daytime during a Singapore GP weekend?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every attraction, hours, and price above is free. The pack adds the actual sequence we'd run — which day to do Sentosa, when to time Gardens' evening light show around your session, and the one combination that genuinely doesn't fit in a single day, so you don't find that out the hard way."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Most Grand Prix cities force a trade-off between racing and sightseeing. Singapore&apos;s night-race format
        genuinely doesn&apos;t, sessions run into the evening, which leaves real daytime for the city itself.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Sentosa is a genuine day trip, an actual island you travel to and spend hours on. Marina Bay Waterfront
        Walk and Gardens by the Bay are both a short walk or one MRT stop from the circuit, worth folding into the
        same day as a session rather than treating as separate outings.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {waterfront && (
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-1">{waterfront.title}</p>
            <p className="text-sm text-[#A3A3A3] leading-6">Merlion Park to the Singapore Flyer — the same waterfront the circuit wraps around, worth doing early as orientation. If your walk runs into the evening, Marina Bay Sands' free Spectra light and water show (8pm/9pm nightly) sits right on the route.</p>
          </div>
        )}
        {sentosa && (
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-1">{sentosa.title}</p>
            <p className="text-sm text-[#A3A3A3] leading-6">10 minutes by MRT — beaches, cable car, and Universal Studios, genuinely doable before an evening session. The only one of the three that's an actual day trip.</p>
          </div>
        )}
        {gardens && (
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-1">{gardens.title}</p>
            <p className="text-sm text-[#A3A3A3] leading-6">Free outdoor gardens, paid Cloud Forest/Flower Dome, and a free nightly Garden Rhapsody light show at 7:45pm and 8:45pm — a short walk or one MRT stop from the circuit, not a separate trip.</p>
          </div>
        )}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we'd sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Do the Waterfront Walk on your first full day, before race sessions start, it doubles as real orientation
            for the geography you'll navigate all weekend. Save Sentosa for a day with a later session start, and
            time Gardens by the Bay's 7:45pm Garden Rhapsody show specifically on an evening you have a session,
            it's close enough to walk straight to the circuit afterward. Don't try to combine Universal Studios and
            a relaxed beach day in one Sentosa visit if you also have a session that evening, the park alone is a
            full day.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            {waterfront && <Link href={`/experience/${waterfront.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">Read the full waterfront walk guide →</Link>}
            {sentosa && <Link href={`/experience/${sentosa.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">Read the full Sentosa guide →</Link>}
            {gardens && <Link href={`/experience/${gardens.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">Read the full Gardens by the Bay guide →</Link>}
          </div>
          <p className="text-sm text-[#A3A3A3] leading-7">
            For the exact hour-by-hour version of this, sequenced against real session times and concert sets, see
            the{" "}
            <Link href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Trip Schedule
            </Link>
            .
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: gardensbythebay.com.sg (Gardens hours, Garden Rhapsody times), sentosa.gov.sg, rome2rio.com,
        headout.com, thrillark.com (Sentosa transit and Universal Studios detail), marinabaysands.com,
        singaporeflyerticket.com, trawell.in, holidify.com (Waterfront Walk landmarks, Spectra show). Verified
        3 Aug 2026.
      </p>
    </SpokeShell>
  );
}
