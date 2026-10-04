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

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      justPurchasedProductType={justPurchasedProductType}
      eventName="Abu Dhabi Grand Prix"
      status="teaser"
      h1="A season-finale weekend, hour by hour"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      miniPackOption={miniPackOption}
      ctaCopy="Buy the Itinerary Guide alone, or the full Event Pack, to unlock the full hour-by-hour itinerary — sequenced against real session times, the Yasalam concert schedule, and a genuine day trip, not just a generic race-weekend template."
    >
      {/* Free teaser — bare day shape only, no specific activities, no
          concert lineup, no day-trip detail. Everything else is gated
          behind isUnlocked (full pack or the Itinerary Guide mini-pack). */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Abu Dhabi runs a standard 4-day Grand Prix rhythm — Thursday through Sunday — but the season-finale framing
        changes what each day is actually for. Every night of the weekend carries a real Yasalam concert on the
        same ticket, and a full race day here genuinely runs from an afternoon session through to a late-night
        headline set under the same lights.
      </p>

      {!isUnlocked && (
        <div className="flex flex-col gap-3 mb-8">
          <DayCard day="Thursday" summary="Arrival, Abu Dhabi city day" />
          <DayCard day="Friday" summary="Practice" />
          <DayCard day="Saturday" summary="Qualifying" />
          <DayCard day="Sunday" summary="Race" />
          <DayCard day="Optional extra day" summary="A bookend day before flying out" />
        </div>
      )}

      {isUnlocked && (
        <div className="flex flex-col gap-3 mb-8">
          <DayCard day="Thursday — Arrival, Abu Dhabi city day" summary="Land, settle in, use the day for Sheikh Zayed Grand Mosque and Qasr Al Watan, catch the opening concerts" />
          <DayCard day="Friday — Practice" summary="Circuit sessions in the afternoon, first night of the marina/dining scene in the evening" />
          <DayCard day="Saturday — Qualifying" summary="Qualifying session, then the season's biggest concert night" />
          <DayCard day="Sunday — Race" summary="Arrival timing by grandstand, the race itself, the closing concerts" />
          <DayCard day="Monday — Optional Dubai day" summary="A full, unhurried Dubai day trip before flying out of DXB — the natural way to use a travel day that would otherwise be dead time" />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour
          </p>

          <ItineraryTable
            day="Thursday — Arrival &amp; Abu Dhabi city day"
            rows={[
              { time: "Morning", location: "AUH or DXB → hotel", activity: "Arrive and settle in. AUH is 8km/~15 min from Yas Island if your routing allows it; if you flew into DXB for better connections, budget the ~90-minute drive via the E11 instead." },
              { time: "Late morning", location: "Sheikh Zayed Grand Mosque", activity: "Arrive close to opening to beat both the heat and the largest tour groups — budget 90 minutes to see it properly. Dress code applies at both this stop and the next." },
              { time: "Midday", location: "Qasr Al Watan", activity: "A short drive from the mosque — the Great Hall and grounds are worth real time, not a rushed pass-through." },
              { time: "Evening", location: "Yas Marina Circuit — opening concerts", activity: "Zara Larsson and Lewis Capaldi open the Yasalam concert series tonight — included on every ticket tier, GA included." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice day"
            rows={[
              { time: "Afternoon", location: "Your booked grandstand", activity: "Practice sessions — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines before qualifying and race day." },
              { time: "Evening", location: "Yas Marina dining walk", activity: "Stars 'N' Bars, Ishtar, or Bar Du Port along the marina — casual to mid-range, and genuinely walkable between all three." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Qualifying day"
            rows={[
              { time: "18:00", location: "Your booked grandstand", activity: "Qualifying — shorter than the race, and it sets Sunday's grid." },
              { time: "Evening", location: "Yas Marina Circuit — headline concert night", activity: "Imagine Dragons headlines tonight — the biggest single concert draw of the weekend. Plan your exit route in advance; this is the highest-traffic concert night." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "Several hours before gates", location: "Your booked grandstand or GA zone", activity: "Race day carries the heaviest traffic and shuttle demand of the weekend — arrive well ahead of the session, not just before it." },
              { time: "17:00", location: "Your booked grandstand", activity: "The race itself, running through sunset into the floodlit finish." },
              { time: "After the chequered flag", location: "Yas Marina Circuit — closing concerts", activity: "The Chainsmokers and The Script close out the weekend. Expect the heaviest post-event traffic of the whole trip — if you're departing tonight, build real slack into any same-day flight." },
            ]}
          />

          <ItineraryTable
            day="Monday — Optional Dubai day"
            rows={[
              { time: "Morning", location: "Abu Dhabi → Dubai", activity: "Check out and make the ~90-minute drive via the E11 rather than treating it as a separate detour — you're already heading toward DXB, so this is dead travel time turned into a real day." },
              { time: "Late morning to afternoon", location: "Burj Khalifa & The Dubai Mall", activity: "The two sit right next to each other in Downtown Dubai — a single stop covers both. Book your At the Top time slot well ahead if you want a specific window; sunset slots in this exact travel window routinely sell out weeks in advance." },
              { time: "Evening", location: "Dubai Marina or Downtown", activity: "One last evening before the flight — the Dubai Fountain's evening shows run every 30 minutes from 6pm, timed easily around a Downtown dinner." },
              { time: "Night", location: "DXB", activity: "Fly out from Dubai rather than backtracking to AUH — since you're already in the city, this closes the loop instead of adding a second cross-emirate drive." },
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
