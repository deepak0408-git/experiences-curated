import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

// Sprint format confirmed for 2027 via grandprix.com.au's own official
// schedule page, 20 Sep 2026 (see project_australian_gp_2027_sprint_format
// memory): Friday = Practice 1 + Sprint Qualifying, Saturday = Sprint Race +
// Qualifying, Sunday = the Grand Prix. Exact session clock times are NOT
// yet published ("released closer to the Grand Prix" per the official
// page) — per the founder's explicit 20 Sep 2026 instruction, this itinerary
// deliberately does not state specific times, using only the confirmed
// day-by-day session skeleton and real activity content sourced from
// DayTripsSpoke/WhereToEatSpoke/ArrivalSpoke's own experiences.
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
      eventName="Australian Grand Prix"
      status="teaser"
      h1="2027's first-ever Sprint weekend at Albert Park — a genuinely different rhythm"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full day-by-day itinerary from Thursday's arrival to Sunday's race — how we'd actually sequence the Great Ocean Road and Yarra Valley around a Sprint weekend's compressed schedule, and the one combination that genuinely doesn't fit."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        2027 is the first time Formula 1&apos;s Sprint format has ever been used at Albert Park — a genuinely
        different weekend from recent years. Friday brings Practice 1 and Sprint Qualifying; Saturday brings the
        Sprint Race and Qualifying, effectively two competitive sessions in one day; Sunday is the Grand Prix
        itself. Exact session clock times haven&apos;t been published yet — check formula1.com or grandprix.com.au
        closer to race week for the confirmed schedule.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Anyone who last attended before 2027 should recalibrate their weekend plan around this change rather than
        assuming the old schedule still applies. Thursday, the day before any on-track action starts, is worth
        building in deliberately — it&apos;s the one genuinely free day, and the natural slot for a longer
        out-of-city day trip that a compressed Sprint weekend won&apos;t easily fit elsewhere.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Arrival & a real day off" summary="Settle in, then the Great Ocean Road or Yarra Valley — the one day this weekend with zero session-time pressure" />
        <DayCard day="Friday — Practice 1 & Sprint Qualifying" summary="Both sessions run, then an evening in South Melbourne or a first look at Federation Square and the CBD laneways" />
        <DayCard day="Saturday — Sprint Race & Qualifying" summary="Two competitive sessions in one day sets Sunday's grid, then the Lakeside Festival once track action wraps" />
        <DayCard day="Sunday — the Grand Prix" summary="Race day. Arrive with your gate and queue-timing plan from the Arrival guide already decided" />
        <DayCard day="Optional Monday — before you fly out" summary="If your flight home isn't until later, consider a Melbourne day trip — the city's laneways, Federation Square, and St Kilda are all easy half-day stops with zero session-time pressure, or an MCG tour and a look around Melbourne Park if you'd rather do something structured" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, day by day
          </p>

          <ItineraryTable
            day="Thursday — Arrival day"
            rows={[
              { window: "Morning to early afternoon", location: "Melbourne Airport (MEL) to your hotel", activity: "Land, transfer, and check in — build in real buffer here rather than planning anything time-sensitive, since arrival delays are the one thing genuinely outside your control." },
              { window: "Full day", location: "Great Ocean Road or Yarra Valley", activity: "This is the day to run whichever full-day excursion matters most — the Great Ocean Road's 12-13 hour round trip or Yarra Valley's shorter wine-country day. Both need a genuine day off, and Thursday is the only one this weekend that offers it with zero session conflict." },
              { window: "Evening", location: "St Kilda Road or the CBD", activity: "An easy dinner close to where you're staying — save exploring South Melbourne's Clarendon Street for Friday or Saturday, once you're properly settled in." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice 1 & Sprint Qualifying"
            rows={[
              { window: "Morning", location: "Tram or train to Albert Park", activity: "Both are free on race day with a valid ticket — head for your confirmed gate rather than the nearest one, and use the PTV app for real-time service updates." },
              { window: "Session 1", location: "Your booked grandstand or the Park Pass", activity: "Practice 1 — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines and the walk time from your gate before the rest of the weekend gets busier." },
              { window: "Session 2", location: "Your booked grandstand or the Park Pass", activity: "Sprint Qualifying — sets Saturday's Sprint Race grid, a genuinely new stake in Friday's action that a standard weekend format doesn't have." },
              { window: "Evening", location: "Federation Square, then South Melbourne", activity: "A first look at Federation Square and the CBD laneways once the day's sessions wrap, or head straight to South Melbourne's Clarendon Street for dinner if you'd rather stay close to the circuit." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Sprint Race & Qualifying"
            rows={[
              { window: "Session 1", location: "Your booked grandstand or the Park Pass", activity: "The Sprint Race — a shorter, standalone race with its own result, distinct from Sunday's Grand Prix." },
              { window: "Session 2", location: "Your booked grandstand or the Park Pass", activity: "Qualifying — sets Sunday's Grand Prix starting grid. Two competitive sessions in one day is the real signature of a Sprint weekend." },
              { window: "Evening", location: "The Lakeside Festival", activity: "Included with any Park Pass or grandstand ticket, no separate queue — walk from the track to the lakeside stage once the day's sessions wrap. Saturday's lineup, straight after Qualifying, typically brings the bigger international headline names." },
            ]}
          />

          <ItineraryTable
            day="Sunday — the Grand Prix"
            rows={[
              { window: "Gates open", location: "Your confirmed gate", activity: "Arrive close to gates-open time if your grandstand or a specific Park Pass spot matters — Sunday sees the largest crowds of the weekend, and Brocky's Hill regulars queue up to 90 minutes early." },
              { window: "Race", location: "Your booked grandstand or the Park Pass", activity: "The Grand Prix itself." },
              { window: "After the flag", location: "Any gate but the nearest one", activity: "Don't rush straight to the closest exit — a coffee, a lap of the Fan Zone, or a walk to a less obvious gate puts you ahead of the departure surge rather than in the middle of it." },
            ]}
          />

          <ItineraryTable
            day="Optional Monday — before you fly out"
            rows={[
              { window: "If your flight isn't until evening", location: "Melbourne CBD, Federation Square, St Kilda", activity: "Worth considering rather than a rushed morning at the hotel — all three are easy half-day stops with zero session-time pressure, and St Kilda's penguin colony viewing runs in the evening if your flight allows for it." },
              { window: "Alternative for the morning", location: "MCG or Melbourne Park", activity: "If you'd rather do something structured than wander, consider an MCG tour or a look around Melbourne Park (Australian Open precinct) — both run guided options and sit close enough to the CBD to fit before an evening flight." },
              { window: "If your flight is early", location: "—", activity: "Skip this day and head straight to the airport — none of these are worth compressing into a tight pre-flight window." },
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
  rows: { window: string; location: string; activity: string }[];
}) {
  return (
    <div className="mb-10">
      <p className="text-sm font-bold text-white mb-3">{day}</p>

      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A]">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left">
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">When</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">Location</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/2">Activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.window + i} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                <td className="px-4 py-3 text-white font-semibold align-top break-words">{row.window}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{row.location}</td>
                <td className="px-4 py-3 text-[#A3A3A3] leading-6 align-top break-words">{row.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={row.window + i} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm font-black text-white">{row.window}</p>
              <p className="text-xs text-[#AAFF00] text-right">{row.location}</p>
            </div>
            <p className="text-sm text-[#A3A3A3] leading-6">{row.activity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
