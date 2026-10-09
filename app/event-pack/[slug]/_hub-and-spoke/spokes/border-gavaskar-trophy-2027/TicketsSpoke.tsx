import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// plannerTicketTierCost has no rows for this event yet (24 Sep 2026), so the
// tier cards are an honest placeholder until planner-data-researcher runs.
// The real-tier branch below lights up automatically once rows exist.
export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const chennaiTiers = linkedExperiences.find((e) => e.slug.includes("chennai-hospitality-tiers"));
  const ahmedabadStand = linkedExperiences.find((e) => e.slug.includes("ahmedabad-which-stand"));

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const hasTiers = Boolean(tier1 || tier2 || tier3);

  const TIER_NAMES: Record<string, string> = {
    tier1: "General Admission",
    tier2: "Reserved Stand",
    tier3: "Premium Stand",
  };

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Border-Gavaskar Trophy"
      status="teaser"
      h1="Which stand you sit in matters more than which tier you buy, and it's different at every ground"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The stand-by-stand comparisons for Chennai and Ahmedabad, and Nagpur's sell-out pattern, are free above. Unlocking adds our specific stand pick at each of the three grounds, the reasoning behind the single day to prioritise at Nagpur, and which Ahmedabad stands look premium on the price list but aren't."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Indian Test tickets aren&apos;t sold the way Australian or English ones are. There&apos;s no simple General
        Admission versus Reserved split. Each ground sells tickets by named or lettered stand, prices step up from
        a very cheap general block to air-conditioned hospitality, and the premium hospitality tiers are usually
        allocated by the state cricket association rather than through the public booking platform. What a
        &quot;cheap seat&quot; actually gets you changes enormously from ground to ground.
      </p>

      {hasTiers ? (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket tiers</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[tier1, tier2, tier3].filter(Boolean).map((t) => (
              <div key={t!.tier} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1.5">{TIER_NAMES[t!.tier]}</p>
                <p className="text-xs font-black tracking-widest text-white mb-1">{t!.eventTierLabel}</p>
                <p className="text-lg font-black text-[#AAFF00]">
                  {formatMoneyRange(Math.round(Number(t!.costLow)), Math.round(Number(t!.costHigh)))}
                </p>
                <p className="text-xs text-[#6A6A6A] mt-1">Single-day Test match ticket</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-sm border border-amber-400/30 bg-amber-400/5 p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-amber-400 mb-2">2027 ticket tiers — prices not announced yet</p>
          <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
            None of the three grounds has announced 2027 Test prices, and we won&apos;t invent tiers. Here is the
            real spread from earlier fixtures at each ground, in rupees, so you know the shape of what&apos;s coming.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-xs font-black tracking-widest uppercase text-white mb-1">Nagpur · VCA</p>
              <p className="text-sm font-black text-[#AAFF00]">₹300–₹500 to ₹10,000–₹30,000</p>
              <p className="text-xs text-[#6A6A6A] mt-1">General to VIP/corporate, 2025 baseline</p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-xs font-black tracking-widest uppercase text-white mb-1">Chennai · Chepauk</p>
              <p className="text-sm font-black text-[#AAFF00]">₹1,200+ to ₹30,000+</p>
              <p className="text-xs text-[#6A6A6A] mt-1">General to VIP boxes, recent fixtures</p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-xs font-black tracking-widest uppercase text-white mb-1">Ahmedabad · Motera</p>
              <p className="text-sm font-black text-[#AAFF00]">~₹1,000 to ₹50,000–₹60,000</p>
              <p className="text-xs text-[#6A6A6A] mt-1">General to premium hospitality, recent fixtures</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Nagpur — the ground that sells out</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          VCA Stadium&apos;s last India-Australia Test sold out within 10-14 days of release, and it&apos;s the
          series opener, so treat release day as the real deadline. Tickets go through BookMyShow and the
          association&apos;s own channels closer to the match. For a full breakdown of the ground itself, see the{" "}
          <Link href={`/event-pack/${eventSlug}/map`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Venue Map guide
          </Link>
          .
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          East Stand and West Stand are the general blocks, cheapest and least shaded. North Stand and South
          Stand sit a tier up — North houses the President&apos;s Room and commercial boxes, South backs onto the
          players&apos; pavilion — and are the reserved stands worth paying the small step-up for. VCA doesn&apos;t
          run a separate premium or hospitality stand the way the other two grounds do; its top-tier access is
          allocated as private corporate boxes through the association, not sold as a seat tier.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Stand-by-stand: Chennai and Ahmedabad</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Chepauk&apos;s lettered stands genuinely differ in atmosphere and shade, and Narendra Modi Stadium&apos;s 132,000
        seats spread across stands with completely different price-to-view ratios. These two are where the wrong
        choice costs you most.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {chennaiTiers && <SpokeExperienceCard eventSlug={eventSlug} experience={chennaiTiers} isPro={isPro} />}
        {ahmedabadStand && <SpokeExperienceCard eventSlug={eventSlug} experience={ahmedabadStand} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where tickets actually get sold</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">General stands</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            BookMyShow (and Paytm Insider at Chennai) for the main sale, plus each state association&apos;s own
            channels: VCA in Nagpur, the Tamil Nadu Cricket Association in Chennai, the Gujarat Cricket Association
            in Ahmedabad. Sale dates for 2027 haven&apos;t been announced. At Chennai, past Tests also sold tickets
            over the counter at the TNCA office booth on Victoria Hostel Road, with a cap of two tickets per person
            in general sales.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Hospitality and corporate boxes</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Allocated separately by the association at each ground, not through the public platform. Enquire
            directly rather than waiting for them to appear on BookMyShow. See the{" "}
            <Link href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </Link>{" "}
            for what each ground offers.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Check for a collection step</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Some Indian Test bookings have required collecting a physical ticket at the ground before play. Read
            your booking confirmation for a collection instruction rather than assuming an e-ticket at the gate is
            enough.
          </p>
        </div>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d buy, ground by ground</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            A Test at three grounds in three different climates rewards a different stand at each. This is a tier
            decision, not a day decision — buy whichever day suits your trip, and if Nagpur forces you to pick just
            one, make it day three.
          </p>
          <TierPickTable />

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mt-8 mb-2">Why day three at Nagpur</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              Day one at Jamtha tends to play true and a little slow, spin starts to grip by the second session of
              day two, and day three is when the pitch has decided the last two India-Australia Tests here: India
              won by an innings and 132 runs in 2023 inside three days, and Jason Krejza took 12 wickets in the 2008
              Test here, yet Australia still lost by 172 runs. A full five-day pass costs more than most travelling
              fans need: if you&apos;re buying only a single day at Nagpur to keep costs down, day three is where
              that one day is most likely to matter, and it&apos;s worth buying on release day before it sells out.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Why price isn&apos;t a guide at Ahmedabad</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
            <p className="text-sm text-[#A3A3A3] leading-6">
              At a ground this size, some higher-priced stands are named for sponsors and positioned for corporate
              visibility rather than the clearest view of play. Blocks N and E are consistently flagged as the best
              value-to-view combination in the ground, so they&apos;re worth prioritising over an equally-priced
              seat elsewhere. Whichever stand you pick, check its position against the gates before matchday: the
              walk to your block can take far longer than at a normal-sized stadium.
            </p>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

const TIER_PICKS = [
  { ground: "Nagpur · VCA", pick: "North Stand or South Stand", why: "VCA's two reserved stands — North Stand houses the President's Room and commercial boxes, South Stand backs onto the players' pavilion — beat the general East/West blocks for both shade and sightline. Both of the last two India-Australia Tests here were decided by day three, and the last one sold out in 10-14 days, so buy on release day." },
  { ground: "Chennai · Chepauk", pick: "Anna Pavilion or an AC box if you're attending several days", why: "Five days in open sun in Chennai's humidity is a real endurance factor. Hospitality is TNCA-allocated, so ask directly." },
  { ground: "Chennai · Chepauk", pick: "A/B for the view, I/J for the noise", why: "A and B sit behind the bowler's arm at the pavilion end. I and J on the Wallajah Road side hold the loudest, most engaged crowd. F/G/H are the casual, cheaper sections." },
  { ground: "Ahmedabad · Motera", pick: "Blocks N and E", why: "The best value-to-view ratio in a 132,000-seat ground where cheap can mean distant." },
  { ground: "Ahmedabad · Motera", pick: "Naroda End or Adalaj End for tradition; a corporate box for a group", why: "Those two stands give the classic sightline behind the bowler's arm. Boxes are air-conditioned, hold 25, and include food, which matters in late-February heat." },
];

function TierPickTable() {
  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A] mb-6">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left">
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/4">Ground</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/3">Our pick</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-5/12">Why</th>
            </tr>
          </thead>
          <tbody>
            {TIER_PICKS.map((t, i) => (
              <tr key={`${t.ground}-${t.pick}`} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                <td className="px-4 py-3 text-white font-semibold align-top break-words">{t.ground}</td>
                <td className="px-4 py-3 text-[#AAFF00] font-semibold align-top break-words">{t.pick}</td>
                <td className="px-4 py-3 text-[#A3A3A3] leading-6 align-top break-words">{t.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-6">
        {TIER_PICKS.map((t) => (
          <div key={`${t.ground}-${t.pick}`} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-black text-white mb-1">{t.ground}</p>
            <p className="text-xs font-bold text-[#AAFF00] mb-2">{t.pick}</p>
            <p className="text-xs text-[#A3A3A3] leading-5">{t.why}</p>
          </div>
        ))}
      </div>
    </>
  );
}
