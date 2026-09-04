import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "hotels";

// Real seeded accommodation experiences: Ibis Boulogne-Billancourt
// (mid-range) and the Boulogne-Billancourt short-let/Airbnb write-up
// (budget). Hôtel Molitor (luxury) lives in the Luxury spoke per the
// agreed spoke-mapping, cross-referenced here rather than duplicated.
// Village d'Auteuil's own neighborhood card lives in Day Trips, also
// cross-referenced for the "near the venue" side of the tradeoff.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const ibis = linkedExperiences.find((e) => e.slug.includes("ibis-boulogne-billancourt-midrange-stay"));
  const shortLet = linkedExperiences.find((e) => e.slug.includes("boulogne-billancourt-short-let-budget-stay"));
  const molitor = linkedExperiences.find((e) => e.slug.includes("hotel-molitor-paris-luxury-stay"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="teaser"
      h1="The 16th arrondissement vs. Boulogne-Billancourt — proximity vs. price"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The honest proximity-vs-price tradeoff and real named picks are free above. Unlocking adds our actual booking call — which option to choose for a dedicated tennis trip versus a longer Paris visit, and when to book before the tournament's small hotel stock near the venue disappears."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Roland-Garros sits in the quiet 16th arrondissement, a part of Paris with genuinely few hotels this close to
        the venue — the real tradeoff most visitors face is between paying a premium to walk to the gates, or
        crossing the Seine to Boulogne-Billancourt for meaningfully lower rates and a short Métro ride instead.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Near the venue — Auteuil, 16th arrondissement</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The 16th arrondissement, and Auteuil specifically, is where the tournament&apos;s handful of walkable hotels
        sit — Hôtel Molitor at the luxury end (10-minute walk, see the{" "}
        <Link href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Luxury Guide
        </Link>
        ), plus a small stock of independent 3-star hotels on quiet residential streets around Porte d&apos;Auteuil
        and Michel-Ange–Molitor. This is a genuine former village annexed into Paris in 1860 — Art Nouveau villas
        hidden behind gates, a twice-weekly market, a real neighborhood character most Roland-Garros visitors never
        get to see (see the full{" "}
        <Link href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Day Trips guide
        </Link>
        ) — but hotel stock here is genuinely small and sells out first.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Across the Seine — Boulogne-Billancourt</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Boulogne-Billancourt is a genuine, functioning Paris suburb directly across the Seine from the stadium&apos;s
        western edge — bakeries, markets, real restaurants, not an anonymous commuter district. Billancourt Métro
        station (Line 9) connects directly toward Porte d&apos;Auteuil, the stop nearest the venue, and both
        real accommodation options here run meaningfully below what the 16th arrondissement charges.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {ibis && <SpokeExperienceCard experience={ibis} isPro={isPro} />}
        {shortLet && <SpokeExperienceCard experience={shortLet} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine, dedicated Roland-Garros trip, Ibis Boulogne-Billancourt is the sharpest real booking at
            this price point — it&apos;s consistently well-rated across four independent review platforms, not just
            one flattering headline score, and the 4-minute drive to the venue with a direct Métro connection beats
            paying a real premium to be in the 16th arrondissement itself.{" "}
            {molitor && (
              <>
                Reserve{" "}
                <Link href={`/experience/${molitor.slug}`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
                  Hôtel Molitor
                </Link>{" "}
                for when the whole trip is meant to be a splurge — its own iconic pool is worth the extra cost on
                its own terms, not just for the shorter walk.
              </>
            )}
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Roland-Garros runs the same two weeks every late May and early June, with no shoulder-season discount
            to chase — book as soon as the following year&apos;s tournament dates are confirmed, not once your
            ballot result lands. The 16th arrondissement&apos;s small hotel stock fills first; Boulogne-Billancourt
            gives more breathing room but its own well-rated options still sell out for the tournament&apos;s
            second week and finals weekend.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
