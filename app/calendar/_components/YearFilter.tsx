"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const YEARS = [2026, 2027];

// Multi-select — unlike the sport filter (single-select, plain links), a
// year pill toggles membership in a comma-separated ?years= param. No years
// selected in the URL = show all (same "All" default as the sport filter),
// so this never renders an explicit "All" pill of its own — deselecting
// every year returns to that same default state.
export default function YearFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = searchParams.get("years")?.split(",").filter(Boolean).map(Number) ?? [];

  function toggle(year: number) {
    const next = selected.includes(year)
      ? selected.filter((y) => y !== year)
      : [...selected, year];

    const params = new URLSearchParams(searchParams.toString());
    if (next.length === 0) {
      params.delete("years");
    } else {
      params.set("years", next.sort().join(","));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {YEARS.map((year) => {
        const isActive = selected.includes(year);
        return (
          <button
            key={year}
            onClick={() => toggle(year)}
            aria-pressed={isActive}
            className={`text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border transition-colors ${
              isActive
                ? "bg-[#AAFF00] text-black border-[#AAFF00]"
                : "bg-[#141414] text-[#A3A3A3] border-[#2A2A2A] hover:border-[#AAFF00] hover:text-white"
            }`}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
