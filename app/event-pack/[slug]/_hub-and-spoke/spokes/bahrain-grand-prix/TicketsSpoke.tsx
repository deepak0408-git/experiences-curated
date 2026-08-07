import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns only (seating/exposure/what it shows) — no
// "best for"/verdict column here, that judgment lives in the gated
// section below. Same split as the Italian GP pilot's Ticket Guide.
const STANDS = [
  {
    slug: "main-grandstand-sepang-start-finish",
    name: "Main Grandstand",
    shows: "Grid, pit lane, start & podium — the whole arc of the event",
    seating: "Reserved seat",
    exposure: "Fully covered",
    priceBand: "Historical 3-day reference: n/a — pricing unpublished",
  },
  {
    slug: "k1-grandstand-sepang-turn-1",
    name: "K1 Grandstand",
    shows: "Turn 1 — real, repeated overtaking every lap",
    seating: "Unreserved within your block (A–R)",
    exposure: "Fully covered",
    priceBand: "Historical 3-day reference: roughly $180–280",
  },
  {
    slug: "grandstand-f-sepang-panoramic",
    name: "Grandstand F",
    shows: "Turns 6–8 and the back straight — widest single sightline on the lap",
    seating: "Reserved seat",
    exposure: "Fully covered",
    priceBand: "Historical 3-day reference: n/a — pricing unpublished",
  },
  {
    slug: "hill-stand-c2-sepang-general-admission",
    name: "Hill Stand (C2)",
    shows: "Turns 9–11 — wide view of the circuit's southern half",
    seating: "General admission, unreserved",
    exposure: "Partial canopy only",
    priceBand: "Historical 3-day reference: roughly $40–75",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const stands = STANDS.map((s) => ({ ...s, exp: linkedExperiences.find((e) => e.slug.includes(s.slug)) }));
  const mainGrandstand = linkedExperiences.find((e) => e.slug.includes("main-grandstand-sepang-start-finish"));
  const k1 = linkedExperiences.find((e) => e.slug.includes("k1-grandstand-sepang-turn-1"));
  const grandstandF = linkedExperiences.find((e) => e.slug.includes("grandstand-f-sepang-panoramic"));
  const hillstand = linkedExperiences.find((e) => e.slug.includes("hill-stand-c2-sepang-general-admission"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Bahrain Grand Prix"
      status="teaser"
      h1="Sepang grandstand vs general admission — what's the difference?"
      question="Which grandstand ticket is the best buy for Sepang?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The tiers, what they show, and real historical price references are all free above. The Event Pack adds our actual verdict — which stand we'd pick for a first Sepang weekend and why — plus the real, experience-level detail (what it's genuinely like to sit there, block-by-block advice) for every stand, not just a summary."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Sepang has four named ticket options, and they&apos;re built around genuinely different ideas of what&apos;s
        worth watching — not just different price points for the same experience. 2026 pricing for this relocated
        race hasn&apos;t been published yet (F1&apos;s official announcement says pricing &quot;will be announced
        soon&quot;), so this guide focuses on what each ticket actually gets you, which is knowable now.
      </p>

      {/* Comparison table — free, factual columns only. Desktop/tablet gets
          the real side-by-side table; mobile (below md) switches to stacked
          cards instead of a horizontally-scrolling table, since a 4-column
          comparison genuinely doesn't fit a phone width without either
          clipping or cramming text unreadably. Heading text differs per
          breakpoint since "Side by side" describes a layout mobile no
          longer uses — "Options compared" stays accurate either way. */}
      <p className="hidden md:block text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <p className="md:hidden text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Options compared</p>
      <div className="hidden md:block overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Stand</th>
              <th className="w-2/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows</th>
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-1/5 text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
            </tr>
          </thead>
          <tbody>
            {STANDS.map((s) => (
              <tr key={s.slug} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{s.name}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{s.shows}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{s.seating}</td>
                <td className="py-3 text-[#A3A3A3] align-top">{s.exposure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-8">
        {STANDS.map((s) => (
          <div key={s.slug} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-2">{s.name}</p>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows: </span>
                {s.shows}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating: </span>
                {s.seating}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover: </span>
                {s.exposure}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative w-full aspect-[1464/1035] rounded-sm border border-[#2A2A2A] overflow-hidden mb-8 bg-[#141414]">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/bahrain-grand-prix-grandstand-map.jpg"
          alt="Sepang International Circuit map showing the Main Grandstand, K1 Grandstand, Grandstand F, and Hill Stand (C2 General Admission) positioned around the track"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>

      <div className="flex flex-col gap-2 mb-8">
        {stands.map((s) => (
          <p key={s.slug} className="text-xs text-[#6A6A6A]">
            <span className="text-[#AAFF00]">{s.name}:</span> {s.priceBand}
          </p>
        ))}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Historical pricing reference — not confirmed for 2026</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Figures above are drawn from comparable recent Sepang MotoGP/F1 race weekends at this circuit, not a
          confirmed 2026 Bahrain GP number — treat them as a rough sense of scale, not a figure to budget against.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which stand we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Malaysian GP, the Main Grandstand is the right call — it teaches you the shape of a
            full race weekend in one seat, and the roof matters more here than at almost any other circuit given how
            fast Sepang&apos;s weather turns. If you already know you want to watch racing rather than ceremony, K1
            is the sharper pick — real, repeated overtaking at Turn 1, not a highlight-reel moment. We wouldn&apos;t
            spend the jump from Hill Stand to a mid-tier grandstand just for a marginally better view; the real
            difference in what you actually experience is general admission versus any covered stand, not one
            grandstand versus another.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {mainGrandstand && <SpokeExperienceCard experience={mainGrandstand} isPro={isPro} />}
            {k1 && <SpokeExperienceCard experience={k1} isPro={isPro} />}
            {grandstandF && <SpokeExperienceCard experience={grandstandF} isPro={isPro} />}
            {hillstand && <SpokeExperienceCard experience={hillstand} isPro={isPro} />}
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What each is actually like</p>
          <div className="overflow-x-auto rounded-sm border border-[#2A2A2A] mb-6">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {[
                  { title: "Main Grandstand", summary: "The ceremony seat — grid, lights, pit stops, podium, all from one spot.", detail: mainGrandstand?.whyItsSpecial },
                  { title: "K1 Grandstand — Turn 1", summary: "The racing seat — the second-longest run to any first corner on the calendar.", detail: k1?.whyItsSpecial },
                  { title: "Grandstand F", summary: "The connoisseur's seat — cars under sustained load through a real sequence, not one braking zone.", detail: grandstandF?.whyItsSpecial },
                  { title: "Hill Stand (C2)", summary: "The value seat — genuinely wide view, general admission, freedom to move within the zone.", detail: hillstand?.whyItsSpecial },
                ]
                  .filter((row) => row.detail)
                  .map((row, i) => (
                    <tr key={row.title} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                      <td className="px-4 py-3 align-top w-1/4">
                        <p className="text-sm font-bold text-white">{row.title}</p>
                        <p className="text-xs text-[#6A6A6A] mt-1">{row.summary}</p>
                      </td>
                      <td className="px-4 py-3 text-[#A3A3A3] leading-6 align-top">{row.detail}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What to watch for once pricing lands</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy only through the official F1 ticketing site (
            <a href="https://tickets.formula1.com/en/f1-83069-bahrain-in-malaysia" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              tickets.formula1.com
            </a>
            ) — resellers and social-media listings are a real risk for a circuit returning after a 9-year gap with
            high pent-up demand. If K1 is your pick, buy the specific block (A through R) that matches the view you
            want — middle blocks lose sight of Turn 2 to a downhill gradient and an advertising board, so the block
            matters as much as the stand itself.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
