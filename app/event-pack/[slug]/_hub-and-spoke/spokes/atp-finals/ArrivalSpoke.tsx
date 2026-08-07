import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const inalpiArena = linkedExperiences.find((e) => e.slug.includes("atp-finals-inalpi-arena"));
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="public"
      h1="Arrival at Inalpi Arena — the two gates"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Arrival strategy here is genuinely simpler than at most sports events, and it&apos;s worth saying why: every
        ATP Finals ticket, from Tribuna Galleria up to Premium Hospitality, is a fully reserved seat — there&apos;s no
        general-admission tier, no unreserved block to stake out, and no weather-exposed embankment to claim ground
        on. Your seat is yours whenever you arrive. What actually matters is picking the right entrance and not
        cutting your arrival too close on session days.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Two entrances — check which one is yours</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Standard match tickets (Tribuna Galleria, Tribuna Platea, and the tier below Premium Hospitality) use the
          north gates on Piazzale Grande Torino — the same side as the Fan Village, so arriving with some time to
          spare gives you the Play Garden or food court before your session rather than a walk-straight-to-your-seat
          arrival. Premium Hospitality guests (Smash, Ace, ATP No. 1 Club) enter through separate south gates on
          Corso Sebastopoli — a genuinely different side of the building, not just a different queue at the same
          door. At 183 metres long, walking around to the wrong entrance is a real, time-costing mistake, so confirm
          which gate your ticket type uses before you arrive, not once you&apos;re on the wrong side.
        </p>
      </div>

      {inalpiArena && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The venue itself</p>
          <SpokeExperienceCard experience={inalpiArena} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">When to actually arrive</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Since every seat is reserved, there&apos;s no arrival-time penalty on where you sit — the real reason to
          arrive early is everything around the match, not the match itself. Every session pairs a doubles match with
          a singles match, so arriving in time for the doubles (rather than timing your arrival to the singles
          start) means you don&apos;t miss real tennis while you&apos;re still finding your seat. On session days,
          build extra time into your tram journey specifically — trams 4 and 10 run noticeably busier as match-goers
          and regular commuters overlap (see the Getting There guide).
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Gate-opening times</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Exact gate-opening times ahead of each session aren&apos;t published by the tournament yet — we won&apos;t
          invent a specific hour. Check{" "}
          <a
            href="https://www.nittoatpfinals.com/en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AAFF00] hover:text-[#BBFF33] underline"
          >
            nittoatpfinals.com
          </a>{" "}
          closer to the event for confirmed times.
        </p>
      </div>
    </SpokeShell>
  );
}
