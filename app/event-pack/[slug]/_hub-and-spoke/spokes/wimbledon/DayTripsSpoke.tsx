import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Rebuilt 15 Aug 2026 per direct founder review, matched to ATP Finals'
// Day Trips format/rhythm. Real change: added Windsor Castle & The Long
// Walk and Eton — Across the River from Windsor as genuine outward day-trip
// options, reusing the same two real, published, already-researched
// experiences BMW PGA Championship uses (sporting_event_experiences is a
// real many-to-many join table — the same experience can legitimately
// belong to two events' packs at once, confirmed 15 Aug 2026). Both sit on
// a direct SWR line from Waterloo, the same terminus as the Wimbledon
// train, so a Windsor/Eton day genuinely doesn't require switching bases.
// The original single in-London rest day (The Rest Day, Brixton) stays as
// a third, shorter option for anyone not up for a full outward day trip.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const windsorCastle = linkedExperiences.find((e) => e.slug.includes("windsor-castle-long-walk"));
  const eton = linkedExperiences.find((e) => e.slug.includes("eton-across-river-windsor"));
  const restDay = linkedExperiences.find((e) => e.slug.includes("london-rest-day"));
  const brixton = linkedExperiences.find((e) => e.slug.includes("brixton-village-market-row"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="teaser"
      h1="Windsor Castle, or a rest day without leaving London"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real destinations and travel times are all free above — no guessing on distances or train times. What it can't tell you is which day of your specific trip to actually give up for Windsor without costing you a match you'd regret missing. Unlocking adds that verdict, plus the exact booking window for Windsor Castle before Fortnight demand pushes you onto the pricier on-the-day rate."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        With the Championships running two full weeks, there&apos;s real room to build a genuine day away from SW19
        into a longer trip — either a proper outward day trip to Windsor and Eton, or a shorter rest day inside
        London itself.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Windsor &amp; Eton — a real day out</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Direct South Western Railway trains run from London Waterloo to Windsor &amp; Eton Riverside in under an
        hour — the same terminus you&apos;re already using for the 21-minute Wimbledon train (see the{" "}
        <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Getting There guide
        </a>
        ), so no need to switch bases for the day. Windsor Castle and Eton sit five minutes apart on foot across
        Windsor Bridge — a realistic single day covering both.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {windsorCastle && <SpokeExperienceCard experience={windsorCastle} isPro={isPro} />}
        {eton && <SpokeExperienceCard experience={eton} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Or a rest day without leaving London</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        For a shorter break that doesn&apos;t need a full day committed to travel, London itself is right there — a
        short train ride from the grounds.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {restDay && <SpokeExperienceCard experience={restDay} isPro={isPro} />}
        {brixton && <SpokeExperienceCard experience={brixton} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">When to take it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Early-round weekdays (Tuesday through Thursday of the first week) are the easiest days to give up — the
            corporate groups clear out and a grounds pass covers everything that matters on the days you are
            on-site, so missing one mid-week day costs the least, whether you spend it in Windsor or on a shorter
            London rest day. Avoid pulling either around Middle Saturday or finals weekend, when the tournament&apos;s
            best atmosphere is concentrated into a handful of specific days.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Fitting Windsor into the Fortnight</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book Windsor Castle in advance via rct.uk for both the cheaper rate and a guaranteed entry slot —
            especially if your chosen day falls during the Fortnight, when demand from both tournament visitors and
            regular tourism can overlap. Plan to leave Waterloo by mid-morning: the castle plus Eton&apos;s High
            Street is a genuine full day, and there&apos;s no realistic way to fit an afternoon session back at SW19
            on the same day.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: rct.uk (Royal Collection Trust — Windsor Castle hours and pricing), South Western Railway published
        timetables.
      </p>
    </SpokeShell>
  );
}
