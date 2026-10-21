import Image from "next/image";
import TennisCockpitHomepageCtaLink from "./TennisCockpitHomepageCtaLink";

// Permanent homepage feature linking to /tennis — behind the same
// SHOW_TENNIS_COCKPIT flag as the Cockpit route itself (separate flag from
// SHOW_F1_COCKPIT — independent launch control). Mirrors
// app/_components/CockpitHomepageFeature.tsx.
export default function TennisCockpitHomepageFeature() {
  if (process.env.SHOW_TENNIS_COCKPIT !== "true") return null;

  return (
    <section className="bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">Tennis Travel Planning Cockpit</p>
        <h2 className="text-2xl font-black text-white leading-snug mb-8">Your tennis journey, from first thought to final set</h2>
        <TennisCockpitHomepageCtaLink className="group relative block overflow-hidden rounded-sm border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors duration-300">
          <div className="relative h-[220px] sm:h-[280px]">
            <Image
              src="/tennis/tennis-cockpit-hero.png"
              alt="A tennis player serving on a Grand Slam show court"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <p className="text-sm text-white/80 max-w-md">
                Discover a tournament, compare your options, find your seat and build your trip — all in one place.
              </p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-black text-[#AAFF00] group-hover:text-[#BBFF33] transition-colors w-fit">
                Explore the Tennis Cockpit →
              </span>
            </div>
          </div>
        </TennisCockpitHomepageCtaLink>
      </div>
    </section>
  );
}
