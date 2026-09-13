import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

// Free "Event rhythm" + paid hour-by-hour, per skill §1a — status must stay
// "teaser", not "gated". Built last, drawing on every other spoke's
// content (Fan Zone/Arrival, Day Trips, Where to Eat, Tickets).
//
// Real, confirmed 2026 session times (founder-supplied screenshot from
// formula1.com/en/racing/2026/qatar, 13 Sep 2026, track-local time):
// Fri P1 16:30-17:30, P2 20:00-21:00; Sat P3 17:30-18:30, Quali 21:00-22:00;
// Sun Race 19:00. Corrected 13 Sep 2026 after an earlier draft wrongly
// stated these times weren't published yet and vaguely called the daytime
// gap "morning" — Saturday in particular is free from wake-up until 17:30,
// not just a morning window, which changes what genuinely fits that day.
export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const dohaTour = linkedExperiences.find((e) => e.slug.includes("qatar-gp-doha-fan-city-tour-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="teaser"
      h1="Every session runs in the afternoon or evening — Sunday's race starts at 19:00 and finishes well after dark"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real, confirmed session times are free above. The pack adds our actual hour-by-hour plan — when to arrive, which day to slot the desert safari and museums around the long free stretches this schedule leaves open, and the one sequencing mistake that costs first-timers a full evening."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Qatar&apos;s 2026 race weekend runs Friday through Sunday, and every on-track session — practice, qualifying,
        and the race itself — lands in the afternoon or evening. There is no morning session at all across the whole
        weekend, and Saturday in particular leaves a genuinely long stretch of free time before anything on-track
        happens.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Event rhythm — free, confirmed 2026 times</p>
      <div className="flex flex-col gap-3 mb-8">
        <RhythmRow day="Friday" label="Practice 1: 16:30–17:30 · Practice 2: 20:00–21:00" detail="Both sessions run afternoon into evening — P2 finishes after dark under the lights." />
        <RhythmRow day="Saturday" label="Practice 3: 17:30–18:30 · Qualifying: 21:00–22:00" detail="The whole day is free until late afternoon — nothing on-track happens before 17:30." />
        <RhythmRow day="Sunday" label="Race: 19:00" detail="The Grand Prix itself starts after dark and finishes well into the night, with the post-race concert following straight after." />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The Fan Zone fills the gaps</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          With every session landing in the afternoon or evening, daytime hours are genuinely free across all three
          days — longest on Saturday, where nothing on-track happens before 17:30. The Fan Zone behind Main
          Grandstand, simulators, and the Pit Stop Challenge are all there for exactly that downtime, included with
          any ticket. See the Arrival guide for the full breakdown.
        </p>
      </div>

      {dohaTour && (
        <div className="mb-8">
          <SpokeExperienceCard experience={dohaTour} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The hour-by-hour we&apos;d actually run</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Fly in the day before Friday practice if you can — it buys you a genuinely free day to slot in the Khor
            Al Adaid desert safari (a 4-8 hour door-to-door commitment that doesn&apos;t fit around a session day)
            before the weekend proper starts. Saturday is the day this schedule actually gives you the most room:
            nothing on-track happens before Practice 3 at 17:30, so a full daytime museum visit — the National Museum
            of Qatar is the stronger single pick if you only have time for one — fits comfortably before you need to
            head to the circuit for qualifying at 21:00. Sunday, race day itself, is not the day to add a new
            activity even though the race doesn&apos;t start until 19:00 — keep the daytime to the Fan Zone and a
            relaxed build-up rather than something that risks running long.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The mistake we&apos;d avoid</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Don&apos;t book a sit-down Souq Waqif or Parisa dinner for Friday or Saturday evening — Friday&apos;s
            second practice runs 20:00-21:00 and Saturday&apos;s qualifying runs 21:00-22:00, so both evenings are
            already spoken for by the time a normal dinner reservation would run. Book that dinner for an early
            Saturday evening instead, well before qualifying, when the day&apos;s only remaining session is Practice
            3 at 17:30 — the one genuine window across the weekend with no on-track session competing for it.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

function RhythmRow({ day, label, detail }: { day: string; label: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xs font-black tracking-widest uppercase text-[#AAFF00]">{day}</span>
        <span className="text-sm font-bold text-white">{label}</span>
      </div>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
