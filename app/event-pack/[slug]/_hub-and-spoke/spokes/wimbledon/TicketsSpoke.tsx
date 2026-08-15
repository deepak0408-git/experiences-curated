import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Rebuilt 15 Aug 2026 per direct founder review — the original version only
// covered the Queue in depth, treating the Ballot as a one-line mention and
// omitting Debentures entirely. Real research added for all 3 public/
// quasi-public routes (the Ballot: help.wimbledon.com + greenandpurple.com,
// cross-checked; Debentures: official wimbledon.com press release + 2
// independent secondary sources cross-checked on issue price; resale queue
// registration: 2 independent sources cross-checked on location/hours) —
// see sources footer. Debenture SECONDARY-MARKET pricing is deliberately
// NOT cited to a specific resale-aggregator figure (StubHub/Viagogo) per
// the planner-data-researcher skill's standing rule against treating those
// sites as authoritative sources — presented as a real, volatile range
// instead, with that volatility stated plainly.
export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const centreCourt = linkedExperiences.find((e) => e.slug.includes("wimbledon-centre-court"));
  const no1Court = linkedExperiences.find((e) => e.slug.includes("wimbledon-no1-court"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="teaser"
      h1="The Ballot, the Queue, and Debentures — how all 3 real routes actually work"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="All 3 routes and the resale-queue mechanics are free above — real, checkable facts, not a sales pitch. What the free version can't tell you is which route is actually worth building your trip around given your dates, your budget, and your odds — that's a judgment call, and it's the one thing free research can't give you. Unlocking adds our route-by-route verdict, the exact resale-queue registration window that actually works, and the specific move that saved past readers a wasted overnight queue."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Centre Court tickets are harder to get than the public Ballot suggests — accepting that early makes for a
        better trip. There are 3 real routes in, and they work completely differently: the free public Ballot (a
        lottery, no control over court or date), the overnight Queue (guaranteed grounds access, a real shot at a
        Show Court through resale), and Debentures (a five-year investment product, not a ticket most fans ever
        buy new — but its single-day resale tickets are a real, if pricey, way in).
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">All 3 routes, compared</p>
      <RouteComparisonTable />

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mt-10 mb-3">Route 1 — The public Ballot</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Free to enter, run by the All England Lawn Tennis Club (AELTC) through your myWimbledon account.
          Applications open in September the year before (2026&apos;s ballot ran 2–21 September 2025) and results
          land by October–November — so a Ballot entry for a given Championships closes out around 9 months before
          the tournament. You can&apos;t request a specific court or day — a win is randomly allocated to Centre
          Court, No.1 Court, No.2 Court, or No.3 Court, and tickets are non-transferable (reselling a Ballot ticket
          voids it). A successful application usually comes with 2 tickets. Wimbledon doesn&apos;t publish official
          odds, but independent estimates put overall success at roughly 1 in 10 — significantly lower for the
          highest-demand Centre Court sessions specifically.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Route 2 — The Queue (day tickets)</p>
      <div className="flex flex-col gap-3 mb-8">
        <TicketRow label="For Centre Court" detail="Join by midday the day before and camp overnight. Queue cards are issued from mid-afternoon, one per person present. Day tickets are released to queuers at 9:30am." />
        <TicketRow label="For a grounds pass only" detail="Arriving by 5-6am on the morning is usually enough — the line moves steadily once gates open at 10:30am." />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">The 3pm resale queue — how to actually register</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Ticket Resale is virtual now, run through the Wimbledon App on your phone, not a physical line. To join:
          download the Wimbledon App, sign in to your myWimbledon account, then register in person at either the{" "}
          <strong className="text-white">Queue Village (8:30am–2:30pm)</strong> or{" "}
          <strong className="text-white">the Ticket Resale Kiosk at Parkside, next to No.1 Court (10am–2:30pm)</strong>{" "}
          — a steward scans your myWimbledon QR code to enrol you. You&apos;re then free to roam the grounds while
          the app tracks your place in the virtual queue. When a ticket comes up, you get an SMS with a window to
          return to Parkside and buy it. Sales run 3pm–9pm, subject to availability. One hard requirement: you
          can&apos;t use Ticket Resale unless you&apos;ve already entered the grounds that day — a Grounds Pass
          alone qualifies you.
        </p>
      </div>

      {centreCourt && (
        <div className="mb-8">
          <SpokeExperienceCard experience={centreCourt} isPro={isPro} />
        </div>
      )}
      {no1Court && (
        <div className="mb-8">
          <SpokeExperienceCard experience={no1Court} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Route 3 — Debentures</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A Debenture isn&apos;t a ticket — it&apos;s a tradeable 5-year security that guarantees the holder the
          same numbered Centre Court or No.1 Court seat for every day of the Championships across that whole span,
          plus access to private restaurants and lounges. New issues are genuinely expensive and run on separate
          cycles per court: the current Centre Court series (2026–2030) issued at £116,000 per seat, paid in 3
          instalments; the No.1 Court series (2027–2031) issued at £73,000. Both sold out on issue — new buyers
          can&apos;t apply directly to the AELTC. What&apos;s actually relevant for most fans: existing Debenture
          holders can resell individual single-day tickets they&apos;re not using themselves, through verified
          resale platforms or the AELTC&apos;s official broker. Prices swing hard with demand — a genuinely volatile
          secondary market, not a fixed rate card, so treat any specific figure you see quoted as a snapshot, not a
          guarantee.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you&apos;re travelling from outside the UK</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Two things work differently for international fans. First, the AELTC allocates a real block of tickets
          directly to overseas national tennis federations and associations, distributed to their own affiliated
          clubs — worth checking with your home country&apos;s tennis federation, since this is a genuinely separate
          channel from the public Ballot, not just a rebrand of it. Second, Debenture ownership itself is
          restricted for residents of several countries (including the US, Canada, Australia, Japan, and South
          Africa) — but that restriction is on owning a Debenture, not on buying a Debenture holder&apos;s resold
          single-day ticket, which remains open to anyone. The Queue and the public Ballot both work identically
          for overseas and UK visitors — no separate process, no separate odds.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which route we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Wimbledon trip, plan around the Queue, not the Ballot — the Ballot is a real long
            shot for Centre Court specifically (roughly 1 in 10 overall, worse for Centre Court), applications close
            around 9 months out, and a win gives you zero control over which court or day you get. A Queue day
            ticket guarantees you&apos;re on the grounds with access to the outer courts and Henman Hill, plus a
            real shot at trading up into a Show Court through the 3pm resale — you control the day, you know the
            cost upfront, and you&apos;re not gambling 9 months of trip planning on a random draw. Save the Ballot
            as a genuinely free, no-downside bonus entry alongside a Queue-anchored plan, not your primary strategy.
            Reserve Debentures for a special-occasion splurge specifically — finals weekend or a marquee match — not
            a first-timer&apos;s default, given the price and the volatility of what you&apos;ll actually pay.
            Dress up if you land a Centre Court seat by any route — it carries an expectation the outer courts
            don&apos;t.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Timing the resale queue</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Register the moment you&apos;re through the gates, not later in the day — the Queue Village window
            (8:30am–2:30pm) opens well before the Parkside kiosk (10am–2:30pm), so registering at Queue Village on
            your way in is the earliest you can lock in your place. The app then lets you roam freely, so there&apos;s
            no real cost to registering early even if you don&apos;t plan to buy. No. 1 Court is worth considering
            over Centre Court when a resale slot comes up: it seats fewer (12,345 vs 14,979) with better sightlines
            for most seats, and its own retractable roof (since 2019) means play isn&apos;t stopped by rain either —
            don&apos;t assume Centre Court is automatically the better resale pickup.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: help.wimbledon.com and greenandpurple.com (Ballot mechanics, cross-checked); greenandpurple.com
        (resale-queue registration locations/hours, cross-checked against a second independent guide);
        wimbledon.com official press release + theticketingbusiness.com + whalesbook.com (Debenture issue prices,
        cross-checked); greenandpurple.com (overseas federation allocation, Debenture ownership restrictions).
        Debenture secondary-market pricing intentionally not quoted to a specific resale-site figure — see note
        above.
      </p>
    </SpokeShell>
  );
}

function TicketRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-xs text-[#A3A3A3] leading-5">{detail}</p>
    </div>
  );
}

const ROUTES = [
  {
    name: "Public Ballot",
    cost: "Free to enter",
    control: "None — random court/day",
    leadTime: "~9 months (applies previous Sept, results by Nov)",
    odds: "~1 in 10 overall (unofficial), lower for Centre Court",
  },
  {
    name: "The Queue",
    cost: "Day-pass/court price, paid on entry",
    control: "You choose the day; court via 3pm resale",
    leadTime: "Same day (overnight queue for Centre Court)",
    odds: "Guaranteed grounds access; resale into a Show Court not guaranteed",
  },
  {
    name: "Debenture resale",
    cost: "High, volatile secondary-market price",
    control: "You choose the exact day and court",
    leadTime: "As available — check resale platforms/broker",
    odds: "Guaranteed once purchased",
  },
];

function RouteComparisonTable() {
  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-sm border border-[#2A2A2A] mb-8">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-[#1A1A1A] text-left">
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/5">Route</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/5">Cost</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/5">Control over court/day</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/5">Booking lead time</th>
              <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00] w-1/5">Odds of getting in</th>
            </tr>
          </thead>
          <tbody>
            {ROUTES.map((r, i) => (
              <tr key={r.name} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                <td className="px-4 py-3 text-white font-semibold align-top break-words">{r.name}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{r.cost}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{r.control}</td>
                <td className="px-4 py-3 text-[#A3A3A3] align-top break-words">{r.leadTime}</td>
                <td className="px-4 py-3 text-[#A3A3A3] leading-6 align-top break-words">{r.odds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-8">
        {ROUTES.map((r) => (
          <div key={r.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-black text-white mb-2">{r.name}</p>
            <dl className="space-y-1.5">
              <div>
                <dt className="text-[10px] font-black tracking-widest uppercase text-[#6A6A6A]">Cost</dt>
                <dd className="text-xs text-[#A3A3A3]">{r.cost}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-black tracking-widest uppercase text-[#6A6A6A]">Control over court/day</dt>
                <dd className="text-xs text-[#A3A3A3]">{r.control}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-black tracking-widest uppercase text-[#6A6A6A]">Booking lead time</dt>
                <dd className="text-xs text-[#A3A3A3]">{r.leadTime}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-black tracking-widest uppercase text-[#6A6A6A]">Odds of getting in</dt>
                <dd className="text-xs text-[#A3A3A3]">{r.odds}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
