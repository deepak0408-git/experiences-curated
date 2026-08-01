import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import { getSpokeData, SPOKES, getSpokeImage } from "./_lib/getSpokeData";
import { STATUS_LABEL } from "./_components/SpokeShell";
import Filmstrip from "./_components/Filmstrip";

// PILOT — hub index page. Links out to all 12 spoke pages (each its own
// route, own <title>, own canonical) rather than containing their content.
// Real hub-and-spoke architecture: this page's job is to be a good index,
// not a long scroll. Real title/meta would live here via generateMetadata
// once this moves off the preview route.
export const revalidate = 3600;

// Evergreen display name — strips the trailing year from event.name
// ("Italian Grand Prix 2026" -> "Italian Grand Prix") so body copy never
// hardcodes a year that would need editing annually. The year only ever
// appears in the explicit "2026 dates: ..." callout below, sourced live
// from startDate/endDate.
function evergreenName(name: string): string {
  return name.replace(/\s+\d{4}$/, "");
}

export default async function ItalianGPHubPreview() {
  const { event, dateRange, linkedExperiences } = await getSpokeData();
  const displayName = evergreenName(event.name);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Filmstrip — a handful of real, atmospheric photos from the actual pack
  // (crowd/tifosi/grandstand energy), not the same images used on the tile
  // grid below. Gives the hub a "you are here" feel beyond one hero shot.
  const filmstripSlugs = ["the-tifosi-ferraris-red-army", "the-fan-zone-ascari-to-parabolica", "curva-grande-general-admission", "history-of-monza-walking-old-banking"];
  const filmstrip = filmstripSlugs
    .map((s) => linkedExperiences.find((e) => e.slug.includes(s)))
    .filter((e): e is NonNullable<typeof e> & { heroImageUrl: string } => Boolean(e?.heroImageUrl))
    .map((e) => ({ id: e.id, heroImageUrl: e.heroImageUrl, title: e.title }));

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Real site header, overlaid on the hero — same pattern as the
          homepage's Zone 1 (HomepageNav email={...} overlay={true}). */}
      <div className="relative">
        <HomepageNav email={user?.email ?? null} overlay={true} />

        <div className="relative h-[60vh] min-h-[440px] overflow-hidden bg-[#141414]">
          {event.heroImageUrl && <Image src={event.heroImageUrl} alt={displayName} fill className="object-cover" priority style={{ filter: "saturate(1.3) brightness(1.02)" }} />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
            <div className="max-w-5xl mx-auto">
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Formula 1 — Event Guide</p>
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">{displayName}</h1>
              <p className="mt-3 text-sm text-white/70">
                Autodromo Nazionale Monza · <span className="font-mono">{dateRange}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filmstrip — real atmosphere, slow auto-scroll, pauses on hover,
          falls back to a static grid under prefers-reduced-motion. */}
      <Filmstrip images={filmstrip} />

      <div className="max-w-5xl mx-auto px-6 py-14">
        <p className="text-base text-[#A3A3A3] leading-7 mb-12 max-w-2xl">
          {`Everything you need to plan a trip to the ${displayName} at Monza — costs, tickets, where to stay, where to eat, and the trip-specific detail that only matters once you're actually going. This guide stays live and current year over year.`}
        </p>

        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">Plan your trip</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SPOKES.map((spoke) => {
            const imageUrl = getSpokeImage(linkedExperiences, spoke.imageSlug);
            return (
              <Link
                key={spoke.id}
                href={spoke.href}
                className="group relative rounded-sm overflow-hidden border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors min-h-[180px] flex flex-col justify-end"
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

                {/* Status badge — pinned top-right, consistent position
                    across every tile. Teaser (Free + Pack depth) gets the
                    brand accent green since that's the upsell signal we
                    want a buyer's eye drawn to; Free/Pack-exclusive stay
                    neutral grey so green isn't diluted into meaning
                    nothing. Flipped from an initial "Free = green" draft
                    after thinking through it as a buyer — green is this
                    site's CTA color, it should point at the tiles that
                    lead to a purchase, not away from them. */}
                <span
                  className={`absolute top-3 right-3 text-[9px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm ${
                    spoke.status === "teaser"
                      ? "text-[#AAFF00] border-[#AAFF00]/50 bg-black/30"
                      : "text-white/70 border-white/20 bg-black/30"
                  }`}
                >
                  {STATUS_LABEL[spoke.status]}
                </span>

                <div className="relative p-5">
                  <p className="text-base font-black text-white group-hover:text-[#AAFF00] transition-colors leading-tight">
                    {spoke.label}
                  </p>
                  <p className="text-xs text-white/60 mt-1.5 leading-5">&quot;{spoke.question}&quot;</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
