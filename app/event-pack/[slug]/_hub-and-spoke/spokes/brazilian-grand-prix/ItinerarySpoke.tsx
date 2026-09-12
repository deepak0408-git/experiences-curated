import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

// Standard 3-day FP1/FP2/FP3/Quali/Race format confirmed for 2026 (no
// Sprint weekend at Interlagos this season, per project memory) — unlike
// several other 2026 events on the calendar. Official session times (track
// time, formula1.com/en/racing/2026/brazil) confirmed 12 Sep 2026: FP1
// 12:30-13:30 and FP2 16:00-17:00 Fri 6 Nov; FP3 11:30-12:30 and Qualifying
// 15:00-16:00 Sat 7 Nov; Race 14:00 Sun 8 Nov. Bookended with a Thursday
// arrival day (GRU landing + one in-city half-day stop) and a Monday day
// trip (São Roque / Santos & Guarujá / Campos do Jordão, all sourced from
// DayTripsSpoke) so the full itinerary runs Thu-Mon, not just the 3 core
// session days. Friday and Saturday evenings each bake in a real sightseeing
// or nightlife stop alongside dinner, not dinner alone — Avenida Paulista's
// street/architecture (not MASP's interior, which keeps normal museum
// hours) plus Liberdade's Japantown streets on Friday, Bar Brahma's live
// samba after dinner on Saturday — all sourced from DayTripsSpoke and
// WhereToEatSpoke's existing experiences, not invented for this pass.
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
      eventName="Brazilian Grand Prix"
      status="teaser"
      h1="A standard 3-day weekend — no Sprint format this year at Interlagos"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full hour-by-hour itinerary from Thursday's arrival to Monday's day trip — exact session-window timings, two different real nights out (not just where to eat), and the one out-of-city excursion that actually fits, not a generic race-weekend template."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Interlagos runs the standard 3-day Formula 1 format for 2026 — Friday practice, Saturday practice and
        qualifying, Sunday race — with no Sprint session this year. Official session times (track time): Practice 1
        12:30-13:30 and Practice 2 16:00-17:00 on Friday 6 Nov; Practice 3 11:30-12:30 and Qualifying 15:00-16:00 on
        Saturday 7 Nov; the race goes lights-out at 14:00 on Sunday 8 Nov.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Arriving Thursday, the day before track action starts, is worth building in deliberately rather than as a
        buffer — it's the one day with zero session-time pressure, so it's the natural slot for the in-city
        sightseeing that doesn't need a full day of its own. Within the three core days, each has a different job.
        Friday is the lightest day on track and the natural window for a first-city orientation walk. Saturday's
        qualifying afternoon leaves an evening free for one of São Paulo's real dining picks. Sunday is race day,
        with Interlagos' bowl-shaped grandstands putting fans genuinely close to the podium celebrations. Monday,
        the day after, is the right window for a true out-of-city day trip — leaving Tuesday as your genuine travel
        day home.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Arrival & first orientation" summary="Settle in, then Ibirapuera Park or Beco do Batman in the afternoon before an early night ahead of Friday practice" />
        <DayCard day="Friday — Practice & first orientation" summary="FP1 12:30-13:30, FP2 16:00-17:00, then an evening walk down Avenida Paulista before dinner in Liberdade's Japantown streets" />
        <DayCard day="Saturday — Qualifying & a real São Paulo night out" summary="FP3 11:30-12:30 and Qualifying 15:00-16:00 set Sunday's grid, then Figueira Rubaiyat or Maní for dinner, followed by live samba at Bar Brahma" />
        <DayCard day="Sunday — Race day" summary="Gates from around 08:00, lights out at 14:00, then Vila Madalena for a night out" />
        <DayCard day="Monday — one real day trip" summary="São Roque, Santos & Guarujá, or Campos do Jordão — pick one, don't try to pair it with a session day" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour
          </p>

          <ItineraryTable
            day="Thursday — Arrival day"
            rows={[
              { time: "Morning to early afternoon", location: "Guarulhos (GRU) to your hotel", activity: "Land, transfer, and check in — build in real buffer here rather than planning anything time-sensitive, since arrival delays are the one thing genuinely outside your control." },
              { time: "Afternoon", location: "Ibirapuera Park or Beco do Batman", activity: "Both are real half-day stops that don't need a full day to themselves — a relaxed way to shake off travel and get oriented without the pressure of a session-day schedule." },
              { time: "Evening", location: "Jardins or your hotel neighborhood", activity: "An early, easy dinner close to where you're staying — save the splurge reservations at Figueira Rubaiyat or Maní for Friday or Saturday night, once you're properly settled in." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice day"
            rows={[
              { time: "Morning", location: "Metrô Line 9 to Autódromo", activity: "Buy your Bilhete Único at a quiet station the day before if you haven't already — race-morning ticket queues at Autódromo build fast." },
              { time: "12:30-13:30", location: "Your booked grandstand", activity: "Practice 1 — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines and the walk time from your gate before qualifying and race day." },
              { time: "16:00-17:00", location: "Your booked grandstand", activity: "Practice 2 — the longer gap before this session is the natural window for lunch and a slower midday break in the city rather than staying at the circuit all day." },
              { time: "Evening", location: "Avenida Paulista, then Liberdade", activity: "Walk the avenue and MASP's exterior once FP2 wraps — the car-free closure and museum's own opening hours are both weekend/daytime-only, so this is the street and its architecture, not the pedestrian shutdown. Finish with dinner in Liberdade's Japantown streets — real neighborhood ramen shops, open evenings regardless of the weekend market." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Qualifying day"
            rows={[
              { time: "11:30-12:30", location: "Your booked grandstand", activity: "Practice 3 — the final tuning session before qualifying, and the last chance to check your grandstand's sightline before it matters most." },
              { time: "15:00-16:00", location: "Your booked grandstand", activity: "Qualifying — sets Sunday's starting grid." },
              { time: "Evening — dinner", location: "Figueira Rubaiyat or Maní", activity: "Book whichever splurge dinner you haven't already reserved — both fill up on weekend evenings, so this is the night to use the reservation you made weeks ahead." },
              { time: "Evening — after dinner", location: "Bar Brahma, downtown", activity: "Live samba downtown rather than just heading back to the hotel — a real, different night-out option to Sunday's Vila Madalena wander, and a better fit for a night that already started with a formal dinner." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "08:00", location: "Interlagos gates", activity: "Gates open — arrive close to this time if your grandstand or sightline matters to you, since there's no re-entry once you're in and security lines build fast." },
              { time: "14:00", location: "Your booked grandstand", activity: "Lights out — the Grand Prix itself. Interlagos' bowl-shaped layout puts fans in stands like A and M genuinely close to the on-track action." },
              { time: "Evening", location: "Vila Madalena", activity: "Bar-to-bar wandering to close out the trip — Mercearia São Pedro gets packed early on a night like this, so head over sooner rather than later." },
            ]}
          />

          <ItineraryTable
            day="Monday — one real day trip"
            rows={[
              { time: "Early morning to evening", location: "São Roque, Santos & Guarujá, or Campos do Jordão", activity: "Pick one based on what you want out of it: São Roque for a relaxed countryside wine day (~7 hours), Santos & Guarujá for football history and a beach afternoon (~8-12 hours), Campos do Jordão for a genuine mountain-town contrast (~12 hours round trip). Book through a tour operator rather than attempting any of these independently." },
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
