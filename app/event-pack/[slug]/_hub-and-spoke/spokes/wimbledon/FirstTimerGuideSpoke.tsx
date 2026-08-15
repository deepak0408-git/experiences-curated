import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Rebuilt 15 Aug 2026 per direct founder review, matched to ATP Finals'
// First-Timer's Guide depth (traditions, apps, practical essentials, sights
// worth the walk) rather than the previous thin Queue-only version. Real
// additions: (1) a real Traditions section (all-white player rule, Royal
// Box, bowing/curtsying history, Henman Hill naming) — researched via
// WebSearch, 15 Aug 2026; (2) the actual spectator dress-code myth
// dispelled (no white requirement for spectators — that's players-only,
// a genuine common first-timer confusion); (3) a real "mistakes first-
// timers make" section; (4) The Wimbledon Queue experience card added here
// alongside Preparing for Your Wimbledon Visit — both genuinely belong in
// a first-timer orientation, not just Arrival; (5) internal source line
// replaced with a reader-facing footer.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const preparing = linkedExperiences.find((e) => e.slug.includes("preparing-for-your-wimbledon-visit"));
  const theQueue = linkedExperiences.find((e) => e.slug.includes("the-wimbledon-queue"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="public"
      h1="Traditions, dress code, and what the official site won't tell you"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Wimbledon carries more tradition and unwritten etiquette than any other Grand Slam, and almost all of it is
        genuinely manageable once you know it going in. Here&apos;s the orientation that makes the rest of the pack
        make sense.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Traditions worth knowing before you go</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">All-white is a players-only rule — not a dress code for you</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Wimbledon&apos;s famously strict all-white clothing rule applies to competitors on court, not
            spectators — a genuinely common first-timer confusion. There&apos;s no official spectator dress code
            beyond a short banned list (no torn jeans, running vests, dirty trainers, or sports shorts). Centre
            Court and No. 1 Court skew smarter as the tournament goes on, especially finals weekend — smart-casual
            (a lightweight shirt or dress, chinos, clean trainers) reads right everywhere on the grounds.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">The Royal Box is invite-only, and the bowing tradition is mostly retired</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The Royal Box on Centre Court has hosted guests since 1922 — royals, heads of government, and other
            invited figures — and there&apos;s no public route to a seat in it. Players bowing or curtsying toward
            the box was standard until 2003; today it only happens if the monarch or the Prince of Wales is
            actually present, so don&apos;t expect to see it on a typical day.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Henman Hill has had three other names in the last decade</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The grassy bank by the big screen changes nickname with whichever British player is deep in the draw —
            Murray Mound, Draper&apos;s Drop, Raducanu Ridge have all stuck at different points. Officially it&apos;s
            just the Aorangi Terrace; the crowd renames it, not the AELTC.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">The grounds run quiet during points, not between them</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            No shouting or moving around during a point — genuinely enforced by stewards on the show courts, not
            just polite convention. Once the point ends, react however you like. Phones go on silent near any
            court, flash photography is never allowed during play.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Mistakes most first-timers make</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Under-planning the Queue&apos;s real start time — 4-5am arrivals aren&apos;t rare for a good position, and
          the first Tube and rail services of the day don&apos;t run that early, so factor in how you&apos;ll
          actually get there. Not downloading the Wimbledon App before travelling — tickets are managed digitally
          and you&apos;ll want it working before you&apos;re relying on grounds wifi. Skipping outer-court tennis
          entirely to camp near Centre Court all day — some of the tightest, most competitive matches of the whole
          Fortnight happen on Courts 3, 12, and 18 in the first week, and you&apos;ll miss them. Not bringing photo
          ID — you&apos;ll need it on the day regardless of ticket type. And treating the whole day as one long sit
          at a single court: build in time to just walk the grounds and take in the atmosphere, which is genuinely
          part of what people come back for.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {preparing && <SpokeExperienceCard experience={preparing} isPro={isPro} />}
        {theQueue && <SpokeExperienceCard experience={theQueue} isPro={isPro} />}
      </div>

      <p className="text-sm font-bold text-white mb-2">What&apos;s not allowed through the gates</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          One bag per person, max 40cm × 30cm × 30cm — hard-sided cases, cool-boxes, and picnic hampers aren&apos;t
          allowed regardless of size. Cameras with a standard lens are fine; anything over 300mm, plus tripods,
          monopods, and selfie sticks, are not. Alcohol is allowed within real limits (see the{" "}
          <a href={`/event-pack/${eventSlug}/weather`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Weather guide
          </a>{" "}
          for the exact figures) — you don&apos;t need to leave it behind entirely.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gates open at 10:30am daily</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Queue cards are issued from mid-afternoon the day before — one per person present, so the whole party
          needs to be there to be counted. Day tickets are released to queuers at 9:30am, ahead of the 10:30am gate
          opening.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A few things worth knowing upfront</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Centre Court tickets are harder than the ballot suggests — accept it early and you&apos;ll have a better
          trip. Queue camping is worth doing once. SW19 is a better base than central London. Read this pack as
          briefing notes from someone who&apos;s been going for years, not a category list.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: wimbledon.com (dress code, Queue guidance, gate times), ESPN and Keith Prowse (traditions, dress
        code history).
      </p>
    </SpokeShell>
  );
}
