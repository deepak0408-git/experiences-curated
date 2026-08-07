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
      eventName="Nitto ATP Finals"
      status="teaser"
      h1="A sample ATP Finals week, day by day"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The week's shape above is free. The pack adds the full hour-by-hour itinerary — sequenced against real transit times and restaurant bookings for whichever days you're actually there."
    >
      {/* Free "Event rhythm" section — built on the real, confirmed 2026
          structure (15-20 Nov round robin, 21 Nov semifinals, 22 Nov
          final), not an assumed generic tennis-tournament template. See
          §2a-5 of the hub-and-spoke-event-pack skill. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The ATP Finals doesn&apos;t run like a Grand Slam, where the draw thins out day by day — round-robin means
        the first six days (15-20 November) all carry the same weight, each with two sessions (afternoon and
        evening) guaranteeing a doubles and a singles match involving top-8 players. There&apos;s no &quot;weak&quot;
        day in that stretch the way an early knockout round can feel thin.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        21 November shifts to semifinals — two sessions, early afternoon and evening. 22 November is finals day, a
        single session at 3pm, the one day with no second sitting. That structure shapes how a week here should be
        planned: a multi-day trip has real flexibility to build a Barolo day trip or a full city day into the
        round-robin stretch, since missing one group-stage session doesn&apos;t cost you as much as missing a
        semifinal or final would.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Arrival (before 15 Nov)" detail="Settle in, install the TO Move and FreeNow apps, and get oriented — Piazza San Carlo for an early aperitivo is a good first evening." />
        <DayCard day="Group stage days (15-20 Nov)" detail="Two sessions daily. Build in a city day (Mole Antonelliana, Museo Egizio, Royal Palace) or the Barolo day trip on whichever day suits your session tickets least." />
        <DayCard day="Semifinals (21 Nov)" detail="Two sessions — protect this day if you have tickets, since round-robin qualification determines who's actually playing." />
        <DayCard day="Final (22 Nov)" detail="Single 3pm session — the whole day builds toward this, no second sitting to fall back on if plans shift." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Times aren't fixed until closer to the event</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The tournament itself states session times and the program are indicative and may change closer to the
          event — build in flexibility around exact match times, especially in the group stage where the day/evening
          split can shift.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour — a 4-day trip
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Built for a short trip timed around the tournament's biggest sessions — arrive the day before a
            group-stage evening, use the middle two days for the city and Barolo, and let the final day overlap with
            whichever of semifinals or final your tickets cover. If your own trip is longer, drop the extra nights
            into more group-stage days using the same city/food picks below.
          </p>

          <ItineraryTable
            day="Day 1 — Arrival"
            rows={[
              { time: "Afternoon", location: "Turin Airport (Caselle) → hotel", activity: "Take the SFM train (every 30 min, ~30 min) to Porta Susa, buying the Integrato B combined ticket (~€4.20) to cover the onward metro/tram leg in one purchase. Install TO Move (for GTT transit) and FreeNow (Turin's real ride-hailing app — standard UberX doesn't operate here) before you land." },
              { time: "Evening", location: "Piazza San Carlo", activity: "An early aperitivo at one of the square's historic cafés — the natural first-evening move, and it sets up the vermouth tradition you'll be drinking all week. Early night ahead of tomorrow's session." },
            ]}
          />

          <ItineraryTable
            day="Day 2 — Group-stage day"
            rows={[
              { time: "Morning", location: "Mole Antonelliana or Museo Egizio", activity: "Pick one — both are a genuine half-morning, not a rushed hour. Save the other for a spare morning later in the trip if you have one." },
              { time: "Midday", location: "Caffè Al Bicerin", activity: "The original bicerin, at the café that's served it since 1763 — go before lunch crowds build." },
              { time: "Afternoon session", location: "Inalpi Arena, north gates (Piazzale Grande Torino)", activity: "General admission uses the north side, the same side as the Fan Village — arrive a little early for time in the Play Garden or food court first. Take tram 4 or 10 from Sebastopoli stop, about a 5-minute walk from the entrance; tram 4 runs direct from Porta Nuova." },
              { time: "Evening", location: "Scannabue or Ristorante Consorzio", activity: "Agnolotti del plin and tajarin — book ahead. Save Razzo for a night you want one tasting-menu-level dinner rather than two more relaxed ones." },
            ]}
          />

          <ItineraryTable
            day="Day 3 — Barolo day trip"
            rows={[
              { time: "Morning", location: "Turin → Barolo (by car, ~50 min)", activity: "Depart by mid-morning at the latest — plan the day around the group-stage session you're least attached to, since the drive plus a genuine half-day in the wine hills doesn't leave margin for an afternoon session back in Turin." },
              { time: "Midday–afternoon", location: "Barolo / Serralunga d'Alba / Castiglione Falletto", activity: "Two winery visits plus one village stop is a realistic day — Fontanafredda's confirmed 90-minute Serralunga tasting is the easiest to book with a fixed November slot." },
              { time: "Evening", location: "Return to Turin", activity: "No session tonight by design — this is the one day built with zero tennis commitments, so there's no clock to watch on the way back." },
            ]}
          />

          <ItineraryTable
            day="Day 4 — Finals day"
            rows={[
              { time: "Morning", location: "Hotel / city", activity: "Keep the morning light — this is the day everything else in the trip has been built around, so no half-day trips or long walks that eat into your margin." },
              { time: "Before the session", location: "Inalpi Arena — confirm your gate", activity: "Smash, Ace, and ATP No. 1 Club hospitality guests enter through separate south gates on Corso Sebastopoli — a different physical side of the building, not just a different queue. At 183 metres long, walking to the wrong entrance genuinely costs time; confirm which gate your ticket type uses before you arrive." },
              { time: "Semifinal (21 Nov) or Final (22 Nov)", location: "Your booked seat", activity: "Semifinals run two sessions, early afternoon and evening — protect the whole day if you're attending. Finals day is a single 3pm session with no second sitting to fall back on if plans shift." },
              { time: "Evening / departure", location: "Hotel → Turin Airport (Caselle)", activity: "If your final session is 22 November, avoid flying out the same night — exit crowds and the adrenaline of a title match don't mix well with a tight connection. Building in a morning-after departure gives real margin instead of rushing straight from Centre Court to the airport." },
            ]}
          />
        </div>
      )}
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

      {/* Desktop/tablet: real 3-column table, 25/25/50 split. Mobile: stacked
          cards — same pattern as Bahrain GP's ItinerarySpoke, see
          hub-and-spoke-event-pack skill §2. */}
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
