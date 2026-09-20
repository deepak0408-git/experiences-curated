import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

// Sprint weekend format for the 2027 Italian Grand Prix, 3-5 September 2027
// (per project CLAUDE.md calendar). Confirmed as a sprint event by the
// founder 20 Sep 2026 — provisional session times supplied directly (not
// independently researched further): FP1 Fri 12:30-13:30 CEST, Sprint
// Qualifying Fri 16:00-17:00, Sprint Race Sat 12:30-13:30, Qualifying Sat
// 16:00-17:00, Grand Prix Sun TBA. These replace the old standard-weekend
// FP1/FP2/FP3/Quali/Race shape — sprint format drops FP2/FP3 and adds a
// Saturday sprint race ahead of Saturday qualifying. A Thursday arrival day
// and Monday day-trip day still bookend the 3 core session days, sourced
// from DayTripsSpoke and WhereToEatSpoke's real experiences, matching the
// sibling-event itinerary pattern.
export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="teaser"
      h1="A sprint weekend, plus Ferrari's biggest crowd of the year"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full hour-by-hour itinerary from Thursday's arrival to Monday's day trip — real sequencing across the sprint format's compressed track days, a genuine night out, and the one out-of-city excursion that actually fits, not a generic race-weekend template."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The 2027 Italian Grand Prix runs the sprint weekend format — one practice session instead of three, plus a
        Saturday sprint race ahead of Saturday qualifying. Provisional timings (CEST, local): Friday FP1
        12:30-13:30 and Sprint Qualifying 16:00-17:00; Saturday Sprint Race 12:30-13:30 and Qualifying 16:00-17:00;
        Sunday&apos;s Grand Prix time is still TBA. These are provisional pending official confirmation from F1 —
        check the official calendar closer to the date.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Arriving Thursday, the day before track action starts, is worth building in deliberately — it&apos;s the
        one day with zero session-time pressure, the natural slot for Monza Town or an Alfa Romeo Museum half-day.
        Friday is a shorter track day than a standard weekend, but a busier one — FP1 and Sprint Qualifying both
        happen. Saturday adds the sprint race itself ahead of qualifying, which sets Sunday&apos;s grid, then
        leaves an evening free for one of Milan&apos;s real dining picks. Sunday is race day, capped by the track
        invasion — decide in advance whether you want to be part of it. Monday, the day after, is the right window
        for the Lake Como day trip, leaving Tuesday as your genuine travel day home.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Arrival & first orientation" summary="Settle into Milan, then Monza Town & the Royal Villa in the afternoon — a genuine half-day sightseeing stop most GP visitors skip entirely" />
        <DayCard day="Friday — FP1 & Sprint Qualifying" summary="FP1 (12:30-13:30) and Sprint Qualifying (16:00-17:00), then aperitivo in Milan before dinner at the fourth-generation trattoria or the Michelin-starred pick" />
        <DayCard day="Saturday — Sprint Race & Qualifying" summary="Sprint Race (12:30-13:30) sets the sprint result, then Qualifying (16:00-17:00) sets Sunday's grid, before a proper Milan dinner — save whichever splurge pick you haven't used yet" />
        <DayCard day="Sunday — Race day" summary="Grand Prix time still TBA — the race itself, then the track invasion — decide in advance if you want to be part of it" />
        <DayCard day="Monday — Lake Como" summary="A full day away from the circuit at a genuinely different pace, before Tuesday's travel day home" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, day by day
          </p>

          <ItineraryTable
            day="Thursday — Arrival day"
            rows={[
              { time: "Morning to early afternoon", location: "Malpensa (MXP) or Linate (LIN) to Milan", activity: "Land, transfer, and check in — build in real buffer here rather than planning anything time-sensitive." },
              { time: "Afternoon", location: "Monza Town & the Royal Villa", activity: "A genuine half-day stop, 2km from the circuit — the Iron Crown, a neoclassical palace, and a medieval centre most GP visitors never see." },
              { time: "Evening", location: "Your Milan neighborhood", activity: "An early, easy dinner close to where you're staying — save the aperitivo ritual and the splurge dinners for Friday and Saturday, once you're properly settled." },
            ]}
          />

          <ItineraryTable
            day="Friday — FP1 & Sprint Qualifying"
            rows={[
              { time: "Morning", location: "Porta Garibaldi to Monza", activity: "S8/S9/S11 suburban train, roughly 20 minutes, then the walk through Parco di Monza — budget real time for this." },
              { time: "12:30-13:30 (provisional, CEST)", location: "Your booked grandstand or GA section", activity: "FP1 — the sprint format's only practice session, so track time is scarcer than a standard weekend. Worth using to test your seat's sightlines before qualifying and race day." },
              { time: "16:00-17:00 (provisional, CEST)", location: "Your booked grandstand or GA section", activity: "Sprint Qualifying — sets Saturday's sprint race grid." },
              { time: "Evening", location: "Milan", activity: "Aperitivo — the pre-dinner ritual Campari itself was invented for — followed by dinner at the fourth-generation trattoria or the Michelin-starred pick, whichever you haven't booked for Saturday." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Sprint Race & Qualifying"
            rows={[
              { time: "12:30-13:30 (provisional, CEST)", location: "Your booked grandstand or GA section", activity: "Sprint Race — a shorter, standalone points-paying race, run at full intensity from lights to flag." },
              { time: "16:00-17:00 (provisional, CEST)", location: "Your booked grandstand or GA section", activity: "Qualifying — sets Sunday's starting grid for the Grand Prix itself." },
              { time: "Evening", location: "Milan", activity: "Your other splurge dinner — book both Milan picks ahead, since race weekend is one of the city's highest-demand dining periods of the year." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "07:00", location: "Circuit gates", activity: "Gates open — arrive close to this time if your seat or a good GA spot matters to you." },
              { time: "Afternoon (start time TBA)", location: "Your booked grandstand or GA section", activity: "The Grand Prix itself — Ferrari's home race, and the loudest, most red-flag-heavy crowd on the F1 calendar." },
              { time: "Post-race", location: "The start/finish straight", activity: "The track invasion, if you're staying for it — tens of thousands of fans flood the tarmac to watch the podium live. Follow marshal directions." },
            ]}
          />

          <ItineraryTable
            day="Monday — Lake Como"
            rows={[
              { time: "Full day", location: "Lake Como", activity: "A slower, more scenic day away from the circuit — a real commute trade-off from Milan, worth building in as its own dedicated day rather than squeezing it between sessions." },
            ]}
          />
        </div>
      )}
    </SpokeShell>
  );
}

function DayCard({ day, summary }: { day: string; summary: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-sm font-bold text-white mb-1">{day}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{summary}</p>
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
