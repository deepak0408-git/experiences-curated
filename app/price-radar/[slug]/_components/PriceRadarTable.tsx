"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Flight = { city: string; region: string; costLow: number; costHigh: number };
type HotelTier = { tier: string; costLow: number; costHigh: number };
type TicketTier = { tier: string; label: string; example: string; exampleForTotal?: string; costLow: number; costHigh: number };
type Band = { low: number; high: number } | null;

const HOTEL_TIER_ORDER = ["budget", "moderate", "splurge", "luxury"];
const HOTEL_TIER_LABEL: Record<string, string> = {
  budget: "Budget",
  moderate: "Moderate",
  splurge: "Splurge",
  luxury: "Luxury",
};

// Split 27 Sep 2026 from one PriceRadarTable component into
// PriceRadarFilters (the tier pickers/day input/city dropdown — narrow,
// renders in the page's sidebar-grid column) + PriceRadarResults (the
// table itself — renders full width, breaking out of that grid). Both were
// previously one component squeezed into the same narrow column once
// SpokeActionSidebar was added alongside it, which visibly cramped the
// table's own columns (caught live 27 Sep 2026). State (hotel/ticket/city
// filter, days) previously lived as local useState inside that one
// component; it now lives in PriceRadarState (a small context provider)
// so the two split halves stay in sync without page.tsx (a server
// component) needing to own client state itself.

interface PriceRadarState {
  flights: Flight[];
  hotelTiers: HotelTier[];
  ticketTiers: TicketTier[];
  food: Band;
  localTravel: Band;
  localTravelNote: string | null;
  foodNote: string | null;
  hotelBenchmarkNote: string | null;
  extraCostsNote: string | null;
  sortedHotelTiers: HotelTier[];
  sortedTicketTiers: TicketTier[];
  originGroups: [string, string[]][];
  hotelFilter: string;
  setHotelFilter: (v: string) => void;
  ticketFilter: string;
  setTicketFilter: (v: string) => void;
  cityFilter: string;
  setCityFilter: (v: string) => void;
  // daysInput is the raw text of the input (can be "" mid-edit, or contain
  // a value outside 1-30 while the user is still typing a multi-digit
  // number) — the input itself is always controlled by THIS, never by a
  // derived/clamped number, so React never re-renders it with a "corrected"
  // value between keystrokes. days is the derived numeric value for actual
  // cost math elsewhere, already tolerant of "" / NaN via PriceRadarResults'
  // own safeDays fallback. Split 28 Sep 2026 — coercing the input's own
  // value to a fallback (e.g. defaulting empty to 1) on every keystroke was
  // fighting the user's typing: clearing the field to type "4" would
  // re-render as "1" before the second keystroke landed, turning "4" into
  // "14". A controlled input's displayed value must never be silently
  // corrected mid-edit.
  daysInput: string;
  setDaysInput: (v: string) => void;
  days: number;
}

const PriceRadarContext = createContext<PriceRadarState | null>(null);

function usePriceRadarState(): PriceRadarState {
  const ctx = useContext(PriceRadarContext);
  if (!ctx) throw new Error("PriceRadarFilters/PriceRadarResults must be used inside PriceRadarProvider");
  return ctx;
}

