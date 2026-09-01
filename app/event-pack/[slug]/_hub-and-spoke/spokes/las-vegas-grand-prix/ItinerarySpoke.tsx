import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const fountainsSphere = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-fountains-sphere"));
  const stripAtNight = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-strip-at-night"));
  const bellagioCaesarsDining = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-bellagio-caesars-dining"));
  const raceWeekFree = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-race-week-free"));
  const sportsbook = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-sportsbook-watch"));
  const hooverDam = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-hoover-dam"));
  const redRock = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-red-rock-canyon"));

  const expLink = (exp: typeof fountainsSphere, label: string) =>
    exp ? (
      <Link href={`/experience/${exp.slug}`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
        {label}
      </Link>
    ) : (
      label
    );

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="teaser"
      h1="An optional arrival day, then three nights of sessions — how the weekend actually runs"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The free rhythm above tells you when each session runs — the pack adds the actual hour-by-hour sequence we'd run around it: which landmark to catch on which night, when to eat, and the one combination of activities that genuinely doesn't fit in a single evening."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Every session at the Las Vegas Grand Prix runs at night, which means this weekend has a genuinely different
        rhythm from a daytime race — there's no early wake-up for first practice, but there is a long afternoon and
        evening every single day, and what you do with it matters as much as the sessions themselves.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Event rhythm</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayRow day="Wednesday 18 Nov — optional arrival day" detail="No sessions run yet, and the Strip hasn't started closing — the one genuinely free day of the trip. This is the day for sightseeing and a day trip, not Thursday or Friday, since both of those already run into a night session with real road closures beforehand." />
        <DayRow day="Thursday 19 Nov" detail="Practice 1, 4:30-5:30pm PT. Practice 2, 8:00-9:00pm PT. Soft Strip closures begin 3pm, full closures 5pm. Lightest session-day crowds of the weekend — good for the free Boulevard fan activations and merchandise before Saturday's rush, but the afternoon is genuinely tight once you factor in closures." />
        <DayRow day="Friday 20 Nov" detail="Practice 3, 4:30-5:30pm PT. Qualifying, 8:00-9:00pm PT. Qualifying is genuinely competitive — real intensity for roughly a quarter of race day's ticket price." />
        <DayRow day="Saturday 21 Nov" detail="Race, 8:00pm PT start. Road closures begin earliest and hit hardest this day — treat the whole afternoon as arrival time, not just the hour before the session." />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">All times Pacific, per the official 2026 race schedule.</p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The circuit's own landmarks</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {fountainsSphere && <SpokeExperienceCard experience={fountainsSphere} isPro={isPro} />}
        {stripAtNight && <SpokeExperienceCard experience={stripAtNight} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour
          </p>

          <ItineraryTable
            day="Wednesday 18 Nov — Arrival day"
            rows={[
              { time: "Morning", location: "Hoover Dam", activity: <>No sessions, no closures — the only day in the trip with genuine room for the longer of the two day trips. Roughly 45 minutes each way via US-93 South, plus touring time; back on the Strip well before evening. Full guide: {expLink(hooverDam, "Hoover Dam")}.</> },
              { time: "Late afternoon", location: "The Strip", activity: <>Walk the Strip while it's still fully open — catch the Bellagio Fountains (every 30 minutes from 3pm, every 15 minutes from 8pm) and the Sphere's Exosphere display before Thursday's closures start reshaping how you move around. Full guide: {expLink(fountainsSphere, "Fountains and Sphere")}.</> },
              { time: "Evening", location: "Bellagio or Caesars Palace", activity: <>The one genuinely unhurried sit-down-dinner window of the whole trip — no session to plan around, no closures to beat. Book Le Cirque or Restaurant Guy Savoy here rather than squeezing it into Friday's tighter 2.5-hour gap. Full guide: {expLink(bellagioCaesarsDining, "Bellagio & Caesars Dining")}.</> },
            ]}
          />

          <ItineraryTable
            day="Thursday 19 Nov — Practice day"
            rows={[
              { time: "Early morning", location: "Red Rock Canyon", activity: <>The shorter of the two day trips — less than 30 minutes from the Strip. Do the 13-mile Scenic Drive (book the Recreation.gov timed-entry slot ahead if visiting between 8am-5pm) and be back on the Strip by early afternoon, well clear of the 3pm soft closures. Full guide: {expLink(redRock, "Red Rock Canyon")}.</> },
              { time: "Early afternoon", location: "The Strip", activity: "Buy official F1 merchandise and catch the free Boulevard Fan Experience (historically 10am-6pm) before soft closures begin at 3pm — today has the lightest session-day crowds of the weekend." },
              { time: "4:30-5:30pm", location: "Your booked zone", activity: "Practice 1." },
              { time: "8:00-9:00pm", location: "Your booked zone", activity: "Practice 2." },
            ]}
          />

          <ItineraryTable
            day="Friday 20 Nov — Qualifying day"
            rows={[
              { time: "4:30-5:30pm", location: "Your booked zone", activity: "Practice 3." },
              { time: "5:30-8:00pm", location: "Near your booked zone", activity: "A 2.5-hour gap before Qualifying — enough time to rest or grab a quick meal near your zone." },
              { time: "8:00-9:00pm", location: "Your booked zone", activity: "Qualifying — genuine competitive intensity under the same night lights as the race, for roughly a quarter of race day's ticket price." },
            ]}
          />

          <ItineraryTable
            day="Saturday 21 Nov — Race day"
            rows={[
              { time: "From 3pm", location: "En route to your zone", activity: "Soft closures begin — head to your zone rather than planning anything else for the afternoon." },
              { time: "Before 8pm", location: "Sphere Exosphere / Strip", activity: <>The Sphere's Exosphere display runs roughly dusk to midnight nightly — visible from most East Harmon/Koval/T-Mobile zone approaches on the walk in. Full guide: {expLink(stripAtNight, "The Strip at Night")}.</> },
              { time: "8:00pm", location: "Your booked zone", activity: "The Race." },
              { time: "After the chequered flag", location: "Circa Resort & Casino, downtown", activity: <>If you want to keep the night going without another circuit ticket, Circa's free Stadium Swim watch-party infrastructure and sportsbook scene are built for exactly this. Full guide: {expLink(sportsbook, "Watching from a Sportsbook")}.</> },
            ]}
          />

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mt-2">
            <p className="text-sm font-bold text-white mb-1.5">The one combination that genuinely doesn&apos;t fit</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Don&apos;t try to combine either day trip with Friday or Saturday — both take a genuine chunk of a
              half-day round trip, and once soft closures start at 3pm, the afternoon is arrival time, not spare
              time. Hoover Dam is the longer of the two, so it belongs on Wednesday when there are no sessions or
              closures at all. Red Rock Canyon is short enough to fit Thursday morning specifically, but even then,
              be back on the Strip by early afternoon rather than cutting it close against the 3pm closures.
            </p>
          </div>

          {raceWeekFree && (
            <div className="mt-6">
              <SpokeExperienceCard experience={raceWeekFree} isPro={isPro} />
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: formula1.com official 2026 session calendar, bellagio.mgmresorts.com fountain schedule,
        f1lasvegasgp.com A-Z Guide (free Boulevard Fan Experience), circalasvegas.com Stadium Swim page.
      </p>
    </SpokeShell>
  );
}

function DayRow({ day, detail }: { day: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{day}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}

function ItineraryTable({ day, rows }: { day: string; rows: { time: string; location: string; activity: React.ReactNode }[] }) {
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
