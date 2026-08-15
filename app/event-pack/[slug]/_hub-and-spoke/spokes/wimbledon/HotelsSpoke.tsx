import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "hotels";

// Rebuilt 15 Aug 2026 per direct founder review. Real changes: (1) village
// atmosphere deepened using the SW19 During the Fortnight experience's own
// real content (pubs, breakfast spots, second-week character) rather than
// a one-line summary; (2) that experience's own card now also surfaces
// here — it's the Itinerary spoke's primary anchor card, cross-referenced
// here rather than duplicated blind, same pattern as Shanghai Masters'
// Hotels/Luxury cross-reference; (3) two new real central-London hotel
// options added (NOX Waterloo — budget, Park Plaza County Hall —
// moderate), both a short walk from Waterloo, the real SWR terminus for
// the direct 21-min Wimbledon train; (4) all 4 hotels now carry real
// Google Places ratings, looked up 15 Aug 2026 — previously none did;
// (5) internal source line replaced with a real reader-facing footer.
//
// Premier Inn Waterloo was the original budget pick, DELETED 15 Aug 2026
// (same day) after the founder couldn't verify a real Booking.com listing
// for that specific property — replaced with NOX Waterloo, confirmed real
// via a genuine Booking.com listing (founder-supplied affiliate link) and
// a live Google Places match (4.6, 2,243 reviews).
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const cannizaro = linkedExperiences.find((e) => e.slug.includes("wimbledon-cannizaro-house"));
  const roseAndCrown = linkedExperiences.find((e) => e.slug.includes("wimbledon-rose-crown"));
  const sw19Village = linkedExperiences.find((e) => e.slug.includes("sw19-during-the-fortnight"));
  const noxWaterloo = linkedExperiences.find((e) => e.slug.includes("nox-waterloo"));
  const parkPlaza = linkedExperiences.find((e) => e.slug.includes("park-plaza-county-hall-london"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="teaser"
      h1="SW19 village vs. central London — a genuinely different trip either way"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The honest SW19-vs-central tradeoff, the village atmosphere, and 4 real named hotels are all free above. Unlocking adds our verdict on which specific hotel to book for your trip shape, and the exact booking-lead-time window that matters most for the Fortnight's short, high-demand run."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Two honest options: SW19 and central London. The case for SW19 is straightforward — you&apos;re 15 minutes
        from the gates, the village has decent food and pubs, and you pick up the local atmosphere that makes the
        trip feel like more than a day out. The case for central London is that it works better if you&apos;re
        using Wimbledon as one day in a longer trip and don&apos;t mind the commute each way.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What Wimbledon Village is actually like during the Fortnight</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        For fifty weeks of the year, Wimbledon Village is a quiet South London high street. For two weeks in late
        June and early July, it becomes something else — the High Street and Church Road fill with fans in light
        summer clothes carrying rolled-up programmes, from several dozen countries, all somehow in the same square
        mile at once. The Dog and Fox, a Victorian pub directly on the walking route from the station, opens its
        windows and serves straight to the pavement; its terrace runs standing-room by mid-afternoon on first-week
        days. The Rose &amp; Crown gets physically decorated for the Fortnight — a marquee extends the courtyard,
        big screens show Centre Court live, and by late afternoon it fills with the crowd that&apos;s just left the
        grounds. Fire Stables on Church Road opens early to serve breakfast to fans walking toward the gates. One
        thing worth knowing: the Village proper (High Street, the pub gardens) is a 15-minute walk uphill from
        Wimbledon station, and a separate destination from the residential streets immediately around the AELTC —
        budget time to move between the two if you&apos;re doing both in a day.
      </p>

      {sw19Village && (
        <div className="mb-8">
          <SpokeExperienceCard experience={sw19Village} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">SW19 — 2 real picks</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {cannizaro && <SpokeExperienceCard experience={cannizaro} isPro={isPro} />}
        {roseAndCrown && <SpokeExperienceCard experience={roseAndCrown} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Central London — 2 real picks near Waterloo</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Both sit a short walk from Waterloo — the real South Western Railway terminus for the direct, no-change
        21-minute train to Wimbledon (see the{" "}
        <Link href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Getting There guide
        </Link>
        ), so you keep the same fast route even basing yourself centrally.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {noxWaterloo && <SpokeExperienceCard experience={noxWaterloo} isPro={isPro} />}
        {parkPlaza && <SpokeExperienceCard experience={parkPlaza} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine Wimbledon trip — not a one-day detour from a longer London stay — book the village over
            central London. Hotel du Vin Cannizaro House sits inside Cannizaro Park itself, a real country-house
            feel a short walk from the grounds; The Rose &amp; Crown is the village&apos;s own historic pub-with-rooms,
            simpler and closer to the daily rhythm of match mornings and post-day pints locals actually keep. If
            Wimbledon is genuinely one day inside a longer London stay, Park Plaza County Hall is the sharper central
            pick over NOX Waterloo — the same Waterloo train access at a real 4-star level, worth the difference if
            you&apos;re spending most nights in London anyway rather than SW19. NOX Waterloo earns its place on
            price and character both — a real budget aparthotel on a genuine local market street, not a chain, this
            close to Waterloo is genuinely rare in central London.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            SW19&apos;s hotel stock is genuinely small next to central London&apos;s, and the Fortnight is a fixed,
            short, high-demand window every year — book as soon as the following year&apos;s Championships dates are
            confirmed, not once you&apos;ve decided which days you&apos;re going. Waiting until ticket results land
            (Ballot results arrive by October–November) is already late for the village&apos;s best rooms; central
            London&apos;s larger hotel stock gives you more breathing room, but the Waterloo-adjacent properties
            specifically still fill for finals weekend.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Google Places API (ratings/review counts for all 4 hotels, verified 15 Aug 2026), NOX Waterloo and
        Park Plaza official sites (address, room details).
      </p>
    </SpokeShell>
  );
}
