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
  const beigeBrigade = linkedExperiences.find((e) => e.slug.includes("beige-brigade-nz-traveling-support"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="public"
      h1="First-ever four-Test Trans-Tasman series — what a first-time traveller actually needs to know"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This is the first-ever four-Test Trans-Tasman series between New Zealand and Australia, and New Zealand&apos;s
        first tour of Australia since 2019-20 — a genuinely historic scale for a rivalry that Australia spent decades
        not taking seriously as a Test opponent at all.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The rivalry you&apos;re actually watching</p>
      <div className="flex flex-col gap-3 mb-8">
        <FactCard title="Australia barely played New Zealand for decades" detail="The two sides met just 7 times in the 39 years between their first-ever Test in 1946 and the introduction of a proper bilateral trophy in 1985 — Australia simply didn't rate New Zealand as a fixture worth scheduling regularly. The Trans-Tasman Trophy exists specifically because that had to change." />
        <FactCard title="New Zealand's first win over Australia took until 1974" detail="It came at Lancaster Park, Christchurch — a five-wicket win built on Glenn Turner's 101 and 110 not out, still one of the great double-centuries in New Zealand cricket history. It's the moment the rivalry became a real contest rather than a formality." />
        <FactCard title="Australia still leads the trophy 12-3" detail="Despite New Zealand's golden generation winning the inaugural World Test Championship in 2021 under Kane Williamson and holding the world No.1 Test ranking, Australia has won 12 of 19 Trans-Tasman Trophy series to New Zealand's 3 — this series is a genuine chance to close that gap on Australian soil." />
        <FactCard title="New Zealand hasn't beaten Australia in a knockout since 1981" detail="Including the 2015 World Cup final, played at this same MCG, where Mitchell Starc bowled Brendon McCullum for a golden duck in the first over — one of the most replayed moments in World Cup history, and still a live wound for New Zealand fans travelling to Melbourne for this Test." />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Real traditions worth knowing</p>
      <div className="flex flex-col gap-3 mb-8">
        <FactCard title="The Boxing Day Test is its own institution" detail="The MCG's 3rd Test, starting 26 December, is the single biggest date on the Southern Hemisphere cricket calendar — Australians build entire Christmas/New Year travel plans around it, and the atmosphere reflects that scale." />
        <FactCard title="Beige is a real colour to know" detail="New Zealand's traveling support wears beige, deliberately — see below for the real story." />
      </div>

      {beigeBrigade && (
        <div className="mb-8">
          <SpokeExperienceCard experience={beigeBrigade} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Mistakes most first-timers make</p>
      <div className="flex flex-col gap-3 mb-8">
        <FactCard title="Assuming every day of a Test looks the same" detail="A Test's rhythm changes day to day — the first day often favours bowlers with a fresh pitch and new ball, the pitch typically flattens by days 3-4, and a match heading into day 5 has a genuinely different tension than day 1. Don't judge the whole experience off a single day." />
        <FactCard title="Not checking what's not allowed through the gates" detail="All four grounds share the same core rules: no glass bottles or cans, no outside alcohol, and a small-bag-only policy — anything too large to fit under your seat will be refused or checked at the gate. The exact bag-size limit differs slightly venue to venue (roughly A4-sized at the MCG, 30x40cm at the SCG), so travel light and expect a bag search at every ground." />
        <FactCard title="Under-planning the gaps between Tests">
          This is a five-week tour with real gaps between legs — treat those gaps as genuine trip-planning
          opportunities (see the{" "}
          <a href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Day Trips guide
          </a>
          ), not dead time to rush through.
        </FactCard>
        <FactCard title="Booking Melbourne accommodation late">
          Boxing Day week is Melbourne&apos;s highest hotel-demand window of the entire year, independent of
          cricket — book that leg first, see the{" "}
          <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Where to Stay guide
          </a>
          .
        </FactCard>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">This tour, in real numbers</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          4 Tests, 4 cities, roughly 4,300km of internal travel if you attend every leg — genuinely one of the
          largest single-tour footprints on the international cricket calendar. See the{" "}
          <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Getting There guide
          </a>{" "}
          for the real domestic-flight logistics.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: cricket.com.au, ICC Test cricket format rules, MCG official Boxing Day Test history, Wikipedia
        (Trans-Tasman Trophy history and series record, cross-referenced against Grokipedia and Cricket Today),
        RNZ/NZ History (1974 first Test win over Australia), ESPNcricinfo and BBC Sport (2015 World Cup final,
        McCullum dismissal), NZ Herald (2021 World Test Championship win, golden-era ranking context), mcg.org.au
        and Ticketek (MCG Conditions of Entry), optusstadium.com.au (Perth Stadium Conditions of Entry),
        adelaideoval.com.au (Adelaide Oval Conditions of Entry), sydneycricketground.com.au (SCG Conditions of
        Entry) — bag and prohibited-item rules verified against each venue's own current entry conditions.
      </p>
    </SpokeShell>
  );
}

function FactCard({ title, detail, children }: { title: string; detail?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail ?? children}</p>
    </div>
  );
}
