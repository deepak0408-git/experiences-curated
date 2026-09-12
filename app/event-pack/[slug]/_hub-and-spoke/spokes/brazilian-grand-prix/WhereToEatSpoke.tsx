import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Four real, seeded dining experiences cover this trip's actual range: two
// splurge picks (A Figueira Rubaiyat, Maní), one budget pick (Liberdade's
// ramen shops), and Vila Madalena's casual bar-food crawl — real range from
// a US$8-15 ramen bowl to a US$120 tasting menu, 12 Sep 2026.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const figueira = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-figueira-rubaiyat-"));
  const mani = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-mani-"));
  const liberdadeRamen = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-liberdade-japanese-dining-"));
  const vilaMadalena = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-vila-madalena-food-crawl-"));
  const barBrahma = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-bar-brahma-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="São Paulo Grand Prix"
      status="teaser"
      h1="From a US$10 ramen bowl to a Michelin-star tasting menu, under the same fig tree"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every pick above is real and free. What's gated is the tactical detail that actually gets you a table: Maní's real booking window, the exact evening to hit Vila Madalena to avoid a wait, our real sequencing across a food-focused day off from the circuit, and the bookable guided food tour that covers your one free market morning for you."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        São Paulo has one of the strongest food scenes in South America, and race weekend is a genuine excuse to
        run the full range — a fig-tree-shaded steakhouse dining room, a Michelin-starred contemporary kitchen, a
        ramen shop with a real neighborhood line, and a night of bar-to-bar wandering in the city&apos;s loudest
        nightlife district.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Splurge — under the fig tree</p>
      {figueira && (
        <div className="mb-8">
          <SpokeExperienceCard experience={figueira} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Splurge — Michelin-starred, Brazilian ingredients</p>
      {mani && (
        <div className="mb-8">
          <SpokeExperienceCard experience={mani} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Budget — the real Liberdade line</p>
      {liberdadeRamen && (
        <div className="mb-8">
          <SpokeExperienceCard experience={liberdadeRamen} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A night out — Vila Madalena or live samba downtown</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {vilaMadalena && <SpokeExperienceCard experience={vilaMadalena} isPro={isPro} hideProCtas />}
        {barBrahma && <SpokeExperienceCard experience={barBrahma} isPro={isPro} hideProCtas />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d actually sequence a food-focused day</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Book Maní for one of your earlier nights in São Paulo rather than your last — the room is genuinely
            small (three connected spaces in a converted house), and a Michelin-starred kitchen at this scale fills
            up well ahead, especially on weekend evenings. Pair a Feira da Liberdade weekend market visit with lunch
            at Aska or Lamen Kazu right after — arriving at the market hungry and finishing with ramen a short walk
            away is the natural order, not the reverse. Save Vila Madalena for a night after a long day at the
            circuit, since it&apos;s built for wandering rather than a fixed reservation time.
          </p>
          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
              Prefer not to gamble your one free morning on trial and error? A local-led half-day covers this same
              market-and-tastings ground for you — stalls, vendors, and what to actually order, without the risk of
              wasting the morning finding out the hard way.
            </p>
            <a
              href="https://www.getyourguide.com/sao-paulo-l384/sao-paulo-farmers-market-brazilian-food-tour-t1439207/?partner_id=HCNITTS&utm_medium=online_publisher"
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
            >
              Book the São Paulo Farmers Market &amp; Food Tour →
            </a>
          </div>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The booking detail that actually matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Maní is closed Mondays — if your trip only overlaps a Monday for a free dinner slot, book Figueira
            Rubaiyat that night instead and save Maní for a Tuesday-through-Sunday evening. For Vila Madalena,
            arrive earlier in the evening at Mercearia São Pedro specifically if you want to actually get a seat
            rather than stand — it gets genuinely packed most nights, more so on a weekend during race week when
            the city&apos;s visitor numbers are already elevated.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