export function PriceRadarProvider({
  flights,
  hotelTiers,
  ticketTiers,
  food,
  localTravel,
  localTravelNote,
  foodNote,
  hotelBenchmarkNote = null,
  extraCostsNote = null,
  children,
}: {
  flights: Flight[];
  hotelTiers: HotelTier[];
  ticketTiers: TicketTier[];
  food: Band;
  localTravel: Band;
  localTravelNote: string | null;
  foodNote: string | null;
  hotelBenchmarkNote?: string | null;
  extraCostsNote?: string | null;
  children: React.ReactNode;
}) {
  const sortedHotelTiers = useMemo(
    () => [...hotelTiers].sort((a, b) => HOTEL_TIER_ORDER.indexOf(a.tier) - HOTEL_TIER_ORDER.indexOf(b.tier)),
    [hotelTiers]
  );
  const sortedTicketTiers = useMemo(
    () => [...ticketTiers].sort((a, b) => a.tier.localeCompare(b.tier)),
    [ticketTiers]
  );

  const originGroups = useMemo(() => {
    const byRegion = new Map<string, string[]>();
    for (const f of [...flights].sort((a, b) => a.region.localeCompare(b.region) || a.city.localeCompare(b.city))) {
      const list = byRegion.get(f.region) ?? [];
      list.push(f.city);
      byRegion.set(f.region, list);
    }
    return Array.from(byRegion.entries());
  }, [flights]);

  const defaultHotel = sortedHotelTiers.find((h) => h.tier === "moderate")?.tier ?? sortedHotelTiers[0]?.tier ?? "";
  const defaultTicket = sortedTicketTiers.find((t) => t.tier === "tier2")?.tier ?? sortedTicketTiers[0]?.tier ?? "";

  const [hotelFilter, setHotelFilter] = useState<string>(defaultHotel);
  const [ticketFilter, setTicketFilter] = useState<string>(defaultTicket);
  const [cityFilter, setCityFilter] = useState<string>("");
  // Trip length — same field/copy as PlannerIntakeForm.tsx's "How many days
  // are you thinking?" originally (min 1, max 30), but capped at 90 instead
  // of 30 as of 28 Sep 2026 — a multi-city cricket tour can run 30-45+ days,
  // which Planner's own single-event 30-day cap was never built to cover.
  // Defaults to 3, matching this event's real 3-day (Fri-Sun) ticket
  // structure (see CostSpoke.tsx's TRIP_NIGHTS), not blank like the
  // Planner's own gated form — this page has no submit step, so it needs a
  // live default to render a table at all. Added 25 Sep 2026: only hotel/
  // food/local-travel scale per day; flight (round-trip) and ticket (a
  // fixed package price) don't.
  //
  // daysInput (raw string) is what the <input> is controlled by — see the
  // PriceRadarState interface comment above for why this is kept separate
  // from the derived numeric `days` (28 Sep 2026 fix).
  const [daysInput, setDaysInput] = useState<string>("3");
  const days = parseInt(daysInput, 10);

  return (
    <PriceRadarContext.Provider
      value={{
        flights,
        hotelTiers,
        ticketTiers,
        food,
        localTravel,
        localTravelNote,
        foodNote,
        hotelBenchmarkNote,
        extraCostsNote,
        sortedHotelTiers,
        sortedTicketTiers,
        originGroups,
        hotelFilter,
        setHotelFilter,
        ticketFilter,
        setTicketFilter,
        cityFilter,
        setCityFilter,
        daysInput,
        setDaysInput,
        days,
      }}
    >
      {children}
    </PriceRadarContext.Provider>
  );
}

