import Image from "next/image";
import { Compass, Wallet, Ticket, CalendarDays } from "lucide-react";

const INFO_ICONS = [
  { Icon: Compass, label: "Find your tournament" },
  { Icon: Wallet, label: "Plan your budget" },
  { Icon: Ticket, label: "Find your ticket" },
  { Icon: CalendarDays, label: "Build your itinerary" },
];

// Section 1 — masthead. Mirrors app/formula-1/_components/CockpitMasthead.tsx.
// Hero asset is a placeholder path — founder needs to supply 3 final hero
// image options before this goes live, per the standing hero-image rule.
export default function CockpitMasthead() {
  return (
    <div className="relative h-[52vh] min-h-[380px] overflow-hidden bg-[#0A0A0A]">
      <Image
        src="/tennis/tennis-cockpit-hero.png"
        alt="A tennis player serving on a Grand Slam show court"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      <div className="relative h-full max-w-5xl mx-auto px-6 sm:px-8 flex flex-col justify-end pb-10">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Tennis</p>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight max-w-xl text-balance">
          Tennis Travel Planning Cockpit
        </h1>
        <p className="text-sm sm:text-base text-white/80 mt-3 max-w-md">
          One place to discover, compare and plan your complete tennis trip
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
          {INFO_ICONS.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/70 text-xs">
              <Icon size={14} strokeWidth={2} className="text-[#AAFF00] flex-shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
