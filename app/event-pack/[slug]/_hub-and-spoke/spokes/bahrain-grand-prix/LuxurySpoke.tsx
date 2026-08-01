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
      h1="F1 Paddock Club — what's actually included"
      question="What's the best hospitality option at Sepang?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's included is real and free above. The pack adds why this tier is worth naming plainly as the real luxury option, and the specific booking detail worth knowing if you're seriously considering it for a race with unusually high pent-up demand."
    >
      {paddockClub && (
        <>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club is F1&apos;s own hospitality product, run the same way at every race — and it&apos;s back
            at Sepang for the first time since 2017. Malaysia doesn&apos;t currently have a documented second
            hospitality tier below it, the way some circuits sell a cheaper grandstand-adjacent package, so this is
            the one confirmed option above a standard ticket for this relocated race. We&apos;ll update this page if
            that changes once F1 publishes fuller 2026 logistics.
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
            Full guide →
          </Link>
        </>
      )}

      {isUnlocked && paddockClub && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {paddockClub.whyItsSpecial && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Why this is worth naming plainly as the real luxury tier</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">{paddockClub.whyItsSpecial}</p>
            </>
          )}
          {paddockClub.practicalInfo?.howToBook && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you&apos;re seriously considering this</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">{paddockClub.practicalInfo.howToBook}</p>
            </>
          )}
          {paddockClub.practicalInfo?.hours && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Access &amp; timing</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">{paddockClub.practicalInfo.hours}</p>
            </>
          )}
          {paddockClub.insiderTips && paddockClub.insiderTips.length > 0 && (
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
          {paddockClub.whatToAvoid && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Worth avoiding</p>
              <p className="text-sm text-[#A3A3A3] leading-7">{paddockClub.whatToAvoid}</p>
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
