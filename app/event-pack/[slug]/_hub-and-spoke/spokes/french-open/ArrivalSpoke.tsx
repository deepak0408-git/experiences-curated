import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Roland-Garros has no Wimbledon-style overnight Queue — arrival strategy
// here is about morning practice-court access and outer-court seating,
// researched during experience seeding (gonomad.com's 10am practice-viewing
// tip, Court 14's semi-sunken outer-court character).
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const practiceCourts = linkedExperiences.find((e) => e.slug.includes("roland-garros-practice-courts-outside-courts"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="public"
      h1="Before 10am for practice courts, gate-opening for the actual matches"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Roland-Garros doesn&apos;t run an overnight queue system the way Wimbledon does — gates open once each
        morning and any valid ticket gets you in. The real arrival decision here is about what you do with the
        first hour once you&apos;re inside, not how early you camp outside.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">When to arrive</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">To catch practice sessions</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Arrive before 10am. Top seeds warming up for that afternoon&apos;s matches train in full public view on
            the grounds&apos; practice courts, and morning arrivals routinely end up a few metres from a top-10
            player with no ticket upgrade needed.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">For a straightforward outer-court day</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Gate-opening time (typically 09:00-10:00, not yet published for 2027) is early enough — there&apos;s no
            queue-jumping advantage to arriving before gates open, since seating on the outside courts is
            first-come but the grounds themselves aren&apos;t rationed by arrival order.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">For a Chatrier or Lenglen day-session ticket</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            A reserved seat means there&apos;s no benefit to arriving right at gate-opening — the seat is yours
            regardless of arrival time. Most visitors arrive an hour or so ahead to clear security and reach the
            seat comfortably before the first match starts; check the daily order of play (released the evening
            before) for your session&apos;s actual first-match time.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">For a Chatrier night session</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Gates open at 18:30; play starts no earlier than 20:15. Arriving right at gate-opening leaves time to
            watch whatever&apos;s still finishing on outside courts before the main event, rather than sitting in an
            empty Chatrier for 90 minutes.
          </p>
        </div>
      </div>

      {practiceCourts && (
        <div className="mb-8">
          <SpokeExperienceCard experience={practiceCourts} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Court 14 — go early if a French player is drawn there</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Court 14 is a semi-sunken 2,200-seat outer court, and French players specifically want to be scheduled
          there in week one — the crowd is loud, partisan, and dedicated to noise from the first point to the last.
          Outer-court seating is unreserved and first-come, so if a home favourite is drawn there, arrive well
          ahead of that match&apos;s scheduled start.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: rolandgarros.com, gonomad.com (practice-court viewing tips).
      </p>
    </SpokeShell>
  );
}
