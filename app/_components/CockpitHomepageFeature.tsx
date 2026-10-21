import Image from "next/image";
import CockpitHomepageCtaLink from "./CockpitHomepageCtaLink";

// Permanent homepage feature linking to /formula-1 — behind the same
// SHOW_F1_COCKPIT flag as the Cockpit route itself, so the link never
// appears while the route is unpublished. Positioned immediately after the
// masthead and before the Trip Planner showcase, per spec. Uses the exact
// same canonical hero file as the Cockpit masthead.
export default function CockpitHomepageFeature() {
  if (process.env.SHOW_F1_COCKPIT !== "true") return null;

  return (
    <section className="bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">F1 Travel Planning Cockpit</p>
        <h2 className="text-2xl font-black text-white leading-snug mb-8">Your Formula 1 journey, from first thought to final lap</h2>
        <CockpitHomepageCtaLink className="group relative block overflow-hidden rounded-sm border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors duration-300">
          <div className="relative h-[220px] sm:h-[280px]">
            <Image
              src="/formula-1/f1-cockpit-hero.png"
              alt="Two Formula 1 cars racing at sunset"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <p className="text-sm text-white/80 max-w-md">
                Discover a Grand Prix, compare your options, find your seat and build your trip — all in one place.
              </p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-black text-[#AAFF00] group-hover:text-[#BBFF33] transition-colors w-fit">
                Explore the F1 Cockpit →
              </span>
            </div>
          </div>
        </CockpitHomepageCtaLink>
      </div>
    </section>
  );
}
