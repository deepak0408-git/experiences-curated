import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

const TOUR_SCHEDULE = [
  { date: "9–13 Dec", type: "1st Test", venue: "Perth Stadium", city: "Perth" },
  { date: "17–21 Dec", type: "2nd Test", venue: "Adelaide Oval", city: "Adelaide" },
  { date: "26–30 Dec", type: "3rd Test (Boxing Day)", venue: "MCG", city: "Melbourne" },
  { date: "4–8 Jan", type: "4th Test", venue: "SCG", city: "Sydney" },
];

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
      eventName="New Zealand in Australia"
      status="teaser"
      h1="A real day-by-day trip plan — not just the shape of the tour"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real 4-Test schedule and the shape of the gaps between legs are free above. What it can't do is plan your specific trip — the pack adds a real day-by-day itinerary for the Melbourne and Sydney legs, the two most fans actually build a trip around, including exactly when to fly, when to rest, and where New Year's Eve fits in."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This is a genuinely large tour to plan around — four Tests, four cities, roughly 4,300km of internal
        travel, and real gaps between legs that are long enough to matter but not so long that a rough plan isn&apos;t
        worth having before you go.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The real schedule</p>
      <ScheduleTable rows={TOUR_SCHEDULE} />

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mt-10 mb-3">The shape of the gaps</p>
      <div className="flex flex-col gap-3 mb-8">
        <GapCard label="Perth → Adelaide" detail="4 days between the end of the 1st Test and the start of the 2nd — enough for a genuine McLaren Vale day trip and a single travel day, not much more." />
        <GapCard label="Adelaide → Melbourne" detail="5 days — the longest gap of the tour, and the one with the most real room for a day trip plus a proper rest day before Boxing Day's crowds and intensity." />
        <GapCard label="Melbourne → Sydney" detail="5 days — Boxing Day Test ends 30 December, the 4th Test starts 4 January, spanning New Year's itself. A genuinely different kind of gap, shaped as much by the calendar as the cricket." />
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which legs we&apos;d actually attend</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If you can only do one leg, Melbourne&apos;s Boxing Day Test is the real answer — biggest atmosphere,
            easiest to build a short standalone trip around, real December weather. If you can do two, Melbourne
            and Sydney back to back is the pairing most fans actually choose — the gap between them spans New
            Year&apos;s itself, which turns a travel gap into a genuine trip highlight rather than dead time. See
            the 11-day itinerary below for exactly how that shape works.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            A real 11-day itinerary — Melbourne and Sydney, 25 Dec–4 Jan
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Not everyone is doing all four Tests — the Boxing Day and Fourth Test legs, back to back with New
            Year&apos;s in between, are the two most fans actually build a trip around. This is the shape that
            works for exactly that trip, arriving in time for Christmas in Melbourne and leaving after the Sydney
            Test gets underway.
          </p>

          <ItineraryBlock
            title="Melbourne — Days 1–6"
            rows={[
              { day: "Day 1 (25 Dec)", activity: "Arrive Melbourne, settle in, Christmas Day — most restaurants close early or run a set Christmas menu, so book ahead or plan for a quiet night in." },
              { day: "Days 2–3 (26–27 Dec)", activity: "3rd Test (Boxing Day) at the MCG — build in real arrival margin for Day 1's 70,000-90,000+ crowd, see the Arrival guide." },
              { day: "Days 4–6 (28–30 Dec)", activity: "Melbourne sights — Royal Botanic Gardens Victoria, Queen Victoria Market, and the free City Circle Tram, per the Top 3 above. Melbourne's laneway coffee and street art scene also fits well here if that's more your pace." },
            ]}
          />

          <ItineraryBlock
            title="Sydney — Days 7–11"
            rows={[
              { day: "Day 7 (31 Dec)", activity: "Domestic flight Melbourne → Sydney (one of the world's busiest routes, frequent departures). New Year's Eve under the Harbour Bridge — claim a vantage point early: Mrs Macquarie's Point, Observatory Hill, or Dawes Point are the regularly recommended free spots, and they fill from mid-afternoon." },
              { day: "Day 8 (1 Jan)", activity: "Rest day — a late, easy morning after NYE, no fixed plan needed." },
              { day: "Day 9 (2 Jan)", activity: "Sydney city day — Circular Quay, the Opera House and Harbour Bridge up close, the Manly ferry or the Bondi to Coogee Coastal Walk, per the Top 3 above." },
              { day: "Day 10 (3 Jan)", activity: "Blue Mountains day trip — see the Day Trips guide for the full route." },
              { day: "Day 11 (4 Jan)", activity: "4th Test begins at the SCG. The Test runs 4–8 Jan, so plan your departure around however many of the 5 days you're staying for." },
            ]}
          />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Source: cricket.com.au official 2026-27 schedule. NYE vantage points: sydneynewyearseve.com and
        sydneytourism.org (Mrs Macquarie's Point, Observatory Hill, Dawes Point).
      </p>
    </SpokeShell>
  );
}

function ScheduleTable({ rows }: { rows: typeof TOUR_SCHEDULE }) {
  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A]">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left">
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">Dates</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">Fixture</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">Venue</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">City</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.date} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                <td className="px-4 py-3 text-white font-semibold align-top break-words">{r.date}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{r.type}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{r.venue}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{r.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-3 mb-8">
        {rows.map((r) => (
          <div key={r.date} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-black text-white mb-1">{r.date} — {r.type}</p>
            <p className="text-xs text-[#A3A3A3]">{r.venue}, {r.city}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function GapCard({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}

function ItineraryBlock({ title, rows }: { title: string; rows: { day: string; activity: string }[] }) {
  return (
    <div className="mb-10">
      <p className="text-sm font-bold text-white mb-3">{title}</p>
      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A]">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left">
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">Day</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-3/4">Activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.day + i} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                <td className="px-4 py-3 text-white font-semibold align-top break-words">{row.day}</td>
                <td className="px-4 py-3 text-[#A3A3A3] leading-6 align-top break-words">{row.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={row.day + i} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-black text-white mb-2">{row.day}</p>
            <p className="text-sm text-[#A3A3A3] leading-6">{row.activity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
