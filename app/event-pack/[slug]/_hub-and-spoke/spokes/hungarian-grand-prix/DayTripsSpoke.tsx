import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isRealAffiliateLink } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Three real, seeded experiences cover Budapest beyond the circuit: A Day
// in Budapest (Castle Hill to Parliament, a genuine full day trip), Széchenyi
// Thermal Bath (Europe's largest medicinal bath complex), and Szimpla Kert
// (the original Budapest ruin bar, Jewish Quarter nightlife). 16 Oct 2026.
//
// "Book these tours" section added 17 Oct 2026, same TourBookingCard pattern
// as Chinese GP's DayTripsSpoke — real GetYourGuide bookingLinks only render
// on an experience's own detail page, not on the SpokeExperienceCard summary
// shown here. All three experiences have a real, seeded GetYourGuide link.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const dayInBudapest = linkedExperiences.find((e) => e.slug.includes("a-day-in-budapest-"));
  const szechenyi = linkedExperiences.find((e) => e.slug.includes("szechenyi-thermal-bath-"));
  const szimplaKert = linkedExperiences.find((e) => e.slug.includes("szimpla-kert-jewish-quarter-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Hungarian Grand Prix"
      status="teaser"
      h1="Castle Hill, Europe's largest medicinal bath, or the original ruin bar"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="Every real site above is free. The pack adds direct booking links for all three — the Castle Hill tour, the Széchenyi spa pass, and the Jewish District walk — plus the actual day-by-day sequencing we'd run across race weekend: which day to make the Castle Hill trip, when to fit in the baths without cutting into session time, and the one combination that genuinely doesn't work."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Budapest is worth real time beyond an evening after each day&apos;s session — a genuine capital city with
        enough packed into a short metro ride from the circuit that most first-time visitors underestimate how much
        they can actually fit in. Three real anchors cover the range: a full day of sightseeing on the Buda side,
        the city&apos;s most famous thermal bath, and its most famous bar.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A Day in Budapest — Castle Hill to Parliament</p>
      {dayInBudapest && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={dayInBudapest} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Two Budapest anchors</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {szechenyi && <SpokeExperienceCard eventSlug={eventSlug} experience={szechenyi} isPro={isPro} hideProCtas />}
        {szimplaKert && <SpokeExperienceCard eventSlug={eventSlug} experience={szimplaKert} isPro={isPro} hideProCtas />}
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8 mt-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest logistics</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Castle Hill and the Parliament walk are a genuine full-day commitment if you want to actually see
          Fisherman&apos;s Bastion, Buda Castle, and the Parliament building properly, not a quick half-day
          add-on. Széchenyi Thermal Bath is a flexible half-day, equally good as a morning soak before an afternoon
          session or an evening wind-down after one. Szimpla Kert works any evening, but the real character of the
          place — the farmers&apos; market inside — only shows up on a Sunday morning.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book these tours</p>
          <div className="flex flex-col gap-3 mb-8">
            <TourBookingCard name="A Day in Budapest — Castle Hill, Parliament & Grand City Tour" links={dayInBudapest?.bookingLinks ?? []} />
            <TourBookingCard name="Széchenyi Spa Full-Day Entrance Pass" links={szechenyi?.bookingLinks ?? []} />
            <TourBookingCard name="Budapest Past & Present — Jewish District Walk" links={szimplaKert?.bookingLinks ?? []} />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a standard Friday-to-Sunday race weekend with a Thursday arrival, Castle Hill fits naturally on
            Thursday — the one day with zero session-time pressure, and the kind of full-day sightseeing that
            deserves a clear calendar rather than a squeeze between practice sessions. Fit Széchenyi in on Friday
            or Saturday morning, before the day&apos;s session starts, rather than after — arriving at the circuit
            relaxed beats rushing in post-soak. Save Szimpla Kert for Saturday night, once qualifying has set
            Sunday&apos;s grid and there&apos;s something real to talk about over a drink.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The one combination that genuinely doesn&apos;t work: don&apos;t try to pair Castle Hill with a
            same-day circuit session — between the walking the sights actually deserve and the commute back to the
            Hungaroring, you&apos;ll arrive late to one or the other, and neither is worth rushing.
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
  links?: Array<{ platform: string; url: string }>;
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
            {link.platform} →
          </a>
        ))}
      </div>
      {links.some((link) => isRealAffiliateLink(link.url)) && (
        <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
      )}
    </div>
  );
}