// Hotel Tier filter. Below sm: 2x2 grid, all 4 pills (Budget/Moderate/
// Splurge/Luxury) sharing equal width (founder feedback, 28 Sep 2026 — the
// original flex-wrap row was overlapping/garbling on small screens). sm and
// up: reverted to the original flex-wrap row with auto-width pills — the
// 2x2 grid was mistakenly applied at every screen width in the first pass
// and broke the desktop layout (caught live 28 Sep 2026); this filter was
// only ever meant to change below sm. Same classes as
// PlannerIntakeForm.tsx's "Which sport?" block otherwise. No "All" option
// (removed per founder feedback, 25 Sep 2026 — single-select only, one
// hotel tier active at a time) and no description line (also removed).
function PillRow({
  eyebrow,
  options,
  selected,
  onSelect,
}: {
  eyebrow: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">{eyebrow}</p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={
                isSelected
                  ? "px-4 py-2 rounded-sm text-sm font-semibold text-center sm:text-left bg-[#AAFF00] text-black transition-colors"
                  : "px-4 py-2 rounded-sm text-sm font-semibold text-center sm:text-left bg-[#141414] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-white transition-colors"
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Vertical stacked list — Ticket Tier filter. Below sm: each option is its
// own full-width row, pill button with the real example text wrapped onto
// its own line below it (founder feedback, 25 Sep 2026 and 28 Sep 2026 —
// long examples read badly as pills, and inline label+example was
// overflowing/garbling on small screens). sm and up: reverted to the
// original layout — fixed-width pill with the example inline beside it —
// the stacked layout was mistakenly applied at every screen width in the
// first pass and broke the desktop layout (caught live 28 Sep 2026); this
// filter was only ever meant to change below sm.
function TicketTierList({
  options,
  selected,
  onSelect,
}: {
  options: { value: string; label: string; example: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">Ticket tier</p>
      <div className="flex flex-col gap-3 sm:gap-2">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className="block text-left sm:flex sm:items-center sm:gap-3"
            >
              <span
                className={
                  isSelected
                    ? "block sm:flex-shrink-0 sm:w-56 px-4 py-2 rounded-sm text-sm font-semibold bg-[#AAFF00] text-black transition-colors sm:whitespace-nowrap"
                    : "block sm:flex-shrink-0 sm:w-56 px-4 py-2 rounded-sm text-sm font-semibold bg-[#141414] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-white transition-colors sm:whitespace-nowrap"
                }
              >
                {opt.label}
              </span>
              <span className="block mt-1.5 sm:mt-0 text-xs text-[#6A6A6A]">e.g. {opt.example}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Narrow column — tier pickers, day input, city dropdown. Renders in the
// page's grid alongside the sidebar.
export function PriceRadarFilters() {
  const { sortedHotelTiers, sortedTicketTiers, originGroups, hotelFilter, setHotelFilter, ticketFilter, setTicketFilter, cityFilter, setCityFilter, daysInput, setDaysInput } =
    usePriceRadarState();

  return (
    <div className="mt-8">
      {sortedHotelTiers.length > 0 && (
        <PillRow
          eyebrow="Hotel tier"
          selected={hotelFilter}
          onSelect={setHotelFilter}
          options={sortedHotelTiers.map((h) => ({ value: h.tier, label: HOTEL_TIER_LABEL[h.tier] ?? h.tier }))}
        />
      )}

      {sortedTicketTiers.length > 0 && (
        <TicketTierList
          selected={ticketFilter}
          onSelect={setTicketFilter}
          options={sortedTicketTiers.map((t) => ({ value: t.tier, label: t.label, example: t.example }))}
        />
      )}

      {/* Trip length — same eyebrow/description/input pattern as
          PlannerIntakeForm.tsx's "How many days are you thinking?" block. */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">How many days are you thinking?</p>
        <p className="text-xs text-[#6A6A6A] mb-3">
          We&apos;ll scale your hotel, food, and local travel costs to this many days.
        </p>
        <input
          type="number"
          min={1}
          // 90, not 30 — 28 Sep 2026 fix. 30 was copied verbatim from
          // PlannerIntakeForm.tsx's own cap without checking whether it
          // fits every sport this page serves: a multi-city cricket tour
          // (e.g. Border-Gavaskar Trophy-style series) can easily run
          // 30-45+ days across venues, and 30 would silently clamp a
          // genuine long-trip entry down. 90 covers a full multi-Test tour
          // with room to spare, without going effectively unbounded.
          max={90}
          // Controlled by the raw string, not a coerced/clamped number —
          // fixed 28 Sep 2026 after the first attempt (falling back to 1 on
          // every keystroke when the field was momentarily empty) fought
          // the user's own typing: clearing the field to type "4" re-
          // rendered as "1" before the second keystroke landed, turning "4"
          // into "14". The field is free to sit empty or out-of-range while
          // the user is mid-edit; onBlur below clamps it back into 1-90
          // once they're done, and PriceRadarResults' own safeDays already
          // tolerates "" / NaN for the live cost math in the meantime.
          value={daysInput}
          onChange={(e) => setDaysInput(e.target.value)}
          onBlur={(e) => {
            const parsed = parseInt(e.target.value, 10);
            const clamped = Number.isNaN(parsed) ? 3 : Math.min(90, Math.max(1, parsed));
            setDaysInput(String(clamped));
          }}
          className="w-32 px-4 py-2 rounded-sm text-sm bg-[#141414] border border-[#2A2A2A] text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00]"
        />
      </div>

      {/* City dropdown — same "Where are you flying from?" pattern as
          PlannerIntakeForm.tsx's origin-market <select>, region-optgrouped.
          Filters the table to one row when set; empty option shows all
          cities. Replaces the earlier free-text search input. */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">Where are you flying from?</p>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-white focus:outline-none focus:border-[#AAFF00] transition-colors"
        >
          <option value="">All cities</option>
          {originGroups.map(([region, cities]) => (
            <optgroup key={region} label={region}>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {/* Added 27 Sep 2026 per founder — the 49-city list is real but
            finite, and a fan whose own city isn't on it had no guidance on
            what to do instead. */}
        <p className="text-xs text-[#6A6A6A] mt-2">
          Don&apos;t see your city? Pick the nearest one on the list — we&apos;ll use it to estimate your flight
          cost.
        </p>
      </div>
    </div>
  );
}

// Full-width results — active-selection summary, table, footnotes. Renders
// below the grid (breaks out of the narrow column) so its columns keep
// their original, uncompressed width.
export function PriceRadarResults() {
  const { sortedHotelTiers, sortedTicketTiers, food, localTravel, localTravelNote, foodNote, hotelBenchmarkNote, extraCostsNote, hotelFilter, ticketFilter, cityFilter, flights, days } =
    usePriceRadarState();

  const activeHotel = sortedHotelTiers.find((h) => h.tier === hotelFilter) ?? null;
  const activeTicket = sortedTicketTiers.find((t) => t.tier === ticketFilter) ?? null;

  const visibleFlights = cityFilter ? flights.filter((f) => f.city === cityFilter) : flights;

  type Row = {
    city: string;
    region: string;
    flightLow: number;
    flightHigh: number;
    totalLow: number;
    totalHigh: number;
  };

  const safeDays = Number.isFinite(days) && days > 0 ? days : 1;
  const foodLow = (food?.low ?? 0) * safeDays;
  const foodHigh = (food?.high ?? 0) * safeDays;
  const localLow = (localTravel?.low ?? 0) * safeDays;
  const localHigh = (localTravel?.high ?? 0) * safeDays;
  const hotelLow = (activeHotel?.costLow ?? 0) * safeDays;
  const hotelHigh = (activeHotel?.costHigh ?? 0) * safeDays;
  const ticketLow = activeTicket?.costLow ?? 0;
  const ticketHigh = activeTicket?.costHigh ?? 0;

  const rows: Row[] = useMemo(() => {
    return [...visibleFlights]
      .sort((a, b) => a.region.localeCompare(b.region) || a.city.localeCompare(b.city))
      .map((f) => ({
        city: f.city,
        region: f.region,
        flightLow: f.costLow,
        flightHigh: f.costHigh,
        totalLow: f.costLow + hotelLow + ticketLow + foodLow + localLow,
        totalHigh: f.costHigh + hotelHigh + ticketHigh + foodHigh + localHigh,
      }));
  }, [visibleFlights, hotelLow, hotelHigh, ticketLow, ticketHigh, foodLow, foodHigh, localLow, localHigh]);

  const grouped = useMemo(() => {
    const byRegion = new Map<string, Row[]>();
    for (const row of rows) {
      const list = byRegion.get(row.region) ?? [];
      list.push(row);
      byRegion.set(row.region, list);
    }
    return Array.from(byRegion.entries());
  }, [rows]);

  return (
    <div>
      {/* Active-selection summary — replaces repeating the hotel/ticket
          tier text under every row (caught live, 25 Sep 2026: "Budget ·
          Turn 4, Turn 9... Grandstand (3-day)" under each of 49 rows read
          as badly formatted). One line, Planner-results style. */}
      {(activeHotel || activeTicket) && (
        <p className="mb-4 text-sm text-[#A3A3A3]">
          {activeHotel && <span className="font-semibold text-white">{HOTEL_TIER_LABEL[activeHotel.tier] ?? activeHotel.tier} hotel</span>}
          {activeHotel && " · "}
          <span className="font-semibold text-white">{safeDays} day{safeDays === 1 ? "" : "s"}</span>
          {activeTicket && " · "}
          {activeTicket && <span className="font-semibold text-white">{activeTicket.exampleForTotal ?? activeTicket.example}</span>}
        </p>
      )}

      {/* Table — lg and up only. Below lg, the 7-column table has no room
          to breathe (caught live, screenshots 28 Sep 2026: numbers
          overlapping, columns unreadable), so small screens get
          RegionCardGroup's stacked mini-tiles instead — same region
          grouping/sort, same 5 line-items + total per city, just laid out
          vertically. */}
      <div className="hidden lg:block rounded-sm border border-[#2A2A2A]">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
          </colgroup>
          <thead className="sticky top-0 bg-[#141414]">
            <tr className="border-b border-[#2A2A2A]">
              <th className="text-left font-semibold text-[#6A6A6A] text-xs uppercase tracking-widest px-4 py-2.5">Origin City</th>
              <th className="text-center font-semibold text-[#6A6A6A] text-xs uppercase tracking-widest px-2 py-2.5">Flight</th>
              <th className="text-center font-semibold text-[#6A6A6A] text-xs uppercase tracking-widest px-2 py-2.5">Hotel</th>
              <th className="text-center font-semibold text-[#6A6A6A] text-xs uppercase tracking-widest px-2 py-2.5">Ticket</th>
              <th className="text-center font-semibold text-[#6A6A6A] text-xs uppercase tracking-widest px-2 py-2.5">Food</th>
              <th className="text-center font-semibold text-[#6A6A6A] text-xs uppercase tracking-widest px-2 py-2.5">Local travel</th>
              <th className="text-center font-semibold text-[#AAFF00] text-xs uppercase tracking-widest px-2 py-2.5">Total</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map(([region, regionRows]) => (
              <RegionGroup
                key={region}
                region={region}
                rows={regionRows}
                hotelLow={hotelLow}
                hotelHigh={hotelHigh}
                ticketLow={ticketLow}
                ticketHigh={ticketHigh}
                foodLow={foodLow}
                foodHigh={foodHigh}
                localLow={localLow}
                localHigh={localHigh}
              />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-[#6A6A6A] text-sm">
                  No matching city.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mini-tiles — below lg only. Mirrors RegionGroup: same region
          headers, same sort, same 5 cost lines + total per city. */}
      <div className="lg:hidden space-y-6">
        {grouped.map(([region, regionRows]) => (
          <RegionCardGroup
            key={region}
            region={region}
            rows={regionRows}
            hotelLow={hotelLow}
            hotelHigh={hotelHigh}
            ticketLow={ticketLow}
            ticketHigh={ticketHigh}
            foodLow={foodLow}
            foodHigh={foodHigh}
            localLow={localLow}
            localHigh={localHigh}
          />
        ))}
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-[#6A6A6A] text-sm rounded-sm border border-[#2A2A2A]">
            No matching city.
          </p>
        )}
      </div>

      {/* Footnotes — generic column captions (matching the exact wording
          used on /planner's own breakdown, ShortlistResults.tsx/
          getPlannerEvents.ts's CostLineItem qualifiers) plus real
          per-destination notes where they exist (plannerDestinationBands.
          localTravelNote/foodNote — same fields CostSpoke.tsx surfaces as
          "Getting around, cheaply"/"A local money-saving trick"). Added
          25 Sep 2026 per founder request. */}
      <div className="mt-6 space-y-1.5 text-xs text-[#6A6A6A]">
        <p>Flight: round-trip, economy.</p>
        <p>Local travel: a mix of taxis and public transport.</p>
        <p>Food: per person, per day — casual dining, not fine dining.</p>
      </div>

      {(localTravelNote || foodNote) && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {localTravelNote && (
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1.5">Getting around, cheaply</p>
              <p className="text-sm text-[#A3A3A3] leading-6">{localTravelNote}</p>
            </div>
          )}
          {foodNote && (
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1.5">A local money-saving trick</p>
              <p className="text-sm text-[#A3A3A3] leading-6">{foodNote}</p>
            </div>
          )}
        </div>
      )}

      {hotelBenchmarkNote && (
        <p className="mt-4 text-xs text-[#6A6A6A]">{hotelBenchmarkNote}</p>
      )}

      {extraCostsNote && (
        <div className="mt-4 rounded-sm border border-amber-400/30 bg-amber-400/5 p-4">
          <p className="text-xs font-black tracking-widest uppercase text-amber-400 mb-1.5">Also budget for</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{extraCostsNote}</p>
        </div>
      )}

      <p className="mt-4 text-[11px] text-[#6A6A6A]">
        Prices shown are indicative for planning purposes — check the event&apos;s official ticketing/booking pages, flight and hotel booking websites for current availability and pricing.
      </p>
    </div>
  );
}

function MoneyCell({ low, high, emphasis = false }: { low: number; high: number; emphasis?: boolean }) {
  // Low/high stacked on their own line each (not a single nowrap string)
  // — caught live 25 Sep 2026: forcing the whole "US$X–US$Y" range onto
  // one line overflowed the table horizontally on a normal viewport width.
  // Each value keeps whitespace-nowrap individually so a single number
  // never breaks mid-digit, but the range itself is free to span two rows.
  const roundedLow = Math.round(low);
  const roundedHigh = Math.round(high);
  const textClass = emphasis ? "font-bold text-[#AAFF00]" : "text-[#A3A3A3]";
  if (roundedLow === roundedHigh) {
    return (
      <td className={`px-2 py-2.5 text-center font-mono ${textClass}`}>
        <span className="whitespace-nowrap">US${roundedLow.toLocaleString()}</span>
      </td>
    );
  }
  return (
    <td className={`px-2 py-2.5 text-center font-mono leading-5 ${textClass}`}>
      <span className="whitespace-nowrap block">US${roundedLow.toLocaleString()}</span>
      <span className="whitespace-nowrap block">–US${roundedHigh.toLocaleString()}</span>
    </td>
  );
}

function RegionGroup({
  region,
  rows,
  hotelLow,
  hotelHigh,
  ticketLow,
  ticketHigh,
  foodLow,
  foodHigh,
  localLow,
  localHigh,
}: {
  region: string;
  rows: { city: string; flightLow: number; flightHigh: number; totalLow: number; totalHigh: number }[];
  hotelLow: number;
  hotelHigh: number;
  ticketLow: number;
  ticketHigh: number;
  foodLow: number;
  foodHigh: number;
  localLow: number;
  localHigh: number;
}) {
  return (
    <>
      <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A]">
        <td colSpan={7} className="px-4 py-1.5 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">
          {region}
        </td>
      </tr>
      {rows.map((r) => (
        <tr key={r.city} className="border-b border-[#2A2A2A] last:border-b-0">
          <td className="px-4 py-2.5 text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">{r.city}</td>
          <MoneyCell low={r.flightLow} high={r.flightHigh} />
          <MoneyCell low={hotelLow} high={hotelHigh} />
          <MoneyCell low={ticketLow} high={ticketHigh} />
          <MoneyCell low={foodLow} high={foodHigh} />
          <MoneyCell low={localLow} high={localHigh} />
          <MoneyCell low={r.totalLow} high={r.totalHigh} emphasis />
        </tr>
      ))}
    </>
  );
}

// Formats a low/high pair the same way MoneyCell does, as plain text (no
// <td>) — shared by the mobile card tiles below.
function formatMoneyRange(low: number, high: number): string {
  const roundedLow = Math.round(low);
  const roundedHigh = Math.round(high);
  if (roundedLow === roundedHigh) return `US$${roundedLow.toLocaleString()}`;
  return `US$${roundedLow.toLocaleString()}–US$${roundedHigh.toLocaleString()}`;
}

// Mobile-only region group — same grouping/sort as RegionGroup, rendered as
// stacked cards instead of table rows. Added 28 Sep 2026 (founder feedback:
// the 7-column table was unreadable below lg — numbers overlapping,
// columns garbled on a phone-width screenshot).
function RegionCardGroup({
  region,
  rows,
  hotelLow,
  hotelHigh,
  ticketLow,
  ticketHigh,
  foodLow,
  foodHigh,
  localLow,
  localHigh,
}: {
  region: string;
  rows: { city: string; flightLow: number; flightHigh: number; totalLow: number; totalHigh: number }[];
  hotelLow: number;
  hotelHigh: number;
  ticketLow: number;
  ticketHigh: number;
  foodLow: number;
  foodHigh: number;
  localLow: number;
  localHigh: number;
}) {
  return (
    <div>
      <p className="mb-2 px-1 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">{region}</p>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.city} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-white font-semibold">{r.city}</p>
              <p className="font-mono font-bold text-sm text-[#AAFF00] text-right whitespace-nowrap">
                {formatMoneyRange(r.totalLow, r.totalHigh)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
              <CostLine label="Flight" low={r.flightLow} high={r.flightHigh} />
              <CostLine label="Hotel" low={hotelLow} high={hotelHigh} />
              <CostLine label="Ticket" low={ticketLow} high={ticketHigh} />
              <CostLine label="Food" low={foodLow} high={foodHigh} />
              <CostLine label="Local travel" low={localLow} high={localHigh} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostLine({ label, low, high }: { label: string; low: number; high: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[#6A6A6A]">{label}</span>
      <span className="font-mono text-[#A3A3A3] whitespace-nowrap">{formatMoneyRange(low, high)}</span>
    </div>
  );
}
