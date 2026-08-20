import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("nz-australia-series-ticket-guide"));
  const mcgComparison = linkedExperiences.find((e) => e.slug.includes("mcg-boxing-day-seating-comparison"));
  const adelaideComparison = linkedExperiences.find((e) => e.slug.includes("adelaide-oval-hill-vs-reserve"));

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="teaser"
      h1="General Admission or Reserve — the real 3 tiers, and how they translate at each ground"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real 3-tier structure and the two ground-specific seating comparisons are free above. Unlocking adds a real per-ground, per-day verdict on which seat is worth the money — including exactly which single days on this tour (Boxing Day, Jane McGrath Day) actually justify paying up for a specific stand, and which don't."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Cricket Australia Test tickets run on two real public tiers — General Admission and Reserved/Reserve
        Grandstand seating — with a third, genuinely separate corporate-hospitality channel sitting above both (see
        the Luxury Guide). There&apos;s no standard third public "suite" tier the way some other sports sell one.
        What changes from ground to ground isn&apos;t the tier structure itself, it&apos;s what each tier actually
        buys you — a grass bank at one ground is a completely different experience from a grass bank at another.
      </p>

      {(tier1 || tier2 || tier3) && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The 3 real tiers</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[tier1, tier2, tier3].filter(Boolean).map((t) => (
              <div key={t!.tier} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <p className="text-xs font-black tracking-widest text-white mb-1">{t!.eventTierLabel}</p>
                <p className="text-lg font-black text-[#AAFF00]">
                  {formatMoneyRange(Math.round(Number(t!.costLow)), Math.round(Number(t!.costHigh)))}
                </p>
                <p className="text-xs text-[#6A6A6A] mt-1">Single-day Test match ticket</p>
              </div>
            ))}
          </div>
        </>
      )}

      {ticketGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={ticketGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ground-by-ground seating comparisons</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Melbourne and Adelaide are the two grounds where where you sit genuinely changes the day: the MCG is
        simply the largest of the four, so the gap between a good seat and a bad one is bigger than anywhere else
        on this tour; Adelaide Oval is the only ground with a real fork in the decision itself, a formal reserved
        stand against the Hill&apos;s grass mound. Perth Stadium and the SCG don&apos;t have that same split, so
        General Admission versus Reserve above already covers what you need to know for those two.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {mcgComparison && <SpokeExperienceCard experience={mcgComparison} isPro={isPro} />}
        {adelaideComparison && <SpokeExperienceCard experience={adelaideComparison} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d pick, ground by ground</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            General Admission is the right call at most of this tour — it&apos;s only worth paying up for Reserve on
            the specific days where crowd size actually threatens your sightlines, or where Adelaide&apos;s heat makes
            shade a real factor rather than a nice-to-have.
          </p>
          <TierPickTable />

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mt-8 mb-2">Boxing Day at the MCG — the one day this tour treats differently</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              Gates open 9am on Days 1-3, play starts 10:30am AEDT, and Day 1 crowds regularly run 70,000-90,000+ —
              among the largest single-day cricket attendances anywhere in the world. On a GA ticket for this
              specific day, arriving at gate-open isn&apos;t optional caution, it&apos;s the difference between a
              seat with a real sightline and standing at the back of a packed bay. Days 2-5 drop off fast from that
              peak, so the same GA ticket that&apos;s a real gamble on Day 1 is a completely relaxed call by Day 3.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The SCG&apos;s Pink Test has its own crowd curve</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              Jane McGrath Day — historically Day 3 of the New Year Test — is the real crush, not Day 1: 2024&apos;s
              Pink Test drew 37,129 on that day alone, the SCG&apos;s biggest Test crowd since the 2017/18 Ashes.
              Day 5, by contrast, has in past years opened to public entry by donation to the McGrath Foundation
              once the match is well advanced — worth watching for if your dates are flexible and you&apos;re
              comfortable with the match potentially finishing early.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Presale timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The free CricketPlus presale membership and exact registration steps are covered in full in the Series
            Ticket Guide above — join before this series goes on public sale if you want Boxing Day or the Pink
            Test specifically, since both are the two highest-demand single days of the tour and presale is
            genuinely first-come.
          </p>
        </div>
      )}

      {isUnlocked && (
        <p className="text-xs text-[#6A6A6A] mt-8">
          Sources: cricket.com.au (CricketPlus mechanics), mcg.org.au and premiumseats.com.au (MCG Boxing Day gate
          times, historical crowd figures, and stand-by-stand seating detail — see the full Ponsford Stand
          breakdown in the seating comparison above), sydneycricketground.com.au and thecricketblog.info (SCG Pink
          Test historical attendance and Day 5 donation-entry precedent), shadedseats.com (SCG stand sun/shade
          orientation), saca.com.au and shadedseats.com (Adelaide Oval Hill vs. Reserve shade/seating). Historical
          crowd and gate-time figures are from prior seasons at each venue — 2026-27 specifics will be confirmed
          closer to the series.
        </p>
      )}

    </SpokeShell>
  );
}

const TIER_PICKS = [
  { ground: "Perth Stadium", day: "Any day", pick: "General Admission", why: "No single day carries outsized crowd pressure here — GA holds up fine throughout." },
  { ground: "Adelaide Oval", day: "Any day", pick: "Square-on in the Western Grandstand", why: "Test start is ~10am; the Hill has no shade and no backrest for a 6+ hour day, and square-on seats give the widest tactical view of field placings — see the Hill vs. Reserve comparison above for the full breakdown." },
  { ground: "MCG", day: "Boxing Day (Day 1)", pick: "Ponsford Stand, lower tier if offered", why: "Day 1 crowds run 70,000-90,000+; Ponsford's lower tier (section M30 area) is rated the best value cricket viewing at the ground and picks up shade earliest — see the seating comparison above for why a 'Southern Stand' ticket isn't the same seat as a Ponsford one." },
  { ground: "MCG", day: "Days 2-5", pick: "General Admission", why: "Crowd drops off fast after Day 1 — GA is a relaxed call, and availability opens up too." },
  { ground: "SCG", day: "Jane McGrath Day (Day 3)", pick: "Brewongle Stand if available", why: "The real Pink Test crush — 37,000+ in 2024, the SCG's biggest Test crowd since 2017/18. Brewongle is well-regarded for both view and shade; the Doug Walters and Bill O'Reilly stands face into the afternoon sun and are worth avoiding for a full day in the seat." },
  { ground: "SCG", day: "Other days", pick: "General Admission", why: "Standard Test-day crowd, no special pressure." },
];

function TierPickTable() {
  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A] mb-6">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left">
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/5">Ground</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/5">Day</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/5">Our pick</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-2/5">Why</th>
            </tr>
          </thead>
          <tbody>
            {TIER_PICKS.map((t, i) => (
              <tr key={`${t.ground}-${t.day}`} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                <td className="px-4 py-3 text-white font-semibold align-top break-words">{t.ground}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{t.day}</td>
                <td className="px-4 py-3 text-[#AAFF00] font-semibold align-top break-words">{t.pick}</td>
                <td className="px-4 py-3 text-[#A3A3A3] leading-6 align-top break-words">{t.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-6">
        {TIER_PICKS.map((t) => (
          <div key={`${t.ground}-${t.day}`} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-black text-white mb-1">{t.ground} — {t.day}</p>
            <p className="text-xs font-bold text-[#AAFF00] mb-2">{t.pick}</p>
            <p className="text-xs text-[#A3A3A3] leading-5">{t.why}</p>
          </div>
        ))}
      </div>
    </>
  );
}
