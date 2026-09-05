import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

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
      eventName="United States Grand Prix"
      status="teaser"
      h1="A standard weekend, plus a real extra day worth planning for"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full hour-by-hour itinerary — sequenced against real session times, the Super Stage concert schedule, and a genuine day-trip option, not just a generic race-weekend template."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Austin runs a standard 3-day Grand Prix weekend for 2026 — Friday through Sunday, no sprint race — plus a
        new, separately-ticketed fourth day (Grand PrixView Thursday, 22 October) built around F1 Academy track
        action. That means a full trip genuinely spans four days if you add the Thursday preview, not the usual
        three.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Within the weekend, each day has a different job. Friday is the quietest and cheapest-feeling — practice
        sessions, smaller crowds, a good day to explore Austin&apos;s own neighborhoods before the weekend gets
        busy, and the first Super Stage concert (Maroon 5) in the evening. Saturday builds through qualifying into
        the second headline concert (Post Malone). Sunday is the race and Alesso&apos;s closing set. If your travel
        dates allow it, adding a day either before or after for Hill Country/Fredericksburg or San Antonio turns a
        tight race-only trip into a fuller Texas visit.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Optional Grand PrixView Thursday" summary="F1 Academy track action and early Fan Zone access — a separate ticket from the main weekend, from $20" />
        <DayCard day="Friday — Practice" summary="Circuit sessions in the afternoon, Maroon 5 headlines the Super Stage in the evening" />
        <DayCard day="Saturday — Qualifying" summary="Qualifying session, then Post Malone headlines the biggest concert night of the weekend" />
        <DayCard day="Sunday — Race" summary="Arrival timing by grandstand, the race itself, Alesso closes out the weekend" />
        <DayCard day="Optional extra day" summary="Texas Hill Country/Fredericksburg or San Antonio — either works well as a bookend day before or after the core weekend" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour
          </p>

          <ItineraryTable
            day="Thursday — Grand PrixView Thursday (optional)"
            rows={[
              { time: "Morning", location: "Arrival, hotel check-in", activity: "Land, settle in — this day works well as a soft landing before the main weekend's intensity picks up." },
              { time: "Afternoon", location: "Circuit of the Americas", activity: "F1 Academy track action and early Fan Zone access, on a separate ticket from the main race-weekend pass." },
              { time: "Evening", location: "South Congress or Sixth Street", activity: "A relaxed first evening in the city — South Congress for boots and murals, or Sixth Street if you want the nightlife right away." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice day"
            rows={[
              { time: "Morning", location: "Franklin Barbecue", activity: "If the line matters to you, this is the day to do it — Friday's queue is typically shorter than the weekend rush that follows." },
              { time: "Afternoon", location: "Your booked grandstand", activity: "Practice sessions (FP1 and FP2) — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines." },
              { time: "Evening", location: "Germania Insurance Super Stage", activity: "Maroon 5 headlines tonight — included on every ticket tier, GA included." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Qualifying day"
            rows={[
              { time: "Morning", location: "Lady Bird Lake or Zilker Park", activity: "A daytime outdoor activity before the afternoon session — kayaking on the lake, or a swim at Barton Springs Pool." },
              { time: "Afternoon", location: "Your booked grandstand", activity: "Qualifying — shorter than the race, and it sets Sunday's grid." },
              { time: "Evening", location: "Germania Insurance Super Stage", activity: "Post Malone headlines tonight — the single biggest concert draw of the weekend. Plan your exit route in advance." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "Several hours before gates", location: "Your booked grandstand or GA zone", activity: "Race day carries the heaviest traffic and shuttle demand of the weekend — arrive well ahead of the session, not just before it." },
              { time: "Afternoon", location: "Your booked grandstand", activity: "The race itself." },
              { time: "After the chequered flag", location: "Germania Insurance Super Stage", activity: "Alesso closes out the weekend. Expect the heaviest post-event traffic of the whole trip — build real slack into any same-day flight, and consider the 30-min-early or 45-min-late exit tactic from the Getting There guide." },
            ]}
          />

          <ItineraryTable
            day="Optional extra day"
            rows={[
              { time: "Full day", location: "Texas Hill Country & Fredericksburg", activity: "A 90-minute drive west via US-290 — 3-5 wineries, lunch, and a walk down Fredericksburg's Main Street. Better as a full dedicated day than a squeeze between track sessions." },
              { time: "Full day (alternative)", location: "San Antonio", activity: "80 miles south via I-35 — the Alamo, the River Walk, and (if time allows) San Antonio Missions National Historical Park. Reserve your free Alamo Church timed-entry ticket online before you go." },
            ]}
          />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: circuitoftheamericas.com, cbsaustin.com, austinmonthly.com.
      </p>
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
