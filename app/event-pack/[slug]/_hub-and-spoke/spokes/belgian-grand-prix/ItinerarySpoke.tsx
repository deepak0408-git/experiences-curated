import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

// Standard weekend format confirmed for the 2027 Belgian Grand Prix (23-25
// Jul), verified directly against Formula1.com and spagrandprix.com, 12 Oct
// 2026 — no sprint session listed in either official schedule. Exact
// session clock times not yet published as of this build; stated honestly.
// A Thursday arrival day and Monday day-trip day bookend the 3 core session
// days, matching the sibling-event itinerary pattern (Italian GP).
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
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Belgian Grand Prix"
      status="teaser"
      h1="A standard weekend, across the longest circuit on the calendar"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full hour-by-hour itinerary from Thursday's arrival to Monday's Ardennes day trip — real sequencing across Spa's scale, a genuine evening out in Spa town, and the one outward excursion that actually fits, not a generic race-weekend template."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The 2027 Belgian Grand Prix runs the standard weekend format — two practice sessions Friday, final
        practice and qualifying Saturday, the race Sunday. Confirmed dates: 23–25 July 2027. Exact session clock
        times aren&apos;t published yet — check the official calendar closer to the date.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Arriving Thursday, the day before track action starts, is worth building in deliberately — the one day
        with zero session-time pressure, the natural slot for Stavelot&apos;s abbey and circuit museum. Friday and
        Saturday are the two practice/qualifying days, with Spa-town evenings in between. Sunday is race day,
        capped by what&apos;s historically a two-hour exit queue — decide in advance whether to stay for the
        podium or beat the worst of the traffic. Monday is the right window for the wider Ardennes day trip,
        leaving Tuesday as your genuine travel day home.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Arrival & first orientation" summary="Settle into Spa or Stavelot, then Stavelot's abbey and circuit museum in the afternoon — a genuine half-day stop most GP visitors have time for on arrival day" />
        <DayCard day="Friday — Practice 1 & 2" summary="Both practice sessions, then an evening in Spa town — frites and stoofvlees trackside, or a proper restaurant booking if you're planning ahead" />
        <DayCard day="Saturday — Final Practice & Qualifying" summary="Qualifying sets Sunday's grid, then a proper Spa-town dinner — save your splurge pick for whichever evening you haven't used yet" />
        <DayCard day="Sunday — Race day" summary="Gates from 06:00, race start mid-afternoon, then the historically slow exit — stay for the podium or plan your early walk to Stavelot" />
        <DayCard day="Monday — The wider Ardennes" summary="A full day away from the circuit, at a genuinely different pace, before Tuesday's travel day home" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, day by day
          </p>

          <ItineraryTable
            day="Thursday — Arrival day"
            rows={[
              { time: "Morning to early afternoon", location: "Brussels, Liège, or your arrival city", activity: "Land, transfer, and settle into Spa or Stavelot — build in real buffer here rather than planning anything time-sensitive." },
              { time: "Afternoon", location: "Stavelot — Abbey, Circuit Museum & Town", activity: "A genuine half-day stop, a short walk or drive from the circuit entrances — the abbey, the circuit museum, and a medieval town centre." },
              { time: "Evening", location: "Your Spa or Stavelot base", activity: "An early, easy dinner close to where you're staying — save the proper Spa-town evening for Friday or Saturday, once you're properly settled." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice 1 & 2"
            rows={[
              { time: "Morning", location: "Day-return shuttle or drive to the circuit", activity: "Arrive via your booked shuttle, or drive with pre-booked parking — allow real time given Spa's scale." },
              { time: "Both practice sessions", location: "Your booked grandstand or GA section", activity: "Use the day to test your seat's sightlines, or roam on Bronze GA to find your preferred spots for qualifying and race day." },
              { time: "Evening", location: "Spa town", activity: "Trackside frites and stoofvlees at the Fan Zone, or an early dinner in Spa town before the Saturday-night rush." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Final Practice & Qualifying"
            rows={[
              { time: "Morning", location: "Your booked grandstand or GA section", activity: "Final practice — the last real setup window before qualifying." },
              { time: "Afternoon", location: "Your booked grandstand or GA section", activity: "Qualifying — sets Sunday's starting grid. Gold 3 at Raidillon and Pouhon's Silver 3 both show real driver differences on single-lap pace." },
              { time: "Evening", location: "Spa town", activity: "Your proper dinner booking — Spa town fills on qualifying Saturday, so a reservation matters more tonight than any other evening." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "06:00", location: "Circuit gates", activity: "Gates open — arrive close to this time if a specific grandstand seat or fence-side GA spot matters to you." },
              { time: "09:30", location: "Kemmel Straight and other popular GA spots", activity: "Fence-side positions are typically gone by this time — build your morning around this cutoff if you're on General Admission." },
              { time: "Mid-afternoon", location: "Your booked grandstand or GA section", activity: "The Belgian Grand Prix itself — 44 laps of the longest circuit on the calendar, opening with Eau Rouge/Raidillon seconds into the race." },
              { time: "Post-race", location: "The circuit's exit roads", activity: "Historically a two-hour exit queue on the single-carriageway roads — stay for the podium ceremony, or walk to Stavelot and let the worst of it clear." },
            ]}
          />

          <ItineraryTable
            day="Monday — The wider Ardennes"
            rows={[
              { time: "Full day", location: "La Roche-en-Ardenne, Durbuy, or Han-sur-Lesse", activity: "A slower, more scenic day away from the circuit — a real driving commitment from Spa, worth building in as its own dedicated day rather than squeezing it between sessions." },
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
