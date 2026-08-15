import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

// Content ported from the real "The Hill," "The Outer Courts," "The
// Practice Courts," and "Wimbledon Museum & Private Tour" experiences plus
// the classic pack's Quick Reference address row — the real, already-
// approved classic-pack copy. "The Hill" added 14 Aug 2026 — it had no
// SpokeExperienceCard anywhere in the pack (§4b-1 item 1 gap, caught during
// the pre-launch gate pass) despite being one of Wimbledon's most iconic
// experiences; Map is its natural home alongside the other grounds/facility
// cards.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const theHill = linkedExperiences.find((e) => e.slug.includes("the-hill-wimbledon"));
  const outerCourts = linkedExperiences.find((e) => e.slug.includes("wimbledon-outer-courts"));
  const practiceCourts = linkedExperiences.find((e) => e.slug.includes("wimbledon-practice-courts"));
  const museum = linkedExperiences.find((e) => e.slug.includes("wimbledon-museum-private-tour"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="public"
      h1="18 courts, Aorangi Park practice courts, and the museum"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Inside the All England Club you&apos;ll find 18 courts and about forty years of compressed tradition. What&apos;s
        less obvious from the outside is how accessible it actually is once you know how to move around.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Site facts</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Address" value="Church Road, Wimbledon, London SW19 5AE" />
        <FactRow label="Total courts" value="18, including Centre Court and No. 1 Court" />
        <FactRow label="Best grounds-pass courts" value="Courts 3, 12, and 18 — Court 3 most often draws a seeded player in the first week" />
      </div>

      {theHill && (
        <div className="mb-8">
          <SpokeExperienceCard experience={theHill} isPro={isPro} />
        </div>
      )}

      {outerCourts && (
        <div className="mb-8">
          <SpokeExperienceCard experience={outerCourts} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Watching outer-court tennis well</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Think match competitiveness over names: a seeded player in a tight early-round match beats watching a big
          name cruise. Check the Order of Play each morning at wimbledon.com before you arrive — it goes up the
          night before.
        </p>
      </div>

      {practiceCourts && (
        <div className="mb-8">
          <SpokeExperienceCard experience={practiceCourts} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Aorangi Park practice courts</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          North end of the grounds — walk up and watch, no reserved spots or upgrade needed. Best access in the
          first few days, when top seeds are still warming up before their early-round matches. Grounds open at
          10am but practice can start before that — worth arriving early if you want to catch a specific player.
        </p>
      </div>

      {museum && (
        <div className="mb-8">
          <SpokeExperienceCard experience={museum} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Centre Court tours run outside the Championships only</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Tours of Centre Court aren&apos;t available during the Championships — book for the week before (closes
          mid-June) or after the tournament ends in mid-July.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Source: experience research and editorial content, wimbledon.com.
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
