import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isRealAffiliateLink } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Combines 3 genuine out-of-Shanghai day trips (Hangzhou/West Lake,
// Suzhou's gardens, Zhujiajiao Water Town — reused from Shanghai Masters
// 2026, venue-agnostic since they're reached via Shanghai's rail hubs
// regardless of which circuit a visitor is near) with 4 downtown Shanghai
// pieces (The Bund, Yu Garden, French Concession, Lujiazui — also reused
// from Shanghai Masters) as a "before/after race weekend" section, since
// the real ~60min Metro Line 11 distance from Jiading makes downtown a
// genuine day-long commitment, not a quick add-on — matches the founder-
// confirmed reuse decision (23 Sep 2026, project_chinese_gp_2027_build_status
// memory). Both groups link to a SECOND event via sporting_event_experiences
// — see the mandatory EXPERIENCE_TO_SPOKE_BY_EVENT entries added in
// app/experience/[slug]/page.tsx in the same pass as these cards.
//
// "Book these tours" section added 4 Oct 2026 — every experience here
// already has a real GetYourGuide bookingLinks entry (confirmed 4 Oct
// 2026), but that field only renders on the experience's own detail page,
// not on the SpokeExperienceCard summary shown here. Surfaced directly on
// this spoke instead, same TourBookingCard pattern as HotelsSpoke's
// HotelBookingCard. Yu Garden and Zhujiajiao share the same GYG product
// (a combined Yu Garden/Old Street/Bund/Zhujiajiao bus tour) — confirmed
// intentional by the founder, not a copy-paste error. French Concession &
// Tianzifang has no GYG link yet — founder declined researching one on the
// spot, left as an open gap rather than guessed at.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const hangzhou = linkedExperiences.find((e) => e.slug.includes("hangzhou-west-lake-day-trip-"));
  const suzhou = linkedExperiences.find((e) => e.slug.includes("suzhou-classical-gardens-day-trip-"));
  const zhujiajiao = linkedExperiences.find((e) => e.slug.includes("zhujiajiao-water-town-day-trip-"));
  const theBund = linkedExperiences.find((e) => e.slug.includes("the-bund-shanghai-dusk-"));
  const yuGarden = linkedExperiences.find((e) => e.slug.includes("yu-garden-old-city-shanghai-"));
  const frenchConcession = linkedExperiences.find((e) => e.slug.includes("french-concession-tianzifang-shanghai-"));
  const lujiazui = linkedExperiences.find((e) => e.slug.includes("lujiazui-skyline-shanghai-"));

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
      h1="Three real Jiangnan day trips, or a full day in downtown Shanghai before or after race weekend"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="All 7 real picks — the 3 day trips and the 4 downtown anchors — are free above. The pack adds direct booking links for every tour, our direct verdict on which one or two to actually prioritize if you only have one spare day, plus how to sequence a downtown day around race weekend without it costing you sleep before a session."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This is one of the few rounds on the calendar with a genuine day-trip advantage built in. Three of
        Jiangnan&apos;s most-visited towns — Hangzhou&apos;s West Lake, Suzhou&apos;s classical gardens, and the
        water town of Zhujiajiao — all sit within easy reach of Shanghai&apos;s rail network, reachable regardless
        of whether you&apos;re based near the circuit or downtown. Separately, downtown Shanghai itself — the Bund,
        Yu Garden, the French Concession, Lujiazui — is a real day&apos;s worth of sightseeing, best treated as a
        dedicated day before or after race weekend given the genuine ~60-minute Metro Line 11 distance from Jiading.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Day trips from Shanghai — Jiangnan's classic towns</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {hangzhou && <SpokeExperienceCard eventSlug={eventSlug} experience={hangzhou} isPro={isPro} hideProCtas />}
        {suzhou && <SpokeExperienceCard eventSlug={eventSlug} experience={suzhou} isPro={isPro} hideProCtas />}
        {zhujiajiao && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard eventSlug={eventSlug} experience={zhujiajiao} isPro={isPro} hideProCtas />
          </div>
        )}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Downtown Shanghai — before or after race weekend</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {theBund && <SpokeExperienceCard eventSlug={eventSlug} experience={theBund} isPro={isPro} hideProCtas />}
        {yuGarden && <SpokeExperienceCard eventSlug={eventSlug} experience={yuGarden} isPro={isPro} hideProCtas />}
        {frenchConcession && <SpokeExperienceCard eventSlug={eventSlug} experience={frenchConcession} isPro={isPro} hideProCtas />}
        {lujiazui && <SpokeExperienceCard eventSlug={eventSlug} experience={lujiazui} isPro={isPro} hideProCtas />}
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Don't assume downtown is a quick add-on</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The real ~60-minute Metro Line 11 journey each way means a downtown day genuinely costs the better part
          of a day once travel time is included — build it in deliberately rather than assuming you can fit it
          around a session day.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book these tours</p>
          <div className="flex flex-col gap-3 mb-8">
            <TourBookingCard name="Hangzhou and West Lake" links={hangzhou?.bookingLinks ?? []} />
            <TourBookingCard name="Suzhou's Classical Gardens" links={suzhou?.bookingLinks ?? []} />
            <TourBookingCard
              name="Yu Garden, Old Street, the Bund & Zhujiajiao Water Town"
              note="One combined bus tour covers both Yu Garden and Zhujiajiao — the same link works for either pick."
              links={yuGarden?.bookingLinks ?? zhujiajiao?.bookingLinks ?? []}
            />
            <TourBookingCard name="The Bund at Dusk" links={theBund?.bookingLinks ?? []} />
            <TourBookingCard name="Lujiazui Skyline" links={lujiazui?.bookingLinks ?? []} />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you only have one spare day</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Zhujiajiao is the sharpest single pick among the three Jiangnan day trips for a first-timer with limited
            time — closer to Shanghai than Hangzhou or Suzhou, and genuinely walkable in a half-day rather than
            requiring a full day out. If a full day is available and you want the more famous name, Hangzhou&apos;s
            West Lake is the pick with the deepest cultural weight; Suzhou is the better choice specifically if
            classical garden architecture is the actual draw.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How to sequence a downtown day</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Put your downtown Shanghai day either right before race weekend starts or right after it ends, never
            wedged between session days — the round-trip commute alone eats a meaningful chunk of a day, and doing
            it on a rest day rather than a race day means you&apos;re not trading sleep or preparation time for
            sightseeing. The Bund at dusk and Lujiazui&apos;s skyline pair naturally into one evening; Yu Garden and
            the French Concession work well together as a daytime walking pair.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

function TourBookingCard({
  name,
  note,
  links = [],
}: {
  name: string;
  note?: string;
  links?: Array<{ platform: string; label?: string; url: string }>;
}) {
  if (links.length === 0) return null;

  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      {note && <p className="text-sm text-[#A3A3A3] leading-6 mb-3">{note}</p>}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {links.map((link, i) => (
          <a
            key={link.url ?? i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
          >
            {link.label ?? link.platform} →
          </a>
        ))}
      </div>
      {links.some((link) => isRealAffiliateLink(link.url)) && (
        <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
      )}
    </div>
  );
}
