"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OriginMarketGroup } from "../_lib/getOriginMarkets";

const SPORTS = [
  { value: "cricket", label: "Cricket" },
  { value: "formula_one", label: "Formula 1" },
  { value: "golf", label: "Golf" },
  { value: "tennis", label: "Tennis" },
] as const;

const BUDGET_BANDS = [
  { value: "under_1000", label: "Under $1,000", min: 0, max: 1000 },
  { value: "1000_2000", label: "$1,000–$2,000", min: 1000, max: 2000 },
  { value: "2000_3000", label: "$2,000–$3,000", min: 2000, max: 3000 },
  { value: "3000_4000", label: "$3,000–$4,000", min: 3000, max: 4000 },
  { value: "flexible", label: "Flexible", min: 0, max: 100000 },
] as const;

const TIME_WINDOWS = [
  { value: "next_3mo", label: "Next 3 months" },
  { value: "next_6mo", label: "Next 6 months" },
  { value: "next_9mo", label: "Next 9 months" },
  { value: "flexible", label: "Flexible — show all" },
] as const;

type Sport = (typeof SPORTS)[number]["value"];

export default function PlannerIntakeForm({ originMarkets }: { originMarkets: OriginMarketGroup[] }) {
  const router = useRouter();
  const [sports, setSports] = useState<Sport[]>([]);
  const [budgetBand, setBudgetBand] = useState<string>("");
  const [timeWindow, setTimeWindow] = useState<string>("");
  const [tripLengthDays, setTripLengthDays] = useState<string>("");
  const [originMarket, setOriginMarket] = useState<string>("");

  const toggleSport = (sport: Sport) => {
    setSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const canSubmit =
    sports.length > 0 && budgetBand !== "" && timeWindow !== "" && tripLengthDays.trim() !== "" && originMarket !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    const band = BUDGET_BANDS.find((b) => b.value === budgetBand)!;
    const params = new URLSearchParams({
      sports: sports.join(","),
      budgetMin: String(band.min),
      budgetMax: String(band.max),
      timeWindow,
      tripLengthDays,
      originMarket,
    });
    router.push(`/planner/results?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
        Trip Planner
      </p>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
        Your next bucket-list sports trip starts here
      </h1>
      <p className="text-[#A3A3A3] text-base mb-12">
        Wimbledon. Monza. The Ashes. Ryder Cup. Tell us your sport, budget, and timing — we&apos;ll help you plan it within your budget, no signup required.
      </p>

      {/* Sport(s) */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          Which sport?
        </p>
        <p className="text-xs text-[#6A6A6A] mb-3">
          From your bucket-list. Pick one or more — we&apos;ll surface events across all of them.
        </p>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((sport) => {
            const selected = sports.includes(sport.value);
            return (
              <button
                key={sport.value}
                type="button"
                onClick={() => toggleSport(sport.value)}
                className={
                  selected
                    ? "px-4 py-2 rounded-sm text-sm font-semibold bg-[#AAFF00] text-black transition-colors"
                    : "px-4 py-2 rounded-sm text-sm font-semibold bg-[#141414] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-white transition-colors"
                }
              >
                {sport.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Origin market */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          Where are you flying from?
        </p>
        <p className="text-xs text-[#6A6A6A] mb-3">
          Don&apos;t see your city? Pick the nearest one on the list — we&apos;ll use it to estimate your flight cost.
        </p>
        <select
          value={originMarket}
          onChange={(e) => setOriginMarket(e.target.value)}
          className="w-full max-w-xs px-4 py-2.5 rounded-sm text-sm bg-[#141414] border border-[#2A2A2A] text-white focus:outline-none focus:border-[#AAFF00]"
        >
          <option value="" disabled>
            Select a city
          </option>
          {originMarkets.map((group) => (
            <optgroup key={group.region} label={group.region}>
              {group.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Budget band (USD) */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          What&apos;s your budget? (USD)
        </p>
        <p className="text-xs text-[#6A6A6A] mb-3">
          This covers your whole trip per person — flights, hotel, tickets, food, and local transit.
        </p>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:overflow-x-auto">
          {BUDGET_BANDS.map((band) => (
            <button
              key={band.value}
              type="button"
              onClick={() => setBudgetBand(band.value)}
              className={
                budgetBand === band.value
                  ? "px-3 py-2 rounded-sm text-sm font-semibold bg-[#AAFF00] text-black transition-colors whitespace-nowrap"
                  : "px-3 py-2 rounded-sm text-sm font-semibold bg-[#141414] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-white transition-colors whitespace-nowrap"
              }
            >
              {band.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time window */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          When are you thinking?
        </p>
        <p className="text-xs text-[#6A6A6A] mb-3">
          A narrower window shows fewer, better-matched events; Flexible shows everything, sorted by price.
        </p>
        <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:overflow-x-auto">
          {TIME_WINDOWS.map((window) => (
            <button
              key={window.value}
              type="button"
              onClick={() => setTimeWindow(window.value)}
              className={
                timeWindow === window.value
                  ? "px-3 py-2 rounded-sm text-sm font-semibold bg-[#AAFF00] text-black transition-colors whitespace-nowrap"
                  : "px-3 py-2 rounded-sm text-sm font-semibold bg-[#141414] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-white transition-colors whitespace-nowrap"
              }
            >
              {window.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trip length */}
      <div className="mb-12">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          How many days are you thinking?
        </p>
        <p className="text-xs text-[#6A6A6A] mb-3">
          We&apos;ll scale your hotel, food, and local travel costs to this many days.
        </p>
        <input
          type="number"
          min={1}
          max={30}
          value={tripLengthDays}
          onChange={(e) => setTripLengthDays(e.target.value)}
          placeholder="e.g. 4"
          className="w-32 px-4 py-2 rounded-sm text-sm bg-[#141414] border border-[#2A2A2A] text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00]"
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="px-8 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Help me plan
      </button>
    </div>
  );
}
