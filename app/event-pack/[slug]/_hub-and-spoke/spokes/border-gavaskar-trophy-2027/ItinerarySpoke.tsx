import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

const TOUR_SCHEDULE = [
  { date: "Thu 21 – Mon 25 Jan", type: "1st Test", venue: "VCA Stadium", city: "Nagpur" },
  { date: "Fri 29 Jan – Tue 2 Feb", type: "2nd Test", venue: "MA Chidambaram Stadium", city: "Chennai" },
  { date: "Sat 27 Feb – Wed 3 Mar", type: "5th Test", venue: "Narendra Modi Stadium", city: "Ahmedabad" },
];

export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const planning = linkedExperiences.find((e) => e.slug.includes("bgt-planning-guide"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Border-Gavaskar Trophy"
      status="teaser"
      h1="Three Tests, a four-day squeeze, and a four-week gap: the shape of the trip before you book"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real schedule, the shape of both gaps, and how each Test tends to play out are free above. What the schedule can't do is plan your trip. Unlocking adds two day-by-day itineraries with real dates: a Nagpur and Chennai run that fits Tadoba into the three clear days between them, and an Ahmedabad week that puts the Statue of Unity on the only days it can work around the Monday closure, with the four-week gap options laid out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This is a long series across a very large country, and the honest problem isn&apos;t the cricket, it&apos;s
        the calendar. The first two Tests in this pack are close together, and the second and third are nearly
        four weeks apart. Deciding how to handle that before you book a single flight is what separates a trip
        that works from one that quietly falls apart.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The schedule for this pack</p>
      <ScheduleTable rows={TOUR_SCHEDULE} />
      <p className="text-xs text-[#6A6A6A] mt-3 mb-8">
        Play starts at 9:30am IST at all three grounds. The series also includes Guwahati (11–15 Feb) and Ranchi
        (19–23 Feb), which this pack doesn&apos;t cover.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The shape of the gaps</p>
      <div className="flex flex-col gap-3 mb-8">
        <GapCard label="Nagpur → Chennai" detail="Only four days from the last possible day in Nagpur (25 Jan) to the first in Chennai (29 Jan), with three clear days in between. There is no direct flight, so it needs a real connection day through Hyderabad, Mumbai, or Delhi. Note that 26 January is Republic Day, a national holiday, so check opening hours and expect busier travel that day." />
        <GapCard label="Chennai → Ahmedabad" detail="The real planning question: Chennai ends on 2 February and Ahmedabad starts on 27 February, nearly four weeks. You can fly home and back, or fill the gap inside India, and Gir and the Statue of Unity are both realistic from Ahmedabad if you arrive early." />
      </div>

      {planning && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={planning} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How each Test tends to unfold</p>
      <div className="flex flex-col gap-3 mb-8">
        <GapCard label="Nagpur — decided by day three" detail="Day one tends to play true and slightly slow, spin grips by the second session of day two, and day three has decided the last two India-Australia Tests here. India won inside three days in 2023, so don't book a non-refundable flight for the final day." />
        <GapCard label="Chennai — a spinner's ground" detail="A low, slow pitch that turns, sometimes sharply. Weight your day choices toward comfort over atmosphere across five days in open sun, and expect a knowledgeable crowd." />
        <GapCard label="Ahmedabad — balanced, and enormous" detail="Generally rated good for both batting and bowling, with pace and bounce for quicks and some spin through the middle overs. As the last Test of the whole series, it is likely to carry real stakes however the first four have gone." />
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which Tests we&apos;d actually attend</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If you can only do one, Chennai gives the best mix of history, walkable logistics and a knowledgeable
            crowd. If you can do two, Nagpur and Chennai back to back is the natural pairing, four days apart, with
            a tiger reserve fitting into the gap. Ahmedabad is the one to add if you want to see the final Test at
            the largest ground in the world and turn the trip into a proper Gujarat holiday.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            Nagpur and Chennai — 16 days, 19 Jan–3 Feb
          </p>
          <ItineraryBlock
            title="Nagpur — Days 1–7"
            rows={[
              { day: "Day 1 (Tue 19 Jan)", activity: "Arrive Nagpur. From the airport, the prepaid taxi to Jamtha is about ₹300-400, or head to your hotel on Wardha Road." },
              { day: "Day 2 (Wed 20 Jan)", activity: "Deekshabhoomi in the morning, 15-20 minutes from the centre. Tarri poha for breakfast, Saoji dinner." },
              { day: "Days 3–5 (Thu 21 – Sat 23 Jan)", activity: "1st Test, days 1-3. Play starts 9:30am. Make sure you are at the ground for day three, the day that has decided the last two Tests here." },
              { day: "Days 6–7 (Sun 24 – Mon 25 Jan)", activity: "Days 4 and 5 if the match goes the distance, otherwise a free day. If you haven't already, use it for Deekshabhoomi, or start the Tadoba Tiger Reserve trip early. Keep travel flexible — see the Day Trips guide." },
            ]}
          />
          <ItineraryBlock
            title="Between the Tests and Chennai — Days 8–10"
            rows={[
              { day: "Day 8 (Tue 26 Jan)", activity: "Drive to Tadoba (Kolara gate, roughly 2-2.5 hours from Nagpur) and overnight near the park. Tadoba's core zone is closed on Tuesdays, so this is a travel day, not a safari day. Republic Day: check opening hours." },
              { day: "Day 9 (Wed 27 Jan)", activity: "Dawn safari, then drive back to Nagpur. Book the permit when booking opens, 120 days ahead (around 29 September 2026)." },
              { day: "Day 10 (Thu 28 Jan)", activity: "Connect through Hyderabad, Mumbai or Delhi to Chennai. Walk Marina Beach at golden hour if you have energy, and eat a filter-coffee-and-dosa breakfast ahead of the Test." },
            ]}
          />
          <ItineraryBlock
            title="Chennai — Days 11–16"
            rows={[
              { day: "Days 11–15 (Fri 29 Jan – Tue 2 Feb)", activity: "2nd Test, days 1-5 at Chepauk, 9:30am start. Chennai's pitch turns slowly, so the cricket tends to build across all five days rather than being decided early — stay in Triplicane or Mylapore to walk or take a short ride to the ground." },
              { day: "Day 16 (Wed 3 Feb)", activity: "Depart Chennai, or use the day as a buffer if you'd rather not fly straight off the back of five days at the ground. The gap to Ahmedabad doesn't start in earnest until later, see below." },
            ]}
          />

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mt-10 mb-4">
            The four-week gap, and Ahmedabad — 24 Feb–3 Mar
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            You have three real options for the gap between 2 February and 27 February. Fly home and return, which
            is the simplest but the most expensive in flights. Use it for Gir, a 2-day trip from Ahmedabad, if you
            move to Gujarat early and book the permit 90 days ahead. Or take a longer rest stretch inside India.
            Whichever you choose, decide before you book Ahmedabad.
          </p>
          <ItineraryBlock
            title="Ahmedabad — the Test week"
            rows={[
              { day: "Wed 24 Feb", activity: "Arrive Ahmedabad. If you're staying at The House of MG, you can walk to the old city." },
              { day: "Thu 25 Feb", activity: "Statue of Unity, a full day: 3.5-4.5 hours each way, so leave early. Book your Viewing Gallery slot online in advance." },
              { day: "Fri 26 Feb", activity: "Old City heritage walk (7:45-10:30am), Sabarmati Ashram in the afternoon (open 10am-6pm), Kankaria Lake's laser show at 7pm." },
              { day: "Sat 27 Feb – Wed 3 Mar", activity: "5th Test, days 1-5, 9:30am start. Take the metro to Motera Stadium station every day. Monday 1 March is day three, and the Statue of Unity is closed that day anyway." },
            ]}
          />
        </div>
      )}
    </SpokeShell>
  );
}

function ScheduleTable({ rows }: { rows: typeof TOUR_SCHEDULE }) {
  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A] mb-3">
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
