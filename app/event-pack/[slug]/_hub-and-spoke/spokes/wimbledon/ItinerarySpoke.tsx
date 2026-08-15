import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

// TOURNAMENT_RHYTHM["wimbledon-2026"] (PackView.tsx) ported in full — the
// real, already-approved classic-pack copy, unchanged in substance. Framed
// as "how the Fortnight unfolds" (evergreen, day-of-tournament-relative)
// rather than tied to specific 2026 calendar dates, since this content
// needs to keep working under the evergreen "wimbledon" slug across future
// editions, not just describe a tournament that's already concluded.
export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const sw19 = linkedExperiences.find((e) => e.slug.includes("sw19-during-the-fortnight"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="teaser"
      h1="How the Fortnight actually unfolds, day by day"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The week-by-week shape is free above. The pack adds our verdict on which stretch of the Fortnight is genuinely worth building a trip around."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Wimbledon runs as a single-elimination draw across two weeks, and the character of the grounds changes
        sharply as the tournament narrows — the same building, a genuinely different atmosphere depending on which
        day you&apos;re there.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The shape of the Fortnight</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Opening Monday" detail="The day the grounds feel genuinely electric — and genuinely overwhelming. Top seeds are on Centre Court and No. 1 Court from day one, but the outer courts are where the draw opens up — players ranked 60 to 120 on courts you can walk right up to. Get in before 11am; the gates flood." />
        <DayCard day="Early-round weekdays (Tue-Thu, week 1)" detail="Quietly the best days to be there. The corporate groups clear out, the proper fans stay, and a grounds pass covers everything that matters. Fewer people, more access, and you can drop in and out of four matches in an afternoon without jostling for standing room." />
        <DayCard day="Middle Saturday" detail="Every local knows this one. Third round done, 32 players left, and the tennis quality has genuinely jumped. The grounds are full but the energy earns it. Centre Court tickets are essentially gone unless planned months ahead; Henman Hill and the outer courts on this day are a better story anyway." />
        <DayCard day="Week 2 weekdays (Mon-Thu)" detail="The draw thins to 16, then 8. Outer courts go quiet — fewer matches, bigger gaps in the schedule. What you get instead is actual seats, actual calm, and the best tennis of the tournament." />
        <DayCard day="Semi-finals (Thu-Fri)" detail="Thursday is the Ladies' semis, Friday the Men's. The formality of the place tightens noticeably. Most of the crowd watches from pubs while the grounds go quiet. If you want pure tennis with no distraction, these are your days." />
        <DayCard day="Finals Weekend" detail="Saturday is the Ladies' Singles final and Men's Doubles. Sunday is the Men's Singles final and Ladies' Doubles. The trophy presentations are part of the event. Worth doing once — but it's also the most formal, least spontaneous version of Wimbledon." />
      </div>

      {sw19 && (
        <div className="mb-8">
          <SpokeExperienceCard experience={sw19} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which days we&apos;d actually pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Wimbledon trip, the early-round weekdays of week 1 are the sharpest window — the
            corporate crowds are gone, a grounds pass covers real access to a wide range of matches, and you can
            move freely between four or five courts in a single afternoon. Middle Saturday is the single best day
            for atmosphere if you can only pick one, even though Centre Court itself is essentially unreachable by
            then without advance planning.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What finals weekend actually trades off</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-10">
            The tournament worth travelling for is the one with roaming outer courts and unexpected results — that
            peaks around the quarterfinals, a few days before finals weekend&apos;s trophy presentations and
            heightened formality. Book finals weekend for the occasion itself, not expecting the loose, wander-the-
            grounds energy of the first week.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour — a 6-day trip
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Built around two grounds days during the sharpest week-1 window, one lighter day inside London, and a
            genuine two-day outward trip to Windsor and Eton — the shape that gets the most out of a Fortnight visit
            without needing tickets for every single day. If your own trip is shorter, drop the Windsor days first;
            if it&apos;s longer, add extra grounds days using the same early-week logic.
          </p>

          <ItineraryTable
            day="Day 1 — Arrival"
            rows={[
              { time: "Afternoon", location: "Heathrow / Gatwick → SW19 or Waterloo", activity: "Settle in and drop bags — SW19 village if you're staying near the grounds, or a Waterloo-area hotel if you're basing centrally (see the Where to Stay guide for both). No grounds visit today; save your energy for tomorrow's early start." },
              { time: "Evening", location: "The Dog and Fox or Fire Stables, Wimbledon Village", activity: "An early dinner and an early night — tomorrow's queue day rewards being properly rested, not a late first evening." },
            ]}
          />

          <ItineraryTable
            day="Day 2 — First grounds day"
            rows={[
              { time: "Early morning", location: "The Queue", activity: "Arrive by mid-morning at the latest if you're queueing for a day ticket — gates open 10:30am, tickets released to queuers from 9:30am. See the Ticket Guide for the full Queue-vs-Ballot-vs-resale comparison if you haven't decided your route yet." },
              { time: "Midday", location: "Outer courts (3, 12, 18)", activity: "The best early-round tennis is here, not on Centre Court — seeded players in genuinely competitive matches, courts you can walk right up to." },
              { time: "Afternoon", location: "Henman Hill", activity: "Strawberries and cream, the Hill's own Pimm's tent, and a show court on the big screen if you want a break from queuing for individual courts." },
              { time: "Evening", location: "The Rose & Crown, Wimbledon Village", activity: "The village's own historic pub-with-rooms — book ahead if it's a big match day, since the post-day crowd fills it fast." },
            ]}
          />

          <ItineraryTable
            day="Day 3 — Second grounds day"
            rows={[
              { time: "Morning", location: "Aorangi Park practice courts", activity: "North end of the grounds, walk up and watch — best access in the first few days while top seeds are still warming up. No reserved spots needed." },
              { time: "Midday", location: "Wimbledon Museum & Private Tour", activity: "A genuine change of pace from queuing — trophies and player memorabilia from 1877 onward, 90 minutes with a Blue Badge Guide if you book the standard tour." },
              { time: "Afternoon", location: "Centre Court or No. 1 Court", activity: "Whichever show-court ticket you've secured — Debenture, resale, or Show Courts tier (see the Ticket Guide for the real comparison of all three routes)." },
              { time: "Evening", location: "The Black Lamb, Wimbledon Village", activity: "Book at least two weeks ahead for an evening sitting during the Fortnight — Wednesdays have live jazz from 7pm if the timing works for your trip." },
            ]}
          />

          <ItineraryTable
            day="Day 4 — London rest day"
            rows={[
              { time: "Morning", location: "Central London", activity: "A genuine day away from SW19 — see the Day Trips guide for the full route. Early-round weekdays (Tuesday through Thursday) are the easiest days to give up; the corporate crowds are gone from the grounds either way." },
              { time: "Afternoon", location: "Brixton Village & Market Row", activity: "A different, non-tournament side of London — worth it precisely because it has nothing to do with tennis." },
              { time: "Evening", location: "Back to your base", activity: "An early night if tomorrow starts a Windsor day trip — it's a genuinely full day out." },
            ]}
          />

          <ItineraryTable
            day="Day 5 — Windsor & Eton day trip"
            rows={[
              { time: "Morning", location: "Waterloo → Windsor & Eton Riverside", activity: "Direct South Western Railway train, under an hour — the same terminus as the Wimbledon train, so no need to switch bases for the day. Leave by mid-morning; this is a full day, not a half-day add-on." },
              { time: "Midday", location: "Windsor Castle & The Long Walk", activity: "Book in advance via rct.uk for the cheaper rate and a guaranteed entry slot. The State Apartments and the 2.5-mile Long Walk are a genuine half-day on their own." },
              { time: "Afternoon", location: "Eton — Across the River from Windsor", activity: "Five minutes on foot over Windsor Bridge — Eton High Street's tea rooms, antique shops, and the 15th-century Cockpit Inn, plus a look at Eton College if timings allow." },
              { time: "Evening", location: "Windsor & Eton Riverside → Waterloo", activity: "No grounds session today by design — this is the one day built with zero tennis commitments." },
            ]}
          />

          <ItineraryTable
            day="Day 6 — Departure"
            rows={[
              { time: "Morning", location: "Hotel → Heathrow / Gatwick", activity: "If your last grounds day ran into finals weekend or a late-evening match, avoid booking an early-morning flight the next day — build in real margin rather than rushing straight from Centre Court to the airport." },
            ]}
          />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Source: wimbledon.com, AELTC published schedule — dates given relative to
        the Fortnight's own structure, since this content applies across every future Championships under this slug.
      </p>
    </SpokeShell>
  );
}

function DayCard({ day, detail }: { day: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{day}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
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

      {/* Desktop/tablet: real 3-column table, 25/25/50 split. Mobile: stacked
          cards — same pattern as ATP Finals' ItinerarySpoke. */}
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
