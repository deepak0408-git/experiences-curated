import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns sourced from the seeded experience content (Ticket
// Guide, General Admission, Grandstand G, Q2 Grandstand, V1/V2 Grandstand
// experiences) plus live research, 22 Sep 2026: General Admission (West Open
// Area, roaming, ~¥18,000/$122 for 2026 as a prior-year reference), reserved
// grandstands ¥22,000-¥105,000+ ($149-$709+) depending on tier, confirmed via
// the official F1 ticketing site and third-party resale-tracking sites (corrected
// 22 Sep 2026 from japan.gp, an affiliate site incorrectly cited as official).
// Corrected 29 Sep 2026: an earlier draft claimed Suzuka's GA+grandstand
// combination was "rare"/"mostly disappeared elsewhere" — false, most F1
// circuits sell both (Interlagos, which has no GA tier at all per
// HubPage.tsx's own QUICK_REFERENCE_BY_EVENT, is the actual outlier, not
// Suzuka). Founder caught this live. 2027 prices aren't published yet —
// every figure below is stated as a 2026 reference point, per skill §2a-3.
// Real planner_ticket_tier_cost grouping, confirmed 29 Sep 2026 (founder
// caught V1/V2 wrongly priced at tier4's $5,500-9,855 hospitality range —
// off-by-one tier mapping): tier1=GA, tier2=Grandstand Q1/Q2/G grouped
// together ($358-520), tier3=Grandstand V1/V2 ($540-750), tier4=F1
// Experiences Paddock/Champions Club hospitality ($5,500-9,855). G and Q2
// share tier2's single price range in the DB (no separate G-only/Q2-only
// figures exist) — both cite tier2 below, not two different tiers.
const TIER_META = [
  {
    tierKey: "tier1",
    name: "General Admission (West Open Area)",
    shows: "Roaming access across open viewing areas — no fixed seat, move between vantage points across the weekend",
    seating: "Standing / open grass areas",
    exposure: "No cover",
  },
  {
    tierKey: "tier2",
    name: "Grandstand G (130R)",
    shows: "130R — the high-speed corner the whole back section of the circuit builds toward",
    seating: "Reserved, permanent seating (G stand); G-1 section is first-come temporary seating",
    exposure: "Partial cover in most G sections",
  },
  {
    tierKey: "tier2",
    name: "Q2 Grandstand (Chicane)",
    shows: "The final chicane and a long, elevated sightline — Block 1 favors the last corner and pit entry, Block 3 stretches out toward 130R",
    seating: "Reserved, elevated seating with big screens",
    exposure: "Mostly covered",
  },
  {
    tierKey: "tier3",
    name: "Grandstand V1/V2 (Main Straight)",
    shows: "Start-finish straight, starting grid, pit lane, and a clear view into the podium and parc fermé",
    seating: "Reserved — V1 lower, closer to the circuit fence; V2 upper, higher above the pit lane",
    exposure: "Fully covered",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");

  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-ticket-guide"));
  const generalAdmission = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-general-admission"));
  const grandstandG = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-grandstand-g"));
  const q2Grandstand = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-q2-grandstand"));
  const v1v2Grandstand = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-v1-v2-grandstand"));
  const hospitalityTiers = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-hospitality-tiers"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="teaser"
      h1="A real General Admission tier, plus a full range of reserved grandstands"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The tiers and what each one actually shows you are free above. The pack adds the full Ticket Guide for these grandstands, our direct verdict on G vs. Q2 for a first Suzuka weekend, and which stand tends to move first for a genuinely new Sprint-format race here."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Suzuka sells a real General Admission tier — a roaming ticket with no fixed seat — alongside a full range
        of reserved grandstands, from budget covered stands to the premium Main Straight tier. The West Open Area
        GA gets you close to several corners across the weekend if you move early, so it's a genuinely good budget
        option here, not just a fallback for people who missed out on a seat.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from the official source first. This is Suzuka&apos;s first-ever Sprint weekend, and a
          genuinely new race format tends to draw stronger-than-usual early demand — every F1 ticket ultimately
          traces back to the promoter, and buying direct means no markup and no risk of a fraudulent listing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in,
          P1 Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos; own
          official reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://ticketing.formula1.com/japan/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Japanese GP tickets →
          </a>
          <a
            href="https://www.p1travel.com/en/organizer/grand-prix-japan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Japanese GP →
          </a>
        </div>
      </div>

      <p className="hidden md:block text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <p className="md:hidden text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Options compared</p>
      <div className="hidden md:block overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/4 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Tier</th>
              <th className="w-2/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows</th>
              <th className="w-[17.5%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-[17.5%] text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
            </tr>
          </thead>
          <tbody>
            {TIER_META.map((t) => (
              <tr key={t.name} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{t.name}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.shows}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.seating}</td>
                <td className="py-3 text-[#A3A3A3] align-top">{t.exposure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-4">
        {TIER_META.map((t) => (
          <div key={t.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-2">{t.name}</p>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows: </span>
                {t.shows}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating: </span>
                {t.seating}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover: </span>
                {t.exposure}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">On pricing</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          2027 prices haven&apos;t been published yet. As a reference point, 2026 3-day General Admission ran
          around $122, and reserved grandstands ranged roughly $149 to $700+ depending on tier — treat these as
          last year&apos;s figures, not a confirmed 2027 price. Confirm current pricing and availability directly
          on the official site before buying.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {ticketGuide && (
            <div className="mb-8">
              <SpokeExperienceCard eventSlug={eventSlug} experience={ticketGuide} isPro={isPro} />
            </div>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Suzuka weekend, Grandstand G ({tier2 && `$${Math.round(Number(tier2.costLow))}–${Math.round(Number(tier2.costHigh))}`}) is the sharpest pick if you want the circuit&apos;s signature
            corner without paying for the premium tiers — a real reserved seat at 130R, the section drivers
            consistently name as their favourite on the whole calendar. If budget matters more than a fixed seat,
            General Admission ({tier1 && `$${Math.round(Number(tier1.costLow))}–${Math.round(Number(tier1.costHigh))}`}) is a genuinely good option here, not a compromise — the West Open Area
            still gets you real views of several corners if you move early in the day.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {grandstandG && <SpokeExperienceCard eventSlug={eventSlug} experience={grandstandG} isPro={isPro} />}
            {generalAdmission && <SpokeExperienceCard eventSlug={eventSlug} experience={generalAdmission} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            Q2 ({tier2 && `$${Math.round(Number(tier2.costLow))}–${Math.round(Number(tier2.costHigh))}`}, the same grouped tier as Grandstand G) and V1/V2 ({tier3 && `$${Math.round(Number(tier3.costLow))}–${Math.round(Number(tier3.costHigh))}`}) sit above General Admission — Q2&apos;s elevated chicane view with big
            screens, V1/V2&apos;s Main Straight, podium, and pit lane sightline. Both get the full breakdown below.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {q2Grandstand && <SpokeExperienceCard eventSlug={eventSlug} experience={q2Grandstand} isPro={isPro} />}
            {v1v2Grandstand && <SpokeExperienceCard eventSlug={eventSlug} experience={v1v2Grandstand} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Above all of these sits genuine hospitality — Paddock Club, Champions Club, and real alternatives —
            a completely different product from a grandstand seat. The full breakdown, including real booking
            mechanics, lives in the{" "}
            {hospitalityTiers && (
              <a href={`/experience/${hospitalityTiers.slug}?from=${eventSlug}`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
                Hospitality Tiers guide
              </a>
            )}
            {!hospitalityTiers && "Hospitality Tiers guide"}, and the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy the moment tickets open on the official promoter&apos;s site, especially for a Sprint-format
            weekend making its debut here — there&apos;s no track record yet for how fast this specific race
            format sells at this circuit, so treat early demand as a real possibility rather than something to
            wait out.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
