import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const orientation = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-first-timer-orientation"));
  const raceWeekFree = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-race-week-free"));
  const sportsbook = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-sportsbook-watch"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="public"
      h1="A night race in a 24-hour city — the basics that actually matter"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Every session at this race runs at night, and Las Vegas already runs on its own clock regardless — that
        combination catches first-timers out more than any other single fact about this weekend. Here&apos;s what
        actually trips people up.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — packing for the daytime forecast, not the session you&apos;re actually attending</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every session is a night session, and November desert nights run genuinely cold once the sun&apos;s down
          — mid-40s°F with real wind, even on a day that felt mild at noon. Pack for the coldest session on your
          schedule, not the mildest part of the day, especially if you&apos;re only attending Saturday&apos;s race.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — assuming the road you walked in on will still be open</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Soft closures begin at 3pm and full closures at 5pm each day of race weekend, Thursday through Saturday —
          this is a street circuit built through the middle of the Strip, not a stadium you drive to. A route that
          worked getting in can be sealed by the time you head back. Download the official Las Vegas Grand Prix app
          before you land — its real-time closure map and custom walking routes are the single most useful tool for
          a circuit that reroutes on the fly.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — showing up without a card that works</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every food, drink, and merchandise purchase on-site is card or mobile payment only — the event is
          entirely cashless. Confirm your card works internationally before race weekend, not once you&apos;re
          already in line with no other way to pay.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — leaving merchandise shopping for race day</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Strip merchandise stores get significantly more crowded on Saturday than earlier in the week. Buy
          official F1 merchandise Thursday or Friday instead, and you avoid carrying bags through peak race-night
          foot traffic on top of it.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — treating the free side of the weekend as an afterthought</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Boulevard fan activations, team fan zones, and sportsbook watch parties don&apos;t need a circuit ticket
          at all — for a budget-conscious first trip, that layer of the weekend is worth building real time around,
          not squeezing in around a single grandstand session.
        </p>
      </div>

      {orientation && (
        <div className="mb-8">
          <SpokeExperienceCard experience={orientation} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">You don&apos;t need a circuit ticket to be part of the weekend</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {raceWeekFree && <SpokeExperienceCard experience={raceWeekFree} isPro={isPro} />}
        {sportsbook && <SpokeExperienceCard experience={sportsbook} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4 pt-10 border-t border-[#2A2A2A]">Practical essentials</p>

      <p className="text-sm font-bold text-white mb-2">Essential apps to download before you land</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <div className="flex flex-col gap-4">
          <AppRow name="Las Vegas Grand Prix app" detail="Real-time road closures, custom walking routes to your ticketed zone, session schedules — the single most useful tool for the weekend." />
          <AppRow name="Las Vegas Monorail app / website" detail="Live schedules for the 24/7 race-week service — the most reliable way to move along the Strip once closures begin." />
          <AppRow name="Rideshare app of choice" detail="Works, but only from designated pickup points (Virgin Hotels Las Vegas, Hughes Center) and gets genuinely slow right after a session ends — a fallback, not a first choice, during peak closure hours." />
          <AppRow name="F1 Official App" detail="Live timing, session schedules, and driver tracking during the race weekend itself — genuinely useful once you're inside a zone and want to follow the wider session." />
        </div>
      </div>

      <p className="text-sm font-bold text-white mb-2">Accessibility</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Wheelchair-accessible seating and companion seats are available circuit-wide — use the &quot;Disabled
          Access&quot; option on the official F1 tickets site when booking. Escorted, complimentary wheelchairs and
          push assistance between entrance gates and seated areas are available on request at each Accessibility
          booth, and crutches, walkers, canes, and personal mobility scooters are all permitted inside the event.
          Confirm your specific entrance and route with the organizers before travelling — most of the site is
          paved and interconnected, but not every path is guaranteed step-free.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">Getting out afterward</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Harry Reid International Airport sits roughly two miles from the circuit, and airlines add between
          14,000 and 25,000 extra seats into Las Vegas for race week — outbound travel is genuinely heavier than a
          normal weekend, not just anecdotally. Follow the airport&apos;s own &quot;4-3-2-1&quot; guidance: start
          arranging transport or returning a rental car a full four hours before your flight, since nearby road
          closures and detours can add real time even for a short trip to the terminal. Text &quot;F1LV&quot; to
          31996 for live race-related traffic alerts around the airport.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: f1lasvegasgp.com official A-Z Guide (cashless payments, road closures, merchandise), lasvegas.gp
        official accessibility page, 8newsnow.com and news3lv.com airport travel-tips coverage (Harry Reid
        International Airport race-week guidance).
      </p>
    </SpokeShell>
  );
}

function AppRow({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{name}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
