import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Real gate-time facts researched fresh for this migration (9:30am day
// sessions, 6pm evening sessions, no overnight queue unlike Wimbledon).
// Morning at the Practice Facility (classic-pack experience) anchors the
// practice-viewing section; the new "When to Arrive" experience carries
// the full by-ticket-type breakdown.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const practiceCourts = linkedExperiences.find((e) => e.slug.includes("us-open-practice-courts"));
  const arrivalExp = linkedExperiences.find((e) => e.slug.includes("us-open-arrival-guide"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="public"
      h1="9:30am for a real shot at practice courts, gate time for everyone else"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The US Open doesn&apos;t run an overnight queue the way Wimbledon does — no camping, no numbered queue
        cards. Gates for day sessions open at 9:30am for most of the main draw, shifting to 11am in the tournament&apos;s
        final days; evening sessions open at 6pm regardless of date. The real arrival decision is about what you
        want out of the first hour once you&apos;re inside, not about beating a queue.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">When to arrive</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">To catch practice sessions</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Arrive at or just after 9:30am. Top players warm up for that afternoon&apos;s matches in full public
            view, no ticket upgrade needed beyond a Grounds Admission pass.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">For a straightforward Grounds Pass day</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Gate-opening time (9:30am) is early enough — there&apos;s no advantage to arriving before gates open,
            since the grounds themselves aren&apos;t rationed by arrival order, only individual court seating is.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">For a reserved day-session seat</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            A reserved seat at Ashe, Armstrong, or the Grandstand means there&apos;s no benefit to arriving right at
            gate-opening — budget 45-60 minutes before your session&apos;s first match for bag check and security.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">For a night session</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Gates open at 6pm; play rarely starts before 7pm. Arriving right at 6pm rather than 6:45pm gets you an
            extra hour to catch the day session's final outer-court matches for free.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {practiceCourts && <SpokeExperienceCard eventSlug={eventSlug} experience={practiceCourts} isPro={isPro} />}
        {arrivalExp && <SpokeExperienceCard eventSlug={eventSlug} experience={arrivalExp} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Fan Week — the lightest crowds of the whole event</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Qualifying week and Fan Week (23-29 August, before the main draw starts) offer meaningfully lighter
          practice-court crowds than the main draw's 9:30am rush — if your trip dates allow it, this window gets
          closer access to top players than any day once the tournament itself begins.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: usopen.org, Ticketmaster US Open fan buying guide.
      </p>
    </SpokeShell>
  );
}
