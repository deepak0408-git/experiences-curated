import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const waterfrontWalk = linkedExperiences.find((e) => e.slug.includes("singapore-gp-waterfront-walk"));
  const gardensByTheBay = linkedExperiences.find((e) => e.slug.includes("singapore-gp-gardens-by-the-bay"));
  const sentosa = linkedExperiences.find((e) => e.slug.includes("singapore-gp-sentosa"));
  const lauPaSat = linkedExperiences.find((e) => e.slug.includes("singapore-gp-lau-pa-sat"));
  const bayfrontHawkers = linkedExperiences.find((e) => e.slug.includes("singapore-gp-bayfront-hawkers"));
  const padangStage = linkedExperiences.find((e) => e.slug.includes("singapore-gp-padang-stage-concerts"));
  const f1Village = linkedExperiences.find((e) => e.slug.includes("singapore-gp-f1-village"));

  const expLink = (exp: typeof waterfrontWalk, label: string) =>
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
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="A sample race weekend, hour by hour"
      question="What does a Singapore GP race weekend actually look like?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The weekend shape above is free. The pack adds the full hour-by-hour itinerary for all four days — exact session times, which grandstand to be at when, the concert set to catch after, and the transit move to make next, so you're never guessing what to do between sessions."
    >
      {/* Free "Event rhythm" section — classic-pack "How the event unfolds"
          parity (hub-and-spoke-event-pack skill §1a). Unlike Bahrain GP,
          Singapore's night-race format and 2026 concert lineup are
          confirmed facts, not open questions — safe to commit to specifics. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        2026 is a Sprint weekend, not the classic three-day format — there&apos;s no FP2 or FP3. Friday is Practice 1
        and Sprint Qualifying, Saturday is the Sprint race and full Qualifying, Sunday is the Grand Prix itself.
        Singapore adds a second rhythm on top of that: every evening ends with a headline concert on the Padang
        Stage, so a full race day here genuinely runs from afternoon sessions through to a late-night set, all
        under the same floodlights. This is F1&apos;s only true night race, run entirely after dark.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The night format also means real daytime is available before each day&apos;s sessions start, worth using
        for Gardens by the Bay, Sentosa, or the Marina Bay waterfront walk rather than sitting in a hotel room
        waiting for the evening.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Thursday — Arrival" summary="Land, settle in, and do the Marina Bay Waterfront Walk — Merlion Park to the Flyer doubles as real circuit-area orientation" />
        <DayCard day="Friday — Practice 1 & Sprint Qualifying" summary="Gardens by the Bay in the daytime, Practice 1 (4:30-5:30pm) then Sprint Qualifying (8:30-9:14pm), JJ Lin and CORTIS on the Padang Stage after" />
        <DayCard day="Saturday — Sprint & Qualifying" summary="Sentosa in the daytime, the Sprint race (5-6pm) then full Qualifying (9-10pm) sets Sunday's grid, The Killers and Zara Larsson close out the night" />
        <DayCard day="Sunday — Race" summary="Arrival timing by grandstand, the Grand Prix itself at 8pm, Lana Del Rey's Singapore debut after the chequered flag" />
      </div>

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour
          </p>

          <ItineraryTable
            day="Thursday — Arrival day"
            rows={[
              { time: "Afternoon", location: "Changi Airport → hotel", activity: "Arrive and get to your base. MRT connects directly from the airport into the city — factor in your specific hotel's nearest station." },
              { time: "Evening", location: "Marina Bay Waterfront Walk", activity: <>Merlion Park, the Helix Bridge, and Marina Bay Sands lit up at night — free, and it doubles as orientation for the same waterfront the circuit wraps around. Full guide: {expLink(waterfrontWalk, "Marina Bay Waterfront Walk")}.</> },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice 1 & Sprint Qualifying"
            rows={[
              { time: "Morning", location: "Gardens by the Bay", activity: <>Outdoor gardens and Supertree Grove are free and open early. Do the OCBC Skyway before the day heats up — last admission is 8-8:30pm, so a morning visit avoids any risk of missing it. Full guide: {expLink(gardensByTheBay, "Gardens by the Bay")}.</> },
              { time: "Early afternoon", location: "Marina Bay Street Circuit", activity: "First circuit visit — find your grandstand, walk the concourse near it before race-day crowds arrive." },
              { time: "4:30-5:30pm", location: "Your booked grandstand", activity: "Practice 1 — the only practice session all weekend, since 2026 is a Sprint format with no FP2/FP3. Worth using to test your seat's sightlines." },
              { time: "8:30-9:14pm", location: "Your booked grandstand", activity: "Sprint Qualifying — sets Saturday's Sprint grid." },
              { time: "Night", location: "Padang Stage", activity: <>JJ Lin and CORTIS headline Friday night — Zone 4 ticket required. {expLink(lauPaSat, "Lau Pa Sat's Satay Street")} (open till 3am) is the realistic post-set food stop. Full concert lineup: {expLink(padangStage, "Padang Stage")}.</> },
            ]}
          />

          <ItineraryTable
            day="Saturday — Sprint & Qualifying"
            rows={[
              { time: "Morning", location: "Sentosa Island", activity: <>10 minutes by MRT via HarbourFront. Take the cable car one direction for the harbour views, walk or Sentosa Express back. Full guide: {expLink(sentosa, "Sentosa Island")}.</> },
              { time: "Early afternoon", location: "En route back to Marina Bay", activity: "Build in real transit buffer — don't cut it close against the Sprint." },
              { time: "5-6pm", location: "Your booked grandstand", activity: "Sprint race — a shorter, standalone race with its own points, run entirely separately from Sunday's Grand Prix." },
              { time: "9-10pm", location: "Your booked grandstand", activity: "Qualifying — this is what sets Sunday's Grand Prix grid, not Friday's Sprint Qualifying." },
              { time: "Night", location: "Padang Stage", activity: <>Zara Larsson and The Killers headline Saturday. {expLink(bayfrontHawkers, "Makansutra Gluttons Bay")} (open till 3am Fri/Sat) is built for exactly this timing.</> },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "Late morning", location: "The Shoppes at Marina Bay Sands", activity: "The race isn't until 8pm, so there's real time for a late brunch and some shopping right by the circuit — The Shoppes opens 10am, with brunch spots like Yardbird and PS.Cafe (both open Sundays). It's a genuine, easy option given how much daytime this format leaves free." },
              { time: "Before the race", location: "Zone 1 or Zone 4 F1 Village", activity: <>Arrive 60-90 minutes before the race to clear security and explore the {expLink(f1Village, "F1 Village")} before the rush — exact gate-opening times not yet published for 2026.</> },
              { time: "8pm", location: "Your booked grandstand", activity: "The Grand Prix itself, under floodlights." },
              { time: "After the chequered flag", location: "Padang Stage", activity: <>James Arthur and Lana Del Rey&apos;s first-ever Singapore show close the weekend, from 10:25pm. Full lineup: {expLink(padangStage, "Padang Stage")}.</> },
              { time: "Late night", location: "Circuit exit routes", activity: "Expect exit crowds to take real time to clear. MRT service runs to 1am specifically for this weekend — plan your last connection." },
            ]}
          />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Session times confirmed via the official F1 2026 calendar (formula1.com), Singapore local time — exact gate
        and Fan Zone opening times not yet published, see the hub page&apos;s Quick Reference for the latest. Sunday
        brunch/shopping options sourced from marinabaysands.com, hungrygowhere.com, sethlui.com. Verified 3 Aug 2026.
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
