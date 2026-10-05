import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

// Real tournament rhythm ported from classic-pack editorial content —
// Fan Week's free access, the two-week draw narrowing, night sessions'
// distinct atmosphere. "Preparing for Your US Open Visit" anchors the
// free section per the original classic-pack mapping.
export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const preparing = linkedExperiences.find((e) => e.slug.includes("preparing-for-us-open"));
  const fanWeek = linkedExperiences.find((e) => e.slug.includes("us-open-fan-week-free-grounds-access"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="teaser"
      h1="How the tournament actually unfolds, day by day"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="How each stretch of the tournament actually feels is free above. What it can't do is plan your specific trip — the pack adds the real hour-by-hour, day-by-day itinerary: which day to spend at the grounds, which to give up for a day trip, and how to sequence a night session."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The US Open runs a single-elimination draw across two weeks, preceded by a free Fan Week — the character of
        the grounds shifts sharply as the tournament narrows, a genuinely different atmosphere depending on which
        day you&apos;re there.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The shape of the tournament</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Fan Week (23-29 Aug)" detail="Free grounds access, qualifying matches, and the lightest practice-court crowds of the whole event — genuinely the best window for close-up access to top players before the main draw's intensity sets in." />
        <DayCard day="First-week weekdays" detail="Quietly the best days to be there. A Grounds Admission pass covers everything that matters, and you can move between four or five matches in an afternoon without a reserved seat pinning you to one court." />
        <DayCard day="Second week" detail="The draw thins to 16, then 8. Outer-court matches thin out too — fewer matches, bigger gaps in the schedule. What you get instead is real seats at Ashe or Armstrong and the tournament's best remaining tennis." />
        <DayCard day="Semifinals" detail="The formality tightens noticeably. If a genuinely competitive match is the whole point of the trip, this is the window — top players, real stakes, a different crowd energy than the first week's looseness." />
        <DayCard day="Finals weekend" detail="The occasion itself, trophy presentations included. The most formal, least spontaneous version of the US Open. Worth doing once, but not the same loose, wander-the-grounds energy as Fan Week or week one." />
      </div>

      {preparing && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={preparing} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which days we&apos;d actually pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first US Open, first-week weekdays plus one Fan Week day if your trip dates allow it are
            the sharpest window — a Grounds Admission pass covers real access across a wide range of matches, and
            practice-court visits are at their best before the main draw's crowds set in. Reserve a single Ashe or
            Armstrong day for whichever week actually has the match you most want to see, rather than defaulting to
            finals weekend by habit.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            A sample 6-day trip, day by day
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Built around two grounds days during the sharpest first-week window, one lighter day in Queens, and one
            full outward day trip — the shape that gets the most out of a tournament visit without needing tickets
            for every single day.
          </p>

          <ItineraryTable
            day="Day 1 — Arrival"
            rows={[
              { time: "Afternoon", location: "JFK / LGA / EWR → your base", activity: "Settle in and drop bags — Queens near the 7 train if minimizing commute matters, or Manhattan for the better room selection (see the Where to Stay guide for both). No grounds visit today." },
              { time: "Evening", location: "An early night", activity: "Rest — tomorrow's practice-court morning rewards being properly awake, not a late first evening." },
            ]}
          />

          <ItineraryTable
            day="Day 2 — First grounds day"
            rows={[
              { time: "9:30am", location: "Practice courts", activity: "Top players warming up for that afternoon's matches, no ticket upgrade needed beyond your Grounds Admission pass. See the Arrival Guide if you haven't planned this yet." },
              { time: "Midday", location: "Outer courts and the Grandstand", activity: "The best first-week tennis is here — ranked professionals in genuinely competitive matches, close enough to feel the atmosphere." },
              { time: "Evening", location: "Jackson Heights or Flushing's Golden Mall", activity: "Skip the tournament-adjacent concessions for a genuine Queens food scene instead — see the Where to Eat guide." },
            ]}
          />

          <ItineraryTable
            day="Day 3 — Second grounds day"
            rows={[
              { time: "Afternoon", location: "Arthur Ashe or Louis Armstrong", activity: "Whichever show-stadium ticket you've secured — see the Ticket Guide for the real comparison of tiers." },
              { time: "Evening", location: "Night session at Ashe", activity: "The signature US Open experience — loud, late, built around a marquee match. Consider the rooftop dinner from the Where to Eat guide beforehand." },
            ]}
          />

          <ItineraryTable
            day="Day 4 — Queens rest day"
            rows={[
              { time: "Morning", location: "Flushing Meadows-Corona Park", activity: "A genuine day away from the grounds without leaving the borough — see the Day Trips guide." },
              { time: "Afternoon", location: "A Morning in Queens Before the Tennis", activity: "Explore the neighborhoods surrounding the park at a slower pace than a match day allows." },
            ]}
          />

          <ItineraryTable
            day="Day 5 — Day trip"
            rows={[
              { time: "Morning", location: "Depart for Atlantic City or the Hudson Valley", activity: "No grounds session today by design — this is the one day built with zero tennis commitments. See the Day Trips guide for the real comparison." },
              { time: "Evening", location: "Return to New York", activity: "Build in real margin on the return trip — don't schedule an early grounds session the morning after a long day trip." },
            ]}
          />

          <ItineraryTable
            day="Day 6 — Departure"
            rows={[
              { time: "Morning", location: "Hotel → airport", activity: "If your last grounds day ran into a late night session, avoid booking an early-morning flight the next day." },
            ]}
          />

          {fanWeek && (
            <div className="mt-10">
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">If your trip dates allow it — Fan Week</p>
              <SpokeExperienceCard eventSlug={eventSlug} experience={fanWeek} isPro={isPro} />
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: usopen.org.
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
