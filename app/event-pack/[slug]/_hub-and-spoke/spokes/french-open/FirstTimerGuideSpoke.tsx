import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real sourced facts: Roland-Garros has no formal spectator dress code
// (unlike Wimbledon) but a genuine fashion culture (tatlerasia.com,
// racquetmag.com, hospitality-area smart-dress requirement). Many
// Roland-Garros first-timers are also first-time Paris visitors, so this
// spoke orients on both the tournament's own etiquette and the city's
// essential landmarks — Paris Icons and Paris Landmarks cards live here.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const parisIcons = linkedExperiences.find((e) => e.slug.includes("paris-icons-eiffel-tower-seine-arc-de-triomphe"));
  const parisLandmarks = linkedExperiences.find((e) => e.slug.includes("paris-landmarks-louvre-notre-dame"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="public"
      h1="No dress code, but a real fashion culture — and the Paris landmarks worth a non-match day"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Roland-Garros is often a first Paris trip as much as a first Grand Slam, so this orientation covers both:
        what makes the tournament itself different from Wimbledon or the US Open, and what to do with the city on
        the days the tennis doesn't fill.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What makes this tournament different</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">There's no formal spectator dress code — but there is a real fashion culture</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Unlike Wimbledon, Roland-Garros doesn't publish spectator dress rules. What it has instead is a genuine
            reputation as the most fashion-forward Grand Slam — the crowd treats it as a style occasion as much as
            a sporting one, especially on the show courts. Smart-casual with real polish reads right almost
            everywhere; hospitality areas specifically do require smart dress (no flip-flops, ripped jeans, or
            sports shorts).
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Clay-court tennis plays differently than what you've seen on TV</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The ball sits up higher and bounces slower on clay than on hard courts or grass, which means longer
            rallies and matches that can run well past three hours in the tournament's second week. If your only
            reference point is Wimbledon or the US Open, expect a genuinely slower, more physical style of tennis.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Silence during points is enforced, not just polite</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            No shouting or moving around during a point on the show courts — stewards genuinely enforce this, not
            just convention. Phones on silent, no flash photography during play. Once the point ends, react however
            you like.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Mistakes most first-timers make</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Missing the December ballot window and assuming tickets can be bought any time closer to the tournament —
          see the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>{" "}
          for the real calendar. Spending the whole day at one show court and skipping the outer courts and
          practice sessions — genuinely some of the best value in the whole tournament. Not bringing photo ID —
          you'll need it regardless of ticket type. Bringing alcohol expecting to bring it in — it's been banned
          inside the stadium since 2024. And treating Paris as an afterthought around the tennis rather than
          building in at least one full non-match day.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to do on a non-match day</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        For anyone whose Roland-Garros trip is also a first Paris trip, these two cover the essential version of
        the city.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {parisIcons && <SpokeExperienceCard experience={parisIcons} isPro={isPro} />}
        {parisLandmarks && <SpokeExperienceCard experience={parisLandmarks} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A few things worth knowing upfront</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The ballot is a real long shot for a specific date — build your plan around the March sales phase and the
          official resale marketplace, not a ballot win. A Grounds Pass is a genuinely great first-timer day, not a
          consolation prize. And the city around the tournament is half the reason to make this trip, not a
          distraction from it.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: rolandgarros.com, tatlerasia.com and racquetmag.com (dress culture).
      </p>
    </SpokeShell>
  );
}
