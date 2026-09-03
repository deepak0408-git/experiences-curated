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
      eventName="Bahrain Grand Prix"
      status="teaser"
      h1="A sample race weekend, hour by hour"
      question="What does a Sepang F1 race weekend actually look like?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full hour-by-hour itinerary — sequenced against real transit times and opening hours for everywhere it sends you."
    >
      {/* Free "Event rhythm" section — classic-pack "How the event unfolds"
          parity (see hub-and-spoke-event-pack skill §1a). Explains the
          shape of the weekend before the paid section gets tactical.
          Session times confirmed 4 Sep 2026 — FIA-announced schedule
          (see project_bahrain_gp_night_race_uncertainty.md, now resolved). */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A Grand Prix weekend runs on a fixed three-day rhythm on track — Friday is practice, Saturday is
        qualifying, Sunday is the race — but a trip built only around those three days wastes real time either
        side of it. Flying in the day before practice starts gives you a genuine first evening in Kuala Lumpur
        with nothing else competing for it; staying an extra day after the race turns Genting Highlands from a
        rushed detour into a real, unhurried day out instead of skipping it. Within the three race days
        themselves, each has a different job. Friday is still light on track commitments — practice sessions
        don&apos;t fill a whole day — so it&apos;s the one day with real room for a half-day trip before you need
        to be trackside. Saturday is the pivot day: qualifying decides Sunday&apos;s grid, and because it&apos;s a
        single, shorter session rather than a full race, there&apos;s a genuine window either side of it. Sunday
        is the race itself, and everything about that day — when you arrive, where you sit, how you leave — is
        dictated by the grandstand you&apos;ve booked.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 has confirmed session times for the weekend: FP1 12:30pm and FP2 4pm on Friday, FP3 12:30pm and
        qualifying 4pm on Saturday, and the race itself at 3pm local time on Sunday.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Arrival" summary="Land, settle in, and use the evening for the Petronas Twin Towers and central KL" />
        <DayCard day="Friday — Practice" summary="A Batu Caves half-day trip in the morning, practice sessions and the circuit the rest of the day" />
        <DayCard day="Saturday — Qualifying" summary="Putrajaya in the morning, qualifying session, evening in the city" />
        <DayCard day="Sunday — Race" summary="Arrival timing by grandstand, the race itself, post-race food and departure planning" />
        <DayCard day="Monday — Optional" summary="If you've stayed the extra day, a full unhurried Genting Highlands day trip before flying home" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour
          </p>

          <ItineraryTable
            day="Thursday — Arrival day"
            rows={[
              { time: "Afternoon", location: "KLIA → hotel", activity: "Arrive and get to your base. Landing at KLIA Terminal 2 puts you a 1-minute walk from the circuit if your routing allows it for race days; for tonight, head into the city — KLIA Ekspres from the airport to KL Sentral runs 33 minutes for RM55." },
              { time: "Evening", location: "Petronas Twin Towers, KLCC", activity: "The towers are lit and open for evening viewing, and the surrounding KLCC park and shopping district gives you a genuine first taste of the city with nothing else competing for the evening. No circuit commitments yet, so this is the one night of the trip with no clock to watch." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice day"
            rows={[
              { time: "Early morning", location: "Batu Caves", activity: "Go before 9am to beat the heat and tour groups — the 272 rainbow steps, the 42.7m gold statue, and the Temple Cave are a genuine half-day, not a full one, so this fits ahead of practice. Entry to the main cave is free; budget around RM35 if you add the Dark Cave tour." },
              { time: "Midday", location: "Sepang International Circuit", activity: "First circuit visit — find your grandstand, walk the concourse near it before race-day crowds arrive. Near the Main Grandstand, the Mall has the best food and facilities." },
              { time: "12:30pm–1:30pm & 4pm–5pm", location: "Your booked grandstand", activity: "FP1 and FP2 — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines before qualifying and race day." },
              { time: "Evening", location: "Jalan Alor, Bukit Bintang", activity: "Ease into the city — loud, cheap street food, the easiest possible introduction to Kuala Lumpur after a travel day." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Qualifying day"
            rows={[
              { time: "Morning", location: "Putrajaya", activity: "The tighter fit at 30-45 minutes from central KL — the Pink Mosque and a lake cruise make a real morning without eating into the whole day. Check the mosque's specific non-Muslim visiting windows against your plan before you go." },
              { time: "Early afternoon", location: "En route back to Sepang", activity: "Build in real transit buffer from Putrajaya — don't cut it close against the qualifying session." },
              { time: "4pm–5pm", location: "Your booked grandstand", activity: "Qualifying — shorter than the race, and it sets Sunday's grid. FP3 runs 12:30pm–1:30pm beforehand if your grandstand access covers it." },
              { time: "Evening", location: "Old China Cafe, Chinatown", activity: "A calmer sit-down dinner in a 1920s shophouse. Reserve ahead — the heritage building means genuinely limited seating." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "Before the gates", location: "Hill Stand (general admission)", activity: "Arrive earliest of all three stands below — no reserved return to your spot, and the best ground near the canopy fills up first." },
              { time: "Before the gates", location: "K1 grandstand", activity: "Arrive early enough to claim a block position with sight of both Turn 1 and Turn 2." },
              { time: "Before the gates", location: "Main Grandstand", activity: "Arrive before the cars roll out for the pre-race grid walk from almost pit-wall distance." },
              { time: "3pm start", location: "Your booked grandstand", activity: "The race itself." },
              { time: "After the chequered flag", location: "Sepang exit routes", activity: "Expect exit crowds to take real time to clear. Build slack into any same-day departure flight — if you're flying from KLIA Terminal 2, you're still only a short walk from the gates even once the circuit is at its busiest." },
            ]}
          />

          <ItineraryTable
            day="Monday — Optional Genting Highlands day"
            rows={[
              { time: "All day", location: "Genting Highlands", activity: "Only makes sense as a full day, not a squeeze between other plans — the Awana SkyWay climb, the 22°C air (colder after dark), and the resort itself are worth the 60-75 minutes each way on their own terms. Go on a weekday if your extra day falls on one, to avoid cable car queues. The Genting Express bus from KL Sentral runs roughly RM11-15 one way." },
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

      {/* Desktop/tablet: real 3-column table, 25/25/50 split. Mobile: a
          25%-wide column is only ~2-3 characters on a phone, so even short
          words like "Midday" or "Practice sessions" broke mid-word — no
          table layout fits 3 real columns at phone width. Stacked cards
          instead, same pattern as the Tickets "Options compared" fix. */}
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
