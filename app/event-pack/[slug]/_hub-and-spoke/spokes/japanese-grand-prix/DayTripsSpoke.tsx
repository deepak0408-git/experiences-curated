import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Four real, seeded day-trip experiences: Nagoya in a Day (city anchor,
// satisfies CLAUDE.md's day-trip rule), Ise Grand Shrine, Osaka in a Day
// (honestly reframed as a real ~4-5hr round trip, not a second base — see
// experience-researcher notes), and Watching Sumo Near Nagoya (Sumo Studio
// Osaka, real year-round program, honestly distinguished from the July-only
// Nagoya Basho tournament). All content sourced 22 Sep 2026.
//
// GetYourGuide affiliate links added 30 Sep 2026 — real URLs provided by
// the founder, per the standing "identify only, never construct" rule
// (feedback_affiliate_link_generation). Six links map to four experiences:
// two separate Nagoya tours (the 2.5hr castle/history/food/city-view tour
// and the dedicated Osu/Kannon Temple street-food tour) both point to the
// single seeded "Nagoya in a Day" experience, since that's the only Nagoya
// day-trip row in this pack and it covers both the castle and Osu; Ise gets
// its own guided Geku/Naiku tour; Osaka gets two tours (Castle walking
// tour, Dotonbori river cruise) since both are genuinely distinct bookable
// products covering the same experience; Sumo gets its own. Also needs
// writing to each experience's own bookingLinks field in the DB per the
// Bahrain pattern — not done in this pass, code-only.
//
// Deliberately placed OUTSIDE the isUnlocked gate, unlike Bahrain GP's
// "Book a guided tour" section (which sits inside it) — founder flagged
// that gating affiliate booking links behind pack purchase loses referral
// revenue from every free/teaser visitor who never buys, since a
// GetYourGuide click-through monetizes independently of whether they ever
// purchase this pack. Bahrain's placement should probably be revisited too,
// but that's out of scope for this pass.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const nagoya = linkedExperiences.find((e) => e.slug.includes("japanese-gp-nagoya-day-trip"));
  const ise = linkedExperiences.find((e) => e.slug.includes("japanese-gp-ise-grand-shrine"));
  const osaka = linkedExperiences.find((e) => e.slug.includes("japanese-gp-osaka-day-trip"));
  const sumo = linkedExperiences.find((e) => e.slug.includes("japanese-gp-sumo-near-nagoya"));

  const gygLinks = {
    nagoyaCastleTour: "https://www.getyourguide.com/nagoya-l32669/25-hour-nagoya-tour-castle-history-local-food-city-view-t1069157/?partner_id=HCNITTS&utm_medium=online_publisher",
    nagoyaOsuTour: "https://www.getyourguide.com/nagoya-l32669/nagoya-kannon-temple-osu-district-street-food-guided-tour-t1094399/?partner_id=HCNITTS&utm_medium=online_publisher",
    iseTour: "https://www.getyourguide.com/ise-japan-l152431/ise-guided-geku-and-naiku-in-the-sacred-pilgrimage-order-t1036256/?partner_id=HCNITTS&utm_medium=online_publisher",
    osakaCastleTour: "https://www.getyourguide.com/osaka-l1204/osaka-castle-history-walking-tour-castle-tower-admission-t1038691/?partner_id=HCNITTS&utm_medium=online_publisher",
    osakaDotonboriTour: "https://www.getyourguide.com/osaka-l1204/osaka-2-hour-walking-tour-with-dotonbori-river-cruise-t1323946/?partner_id=HCNITTS&utm_medium=online_publisher",
    osakaSumoTour: "https://www.getyourguide.com/osaka-l1204/osaka-sumo-experience-with-live-show-audience-challenge-t1111734/?partner_id=HCNITTS&utm_medium=online_publisher",
  };

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="teaser"
      h1="Nagoya Castle, Japan's most sacred shrine, and an honest read on Osaka's real commute cost"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The four real options and what each one actually involves are free above. The pack adds our direct verdict on which one to prioritize if you only have one non-race day, the specific Kintetsu departure timing that makes or breaks an Ise half-day, and the honest reasoning behind skipping Osaka Castle if your day trip time is genuinely limited."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        A Suzuka trip has real non-race-day potential, precisely because Nagoya sits close to some of the
        region&apos;s most distinctive destinations — but not all of them are worth the same commitment. Here&apos;s
        the honest version, including the trips most guides oversell.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Nagoya in a day — the city most visitors skip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Most Suzuka visitors already pass through Nagoya without really seeing it — it&apos;s the base for the
          race, not the destination. Nagoya Castle and its genuinely faithful Honmaru Palace reconstruction,
          Kinshachi Yokocho&apos;s food street right at the castle entrance, and Osu&apos;s dense,
          Akihabara-energy shopping streets cover a real full day comfortably.
        </p>
      </div>

      {nagoya && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={nagoya} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ise Grand Shrine — Japan&apos;s most sacred site, genuinely worth the half-day</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Two main complexes — Geku (Outer Shrine) and Naiku (Inner Shrine, more sacred, dedicated to Amaterasu) —
          rebuilt from scratch every 20 years using traditional techniques, a practice continued for over a
          millennium. Reachable from Nagoya via the Kintetsu Limited Express in around 80 minutes.
        </p>
      </div>

      {ise && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={ise} isPro={isPro} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {osaka && <SpokeExperienceCard eventSlug={eventSlug} experience={osaka} isPro={isPro} />}
        {sumo && <SpokeExperienceCard eventSlug={eventSlug} experience={sumo} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest read on Osaka</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Osaka comes up in almost every Suzuka planning guide, but it&apos;s a genuine four-to-five-hour round
          trip from Nagoya once you include both legs — a real day trip, not a second base you&apos;d commute
          from to the circuit. Dotonbori alone, walked slowly with real time for the food, gives a strong sense of
          the city in a few hours; add Osaka Castle only if you have the better part of a full day.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you only have one non-race day</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Ise Grand Shrine is the pack&apos;s own pick — it&apos;s a genuinely rare opportunity given you&apos;re
            already in the region, and nothing else on this list carries the same weight of being a once-in-a-trip
            experience rather than something you could see on any future Japan visit. If a temple half-day isn&apos;t
            for you, Nagoya itself — the castle, Kinshachi Yokocho, Osu — is the more comfortable, lower-commitment
            option, and it&apos;s the city you&apos;re already staying in.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The Ise timing that actually matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Take the Kintetsu Limited Express (or the Shimakaze on weekdays, a premium option with a more
            comfortable ride) from Nagoya Station in the mid-morning — leaving any later genuinely risks running
            out of daylight to see both Geku and Naiku with the bus connection between them. If your schedule only
            allows one shrine, Naiku is the more essential visit; it&apos;s the more sacred site and the one most
            associated with Ise&apos;s reputation nationally.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Why we&apos;d skip Osaka Castle specifically</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            If your Osaka day is genuinely time-limited, cut Osaka Castle before you cut Dotonbori — the castle
            adds a real hour-or-two on top of an already long round trip, and Dotonbori&apos;s food and
            atmosphere give a stronger, faster sense of what makes Osaka distinct than a reconstructed castle
            interior does. Save Osaka Castle for a future trip where Osaka is the actual base, not a day trip
            squeezed around a race weekend.
          </p>
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Book a guided tour</p>
      <div className="flex flex-col gap-3">
        {nagoya && (
          <>
            <TourLinkCard title="Nagoya Castle, History & Food — 2.5hr Guided Tour" url={gygLinks.nagoyaCastleTour} />
            <TourLinkCard title="Osu Kannon Temple & Street Food — Guided Tour" url={gygLinks.nagoyaOsuTour} />
          </>
        )}
        {ise && (
          <TourLinkCard title="Ise Grand Shrine — Geku & Naiku, Guided" url={gygLinks.iseTour} />
        )}
        {osaka && (
          <>
            <TourLinkCard title="Osaka Castle History Walking Tour" url={gygLinks.osakaCastleTour} />
            <TourLinkCard title="Osaka Walking Tour with Dotonbori River Cruise" url={gygLinks.osakaDotonboriTour} />
          </>
        )}
        {sumo && (
          <TourLinkCard title="Osaka Sumo Experience — Live Show & Audience Challenge" url={gygLinks.osakaSumoTour} />
        )}
      </div>
    </SpokeShell>
  );
}

function TourLinkCard({ title, url }: { title: string; url: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 flex flex-col items-start gap-3">
      <p className="text-sm font-bold text-white">{title}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
      >
        Book with GetYourGuide ↗
      </a>
    </div>
  );
}
