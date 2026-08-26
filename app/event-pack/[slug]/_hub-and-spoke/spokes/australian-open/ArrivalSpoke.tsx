import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const outsideCourts = linkedExperiences.find((e) => e.slug.includes("outside-courts-grounds-pass-strategy"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="public"
      h1="Early arrival only pays off if you're holding a Ground Pass"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        How early you should arrive at Melbourne Park depends entirely on which ticket you&apos;re holding — a
        reserved seat means your spot is yours whenever you arrive, but a Ground Pass has no assigned seating
        anywhere, so the earlier you&apos;re through the gates, the better your access to the outside courts.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ground Pass — arrive early, it genuinely matters</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Gates typically open around 10am during the day session. Outside courts fill up gradually through the
          morning — by early afternoon on a weekend, standing room is common at the more popular courts. Arriving
          close to gate-opening is the one part of an Australian Open visit where showing up early has a real,
          direct payoff: closer viewing, more courts seen before crowds build, and a better shot at seeing a
          higher-ranked player warming up before their session.
        </p>
      </div>

      {outsideCourts && (
        <div className="mb-8">
          <SpokeExperienceCard experience={outsideCourts} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Reserved seat — arrive on your own schedule</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A Grandstand, Show Court Reserved, or Hospitality ticket holds your seat regardless of arrival time —
          the early-arrival advantage here is about getting settled, browsing the wider precinct, and finding
          your gate before your session starts, not about claiming a spot. Still worth building in real margin,
          since Melbourne Park is a large complex and walking to the wrong entrance costs genuine time.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Exact gate-opening times aren&apos;t published yet</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The 2027 tournament&apos;s exact daily gate-opening times haven&apos;t been published as of this writing
          — based on the pattern in recent years, expect gates to open roughly 1-2 hours before the day session&apos;s
          first match. Confirm exact times via{" "}
          <a
            href="https://ausopen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AAFF00] hover:text-[#BBFF33] underline"
          >
            ausopen.com
          </a>{" "}
          closer to the tournament.
        </p>
      </div>

    </SpokeShell>
  );
}
