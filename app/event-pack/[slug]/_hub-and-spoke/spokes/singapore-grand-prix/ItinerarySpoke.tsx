import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isSpokeUnlocked } from "../../_lib/getSpokeData";
import { getMiniPackPricing } from "@/lib/packPricing";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, justPurchasedProductType, purchasedProductTypes } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = isSpokeUnlocked(SPOKE_ID, { hasPurchased, purchasedProductTypes });
  const miniPack = getMiniPackPricing(eventSlug)?.itinerary;
  const miniPackOption = miniPack
    ? { ...miniPack, productType: "itinerary_guide" as const, owned: purchasedProductTypes.has("itinerary_guide") }
    : undefined;

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
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      justPurchasedProductType={justPurchasedProductType}
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="A sample race weekend, hour by hour"
      question="What does a Singapore GP race weekend actually look like?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      miniPackOption={miniPackOption}
      ctaCopy="Buy the Itinerary Guide alone, or the full Event Guide, to unlock the full hour-by-hour itinerary for all four days — exact session times, which grandstand to be at when, the concert set to catch after, and the transit move to make next, so you're never guessing what to do between sessions."
    >
      {/* Free teaser — the weekend's basic 4-day shape only (day names, no
          specific activities/times/concert acts). Everything with real
          planning value (the rhythm essay, session times, concert lineup,
          day-by-day summaries, hour-by-hour tables) is gated behind
          isUnlocked (full pack or the Itinerary Guide mini-pack).

          !isUnlocked gate tightened 15 Sep 2026 — the previous version
          left the full rhythm essay and all 4 DayCard summaries (each
          naming real session times AND the specific headline acts — JJ
          Lin, CORTIS, The Killers, Zara Larsson, Lana Del Rey) free to
          everyone, which the founder correctly flagged as giving away
          most of the guide's real value; only the hour-by-hour table was
          behind the paywall. Same fix as Bahrain GP's Itinerary spoke. */}
      {!isUnlocked && (
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm text-[#A3A3A3]">A Singapore GP weekend runs Thursday arrival through Sunday race day, with concerts most nights.</p>
          <p className="text-sm text-[#A3A3A3]">
            <span className="text-white font-bold">Thursday:</span>{" "}Arrival
          </p>
          <p className="text-sm text-[#A3A3A3]">
            <span className="text-white font-bold">Friday:</span>{" "}Practice
          </p>
          <p className="text-sm text-[#A3A3A3]">
            <span className="text-white font-bold">Saturday:</span>{" "}Final Practice &amp; Qualifying
          </p>
          <p className="text-sm text-[#A3A3A3]">
            <span className="text-white font-bold">Sunday:</span>{" "}The Grand Prix Itself
          </p>
        </div>
      )}

      {isUnlocked && (
        <div className="mt-2">
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            2027 is a classic three-day weekend — Singapore isn&apos;t on F1&apos;s published list of 2027 Sprint
            venues (confirmed against the official 2027 calendar announcement, 16 Sep 2026), unlike its 2026 edition.
            Expect Free Practice 1 and 2 on Friday, Free Practice 3 and Qualifying on Saturday, the Grand Prix itself
            on Sunday. Singapore&apos;s second rhythm stays the same regardless of session format: evenings end with
            a headline concert on the Padang Stage, so a full race day here genuinely runs from afternoon sessions
            through to a late-night set, all under the same floodlights. This is F1&apos;s only true night race, run
            entirely after dark.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            The night format also means real daytime is available before each day&apos;s sessions start, worth using
            for Gardens by the Bay, Sentosa, or the Marina Bay waterfront walk rather than sitting in a hotel room
            waiting for the evening. Exact 2027 session times and the concert line-up hadn&apos;t been published as
            of this writing — check formula1.com and singaporegp.sg&apos;s entertainment page closer to race week.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            <DayCard day="Thursday — Arrival" summary="Land, settle in, and do the Marina Bay Waterfront Walk — Merlion Park to the Flyer doubles as real circuit-area orientation" />
            <DayCard day="Friday — Practice" summary="Gardens by the Bay in the daytime, Free Practice 1 and 2, a Padang Stage set after (2027 line-up not yet announced)" />
            <DayCard day="Saturday — Final Practice & Qualifying" summary="Sentosa in the daytime, Free Practice 3 then Qualifying sets Sunday's grid, another headline set closes out the night" />
            <DayCard day="Sunday — Race" summary="Arrival timing by grandstand, the Grand Prix itself under floodlights, the weekend's closing set after the chequered flag" />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4 pt-10 border-t border-[#2A2A2A]">
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
            day="Friday — Practice"
            rows={[
              { time: "Morning", location: "Gardens by the Bay", activity: <>Outdoor gardens and Supertree Grove are free and open early. Do the OCBC Skyway before the day heats up — last admission is 8-8:30pm, so a morning visit avoids any risk of missing it. Full guide: {expLink(gardensByTheBay, "Gardens by the Bay")}.</> },
              { time: "Early afternoon", location: "Marina Bay Street Circuit", activity: "First circuit visit — find your grandstand, walk the concourse near it before race-day crowds arrive." },
              { time: "Afternoon/Evening", location: "Your booked grandstand", activity: "Free Practice 1 and Free Practice 2 — exact 2027 session times not yet published. Worth using FP1 especially to test your seat's sightlines." },
              { time: "Night", location: "Padang Stage", activity: <>Friday's headline act hadn&apos;t been announced as of this writing — check singaporegp.sg's entertainment page closer to race week. {expLink(lauPaSat, "Lau Pa Sat's Satay Street")} (open till 3am) is the realistic post-set food stop if your zone allows it. Full details: {expLink(padangStage, "Padang Stage")}.</> },
            ]}
          />

          <ItineraryTable
            day="Saturday — Final Practice & Qualifying"
            rows={[
              { time: "Morning", location: "Sentosa Island", activity: <>10 minutes by MRT via HarbourFront. Take the cable car one direction for the harbour views, walk or Sentosa Express back. Full guide: {expLink(sentosa, "Sentosa Island")}.</> },
              { time: "Early afternoon", location: "En route back to Marina Bay", activity: "Build in real transit buffer before Qualifying." },
              { time: "Afternoon", location: "Your booked grandstand", activity: "Free Practice 3 — the final practice session before Qualifying." },
              { time: "Evening", location: "Your booked grandstand", activity: "Qualifying — sets Sunday's Grand Prix grid." },
              { time: "Night", location: "Padang Stage", activity: <>Saturday's headline act hadn&apos;t been announced as of this writing. {expLink(bayfrontHawkers, "Makansutra Gluttons Bay")} (open till 3am Fri/Sat) is built for exactly this timing.</> },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "Late morning", location: "The Shoppes at Marina Bay Sands", activity: "The race runs under floodlights in the evening, so there's real time for a late brunch and some shopping right by the circuit — The Shoppes opens 10am, with brunch spots like Yardbird and PS.Cafe (both open Sundays). It's a genuine, easy option given how much daytime this format leaves free." },
              { time: "Before the race", location: "Zone 1 or Zone 4 F1 Village", activity: <>Arrive 60-90 minutes before the race to clear security and explore the {expLink(f1Village, "F1 Village")} before the rush — exact gate-opening times not yet published for 2027.</> },
              { time: "Evening", location: "Your booked grandstand", activity: "The Grand Prix itself, under floodlights." },
              { time: "After the chequered flag", location: "Padang Stage", activity: <>The weekend's closing headline act hadn&apos;t been announced as of this writing. Full details: {expLink(padangStage, "Padang Stage")}.</> },
              { time: "Late night", location: "Circuit exit routes", activity: "Expect exit crowds to take real time to clear. MRT service typically runs later specifically for this weekend — plan your last connection once the 2027 schedule is confirmed." },
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
