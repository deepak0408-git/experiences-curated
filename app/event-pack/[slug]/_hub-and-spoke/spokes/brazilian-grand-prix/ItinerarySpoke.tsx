import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isSpokeUnlocked } from "../../_lib/getSpokeData";
import { getMiniPackPricing } from "@/lib/packPricing";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

// 2026 ran a standard 3-day FP1/FP2/FP3/Quali/Race format (no Sprint at
// Interlagos that season). 2027 brings Sprint back to Interlagos, confirmed
// against F1's official 2027 calendar announcement (16 Sep 2026) —
// rollover-event-into-next-year skill §3/§4a, 24 Nov 2026. Exact 2027
// session times not yet published; standard Sprint-weekend structure is
// Friday FP1 + Sprint Qualifying, Saturday Sprint + Qualifying, Sunday
// Race. Bookended with a Thursday arrival day (GRU landing + one in-city
// half-day stop) and a Monday day trip (São Roque / Santos & Guarujá /
// Campos do Jordão, all sourced from DayTripsSpoke) so the full itinerary
// runs Thu-Mon, not just the 3 core session days. Friday and Saturday
// evenings each bake in a real sightseeing or nightlife stop alongside
// dinner, not dinner alone — Avenida Paulista's street/architecture (not
// MASP's interior, which keeps normal museum hours) plus Liberdade's
// Japantown streets on Friday, Bar Brahma's live samba after dinner on
// Saturday — all sourced from DayTripsSpoke and WhereToEatSpoke's existing
// experiences, not invented for this pass.
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
      eventName="São Paulo Grand Prix"
      status="teaser"
      h1="Sprint returns to Interlagos for 2027 — a full weekend, hour by hour"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      miniPackOption={miniPackOption}
      ctaCopy="Buy the Itinerary Guide alone, or the full Event Guide, to unlock the full hour-by-hour itinerary from Thursday's arrival to Monday's day trip — the Sprint-weekend session structure, two different real nights out, and the one out-of-city excursion that actually fits, not a generic race-weekend template."
    >
      {/* Free teaser — bare day shape only, no session times, no specific
          activities, no verdict on which day trip to pick. Everything else
          is gated behind isUnlocked (full pack or the Itinerary Guide
          mini-pack). */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Interlagos returns to the Sprint calendar for 2027 after running a standard weekend in 2026 — confirmed
        against F1's official 2027 calendar. Expect Friday Practice 1 and Sprint Qualifying, Saturday the Sprint
        race and full Qualifying, Sunday the Grand Prix itself. A Thursday arrival day and a Monday day trip round
        the full trip out to five days, Thursday through Monday, with Tuesday left as a genuine travel day home.
        Exact 2027 session times hadn't been published as of this writing.
      </p>

      {!isUnlocked && (
        <div className="flex flex-col gap-3 mb-8">
          <DayCard day="Thursday" summary="Arrival" />
          <DayCard day="Friday" summary="Practice & Sprint Qualifying" />
          <DayCard day="Saturday" summary="Sprint & Qualifying" />
          <DayCard day="Sunday" summary="Race" />
          <DayCard day="Monday" summary="Day trip" />
        </div>
      )}

      {isUnlocked && (
        <div className="flex flex-col gap-3 mb-8">
          <DayCard day="Thursday — Arrival & first orientation" summary="Settle in, then Ibirapuera Park or Beco do Batman in the afternoon before an early night ahead of Friday's sessions" />
          <DayCard day="Friday — Practice & Sprint Qualifying" summary="Practice 1 then Sprint Qualifying (exact 2027 times not yet published), then an evening walk down Avenida Paulista before dinner in Liberdade's Japantown streets" />
          <DayCard day="Saturday — Sprint, Qualifying & a real São Paulo night out" summary="The Sprint race then Qualifying sets Sunday's grid, then Figueira Rubaiyat or Maní for dinner, followed by live samba at Bar Brahma" />
          <DayCard day="Sunday — Race day" summary="Gates well before the race, the Grand Prix itself, then Vila Madalena for a night out" />
          <DayCard day="Monday — one real day trip" summary="São Roque, Santos & Guarujá, or Campos do Jordão — pick one, don't try to pair it with a session day" />
        </div>
      )}

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
            day="Friday — Practice & Sprint Qualifying"
            rows={[
              { time: "Morning", location: "Metrô Line 9 to Autódromo", activity: "Buy your Bilhete Único at a quiet station the day before if you haven't already — race-morning ticket queues at Autódromo build fast." },
              { time: "Afternoon", location: "Your booked grandstand", activity: "Practice 1 — the only practice session before Sprint Qualifying under the 2027 Sprint format, worth using to test your seat's sightlines. Exact 2027 session times not yet published." },
              { time: "Afternoon/Evening", location: "Your booked grandstand", activity: "Sprint Qualifying — sets Saturday's Sprint grid. Exact 2027 session times not yet published." },
              { time: "Evening", location: "Avenida Paulista, then Liberdade", activity: "Walk the avenue and MASP's exterior once the day's sessions wrap — the car-free closure and museum's own opening hours are both weekend/daytime-only, so this is the street and its architecture, not the pedestrian shutdown. Finish with dinner in Liberdade's Japantown streets — real neighborhood ramen shops, open evenings regardless of the weekend market." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Sprint & Qualifying"
            rows={[
              { time: "Afternoon", location: "Your booked grandstand", activity: "The Sprint race — a shorter, standalone race with its own points, run separately from Sunday's Grand Prix. Exact 2027 session times not yet published." },
              { time: "Afternoon/Evening", location: "Your booked grandstand", activity: "Qualifying — this is what sets Sunday's Grand Prix grid, not Friday's Sprint Qualifying. Exact 2027 session times not yet published." },
              { time: "Evening — dinner", location: "Figueira Rubaiyat or Maní", activity: "Book whichever splurge dinner you haven't already reserved — both fill up on weekend evenings, so this is the night to use the reservation you made weeks ahead." },
              { time: "Evening — after dinner", location: "Bar Brahma, downtown", activity: "Live samba downtown rather than just heading back to the hotel — a real, different night-out option to Sunday's Vila Madalena wander, and a better fit for a night that already started with a formal dinner." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "Several hours before gates close", location: "Interlagos gates", activity: "Gates typically open around 08:00 in recent editions (2027 confirmation pending) — arrive close to opening if your grandstand or sightline matters to you, since there's no re-entry once you're in and security lines build fast." },
              { time: "Afternoon", location: "Your booked grandstand", activity: "Lights out — the Grand Prix itself. Interlagos' bowl-shaped layout puts fans in stands like A and M genuinely close to the on-track action. Exact 2027 start time not yet published." },
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
