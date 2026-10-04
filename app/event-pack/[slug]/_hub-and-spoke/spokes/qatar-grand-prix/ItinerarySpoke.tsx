import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isSpokeUnlocked } from "../../_lib/getSpokeData";
import { getMiniPackPricing } from "@/lib/packPricing";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

// Real, confirmed 2026 session times (founder-supplied screenshot from
// formula1.com/en/racing/2026/qatar, 13 Sep 2026, track-local time):
// Fri P1 16:30-17:30, P2 20:00-21:00; Sat P3 17:30-18:30, Quali 21:00-22:00;
// Sun Race 19:00.
//
// Whole-spoke gating applied per the add-mini-guides-to-existing-event-pack
// skill §3, 4 Oct 2026 — the previous version kept this spoke's "Event
// rhythm" section (confirmed session times + DayCard summaries naming real
// activities: National Museum, Khor Al Adaid safari, Souq Waqif food tour)
// free regardless of purchase, by design (see prior header comment). That
// pattern predates the mini-packs pilot and gives away exactly the kind of
// week-planning detail a buyer would pay for — trimmed to bare day names
// only in the free teaser; the full rhythm + hour-by-hour both now sit
// behind isUnlocked (full pack or the Itinerary Guide mini-pack). Intro
// shape (bare DayCard list locked / detailed DayCard list unlocked) matches
// the united-states-grand-prix pattern, per founder instruction 4 Oct 2026.
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

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      justPurchasedProductType={justPurchasedProductType}
      eventName="Qatar Grand Prix"
      status="teaser"
      h1="Every session runs in the afternoon or evening — Sunday's race starts at 19:00 and finishes well after dark"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      miniPackOption={miniPackOption}
      ctaCopy="Buy the Itinerary Guide alone, or the full Event Pack, to unlock the real confirmed session times, the day-by-day rhythm, and the full 5-day itinerary hour by hour — Thursday through the optional Monday trip — including exactly which morning gets the museum, which evening gets your one real dinner, and why unreserved seating changes the sequencing most guides miss."
    >
      {/* Free teaser — bare day shape only, no session times/specific
          activities/hour-by-hour. Everything else gated behind isUnlocked
          (full pack or the Itinerary mini-pack) — whole-spoke gating per
          the mini-packs pilot. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Qatar&apos;s 2026 race weekend runs Friday through Sunday, and every on-track session — practice, qualifying,
        and the race itself — lands in the afternoon or evening. There is no morning session at all across the whole
        weekend, which changes how the rest of each day gets planned.
      </p>

      {!isUnlocked && (
        <div className="flex flex-col gap-3 mb-8">
          <DayCard day="Thursday" summary="Arrival" />
          <DayCard day="Friday" summary="Practice day" />
          <DayCard day="Saturday" summary="Qualifying day" />
          <DayCard day="Sunday" summary="Race day" />
          <DayCard day="Optional extra day" summary="A bookend day before flying out" />
        </div>
      )}

      {isUnlocked && (
        <div className="flex flex-col gap-3 mb-8">
          <DayCard day="Thursday — Arrival & one real dinner" summary="Land, transfer, and check in, then your one genuine sit-down dinner of the trip — the only evening with zero session pressure" />
          <DayCard day="Friday — Practice day" summary="P1 16:30-17:30, P2 20:00-21:00, with a genuinely free daytime for the Souq before the evening sessions" />
          <DayCard day="Saturday — Qualifying day, the day with the most room" summary="Nothing on-track before P3 at 17:30 — the natural window for the National Museum of Qatar or Museum of Islamic Art, then Qualifying 21:00-22:00" />
          <DayCard day="Sunday — Race day" summary="The Souq Waqif food tour in the free morning, gates several hours ahead of the 19:00 lights-out, race finishes well after dark" />
          <DayCard day="Monday — one optional full day trip" summary="Khor Al Adaid desert safari (4-8 hours door-to-door), or a slower city day at Pearl-Katara and Souq Waqif" />
        </div>
      )}

      {isUnlocked && (
        <>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            Confirmed 2026 times: Friday Practice 1 16:30–17:30 and Practice 2 20:00–21:00, both running into
            full darkness under the lights; Saturday Practice 3 17:30–18:30 and Qualifying 21:00–22:00, with the whole
            day free until late afternoon; Sunday&apos;s race goes lights-out at 19:00 and finishes well into the night,
            with the post-race concert following straight after.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Saturday in particular leaves a genuinely long stretch of free time before anything on-track happens — the
            one day this schedule actually gives you room to spare.
          </p>

          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The Fan Zone fills the gaps</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              With every session landing in the afternoon or evening, daytime hours are genuinely free across all three
              days — longest on Saturday, where nothing on-track happens before 17:30. The Fan Zone behind Main
              Grandstand, simulators, and the Pit Stop Challenge are all there for exactly that downtime, included with
              any ticket. See the Arrival guide for the full breakdown.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
              The full itinerary, hour by hour
            </p>

            <ItineraryTable
              day="Thursday — Arrival day"
              rows={[
                { time: "Afternoon to evening", location: "Hamad International (DOH) to your hotel", activity: "Land, transfer via Karwa or the Doha Metro Red Line, and check in — build in real buffer here rather than planning anything time-sensitive around your landing time." },
                { time: "Evening", location: "Sawa by Sanad, Parisa, or Qatari Cuisine in Souq Waqif", activity: "Book your one real sit-down dinner tonight — the only evening across the trip with zero session pressure." },
              ]}
            />

            <ItineraryTable
              day="Friday — Practice day"
              rows={[
                { time: "Morning to midday", location: "Souq Waqif or your hotel area", activity: "A genuinely free stretch — this is the natural slot for a first orientation walk through Souq Waqif, or simply resting up before the evening's two sessions." },
                { time: "16:30-17:30", location: "Your booked grandstand", activity: "Practice 1 — the lowest-pressure session of the weekend, worth using to test your seat's sightlines and the shuttle walk time before qualifying and race day matter more." },
                { time: "17:30-20:00", location: "Fan Zone, behind Main Grandstand", activity: "The gap between P1 and P2 — simulators and the Pit Stop Challenge are both included with any ticket, and this is the natural window to use them rather than leaving and re-entering the circuit." },
                { time: "20:00-21:00", location: "Your booked grandstand", activity: "Practice 2 — runs into full darkness, since Lusail is a night race." },
              ]}
            />

            <ItineraryTable
              day="Saturday — Qualifying day"
              rows={[
                { time: "Morning to early afternoon", location: "National Museum of Qatar or Museum of Islamic Art", activity: "The day's biggest genuine window — nothing on-track happens before Practice 3 at 17:30, so a full museum visit fits comfortably. The National Museum is the stronger single pick if you only have time for one, per the Day Trips guide." },
                { time: "17:30-18:30", location: "Your booked grandstand", activity: "Practice 3 — the final tuning session before qualifying." },
                { time: "18:30-21:00", location: "Fan Zone or a quick bite near the circuit", activity: "The gap before Qualifying — keep it light and close to the venue rather than a full sit-down dinner, since North Grandstand's unreserved seating means arriving early actually matters for a real spot." },
                { time: "21:00-22:00", location: "Your booked grandstand", activity: "Qualifying — sets Sunday's starting grid." },
              ]}
            />

            <ItineraryTable
              day="Sunday — Race day"
              rows={[
                { time: "Morning", location: "Souq Waqif Guided Food Tour", activity: "A ~2-hour guided tour — Falcon Souq, a tasting stop, and a walk through Souq Waqif — finishing well before the afternoon transfer to the circuit. See the Where to Eat guide to book." },
                { time: "Several hours before first session", location: "Lusail Circuit gates", activity: "Gate-opening times aren't published this far out — confirm via formula1.com closer to race week, but arrive with real margin if your grandstand or sightline matters to you." },
                { time: "Afternoon build-up", location: "Fan Zone, behind Main Grandstand", activity: "Keep this stretch relaxed and close to the venue rather than adding another activity — once you're at the circuit, race day isn't the day to risk running long on something off-site." },
                { time: "19:00", location: "Your booked grandstand", activity: "Lights out — the Grand Prix itself, finishing well after dark with the post-race concert following straight after." },
              ]}
            />

            <ItineraryTable
              day="Monday — one optional full day trip"
              rows={[
                { time: "Early morning to evening", location: "Khor Al Adaid — the Inland Sea", activity: "A 4-8 hour door-to-door desert safari — it's the one item on this list that genuinely doesn't fit around a session day, which is exactly why it belongs on this free Monday." },
                { time: "Alternative — a slower city day", location: "Pearl-Katara and Souq Waqif", activity: "If the desert safari isn't for you, pair a Pearl-Katara evening walk with Souq Waqif on a different night rather than trying to do both districts in one trip — each rewards slowing down." },
              ]}
            />
          </div>
        </>
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
