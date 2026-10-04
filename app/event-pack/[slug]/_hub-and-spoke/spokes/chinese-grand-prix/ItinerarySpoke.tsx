import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "itinerary";

// Free "Event rhythm" section per skill §1a — the real, founder-confirmed
// regular (non-sprint) weekend format (Friday practice, Saturday
// qualifying, Sunday race), with exact clock times honestly flagged as
// unpublished (§2a-3) — matches Japanese GP's ItinerarySpoke pattern, the
// closest sibling with the same TBC-times gap. No dedicated source
// experience exists for this spoke (matches Italian GP/Japanese GP's
// pattern) — renders real general content without a linked
// SpokeExperienceCard.
//
// Full hour-by-hour ItineraryTable (Wed/Thu arrival through Monday
// excursion) added 4 Oct 2026, matching Brazilian GP's ItinerarySpoke
// structure — the CTA already promised "the full hour-by-hour itinerary"
// but the gated section only had two prose paragraphs, no actual table.
// Uses relative dayparts and session names (Practice 1/2/3, Qualifying,
// Race) instead of invented clock times, since 2027's exact session times
// aren't published yet (see the free "Clock times" box above) — the same
// honesty bar this file already applies elsewhere. Activities pulled from
// content already established in this pack (Anting Old Street, Nanxiang,
// downtown Shanghai, the Jiangnan day trips, Amap/Alipay setup, Metro
// Daduhui/Suishenxing), not invented for this pass.
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
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Chinese Grand Prix"
      status="teaser"
      h1="A standard three-day weekend — regular format confirmed, exact times still TBC"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real weekend rhythm is free above. The pack adds the full hour-by-hour itinerary — which day to fit Nanxiang or a downtown Shanghai day around your session times, when to eat at Anting Old Street to dodge the busiest hours, and the one combination of day trips that genuinely doesn't fit into a single Shanghai weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        2027 is a standard, regular-format weekend at Shanghai International Circuit — no Sprint session, confirmed
        directly by the event organizers. That&apos;s the familiar three-day rhythm: practice, qualifying, race.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Event rhythm</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayRow day="Friday, 16 Apr" sessions="Practice 1, Practice 2" note="The first look at the cars on track — a lighter day than qualifying or the race, and a good window to explore the circuit's non-track offerings (karting, the museum tour) if you're staying nearby." />
        <DayRow day="Saturday, 17 Apr" sessions="Practice 3, Qualifying" note="Qualifying sets Sunday's grid — the session most likely to decide where the real overtaking battles happen the next day." />
        <DayRow day="Sunday, 18 Apr" sessions="Chinese Grand Prix" note="Race day." />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Clock times</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Not yet published for 2027 as of this writing — Formula 1&apos;s own event page still marks every session
          time TBC. Check formula1.com closer to race week for the confirmed daily schedule.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The shape of a real trip</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Given the real ~60-minute Metro Line 11 distance between Jiading and downtown Shanghai, this trip works
          best as more than just three session days. Arriving a day early, or staying a day after, gives you room
          for a genuine downtown Shanghai day (the Bund, Yu Garden, the French Concession) or one of the Jiangnan
          day trips (Hangzhou, Suzhou, Zhujiajiao) without cutting into rest before a session day.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d build the full weekend</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Arrive the Wednesday or Thursday before practice starts, and use that buffer day for Nanxiang or Anting
            Old Street — both genuinely close to Jiading and low-commitment if jet lag is still a factor. Keep
            Friday practice light and stay local; save any longer downtown excursion for after Saturday
            qualifying&apos;s crowds have thinned, or push it to Monday if your schedule allows staying an extra
            day. Race day itself should have zero other plans layered on top of it — arrive early given the
            circuit&apos;s 200,000 capacity, and treat the evening after as recovery, not a night out.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The one combination that doesn't fit</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-10">
            Don&apos;t try to combine a full Jiangnan day trip (Hangzhou or Suzhou, both realistically a full day
            each including travel) with a downtown Shanghai day (the Bund, Yu Garden, French Concession) inside the
            same short trip alongside three session days — that&apos;s five full days of activity stacked onto what
            most visitors plan as a long weekend. Pick one focus: either a Jiangnan day trip, or a downtown Shanghai
            day, not both, unless your trip genuinely runs a week or longer.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">
            The full itinerary, day by day
          </p>
          <p className="text-sm text-[#A3A3A3] leading-6 mb-6">
            2027&apos;s exact session clock times aren&apos;t published yet, so the blocks below use the session
            order and real daypart structure rather than invented times — swap in the confirmed clock times from
            formula1.com once they land, closer to race week.
          </p>

          <ItineraryTable
            day="Wednesday or Thursday — Arrival buffer day"
            rows={[
              { time: "On arrival", location: "Pudong (PVG) or Hongqiao (SHA) to your Jiading hotel", activity: "Land, transfer, and check in — build in real buffer here, not a tight schedule, since international arrival delays are genuinely outside your control. Set up Amap and Alipay/WeChat Pay before you land if you haven't already." },
              { time: "Afternoon", location: "Anting Old Street or Nanxiang", activity: "Both are real, low-commitment half-day stops close to Jiading — a relaxed way to shake off travel and get oriented near the circuit before the session days start." },
              { time: "Evening", location: "Jiading or your hotel neighborhood", activity: "An early, easy dinner close to where you're staying — save any longer downtown excursion for after qualifying, not your first jet-lagged night." },
            ]}
          />

          <ItineraryTable
            day="Friday — Practice day"
            rows={[
              { time: "Morning", location: "Shanghai Metro Line 11 to the circuit", activity: "Make your way to the circuit well ahead of the first session — a lighter day than qualifying or the race, and a good window to use Metro Daduhui or Suishenxing at the gate for the first time before race-day crowds test it." },
              { time: "Practice 1", location: "Your booked grandstand or GA zone", activity: "The first look at the cars on track — worth using to test your seat's sightlines and the walk time from your gate before qualifying and race day matter more." },
              { time: "Practice 2", location: "Your booked grandstand or GA zone", activity: "The gap before and after this session is the natural window for lunch and a slower midday break, rather than staying at the circuit all day." },
              { time: "Evening", location: "Anting or Jiading", activity: "Stay local and keep the night light — this is deliberately the lowest-key evening of the weekend, saving any bigger night out for after qualifying." },
            ]}
          />

          <ItineraryTable
            day="Saturday — Qualifying day"
            rows={[
              { time: "Practice 3", location: "Your booked grandstand or GA zone", activity: "The final tuning session before qualifying, and the last chance to check your seat's sightline before it matters most." },
              { time: "Qualifying", location: "Your booked grandstand or GA zone", activity: "Sets Sunday's starting grid — the session most likely to decide where the real overtaking battles happen the next day." },
              { time: "Evening", location: "Downtown Shanghai (the Bund, Yu Garden, French Concession) or back in Jiading", activity: "Once qualifying's crowds have thinned, this is the better evening of the two session nights for a longer downtown excursion if you're doing one — keep in mind the ~60-minute Metro Line 11 commute each way." },
            ]}
          />

          <ItineraryTable
            day="Sunday — Race day"
            rows={[
              { time: "Morning", location: "Shanghai International Circuit gates", activity: "Arrive early given the circuit's roughly 200,000 capacity — security lines build fast, and there's no realistic way to beat the crowd by arriving close to lights-out." },
              { time: "Race", location: "Your booked grandstand or GA zone", activity: "The Chinese Grand Prix itself." },
              { time: "Evening", location: "Jiading or your hotel", activity: "Treat the evening after the race as recovery, not a night out — zero other plans should be layered onto race day itself." },
            ]}
          />

          <ItineraryTable
            day="Monday — one real excursion, if your trip allows it"
            rows={[
              { time: "Full day", location: "A Jiangnan day trip (Hangzhou, Suzhou, or Zhujiajiao) or a downtown Shanghai day", activity: "Pick one, not both, on top of the three session days — Zhujiajiao is the sharpest single pick for limited time, Hangzhou or Suzhou for a full day out, or downtown Shanghai (the Bund, Yu Garden, French Concession) if you haven't already fit that in. Book transport through Amap rather than assuming Google Maps will route you correctly." },
            ]}
          />
        </div>
      )}
    </SpokeShell>
  );
}

function DayRow({ day, sessions, note }: { day: string; sessions: string; note: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <p className="text-sm font-bold text-white">{day}</p>
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00]">{sessions}</p>
      </div>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
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
