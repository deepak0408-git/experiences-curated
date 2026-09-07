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
      eventName="Mexico City Grand Prix"
      status="teaser"
      h1="A race weekend that collides with Día de Muertos, hour by hour"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full hour-by-hour itinerary — sequenced against the real session schedule, the Día de Muertos parade, and a genuine Teotihuacán day trip, not just a generic race-weekend template."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Mexico City runs a standard 3-day Grand Prix weekend — Friday through Sunday — but 2026 carries a genuine
        complication most other race weekends don&apos;t: the city&apos;s Día de Muertos Grand Parade falls on
        Saturday 31 October, directly inside race weekend itself. That means Saturday specifically needs real
        planning, not just a qualifying-session-and-dinner day like it would be most other years.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Within the three core days, each has a different job. Thursday (before track action starts) is the natural
        day for the one genuine out-of-city commitment — Teotihuacán — since it eats most of a day including travel.
        Friday is practice, light on track commitments, and a good day for the Zócalo/Cathedral/Templo Mayor loop in
        the city itself. Saturday is qualifying and the parade, both real commitments on the same day. Sunday is race
        day, with the Foro Sol podium ceremony as the closing spectacle.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Teotihuacán day trip" summary="An early start to beat the heat and crowds, back in the city by evening with time to spare" />
        <DayCard day="Friday — Practice, Zócalo & historic center" summary="Circuit sessions, then the Zócalo/Cathedral/Templo Mayor loop in the afternoon or evening" />
        <DayCard day="Saturday — Practice, qualifying & the Día de Muertos parade" summary="Practice 3, qualifying, plus catching part of the parade — the one day this year that needs real sequencing" />
        <DayCard day="Sunday — Race day" summary="Arrival timing by grandstand, the race itself, the Foro Sol podium ceremony" />
        <DayCard day="Monday (optional) — More of the city" summary="If your trip extends a day further, Chapultepec, the Frida Kahlo Museum, or Xochimilco round out the sightseeing without competing with track sessions" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour
          </p>

          <ItineraryTable
            day="Thursday — Teotihuacán day trip"
            rows={[
              { time: "Early morning", location: "Terminal de Autobuses del Norte or your hotel", activity: "Take the Autobuses Teotihuacán service (every 15-30 min, 6am-6pm) or a taxi/rideshare — either way, leave early to beat both the midday heat and the busiest crowds at the pyramids." },
              { time: "Late morning to early afternoon", location: "Teotihuacán archaeological site", activity: "Budget 3-4 hours to see the Pyramid of the Sun, Pyramid of the Moon, and the Avenue of the Dead properly — climbing the Pyramid of the Sun is still permitted and the single most memorable part of the visit." },
              { time: "Evening", location: "Back in the city", activity: "Return by bus or taxi — a full round trip including site time runs close to 6 hours, so expect to be back with a real evening still ahead of you." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice day"
            rows={[
              { time: "12:30 PM – 1:30 PM", location: "Your booked grandstand", activity: "Practice 1 — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines before qualifying and race day." },
              { time: "4:00 PM – 5:00 PM", location: "Your booked grandstand", activity: "Practice 2 — the second and final practice session of the weekend." },
              { time: "Evening", location: "The Zócalo, Metropolitan Cathedral & Templo Mayor", activity: "A genuinely walkable half-day loop through the historic center — the cathedral is free, Templo Mayor's museum takes 60-90 minutes." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Practice, qualifying & the parade"
            rows={[
              { time: "11:30 AM – 12:30 PM", location: "Your booked grandstand", activity: "Practice 3 — the final tuning session before qualifying, on the same day this year." },
              { time: "3:00 PM – 4:00 PM", location: "Your booked grandstand", activity: "Qualifying — sets Sunday's starting grid." },
              { time: "Evening", location: "Along the parade route (Chapultepec to the Zócalo)", activity: "Head over after qualifying to catch part of the Día de Muertos Grand Parade — the stretch between the Angel of Independence and Alameda Central is repeatedly named as where the atmosphere peaks." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "Several hours before gates", location: "Your booked grandstand or GA zone", activity: "Race day carries the heaviest Metro and foot traffic of the weekend, and several Metro stations close specifically on race day — head to Velódromo if your usual station is affected." },
              { time: "2:00 PM", location: "Your booked grandstand", activity: "Lights out — the Grand Prix itself. Foro Sol grandstands specifically get the podium ceremony at ground level after the checkered flag." },
              { time: "After the race", location: "Foro Sol / around the circuit", activity: "If you're in or near Foro Sol, stay for the podium ceremony — fans remain in their seats as the celebration happens right there, a genuine Mexico City signature no other race replicates." },
            ]}
          />

          <ItineraryTable
            day="Monday (optional) — More of the city"
            rows={[
              { time: "Morning", location: "Chapultepec Park & the National Museum of Anthropology", activity: "A genuine half-day commitment in a green, less-touristed part of the city — worth the day if you didn't fit it in earlier in the weekend." },
              { time: "Early afternoon", location: "Frida Kahlo Museum (Casa Azul), Coyoacán", activity: "Timed-entry, online-only tickets — book well ahead given the Día de Muertos overlap, ideally a month or more out, not the usual 2-4 week window." },
              { time: "Afternoon to evening", location: "Xochimilco & the Trajinera Canals", activity: "A genuine half-to-full-day commitment on its own — better suited to an extra day than squeezed alongside a track session, since rushing it defeats the point." },
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
