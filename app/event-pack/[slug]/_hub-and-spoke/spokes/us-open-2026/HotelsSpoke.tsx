import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// Only one real accommodation experience exists for this event (splurge
// tier, from the classic pack) — no dedicated budget/moderate hotel
// experience was written. Rather than invent one, this spoke presents the
// real splurge pick plus a transparent, sourced note on the honest budget
// alternative (staying in Queens near the 7 train) instead of a second
// named card. Flagged explicitly to the founder during the migration.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const whereToStay = linkedExperiences.find((e) => e.slug.includes("where-to-stay-us-open"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="teaser"
      h1="Manhattan vs. Queens — proximity vs. price"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The honest proximity-vs-price tradeoff is free above. Unlocking adds our actual booking call, and when to book before the tournament's limited Queens hotel stock disappears."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Flushing Meadows sits in Queens, a real neighborhood with real hotel stock but genuinely less of it than
        Manhattan — the tradeoff most visitors face is between a short 7-train ride from a Queens hotel near the
        grounds, or staying in Manhattan proper and commuting in, which is longer but opens up far more rooms and
        price points.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Near the venue — Flushing &amp; the 7 train corridor</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A handful of hotels sit a short 7-train ride or drive from the USTA Billie Jean King National Tennis Center,
        including the real splurge pick below. Staying here minimizes the daily commute — a genuine advantage on a
        late night-session day when getting back to a hotel quickly matters.
      </p>
      <div className="mb-8">
        {whereToStay && <SpokeExperienceCard eventSlug={eventSlug} experience={whereToStay} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Staying in Manhattan instead</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Manhattan has by far the deepest hotel stock in the city, across every price point, and the 7 train runs
        directly from several Midtown and Long Island City stations to Mets-Willets Point with no transfer — roughly
        25-35 minutes depending on where you start. This is the honest budget move: a real, well-reviewed Manhattan
        hotel at a lower nightly rate than the limited Queens options, traded against a longer daily commute. See
        the{" "}
        <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Getting There guide
        </a>{" "}
        for the real 7-train route and OMNY fare details.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine, dedicated US Open trip where minimizing commute matters more than price, book the Queens
            option near the grounds — it pays off most on a late night-session day when a 30-minute Manhattan commute
            is the last thing you want after an 11pm finish. For anyone splitting the trip between tennis and the
            rest of New York, a Manhattan hotel is the sharper call — the 7 train's direct run means the "cost" of
            staying further away is smaller than it looks on a map.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The US Open runs the same two weeks every year with no shoulder-season discount — book as soon as your
            trip dates are set, not once your ticket purchase is confirmed. Queens&apos; limited hotel stock near the
            grounds fills first, especially for the tournament&apos;s second week and finals weekend.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
