import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

// Free "Event rhythm" section per skill §1a — the real, confirmed Sprint
// session order (FP1+Sprint Quali Friday, Sprint+Quali Saturday, Race
// Sunday), with exact clock times honestly flagged as unpublished (§2a-3).
//
// Paid hour-by-hour rebuilt 30 Sep 2026 to match Brazilian GP's
// ItinerarySpoke table format (per-day Time/Location/Activity tables),
// which this spoke was missing entirely — it previously used prose-only
// ItineraryDay cards. Uses relative time blocks (Morning/Afternoon/Evening)
// rather than invented clock times, since 2027 session times are genuinely
// unpublished (confirmed in the Ticket Guide and First-Timer's Guide seed
// scripts) — inventing specific times here would violate skill §2a-3.
// Sourced from: japanese-gp-suzuka-first-timer-guide, -ticket-guide,
// -getting-there, -fan-zones, -nagoya-day-trip, -nagoya-food-scene,
// -ise-grand-shrine, -suzuka-circuit-park-motopia, -suzuka-city seed
// scripts — no new claims introduced.
export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const suzukaCity = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-city"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="teaser"
      h1="A new three-day rhythm — Sprint qualifying, Sprint, and race day, with the Nagoya days built around it"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real Sprint-weekend rhythm is free above. The pack adds the full hour-by-hour itinerary — which day to fit Ise Grand Shrine around your session times, when to eat at Atsuta Hōraiken to dodge the lunch queue, and the one combination of day trips that genuinely doesn't fit into a single Suzuka weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        2027 is Suzuka&apos;s first-ever Sprint weekend — a genuinely different rhythm from the classic three-day
        format the circuit has run for decades, and worth understanding before you build a day-by-day plan around
        it.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Event rhythm</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayRow day="Friday, 9 Apr" sessions="Practice 1, Sprint Qualifying" note="No FP2 or FP3 this year — a lighter on-track day than a classic weekend, with real downtime for the fan zones." />
        <DayRow day="Saturday, 10 Apr" sessions="Sprint Race, Grand Prix Qualifying" note="Two competitive sessions in one day — the Sprint itself, then qualifying for Sunday's race." />
        <DayRow day="Sunday, 11 Apr" sessions="Japanese Grand Prix" note="Race day." />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Clock times</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Not yet published for 2027 as of this writing — a genuinely new Sprint format at this circuit means
          there&apos;s no reliable prior-year pattern to lean on either. Check formula1.com closer to race week
          for confirmed daily session times.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The shape of a real trip</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Most first-time visitors build in a non-race day before or after the weekend — for Ise Grand Shrine, a
          full Nagoya day, or Sumo Studio Osaka — since the Sprint format&apos;s lighter Friday schedule already
          leaves real gaps to fill with the circuit&apos;s own fan zones. See the{" "}
          <a href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Day Trips guide
          </a>{" "}
          for the honest version of each option, including which ones are worth the real travel time.
        </p>
      </div>

      {suzukaCity && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={suzukaCity} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, day by day
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Exact 2027 session clock times aren&apos;t published yet — a genuinely new Sprint format at this
            circuit means there&apos;s no reliable prior-year pattern to lean on either. The blocks below use the
            confirmed session order and relative time-of-day; check formula1.com closer to race week for exact
            gate and session times, then slot them in.
          </p>

          <ItineraryTable
            day="Thursday — Arrival day"
            rows={[
              { time: "Morning to afternoon", location: "Chubu Centrair or Narita, to Nagoya Station", activity: "Land, transfer, and check in — see the Getting There guide for both airport routes. Build in real buffer here rather than planning anything time-sensitive." },
              { time: "Afternoon", location: "Osu or Nagoya Castle", activity: "A first walk through Osu's shopping streets and Osu Kannon, or Nagoya Castle's grounds and Honmaru Palace if your flight lands early enough — either is a real half-day stop, not a rushed add-on." },
              { time: "Evening", location: "Kinshachi Yokocho or your hotel neighborhood", activity: "An early, easy dinner — Kinshachi Yokocho sits right at the castle entrance if you've already been there. Keep the day genuinely light; jet lag plus a long-haul flight is a bad combination with a packed first day." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice 1 + Sprint Qualifying"
            rows={[
              { time: "Morning", location: "Nagoya Station to Suzuka Circuit Ino Station", activity: "Meitetsu/JR/Ise Railway via Yokkaichi (~90 min standard), or direct Kintetsu to Shiroko Station plus shuttle — the recommended race-weekend route. Build in real buffer; trains and shuttles run at capacity." },
              { time: "On-track", location: "Your booked grandstand", activity: "Practice 1, then Sprint Qualifying — no FP2 or FP3 this year, a lighter on-track day than a classic weekend." },
              { time: "Between sessions", location: "GP Square and the West Fanzone", activity: "Real downtime to fill — driver appearances and the Fan Forum Q&A on GP Square's stage, sim racing and the F1 Pitstop Challenge at the West Fanzone. Check the Fan Forum schedule as soon as it's published; good spots fill before the published start time." },
              { time: "Evening", location: "Sakae or Osu", activity: "Tebasaki at one of the city's many izakaya-style specialists closes out the day well if your energy holds." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Sprint Race + Grand Prix Qualifying"
            rows={[
              { time: "Morning", location: "Nagoya Station to Suzuka Circuit Ino Station", activity: "Same route as Friday — leave with the same buffer, since this is the busiest on-track day of the weekend." },
              { time: "On-track", location: "Your booked grandstand", activity: "The Sprint race itself — a genuine, competitive race with its own championship points — followed by qualifying for Sunday's Grand Prix. Two real sessions in one day." },
              { time: "Lunch", location: "At the circuit", activity: "Eat at the circuit rather than planning a trip back into Nagoya — save Atsuta Hōraiken's hitsumabushi for a day with more flexibility, since its real lunchtime queue doesn't suit a day built around fixed session times." },
              { time: "Evening", location: "Suzuka Circuit Park or Nagoya", activity: "Motopia and the Honda Racing Gallery run independently of the Grand Prix calendar if you want a wind-down stop before heading back, or return to Nagoya for dinner." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Japanese Grand Prix"
            rows={[
              { time: "Morning", location: "Nagoya Station to Suzuka Circuit Ino Station", activity: "Leave earlier than feels necessary — every train and shuttle runs at capacity on race day specifically, and a missed connection on a day with a fixed session start is a real risk." },
              { time: "Race", location: "Your booked grandstand", activity: "The Japanese Grand Prix. Check whether the Suzuka Grand Prix limited express (joint JR/Ise Railway direct service) is running on your travel day — when it is, it cuts the return journey to about an hour with no transfers." },
              { time: "Evening", location: "Nagoya", activity: "A closing dinner back in Nagoya — Sakae or Osu both work, depending on which side of the city your hotel is on." },
            ]}
          />

          <ItineraryTable
            day="Monday — one optional day trip"
            rows={[
              { time: "Morning", location: "Nagoya Station to Shin-Osaka", activity: "Shinkansen, around 50 minutes — considerably faster than the Kintetsu HINOTORI's ~2h10min alternative, and the better choice if a day trip is genuinely all the time you have." },
              { time: "Late morning to afternoon", location: "Dotonbori", activity: "Walked slowly, with real time for takoyaki and okonomiyaki at the street stalls — Osaka's own specialties, worth trying here rather than a version elsewhere in Japan. Gives a strong sense of Osaka on its own if time is tight." },
              { time: "Afternoon (if time allows)", location: "Osaka Castle", activity: "Add this only if you have the better part of a full day — a genuinely striking reconstructed castle set in a large park, worth an hour or two, but not worth rushing Dotonbori for." },
              { time: "Evening", location: "Shin-Osaka to Nagoya Station", activity: "Shinkansen back, ~50 minutes — this is a real four-to-five-hour round trip once both legs are counted, so treat it as a full day, not a half-day add-on. Optional: skip Osaka entirely and use Monday as a genuine rest day instead." },
            ]}
          />

          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Or, in place of Osaka</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-2">
              Ise Grand Shrine works best as a pre-race Wednesday/Thursday add-on rather than Monday, since it
              pairs more naturally with an early-week arrival — the Kintetsu Limited Express from Nagoya Station
              runs the route in around 80 minutes, and leaving mid-morning gives real daylight for both Geku and
              Naiku with the bus connection between them. A genuine half-day-to-full-day commitment on its own.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Don&apos;t try to combine Ise Grand Shrine and the Osaka day trip inside one day — each is a
              half-day-to-full-day commitment on its own, and Osaka&apos;s real round trip from Nagoya already
              runs four to five hours before you&apos;ve seen anything. Pick one, or spread them across two
              separate non-race days if your trip allows it.
            </p>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function DayRow({ day, sessions, note }: { day: string; sessions: string; note: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1.5">
        <span className="text-sm font-black text-white">{day}</span>
        <span className="text-xs font-bold text-[#AAFF00]">{sessions}</span>
      </div>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
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
