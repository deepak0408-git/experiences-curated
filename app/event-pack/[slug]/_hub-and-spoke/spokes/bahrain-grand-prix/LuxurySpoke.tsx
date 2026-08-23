import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const paddockClub = linkedExperiences.find((e) => e.slug.includes("f1-paddock-club"));
  const samaSama = linkedExperiences.find((e) => e.slug.includes("sama-sama-hotel"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Bahrain Grand Prix"
      status="teaser"
      h1="Hospitality, private transit, and where a luxury Sepang weekend actually goes beyond Paddock Club"
      question="What does a genuinely luxury Sepang weekend look like?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — Corporate Suites, private transit, the KL skyline venue, and Paddock Club's own inclusions. The pack adds the actual contacts, prices, and booking timeline for every one of them: who to call for Corporate Suites, real chauffeur pricing and how to book, the reservations line for the skyline venue, and the specific Paddock Club booking window worth knowing for a race with unusually high pent-up demand — this tier has historically sold out its best packages well ahead of race weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Luxury at a relocated, first-in-9-years Sepang race isn&apos;t as built-out as at an established calendar
        stop — there&apos;s no second F1 hospitality tier confirmed below Paddock Club yet. What genuinely exists:
        Sepang&apos;s own Corporate Suites, real private chauffeur options built for the circuit&apos;s distance
        from KL, a real luxury skyline venue in the city, and Paddock Club itself as the one confirmed hospitality
        product above a standard ticket.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Corporate Suites — the one other hospitality option at the circuit</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Sepang&apos;s Main Grandstand includes 18 air-conditioned Corporate Suites (sofa seating, 2 restrooms, 4
        TVs, a pantry area) — a real, standing circuit facility, not an F1-specific hospitality product like
        Paddock Club, and its availability and 2026 F1 pricing aren&apos;t published.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Private transit — Kuala Lumpur to Sepang</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Sepang sits roughly 45-60km south of KL and 10-15km from KLIA, far enough that a private transfer is a
        genuine luxury upgrade over public transport on race days, not just a convenience. Real KL/Sepang-based
        operators run fleets from executive sedans through Alphard/Vellfire premium MPVs.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where to go after — the honest picture</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">A real skyline venue in KL</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A confirmed Petronas Twin Towers view from a rooftop infinity pool and lounge — a genuine luxury venue
            in the city, not an official F1 tie-in.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Luxury hotels</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The Hotels guide already covers Mandarin Oriental, Banyan Tree, and JW Marriott as the real KL luxury-tier
        stays, plus Sama-Sama at the airport — worth checking there before booking anywhere else.
      </p>
      <div className="flex flex-wrap gap-4 mb-8">
        <a href="https://www.booking.com/hotel/my/mandarin-oriental-kuala-lumpur.en-gb.html" target="_blank" rel="noopener noreferrer" className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">Mandarin Oriental →</a>
        <a href="https://www.booking.com/hotel/my/banyan-tree-kuala-lumpur-kuala-lumpur.en-gb.html" target="_blank" rel="noopener noreferrer" className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">Banyan Tree →</a>
        <a href="https://www.marriott.com/en-us/hotels/kuldt-jw-marriott-hotel-kuala-lumpur/overview/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">JW Marriott →</a>
        {samaSama && (
          <Link href={`/experience/${samaSama.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
            Sama-Sama full guide →
          </Link>
        )}
      </div>

      {paddockClub && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: F1 Paddock Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Paddock Club is F1&apos;s own hospitality product, run the same way at every race — and it&apos;s back
            at Sepang for the first time since 2017.
          </p>

          <div className="mb-8">
            <SpokeExperienceCard experience={paddockClub} isPro={isPro} />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What&apos;s actually included</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <IncludeCard label="All-day dining" detail="Chef stations, tasting counters, seasonal menus — no extra charges" />
            <IncludeCard label="Open bar" detail="Champagne, fine wines, premium spirits, plus soft drinks" />
            <IncludeCard label="Pit lane walks" detail="Scheduled daily — observe teams prepping cars up close" />
            <IncludeCard label="Podium & garage access" detail="Team garage views plus podium celebration access" />
            <IncludeCard label="Support race access" detail="F2, F3, Porsche Supercup where applicable, plus a guided paddock tour" />
            <IncludeCard label="Extras" detail="Official programmes, pit radio scanner, F1 merchandise" />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paddock Club at Sepang — the real price</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Confirmed 3-day Paddock Club pricing for Sepang 2026 starts at{" "}
            <span className="text-white font-bold">roughly US$6,188 per person</span>.
          </p>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            A grandstand sells you one great view of the racing. Paddock Club sells you the whole day around it —
            the view is just one part of a much bigger product.
          </p>
        </>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Corporate Suites and private transit</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For Corporate Suites, don&apos;t wait for pricing to appear online — it likely never will for a single
            race weekend. Call +60 3 8778 2200 or email hafiz.mahidin@sepangcircuit.com directly (for groups of 10
            or more, that&apos;s the right contact; smaller groups can use the same line or the enquiry form at
            sepangcircuit.com/enquiry). Office hours are 9:30am-5:30pm Monday-Friday, closed weekends and public
            holidays — call within that window rather than expecting an evening or weekend response. State Formula
            1 2026 (2-4 Oct) explicitly, and ask what suite capacity and pricing look like this early — a
            relocated, first-in-9-years race means the circuit itself may not have finalised F1-specific suite
            packages until closer to the date, so an early call is as much about getting on their radar as
            securing a firm price.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For private transit, LimoTaxi is genuinely based at KLIA, Sepang, Selangor. Real published from-prices:
            Economy Sedan from RM100, Premium MPV from RM180,
            Luxury MPV from RM250, Family Van from RM350. Book via WhatsApp or phone on +60 11-5711 4879 — request
            an Alphard or Vellfire specifically if space and comfort matter more than the published from-price,
            since the RM250 rate is a starting point, not a guaranteed race-day fare. Confirm your exact
            pickup/drop-off points when you message, as these base fares don&apos;t automatically include a
            race-day surge or a confirmed circuit run.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking the KL skyline venue for race weekend</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            SkyBar at Traders Hotel Kuala Lumpur is the real venue — book your table through Traders Hotel&apos;s
            own reservations channel ahead of race weekend rather than walking in, since a 33rd-floor
            infinity-pool bar with a genuine Twin Towers view is a real draw on any given night in KL, and race
            weekend brings extra visitors into the city even without an official F1 tie-in. If you&apos;re staying
            at Banyan Tree instead, its own Vertigo sky bar (53rd floor, already listed in the Hotels guide) is
            the more convenient choice — no need to cross town for a comparable rooftop experience.
          </p>

          {paddockClub?.practicalInfo?.bookingMethod && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book only through official channels</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">{paddockClub.practicalInfo.bookingMethod}</p>
            </>
          )}
          {paddockClub?.practicalInfo?.hours && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Access &amp; timing</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">{paddockClub.practicalInfo.hours}</p>
            </>
          )}
        </div>
      )}
    </SpokeShell>
  );
}

function IncludeCard({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
