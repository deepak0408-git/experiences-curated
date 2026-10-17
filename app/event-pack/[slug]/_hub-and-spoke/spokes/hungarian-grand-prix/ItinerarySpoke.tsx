import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

// Standard weekend format confirmed for the 2027 Hungarian Grand Prix — no
// "S" sprint marker on F1's official 2027 calendar announcement (Hungary,
// Round 13, 30 Jul-1 Aug 2027), unlike Austria/Great Britain which ARE
// marked. Real dates verified day-of-week before writing (30 Jul 2027 =
// Friday, 31 Jul = Saturday, 1 Aug = Sunday — standard Fri/Sat/Sun). Race
// start time (15:00 local) carried forward from this event's existing,
// founder-confirmed 2026 TOURNAMENT_RHYTHM content (classic pack) — same
// Sunday 15:00 local slot F1's European rounds use by convention; re-verify
// against the official 2027 calendar closer to the date since exact FP/
// Quali times aren't yet published this far out.
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
      eventName="Hungarian Grand Prix"
      status="teaser"
      h1="A standard weekend, Budapest on the side, and a race that's decided early"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full hour-by-hour itinerary from Thursday's arrival to Monday's day trip — real sequencing across the three session days, which evening to spend in the Jewish Quarter, and the one Budapest excursion that actually fits without cutting into session time."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The 2027 Hungarian Grand Prix runs the standard weekend format — no sprint, two practice sessions Friday,
        final practice and qualifying Saturday, race Sunday. Provisional timings (CEST, local, carried forward from
        this event&apos;s confirmed prior-year pattern — re-verify closer to the date): Friday FP1 and FP2;
        Saturday FP3 and Qualifying; Sunday&apos;s Grand Prix at 15:00 local, the same slot this event has used in
        recent seasons.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Arriving Thursday, the day before track action starts, is worth building in deliberately — it&apos;s the
        one day with zero session-time pressure, the natural slot for a full day on Castle Hill. Friday and
        Saturday are both genuine track days, with real evenings free in Budapest once each session wraps. Sunday
        is race day, capped by a circuit that&apos;s historically one of the hardest to pass on — most of the real
        action compresses into Turn 1 and the opening laps. Monday, the day after, is the right window for
        Széchenyi Thermal Bath or a slower farewell to the city, leaving Tuesday as your genuine travel day home.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Arrival & first orientation" summary="Settle into Budapest, then Castle Hill in the afternoon — a genuine full day of sightseeing most GP visitors underestimate" />
        <DayCard day="Friday — FP1 & FP2" summary="Two practice sessions, the quietest day on circuit, then goulash in the Jewish Quarter for an easy first evening" />
        <DayCard day="Saturday — FP3 & Qualifying" summary="Final practice in the morning, Qualifying in the afternoon sets Sunday's grid, then Szimpla Kert for a proper Saturday night" />
        <DayCard day="Sunday — Race day" summary="Gates open 7:30am, race at 15:00 local — Turn 1 decides most of the real action early on a circuit that's hard to pass on" />
        <DayCard day="Monday — Széchenyi Thermal Bath" summary="A slower day at Europe's largest medicinal bath before Tuesday's travel day home" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, day by day
          </p>

          <ItineraryTable
            day="Thursday 29 Jul — Arrival day"
            rows={[
              { time: "Morning to early afternoon", location: "Budapest Ferenc Liszt International (BUD) to Budapest", activity: "Land, transfer, and check in — build in real buffer here rather than planning anything time-sensitive." },
              { time: "Afternoon", location: "Castle Hill, Buda side", activity: "Fisherman's Bastion, Buda Castle, and the funicular — a genuine half-to-full day, worth doing properly on the one day with no session-time pressure." },
              { time: "Evening", location: "Your Pest neighbourhood", activity: "An early, easy dinner close to where you're staying — save Gettó Gulyás and Stand25 for Friday and Saturday, once you're properly settled." },
            ]}
          />

          <ItineraryTable
            day="Friday 30 Jul — FP1 & FP2"
            rows={[
              { time: "Morning", location: "Örs vezér tere to the Hungaroring", activity: "M2 metro to Örs vezér tere, HÉV suburban rail toward Kerepes, then the free shuttle to Gate 3 — budget real time for this, three legs end to end." },
              { time: "FP1 (provisional, CEST)", location: "Your booked grandstand or General Admission section", activity: "First practice — worth using to test your seat's sightlines before qualifying and race day, especially if you're on a hillside GA spot." },
              { time: "FP2 (provisional, CEST)", location: "Your booked grandstand or General Admission section", activity: "Second practice." },
              { time: "Evening", location: "Jewish Quarter", activity: "Gettó Gulyás for real Hungarian goulash — call ahead rather than walking in, especially on a weekend evening during race week." },
            ]}
          />

          <ItineraryTable
            day="Saturday 31 Jul — FP3 & Qualifying"
            rows={[
              { time: "FP3 (provisional, CEST)", location: "Your booked grandstand or General Admission section", activity: "Final practice — the last real setup window before parc fermé rules apply." },
              { time: "Qualifying (provisional, CEST)", location: "Your booked grandstand or General Admission section", activity: "Sets Sunday's grid — single-lap efforts expose the technical differences between drivers through the chicane and Turn 1 far more clearly than race laps with traffic." },
              { time: "Evening", location: "Buda, across the river", activity: "Stand25 Bisztró for the Bib Gourmand pick, or Szimpla Kert in the Jewish Quarter if a proper night out matters more than a destination meal." },
            ]}
          />

          <ItineraryTable
            day="Sunday 1 Aug — Race day"
            rows={[
              { time: "07:30", location: "Circuit gates", activity: "Gates open — arrive close to this time if your seat or a good General Admission spot matters to you." },
              { time: "15:00 (provisional, CEST)", location: "Your booked grandstand or General Admission section", activity: "The Grand Prix itself — watch Turn 1 closely; most of this circuit's real action happens there in the opening laps, with little else changing hands until pit strategy reshuffles the order." },
              { time: "Post-race", location: "Gate 3 shuttle", activity: "Return shuttle runs to Gödöllő station, not Kerepes — a genuinely different route from the morning. Build in real time for the queue; the whole crowd is leaving at once." },
            ]}
          />

          <ItineraryTable
            day="Monday 2 Aug — Széchenyi Thermal Bath"
            rows={[
              { time: "Full day", location: "Széchenyi Thermal Bath", activity: "Europe's largest medicinal bath complex — a genuine slow-paced day to close out the trip, buy a skip-the-line ticket online in advance for a summer-weekend crowd." },
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
