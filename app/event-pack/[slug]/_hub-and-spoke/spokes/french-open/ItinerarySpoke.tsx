import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

// Real tournament rhythm from experience research (Court 14's week-1
// atmosphere, night sessions from the roof's 2020 addition, the ballot/
// resale timing). Moulin Rouge and Le Caveau de la Huchette anchor two of
// the evening slots in the full itinerary.
export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const moulinRouge = linkedExperiences.find((e) => e.slug.includes("moulin-rouge-show"));
  const caveau = linkedExperiences.find((e) => e.slug.includes("caveau-de-la-huchette-jazz"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="teaser"
      h1="How the tournament actually unfolds, day by day"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="How each stretch of the tournament actually feels is free above. What it can't do is plan your specific trip — the pack adds the real hour-by-hour, day-by-day itinerary: which day to spend at the grounds, which to give up for Versailles, and how to sequence evenings between the tennis and the city."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Roland-Garros runs a single-elimination draw across two weeks, and the character of the grounds shifts
        sharply as the tournament narrows — the same clay, a genuinely different atmosphere depending on which day
        you're there.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The shape of the tournament</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Opening days" detail="Seeded players are on Chatrier and Lenglen from day one, but the outer courts are where the draw genuinely opens up — ranked professionals in first-round matches you can walk right up to, plus the best morning practice-court access of the whole tournament." />
        <DayCard day="First-week weekdays" detail="Quietly the best days to be there. A Grounds Pass covers everything that matters, Court 14 turns loud whenever a French player is drawn there, and you can move between four or five matches in an afternoon without a reserved seat pinning you to one court." />
        <DayCard day="Second week" detail="The draw thins to 16, then 8. Outer-court matches thin out — fewer matches, bigger gaps in the schedule. What you get instead is real seats on Chatrier or Lenglen and the tournament's best remaining tennis." />
        <DayCard day="Semifinals" detail="The formality tightens noticeably. If a genuinely competitive match is the whole point of the trip, this is the window — top-4 players, real stakes, less crowd noise between points than the first week." />
        <DayCard day="Finals weekend" detail="The occasion itself — trophy presentations included. The most formal, least spontaneous version of Roland-Garros. Worth doing once, but not the same loose, wander-the-grounds energy as week one." />
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which days we&apos;d actually pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Roland-Garros trip, first-week weekdays are the sharpest window — a Grounds Pass
            covers real access across a wide range of matches, and morning practice-court visits are at their best
            before the draw thins. Reserve a single Chatrier or Lenglen day for whichever week actually has the
            match you most want to see, rather than defaulting to finals weekend by habit.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What finals weekend actually trades off</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-10">
            The tournament worth travelling for is the one with roaming outer courts and unexpected first-week
            results — that peaks well before finals weekend's trophy presentations and heightened formality. Book
            finals weekend for the occasion itself, not expecting the loose, wander-the-grounds energy of week one.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour — a 6-day trip
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Built around two grounds days during the sharpest first-week window, one lighter day inside Paris, and a
            genuine day trip to Versailles — the shape that gets the most out of a tournament visit without needing
            tickets for every single day. If your own trip is shorter, drop the Versailles day first; if it's
            longer, add extra grounds days using the same first-week logic.
          </p>

          <ItineraryTable
            day="Day 1 — Arrival"
            rows={[
              { time: "Afternoon", location: "CDG / Orly → your base", activity: "Settle in and drop bags — the 16th arrondissement if you're staying near the grounds, or Boulogne-Billancourt for the better-value option (see the Where to Stay guide for both). No grounds visit today; save your energy for tomorrow's early start." },
              { time: "Evening", location: "A boulangerie sandwich, then an early night", activity: "A real jambon-beurre from any local boulangerie, then rest — tomorrow's practice-court morning rewards being properly awake, not a late first evening." },
            ]}
          />

          <ItineraryTable
            day="Day 2 — First grounds day"
            rows={[
              { time: "Before 10am", location: "Practice courts", activity: "Top seeds warming up for that afternoon's matches, no ticket upgrade needed beyond your Grounds Pass. See the Ticket Guide for the full Grounds Pass vs. show-court comparison if you haven't decided your route yet." },
              { time: "Midday", location: "Outer courts (6, 7, 9, 12, 13, 14)", activity: "The best first-week tennis is here — ranked professionals in genuinely competitive matches, and Court 14's crowd turns loud fast if a French player is drawn there." },
              { time: "Afternoon", location: "Court Simonne-Mathieu", activity: "The greenhouse-wrapped court built into the Jardin des Serres d'Auteuil — worth a visit even outside your ticket tier for the setting alone." },
              { time: "Evening", location: "A neighborhood restaurant, Auteuil", activity: "Skip the tournament-adjacent tourist spots for a genuine local pick in the Village d'Auteuil — see the Day Trips guide." },
            ]}
          />

          <ItineraryTable
            day="Day 3 — Second grounds day"
            rows={[
              { time: "Morning", location: "Stadium Backstage Tour + Tenniseum", activity: "Genuinely worth timing for an off-tournament morning if your trip allows — the guided route doesn't run during the tournament fortnight itself; check whether the museum alone is open on your dates." },
              { time: "Afternoon", location: "Court Philippe-Chatrier or Suzanne-Lenglen", activity: "Whichever show-court ticket you've secured — see the Ticket Guide for the real comparison of ticket tiers and the ballot/resale calendar." },
              { time: "Evening", location: "Le Caveau de la Huchette, Latin Quarter", activity: "Live jazz and swing dancing in a medieval cellar — arrive 30-45 minutes before the 9:30pm doors, especially on a weekend." },
            ]}
          />

          <ItineraryTable
            day="Day 4 — Paris rest day"
            rows={[
              { time: "Morning", location: "Eiffel Tower, Seine cruise, or the Louvre", activity: "A genuine day away from the tournament — see the First-Timer's Guide for the essential Paris landmarks. Early-round weekdays are the easiest tournament days to give up." },
              { time: "Afternoon", location: "Montmartre", activity: "Sacré-Cœur, Place du Tertre's working artists, a genuinely different register of Paris than the tournament's quiet 16th arrondissement." },
              { time: "Evening", location: "Moulin Rouge — Féerie", activity: "Book the 11pm show over the 9pm slot for the same production at a lower price. A cabaret institution running since 1889, a genuine change of pace from a day of tennis." },
            ]}
          />

          <ItineraryTable
            day="Day 5 — Versailles day trip"
            rows={[
              { time: "Morning", location: "Central Paris → Versailles", activity: "RER C from Saint-Michel–Notre-Dame, Musée d'Orsay, or Invalides, 35-45 minutes. Leave by mid-morning; this is a full day, not a half-day add-on." },
              { time: "Midday", location: "The Palace of Versailles", activity: "Book timed-entry tickets in advance via en.chateauversailles.fr — slots genuinely sell out in May-June, which overlaps directly with the tournament." },
              { time: "Afternoon", location: "The Trianon Estate & Hameau de la Reine", activity: "A genuinely different, more intimate side of Versailles than the palace's state rooms — worth the extra walk most visitors skip." },
              { time: "Evening", location: "Versailles → central Paris", activity: "No grounds session today by design — this is the one day built with zero tennis commitments." },
            ]}
          />

          <ItineraryTable
            day="Day 6 — Departure"
            rows={[
              { time: "Morning", location: "Hotel → CDG / Orly", activity: "If your last grounds day ran into a late night session, avoid booking an early-morning flight the next day — build in real margin rather than rushing straight from Chatrier to the airport." },
            ]}
          />

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mt-10 mb-4">Two evenings worth building the trip around</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {moulinRouge && <SpokeExperienceCard experience={moulinRouge} isPro={isPro} />}
            {caveau && <SpokeExperienceCard experience={caveau} isPro={isPro} />}
          </div>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: rolandgarros.com, en.chateauversailles.fr.
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
