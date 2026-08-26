import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

// Itinerary spoke folds in "how the event unfolds" per hub-and-spoke skill
// §1a — free event-rhythm content, status stays "teaser" (never "gated").
// Real, confirmed 2027 structure: qualifying/exhibitions 11-16 Jan, the
// 15-day main draw 17-31 Jan (per sportingEvents.editorialOverview, already
// verified when the event row was created). Practice Week and Late Night at
// Melbourne Park both live here — event-rhythm/history content, not a
// ticket-purchase decision.
export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const practiceWeek = linkedExperiences.find((e) => e.slug.includes("practice-week-national-tennis-centre"));
  const lateNight = linkedExperiences.find((e) => e.slug.includes("late-night-melbourne-park-midnight-finishes"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="teaser"
      h1="A real 15-day draw, plus the practice week most first-timers skip"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="The week's real shape is free above. The pack adds the full hour-by-hour itinerary — sequenced against session times, a day-trip window, and which stretch of the draw to book your reserved seat for."
    >
      {/* Free "Event rhythm" section — built on the real, confirmed
          structure (qualifying/exhibitions 11-16 Jan, main draw 17-31 Jan),
          not an assumed generic template. Early rounds spread matches
          across every court including the outer showcourts; later rounds
          concentrate onto Rod Laver and Margaret Court Arena. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The tournament most people think of as &quot;the Australian Open&quot; is really the back half of a
        longer window. Qualifying and exhibition matches run 11-16 January, largely unnoticed by anyone who
        arrives for the main draw — then the 15-day main draw itself runs 17-31 January, moving from a wide field
        across every court in the first week to a handful of matches on the two biggest arenas by the second.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The National Tennis Centre&apos;s practice courts, adjacent to the main precinct, run open sessions during
        the week before qualifying even starts — the least-known, most underrated part of the whole event, and
        genuinely cheap relative to main-draw ticket prices.
      </p>
      {practiceWeek && (
        <div className="mb-8">
          <SpokeExperienceCard experience={practiceWeek} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The shape of the Fortnight</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Opening Week (11-16 Jan)" detail="Qualifying and exhibition matches, plus open practice at the National Tennis Centre — the cheapest, least crowded window to see players up close before the main draw starts." />
        <DayCard day="First week of the main draw (17-23 Jan)" detail="The most matches on the most courts — outer courts and Ground Pass access are at their best here, before the draw narrows." />
        <DayCard day="Second week (24-27 Jan)" detail="Fewer matches, higher stakes — quarterfinals onward concentrate onto Rod Laver and Margaret Court Arena." />
        <DayCard day="Semifinals and finals (28-31 Jan)" detail="The tournament's biggest sessions, and its highest reserved-seat prices — see the Cost Guide for how sharply this stretch climbs." />
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Night sessions carry their own real risk, at Rod Laver Arena and Margaret Court Arena alike: this is the
        Grand Slam most associated with genuinely late finishes, some running past 4am under lights — Rod Laver
        specifically has hosted the tournament&apos;s most extreme cases. New ATP/WTA scheduling rules introduced
        in 2024 are actively working to prevent this going forward, but the history is real and worth knowing
        before you book a night ticket at either arena and plan an early flight the next morning.
      </p>
      {lateNight && (
        <div className="mb-8">
          <SpokeExperienceCard experience={lateNight} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Exact session times can still shift</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The round-by-round dates above are the real, confirmed 2027 tournament structure — but exact daily
          session start times aren&apos;t set until closer to the tournament. Check the official day-by-day order
          of play once it&apos;s published via ausopen.com.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour — a 5-day trip
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Built for a trip timed around a first-week reserved seat and a day-trip window — arrive with a day to
            spare, use the middle days for early-draw matches and the outside courts, take a full day away from
            tennis, and finish with your booked session.
          </p>

          <ItineraryTable
            day="Day 1 — Arrival"
            rows={[
              { time: "Afternoon", location: "Flinders Street or Southern Cross → hotel", activity: "Settle in and get oriented. If you're staying East Melbourne, walk the route to Melbourne Park you'll use every match day — Batman Avenue along the Yarra." },
              { time: "Evening", location: "Federation Square & the CBD laneways", activity: "An evening walk through Hosier Lane and the surrounding laneways — the classic first-night move, a short walk from Flinders Street Station." },
            ]}
          />

          <ItineraryTable
            day="Day 2 — Ground Pass day"
            rows={[
              { time: "Morning", location: "Melbourne Park, gates open ~10am", activity: "Arrive close to gate-opening — a Ground Pass has no reserved seat, so early arrival genuinely earns better outer-court viewing." },
              { time: "Midday", location: "Grand Slam Oval & the Food Village", activity: "Lunch at one of the real Melbourne restaurant stalls, not generic stadium catering." },
              { time: "Afternoon", location: "Outside Courts 3-15", activity: "Move between numbered courts — early rounds mean top-20 players warming up close, with genuine standing room by early afternoon on a busy day." },
            ]}
          />

          <ItineraryTable
            day="Day 3 — Reserved-seat day"
            rows={[
              { time: "Morning", location: "Hotel / city", activity: "A lighter morning — today's ticket is a reserved seat, so there's no early-arrival advantage the way there was on your Ground Pass day." },
              { time: "Session", location: "Rod Laver Arena or Margaret Court Arena", activity: "Your booked reserved seat — see the Ticket Guide for how the tier structure and pricing work." },
              { time: "Evening", location: "CBD or East Melbourne", activity: "Dinner — book ahead if going somewhere specific, since match days genuinely fill up nearby restaurants." },
            ]}
          />

          <ItineraryTable
            day="Day 4 — Day trip"
            rows={[
              { time: "Morning", location: "Melbourne → Great Ocean Road or Yarra Valley", activity: "Depart with no session booked today — see the Day Trips guide for the real time commitment of each." },
              { time: "Midday–evening", location: "Twelve Apostles or Yarra Valley wineries", activity: "A genuine day away from tennis, built with no clock to watch on the way back." },
            ]}
          />

          <ItineraryTable
            day="Day 5 — Departure"
            rows={[
              { time: "Morning", location: "Hotel → airport", activity: "If your last session was a night match, book a relaxed next-morning departure rather than risking a same-day exit — see the Late Night experience for why this genuinely matters at this event." },
            ]}
          />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Exact 2027 session times haven&apos;t been published yet — confirm via ausopen.com closer to the tournament.
      </p>
    </SpokeShell>
  );
}

function DayCard({ day, detail }: { day: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{day}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}

function ItineraryTable({
  day,
  rows,
}: {
  day: string;
  rows: { time: string; location: string; activity: string }[];
}) {
  return (
    <div className="mb-10">
      <p className="text-sm font-bold text-white mb-3">{day}</p>

      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A]">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left">
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">Time</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">Location</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/2">Activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.time + i} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                <td className="px-4 py-3 text-white font-semibold align-top break-words">{row.time}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{row.location}</td>
                <td className="px-4 py-3 text-[#A3A3A3] leading-6 align-top break-words">{row.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={row.time + i} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm font-black text-white">{row.time}</p>
              <p className="text-xs text-[#AAFF00] text-right">{row.location}</p>
            </div>
            <p className="text-sm text-[#A3A3A3] leading-6">{row.activity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
