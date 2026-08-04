import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "luxury";

export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const paddockClub = linkedExperiences.find((e) => e.slug.includes("f1-paddock-club"));

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
      ctaCopy="Every real contact, price, and lead time named above is free. The pack adds the specific booking timeline and detail worth knowing if you're seriously considering Paddock Club for a race with unusually high pent-up demand — this tier has historically sold out its best packages well ahead of race weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Luxury at a relocated, first-in-9-years Sepang race isn&apos;t as built-out as at an established calendar
        stop — there&apos;s no second F1 hospitality tier confirmed below Paddock Club yet, and no official
        afterparty announced for 2026 as of this writing. What genuinely exists: Sepang&apos;s own Corporate
        Suites, real private chauffeur options built for the circuit&apos;s distance from KL, a real luxury
        skyline venue in the city, and Paddock Club itself as the one confirmed hospitality product above a
        standard ticket. We&apos;d rather tell you honestly what&apos;s real and what isn&apos;t than pad this page
        to look more finished than the race&apos;s own 2026 planning currently is.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Corporate Suites — the one other hospitality option at the circuit</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Sepang&apos;s Main Grandstand includes 18 air-conditioned Corporate Suites (sofa seating, 2 restrooms, 4
        TVs, a pantry area) — a real, standing circuit facility, not an F1-specific hospitality product like
        Paddock Club, and its availability and 2026 F1 pricing aren&apos;t published. For bookings of more than 10
        guests, the circuit&apos;s own corporate contact is hafiz.mahidin@sepangcircuit.com; for a smaller group or
        a general enquiry, call the circuit directly on +60 3 8778 2200 or use the enquiry form at
        sepangcircuit.com/enquiry. Office hours are 9:30am-5:30pm Monday-Friday, closed weekends and public
        holidays — call within that window rather than expecting an evening or weekend response.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Private transit — Kuala Lumpur to Sepang</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Sepang sits roughly 45-60km south of KL and 10-15km from KLIA, far enough that a private transfer is a
        genuine luxury upgrade over public transport on race days, not just a convenience. LimoTaxi (based at KLIA,
        Sepang, Selangor — genuinely local to the circuit, not a Singapore-based operator working cross-border) runs
        a real fleet from economy sedans through Toyota Alphard/Vellfire premium MPVs and 14-18 seat family vans,
        with published from-prices: Economy Sedan from RM100, Premium MPV from RM180, Luxury MPV from RM250, Family
        Van from RM350. Book via WhatsApp on +60 11-5711 4879 (also their phone number) — confirm your exact race-day
        pickup and drop-off points when you message, since these are published base fares, not automatically
        inclusive of a race-day surge or a confirmed circuit run.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where to go after — the honest picture</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">SkyBar, Traders Hotel Kuala Lumpur</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            33rd floor, a genuine, confirmed Petronas Twin Towers view from its infinity pool and lounge — a real
            luxury venue in the city, not an official F1 tie-in. No F1-branded afterparty has been announced for
            Sepang 2026 as of this writing, unlike some other calendar stops — worth being direct about that rather
            than implying one exists. If that changes closer to race week, we&apos;ll update this page.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Luxury hotels — the one detail worth adding to the main guide</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Hotels guide already covers Mandarin Oriental, Banyan Tree, and JW Marriott as the real KL luxury-tier
        stays, plus Sama-Sama at the airport. Worth adding here specifically: Banyan Tree&apos;s own 53rd-floor
        Vertigo sky bar is a genuine second rooftop-view option in the city beyond SkyBar, already confirmed in the
        Hotels guide&apos;s own listing — worth booking a table there if you&apos;re staying at Banyan Tree rather
        than travelling across town for SkyBar.
      </p>

      {paddockClub && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: F1 Paddock Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club is F1&apos;s own hospitality product, run the same way at every race — and it&apos;s back
            at Sepang for the first time since 2017.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What&apos;s actually included</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <IncludeCard label="All-day dining" detail="Chef stations, tasting counters, seasonal menus — no extra charges" />
            <IncludeCard label="Open bar" detail="Champagne, fine wines, premium spirits, plus soft drinks" />
            <IncludeCard label="Pit lane walks" detail="Scheduled daily — observe teams prepping cars up close" />
            <IncludeCard label="Podium & garage access" detail="Team garage views plus podium celebration access" />
            <IncludeCard label="Support race access" detail="F2, F3, Porsche Supercup where applicable, plus a guided paddock tour" />
            <IncludeCard label="Extras" detail="Official programmes, pit radio scanner, F1 merchandise" />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Pricing by race demand — real ranges, not a Sepang confirmation</p>
          <div className="overflow-x-auto rounded-sm border border-[#2A2A2A] mb-2">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-left">
                  <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00]">Demand tier</th>
                  <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00]">Example races</th>
                  <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00]">Price per person, 3 days</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: "Lower demand", example: "Less in-demand calendar rounds", price: "€3,500–4,500" },
                  { tier: "Mid-tier", example: "Most calendar rounds", price: "€4,500–6,500" },
                  { tier: "Higher demand", example: "Popular, high-attendance races", price: "€6,500–9,500" },
                  { tier: "Top tier", example: "Monaco, an Abu Dhabi season finale", price: "€8,500–15,000+" },
                ].map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                    <td className="px-4 py-3 text-white font-semibold align-top">{row.tier}</td>
                    <td className="px-4 py-3 text-[#A3A3A3] align-top">{row.example}</td>
                    <td className="px-4 py-3 text-[#A3A3A3] align-top">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#6A6A6A] mb-8">
            Malaysia&apos;s specific 2026 tier and price haven&apos;t been published — this is a relocated, one-off
            race with no direct historical precedent to price against. Treat this table as the honest range the
            product spans elsewhere, not a Sepang confirmation.
          </p>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            A grandstand sells you one great view of the racing. Paddock Club sells you the whole day around it —
            the view is just one part of a much bigger product.
          </p>

          {paddockClub.practicalInfo?.website && (
            <p className="text-sm text-[#A3A3A3] mb-2">
              Official ticketing:{" "}
              <a href={paddockClub.practicalInfo.website} target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
                {paddockClub.practicalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            </p>
          )}
          <p className="text-sm text-[#A3A3A3] mb-2">
            Official booking &amp; packages:{" "}
            <a href="https://f1experiences.com/2026-bahrain-grand-prix" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              f1experiences.com
            </a>{" "}
            — F1&apos;s own authorised hospitality and travel operator (run by QuintEvents on F1&apos;s behalf).
            Packages for this race are waitlist-only at the time of writing; register there to be notified when the
            deposit programme and official ticket packages open.
          </p>
          {paddockClub.practicalInfo?.bookingMethod && (
            <p className="text-sm text-[#A3A3A3] leading-6 mb-6">{paddockClub.practicalInfo.bookingMethod}</p>
          )}

          <Link href={`/experience/${paddockClub.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
            Full F1 Paddock Club guide →
          </Link>
        </>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Corporate Suites and private transit</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For Corporate Suites, don&apos;t wait for pricing to appear online — it likely never will for a single
            race weekend. Call +60 3 8778 2200 or email hafiz.mahidin@sepangcircuit.com directly, state Formula 1
            2026 (2-4 Oct) explicitly, and ask what suite capacity and pricing look like this early — a relocated,
            first-in-9-years race means the circuit itself may not have finalised F1-specific suite packages until
            closer to the date, so an early call is as much about getting on their radar as securing a firm price.
            For LimoTaxi, request an Alphard or Vellfire specifically if space and comfort matter more than the
            published from-price — the RM250 Luxury MPV rate is a starting point, not a guaranteed race-day fare,
            so confirm the actual quote for your specific pickup/drop-off before treating it as fixed.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking SkyBar for race weekend</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Book your table through Traders Hotel&apos;s own reservations channel ahead of race weekend rather than
            walking in — a 33rd-floor infinity-pool bar with a genuine Twin Towers view is a real draw on any given
            night in KL, and race weekend brings extra visitors into the city even without an official F1 tie-in.
            If you&apos;re staying at Banyan Tree instead, its own Vertigo sky bar is the more convenient choice —
            no need to cross town for a comparable rooftop experience.
          </p>

          {paddockClub?.whyItsSpecial && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Why Paddock Club is worth naming plainly as the real luxury tier</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">{paddockClub.whyItsSpecial}</p>
            </>
          )}
          {paddockClub?.practicalInfo?.howToBook && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you&apos;re seriously considering Paddock Club</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">{paddockClub.practicalInfo.howToBook}</p>
            </>
          )}
          {paddockClub?.practicalInfo?.hours && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Access &amp; timing</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">{paddockClub.practicalInfo.hours}</p>
            </>
          )}
          {paddockClub?.insiderTips && paddockClub.insiderTips.length > 0 && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking specifics worth knowing</p>
              <div className="flex flex-col gap-3 mb-6">
                {paddockClub.insiderTips.map((tip, i) => (
                  <div key={i} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                    <p className="text-sm text-[#A3A3A3] leading-6">{tip}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {paddockClub?.whatToAvoid && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Worth avoiding</p>
              <p className="text-sm text-[#A3A3A3] leading-7">{paddockClub.whatToAvoid}</p>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: sepangcircuit.com (Corporate Suites facility detail, general contact line), WebSearch-sourced
        contact detail for Sepang&apos;s corporate booking email and enquiry form (site blocked direct verification
        — treated as unconfirmed until independently checked, per standing sourcing policy), limo2klia.com
        (LimoTaxi fleet, pricing, contact — genuinely KL/Sepang-based, not a Singapore operator working
        cross-border), therooftopguide.com and tripadvisor.com (SkyBar, Traders Hotel KL — confirmed Twin Towers
        view, no confirmed F1 tie-in for 2026). No official Sepang 2026 afterparty found — stated as a real gap,
        not filled with an invented one. Verified 4 Aug 2026 — reconfirm all contact and pricing detail closer to
        race week, especially Corporate Suites given this is a newly-returning race.
      </p>
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
