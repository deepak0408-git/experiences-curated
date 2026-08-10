import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "itinerary";

// Itinerary spoke folds in "how the event unfolds" per the hub-and-spoke
// skill's classic-pack-parity mapping (§1a) — free event-rhythm content,
// status MUST stay "teaser" (never "gated") so the CTA/checkout block
// renders. Real, confirmed 2026 structure (5-18 Oct, standard ATP Masters
// 1000 single-elimination draw, not round-robin like ATP Finals) — see
// hub-and-spoke skill §2a-5 on verifying structure before writing content
// that assumes one. The 2 fan-culture experiences (crowds, Li Na/Zheng
// Qinwen) and the Federer exhibition live here since they're about the
// event's own rhythm/culture, not a ticket-purchase decision (that's the
// Tickets spoke). The tournament-history experience that used to sit here
// (shanghai-tennis-legacy-china-boom-) was converted to blog article #50
// on 9 Aug 2026 and no longer exists as an experience — removed.
export default async function ItinerarySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const crowds = linkedExperiences.find((e) => e.slug.includes("shanghai-masters-crowds-atmosphere"));
  const liNaZheng = linkedExperiences.find((e) => e.slug.includes("li-na-zheng-qinwen-generations"));
  const federer = linkedExperiences.find((e) => e.slug.includes("roger-friends-federer-exhibition"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="teaser"
      h1="A real match schedule, plus how the crowds and culture fit around it"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The week's shape above is free. The pack adds the full hour-by-hour itinerary — sequenced against real shuttle times, a day-trip window, and Federer exhibition-day booking timing for whichever days you're actually there."
    >
      {/* Free "Event rhythm" section — built on the real, confirmed 2026
          schedule (qualifying Oct 5-6, R1/R2 Oct 7-10, R3/R4 Oct 11-14, QF
          Oct 15-16, SF Oct 17, Final Oct 18), not an assumed generic
          template. Early rounds carry more matches spread across more
          courts (including Court 17 practice sessions); later rounds
          concentrate onto Center Court with fewer, higher-stakes matches. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Unlike the Finals in November, this is a standard Masters 1000 single-elimination draw — 96 players, one
        loss and you&apos;re out. That shapes the week very differently: qualifying and the first two rounds (5-10
        October) run the most matches across the most courts, including the outer showcourts and Court 17&apos;s
        practice sessions, so this is genuinely the best window for close-up access to a wide range of players.
        Third and fourth rounds (11-14 October) narrow things further, then quarterfinals (15-16 October) through
        the semifinals (17 October) and final (18 October) concentrate onto Center Court and Grandstand 2 — fewer
        matches, but each one carries more weight.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This year, Roger Federer continues his &quot;Roger &amp; Friends&quot; exhibition tradition, returning to
        Shanghai for a celebrity doubles match on 16 October — inside this window, but not part of the tournament
        draw. A Grounds Pass doesn&apos;t automatically cover it, but there&apos;s also no separate Federer ticket to
        buy: whichever day-session ticket you hold for that date is what gets you in, so book 16 October specifically
        rather than any other day if seeing him is the priority (see the{" "}
        <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Ticket Guide
        </a>
        ). A multi-day trip has real flexibility to build a Suzhou or Hangzhou day trip into the early-rounds
        stretch, since missing one first-week match day doesn&apos;t cost you the way missing a quarterfinal or
        semifinal would later in the week.
      </p>
      {federer && (
        <div className="mb-8">
          <SpokeExperienceCard experience={federer} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A tentative week, built around that rhythm</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Arrival (before 5 Oct)" detail="Settle in, install Amap and Didi, and get oriented — an evening at the Bund is a good first night, well before Qizhong crowds build." />
        <DayCard day="Qualifying & early rounds (5-10 Oct)" detail="The most matches on the most courts, including Court 17 practice sessions — the best window for close-up access. Build in a city day or the Suzhou/Hangzhou day trip on whichever day suits your session tickets least." />
        <DayCard day="Third/fourth rounds (11-14 Oct)" detail="The draw has narrowed — a good stretch to prioritize specific players you want to see before the field thins further." />
        <DayCard day="Federer exhibition (16 Oct)" detail="No separate ticket exists — a normal day-session ticket for 16 October is what gets you in. Book that specific date early, since exhibition-day sessions sell through faster than an average day." />
        <DayCard day="Quarterfinals through the final (15-18 Oct)" detail="Matches concentrate onto Center Court and Grandstand 2 — protect these days if you have tickets, since the draw has narrowed to fewer, higher-stakes matches." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Session times can still shift</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The round-by-round dates above are the real, confirmed 2026 schedule — but exact daily session start times
          and any weather-driven adjustments aren&apos;t set until closer to the tournament. Check the official
          day-by-day order of play once it&apos;s published.
        </p>
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Recent editions have drawn over 220,000 spectators across the tournament, more than 70% of them traveling in
        from outside Shanghai — a genuine national draw, not a local event with a big venue. That scale is exactly
        why booking early matters here, and it collides directly with China&apos;s National Day Golden Week (1-7
        October), which runs right before the tournament starts and puts real pressure on hotel and transport
        availability in the same window (see the{" "}
        <a href={`/event-pack/${eventSlug}/cost`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Cost Guide
        </a>
        ).
      </p>
      {crowds && (
        <div className="mb-6">
          <SpokeExperienceCard experience={crowds} isPro={isPro} />
        </div>
      )}

      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Shanghai&apos;s crowds skew both younger and older at once, and two careers explain why: Li Na&apos;s 2011
        French Open win made her the first Chinese Grand Slam singles champion and the reason an older generation
        started following tennis at all, while Zheng Qinwen&apos;s 2024 Olympic gold is doing the same for a much
        younger generation discovering the sport now. Federer&apos;s exhibition partner this year is Li Na herself —
        a real link between the tournament&apos;s past and its present.
      </p>
      {liNaZheng && (
        <div className="mb-6">
          <SpokeExperienceCard experience={liNaZheng} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
            The full itinerary, hour by hour — a 6-day trip
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Built for a short trip timed around the tournament&apos;s early-week access and the Federer exhibition —
            arrive with a day to spare, use the middle days for early-round matches and one day trip, let the
            Federer session run late, and give yourself a genuine next-morning departure rather than rushing straight
            from Center Court to the airport. If your own trip is longer, drop the extra nights into more early-round
            days using the same city/food picks below.
          </p>

          <ItineraryTable
            day="Day 1 — Arrival"
            rows={[
              { time: "Afternoon", location: "Pudong (PVG) or Hongqiao (SHA) → hotel", activity: "Take the Maglev + Metro Line 2 combination from PVG (fastest, roughly 45-50 min to central Shanghai) or Metro Line 10/2 directly from SHA. Install Amap (Google Maps is blocked in China) and Didi (China's dominant ride-hailing app, works with a foreign card) before you land." },
              { time: "Evening", location: "The Bund", activity: "An evening walk along the Bund at dusk — the classic first-night move, with the Lujiazui skyline lit up across the river. Early night ahead of tomorrow's session." },
            ]}
          />

          <ItineraryTable
            day="Day 2 — Early-round day"
            rows={[
              { time: "Morning", location: "Yu Garden and the Old City", activity: "A genuine half-morning in the Ming-dynasty garden and the surrounding old-city lanes — save the afternoon for Qizhong." },
              { time: "Midday", location: "Nanxiang Mantou Dian, Yu Garden", activity: "Xiaolongbao at the original Nanxiang-style shop inside the Yuyuan Bazaar — go early to beat the queue." },
              { time: "Afternoon/evening session", location: "Qizhong Forest Sports City Arena", activity: "Early rounds spread matches across Center Court, the outer showcourts, and Court 17's practice sessions — a Grounds Pass gets genuine close-up access to a wide range of players on this kind of day. Take Metro Line 1 to Xinzhuang or Line 5 to Zhuanqiao, then the ¥2 tournament shuttle for the final leg." },
              { time: "Evening (after)", location: "French Concession", activity: "Dinner in the French Concession — book ahead if going somewhere specific, since it's a genuinely popular area after a session lets out." },
            ]}
          />

          <ItineraryTable
            day="Day 3 — Day trip"
            rows={[
              { time: "Morning", location: "Shanghai → Suzhou or Hangzhou (high-speed rail)", activity: "Depart by mid-morning — Suzhou is the faster round trip (as little as 21 minutes each way), Hangzhou rewards a slightly longer day if you have the time. Build the day around a match session you're comfortable missing entirely, not one you're hoping to catch on return." },
              { time: "Midday–afternoon", location: "Suzhou's classical gardens or Hangzhou's West Lake", activity: "A genuine half-day to full-day out of the city — this is the one day built with no tennis commitments, so there's no clock to watch on the way back." },
              { time: "Evening", location: "Return to Shanghai", activity: "Back by early evening on the fast train — no session booked tonight by design." },
            ]}
          />

          <ItineraryTable
            day="Day 4 — Later-round day"
            rows={[
              { time: "Morning", location: "Hotel / Lujiazui", activity: "A lighter morning — the draw has narrowed by now, so today's session is likely the trip's most important match day." },
              { time: "Before the session", location: "Qizhong — confirm your gate", activity: "By this stage of the draw, matches concentrate onto Center Court and Grandstand 2 — confirm your ticket tier's entrance before you arrive, since Qizhong's 80-hectare footprint means walking to the wrong gate genuinely costs time." },
              { time: "Session", location: "Your booked seat", activity: "Later rounds carry more weight per match — protect the whole day if you're attending a quarterfinal or later." },
              { time: "Evening", location: "Xintiandi or French Concession", activity: "A relaxed dinner — this is a good night to book something you've been saving, since tomorrow is the exhibition." },
            ]}
          />

          <ItineraryTable
            day="Day 5 — Federer exhibition day"
            rows={[
              { time: "Morning", location: "Hotel / city", activity: "Keep the morning light — today's session is a genuine exhibition, not a tournament match, and it's the day this itinerary has been built around." },
              { time: "Before the session", location: "Qizhong Forest Sports City Arena", activity: "\"Roger & Friends\" runs on your normal 16 October day-session ticket, not a separate purchase — arrive with the same margin you would for a marquee tournament match, since demand for this specific date is genuinely higher than a standard round." },
              { time: "Evening session", location: "Center Court", activity: "Exhibitions like this typically fall in the evening/night session — the week's centerpiece. Book this session's ticket first, before anything else in your trip, given how fast exhibition-day tickets move." },
              { time: "Late night", location: "Stay another night", activity: "A prime-time exhibition means a late finish — don't plan a same-day departure. Book your flight or onward travel for the next morning instead, so you're not rushing straight from Center Court to a departure gate." },
            ]}
          />

          <ItineraryTable
            day="Day 6 — Departure"
            rows={[
              { time: "Morning", location: "Hotel → Pudong or Hongqiao Airport", activity: "A relaxed next-morning departure gives real margin after the previous night's late finish, rather than a rushed same-day exit." },
            ]}
          />
        </div>
      )}
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
          cards — same pattern as ATP Finals' and Bahrain GP's
          ItinerarySpoke, see hub-and-spoke-event-pack skill §2. */}
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
