import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, dayTrips } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const genting = dayTrips.find((t) => t.slug.includes("genting-highlands"));
  const putrajaya = dayTrips.find((t) => t.slug.includes("putrajaya"));
  // Batu Caves is experienceType "cultural_site", not "day_trip", so it
  // doesn't come through the dayTrips filter — pulled from
  // linkedExperiences directly, same pattern as klGuide/samaSama
  // elsewhere. Added as a genuine third option 1 Aug 2026, since it's
  // linked to this event but wasn't surfaced on this spoke (or anywhere
  // else in the pack) at all.
  const batuCaves = linkedExperiences.find((e) => e.slug.includes("batu-caves"));

  // GetYourGuide affiliate links — real URLs provided by the user, 1 Aug
  // 2026, per the standing "identify only, never construct" rule
  // (feedback_affiliate_link_generation). Also written to each
  // experience's own bookingLinks field in the DB.
  const gygLinks: Record<string, string> = {
    genting: "https://www.getyourguide.com/kuala-lumpur-l171/kuala-lumpur-genting-highlands-tour-with-awana-cable-car-t987863/?partner_id=HCNITTS&utm_medium=online_publisher",
    putrajaya: "https://www.getyourguide.com/kuala-lumpur-l171/kuala-lumpur-putrajaya-tour-with-traditional-boat-cruise-t209247/?partner_id=HCNITTS&utm_medium=online_publisher",
    batuCaves: "https://www.getyourguide.com/kuala-lumpur-l171/kuala-lumpur-suburbs-batu-caves-half-day-tour-with-pick-up-t236817/?partner_id=HCNITTS&utm_medium=online_publisher",
  };

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Bahrain Grand Prix"
      status="teaser"
      h1="Cool mountain air, a capital built from scratch, or a living shrine — which day trip?"
      question="What are the best day trips from Kuala Lumpur?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The three trips are named above — the pack adds the real detail on each one (what's actually there, entry rules, costs), which one we'd pick for your specific free day, and how to fit it around race sessions without wasting travel time."
    >
      {/* Orientation intro — expanded 1 Aug 2026 after the user flagged the
          page as thin, then again to add Batu Caves as a real third
          option. Built from real facts already in each linked
          experience's own body_content/whyItsSpecial — nothing invented.
          None of the three destinations are self-explanatory by name
          alone to a reader with no Malaysia context, so this orients
          before naming any of them. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A three-day Sepang weekend usually has at least one real gap — practice day, or a morning before qualifying —
        worth using rather than sitting in a hotel. Kuala Lumpur has three genuinely different day trips within easy
        reach, built around different ideas of what a day off should feel like: a mountain resort town with a cable
        car and real cool air, an entire capital city built from nothing over a decade as a single architectural
        statement, or a living Hindu shrine built into 400-million-year-old limestone caves.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Genting Highlands is escape — a resort complex an hour outside the city, high enough that the temperature
        genuinely drops from KL&apos;s tropical heat to around 22°C by day, closer to 12°C after dark. Putrajaya is spectacle — Malaysia&apos;s
        purpose-built administrative capital, centred on a rose-granite mosque that appears to float on a
        650-hectare man-made lake. Batu Caves is the closest and most easily combined with a half day — a genuine
        active place of worship, not a museum piece, reachable by direct train from KL Sentral in under an hour.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {genting && <SpokeExperienceCard experience={genting} isPro={isPro} />}
        {putrajaya && <SpokeExperienceCard experience={putrajaya} isPro={isPro} />}
        {batuCaves && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard experience={batuCaves} isPro={isPro} />
          </div>
        )}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
            <p className="text-sm font-bold text-white mb-1">Genting Highlands</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The climb is the point — the Awana SkyWay cable car carries you up to Resorts World Genting, a full
              hill resort of seven hotels, a theme park, and Malaysia&apos;s only legal casino. Casino access is
              real and legally mandated, not casino policy: Malaysian Muslims cannot enter by federal law,
              Malaysian non-Muslims need a MyKad and a RM200 entrance fee, and foreign tourists need a passport and
              must be 21 or older. A dedicated Genting Express bus runs from KL Sentral for roughly RM11-15 one way
              if you&apos;d rather not drive.
            </p>
          </div>

          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
            <p className="text-sm font-bold text-white mb-1">Putrajaya</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The centrepiece is Putra Mosque — the Pink Mosque — built between 1997 and 1999 from pale pink rose
              granite, its 116-metre minaret drawing on Persian, Arab, and Malay architectural traditions and
              inspired specifically by Baghdad&apos;s Sheikh Omar Mosque. Non-Muslim visitors are welcome during
              specific windows (free entry, no booking, modest dress required — robes are provided at the door).
              Beyond the mosque, Cruise Tasik Putrajaya has run scenic lake tours since 2003 past the Seri Wawasan
              Bridge, its cable-stayed design deliberately echoing a sailing ship&apos;s mast and sails.
            </p>
          </div>

          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
            <p className="text-sm font-bold text-white mb-1">Batu Caves</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Guarding the base of the 272 rainbow-painted steps is a 42.7-metre gold statue of Lord Murugan, the
              largest statue in Malaysia, funded entirely by community donations. The Temple Cave at the top is a
              genuine active shrine, first dedicated in 1890 when a Tamil trader noticed the main cave entrance
              resembled Lord Murugan&apos;s divine spear. Entry to the main cave is free; the Dark Cave tour,
              exploring an undeveloped cave system with real conservation guides, runs from around RM35. The
              resident macaques are real and grab loose items — keep phones zipped away and don&apos;t carry
              visible food.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which one we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If you only have half a day, Batu Caves is the easiest fit — under an hour there by direct train, and a
            real three-hour visit covers the climb, the Temple Cave, and getting back with room to spare before an
            afternoon session. Putrajaya is the next best half-day option — the drive is shorter than Genting, and a
            Pink Mosque visit plus a lake cruise is a genuinely complete experience in 3-4 hours. If you have a full
            day and want real relief from three straight days of heat and monsoon risk at the circuit, Genting is
            worth the extra travel time — the temperature drop alone is a different physical sensation from anything
            else on this trip. For any of the three, an organised tour with pickup included is worth the modest extra
            cost on a single free day squeezed between race sessions rather than managing transfers yourself.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Pack for both climates if you&apos;re headed to Genting — a jacket that feels unnecessary leaving Kuala
            Lumpur&apos;s heat is exactly what you&apos;ll want once the SkyWay climbs and the temperature drops
            after dark. For Putrajaya and Batu Caves, dress modestly regardless of which window you visit in — both
            are active places of worship, not tourist sites open on your schedule.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Timing it around race sessions</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Putrajaya&apos;s mosque has specific non-Muslim visiting windows — Saturday to Thursday 9am-12:30pm,
            2pm-4pm, 5:30pm-6pm, with Friday far more restricted (3pm-4pm, 5:30pm-6pm only) — so check that against
            your session schedule before picking the day. Batu Caves is best done before 9am on a weekday, both for
            the heat and to beat tour-bus crowds — a genuine early start that pairs well with an afternoon or evening
            session. For Genting, go on a weekday if you can; weekend cable car queues run long and eat into a day
            you don&apos;t want to lose to standing in line.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Book a guided tour</p>
          <div className="flex flex-col gap-3">
            {genting && (
              <TourLinkCard title={genting.title} url={gygLinks.genting} />
            )}
            {putrajaya && (
              <TourLinkCard title={putrajaya.title} url={gygLinks.putrajaya} />
            )}
            {batuCaves && (
              <TourLinkCard title={batuCaves.title} url={gygLinks.batuCaves} />
            )}
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function TourLinkCard({ title, url }: { title: string; url: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 flex items-center justify-between flex-wrap gap-3">
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
