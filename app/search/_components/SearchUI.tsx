"use client";

import { liteClient } from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Stats,
  Configure,
  useInstantSearch,
  useClearRefinements,
} from "react-instantsearch";
import type { Hit } from "instantsearch.js";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

type ExperienceHit = Hit<{
  title: string;
  subtitle?: string;
  slug: string;
  experienceType: string;
  heroImageUrl?: string;
  budgetTier?: string;
  pace?: string;
  neighborhood?: string;
  destinationName: string;
  destinationCountry: string;
}>;

const TYPE_LABELS: Record<string, string> = {
  activity: "Activity",
  dining: "Dining",
  accommodation: "Stay",
  cultural_site: "Cultural Site",
  natural_wonder: "Natural Wonder",
  neighborhood: "Neighbourhood",
  day_trip: "Day Trip",
  multi_day: "Multi-day",
  sports_venue: "Sports Venue",
  fan_experience: "Fan Experience",
  transit: "Transit",
  event: "Event",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Mid-range",
  splurge: "Splurge",
  luxury: "Luxury",
};

const PACE_LABELS: Record<string, string> = {
  slow: "Slow",
  moderate: "Moderate",
  active: "Active",
  intense: "Intense",
};

const SPORT_LABELS: Record<string, string> = {
  formula_one: "Formula 1",
  tennis: "Tennis",
  cricket: "Cricket",
  football: "Football",
  rugby: "Rugby",
  golf: "Golf",
  cycling: "Cycling",
  athletics: "Athletics",
  other: "Other",
};

function transformSportItems(items: { label: string; value: string; count: number; isRefined: boolean }[]) {
  return items.map((item) => ({ ...item, label: SPORT_LABELS[item.label] ?? item.label }));
}

function transformTypeItems(items: { label: string; value: string; count: number; isRefined: boolean }[]) {
  return items.map((item) => ({ ...item, label: TYPE_LABELS[item.label] ?? item.label }));
}

function transformBudgetItems(items: { label: string; value: string; count: number; isRefined: boolean }[]) {
  return items.map((item) => ({ ...item, label: BUDGET_LABELS[item.label] ?? item.label }));
}

function transformPaceItems(items: { label: string; value: string; count: number; isRefined: boolean }[]) {
  return items.map((item) => ({ ...item, label: PACE_LABELS[item.label] ?? item.label }));
}

function HitsOrEmpty() {
  const { results } = useInstantSearch();
  const noResults = (results?.nbHits ?? 0) === 0;

  if (noResults) {
    return (
      <div className="py-20 text-center">
        <p className="text-white font-black mb-1">{results.query ? <>No results for &ldquo;{results.query}&rdquo;</> : "No results"}</p>
        <p className="text-[#6A6A6A] text-sm">Try a different search or remove filters.</p>
      </div>
    );
  }

  return (
    <Hits
      hitComponent={HitCard}
      classNames={{
        root: "",
        list: "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5",
        item: "",
      }}
    />
  );
}

function HitCard({ hit }: { hit: ExperienceHit }) {
  return (
    <Link
      href={`/experience/${hit.slug}`}
      className="group rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden hover:border-[#AAFF00] transition-colors block"
    >
      {hit.heroImageUrl ? (
        <div className="relative h-32 sm:h-40 overflow-hidden bg-[#1A1A1A]">
          <Image
            src={hit.heroImageUrl}
            alt={hit.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-32 sm:h-40 bg-[#1A1A1A] flex items-center justify-center">
          <span className="text-xs text-[#6A6A6A] tracking-widest uppercase">
            {TYPE_LABELS[hit.experienceType] ?? hit.experienceType}
          </span>
        </div>
      )}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A]">
            {TYPE_LABELS[hit.experienceType] ?? hit.experienceType}
          </span>
          {hit.budgetTier && (
            <span className="text-xs text-[#6A6A6A]">{BUDGET_LABELS[hit.budgetTier] ?? hit.budgetTier}</span>
          )}
        </div>
        <h3 className="text-sm font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors truncate">
          {hit.title}
        </h3>
        {hit.subtitle && (
          <p className="mt-1 text-xs text-[#A3A3A3] line-clamp-2 leading-5">{hit.subtitle}</p>
        )}
        <p className="mt-2 text-xs text-[#6A6A6A]">
          {hit.destinationName}
          {hit.neighborhood ? ` · ${hit.neighborhood}` : ""}
        </p>
      </div>
    </Link>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">{title}</p>
      {children}
    </div>
  );
}

const refinementClassNames = {
  list: "space-y-1.5",
  item: "",
  label: "flex items-center gap-2 cursor-pointer group/label",
  checkbox: "rounded-sm border-[#3A3A3A] text-[#AAFF00] focus:ring-[#AAFF00] cursor-pointer bg-[#1A1A1A]",
  labelText: "text-sm text-[#A3A3A3] group-hover/label:text-white transition-colors flex-1",
  count: "text-xs text-[#6A6A6A] tabular-nums",
  selectedItem: "[&_span]:font-black [&_span]:text-white",
};

function useActiveFilterCount() {
  const { indexUiState } = useInstantSearch();
  const refinements = indexUiState.refinementList ?? {};
  return Object.values(refinements).reduce((sum, vals) => sum + (vals?.length ?? 0), 0);
}

function MobileFilterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { refine: clearAll } = useClearRefinements();
  const activeCount = useActiveFilterCount();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-[#141414] rounded-t-sm max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
          <p className="text-sm font-black text-white">
            Search & Filter{activeCount > 0 ? ` · ${activeCount} active` : ""}
          </p>
          <div className="flex items-center gap-4">
            {activeCount > 0 && (
              <button
                onClick={() => clearAll()}
                className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            )}
            <button onClick={onClose} className="text-[#6A6A6A] hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-7">
          {/* Search inside drawer on mobile */}
          <SearchBox
            placeholder="Search experiences, destinations…"
            classNames={{
              root: "",
              form: "relative",
              input: "w-full rounded-sm border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-2.5 pr-10 text-sm text-white placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#AAFF00]",
              submit: "absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A6A] hover:text-[#AAFF00]",
              submitIcon: "w-4 h-4",
              reset: "absolute right-8 top-1/2 -translate-y-1/2 text-[#6A6A6A] hover:text-white",
              resetIcon: "w-3.5 h-3.5",
              loadingIndicator: "absolute right-3 top-1/2 -translate-y-1/2",
              loadingIcon: "w-4 h-4 animate-spin text-[#6A6A6A]",
            }}
          />
          <FilterSection title="Sport">
            <RefinementList attribute="sport" sortBy={["name:asc"]} transformItems={transformSportItems as any} classNames={refinementClassNames} />
          </FilterSection>
          <FilterSection title="Destination">
            <RefinementList attribute="destinationName" sortBy={["name:asc"]} classNames={refinementClassNames} />
          </FilterSection>
          <FilterSection title="Type">
            <RefinementList attribute="experienceType" sortBy={["name:asc"]} transformItems={transformTypeItems as any} classNames={refinementClassNames} />
          </FilterSection>
          <FilterSection title="Budget">
            <RefinementList attribute="budgetTier" sortBy={["name:asc"]} transformItems={transformBudgetItems as any} classNames={refinementClassNames} />
          </FilterSection>
          <FilterSection title="Pace">
            <RefinementList attribute="pace" sortBy={["name:asc"]} transformItems={transformPaceItems as any} classNames={refinementClassNames} />
          </FilterSection>
        </div>
        <div className="px-5 py-4 border-t border-[#2A2A2A]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileFilterButton({ onOpen }: { onOpen: () => void }) {
  const activeCount = useActiveFilterCount();
  return (
    <button
      onClick={onOpen}
      className={`md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-semibold transition-colors flex-shrink-0 ${
        activeCount > 0
          ? "border-[#AAFF00] bg-[#AAFF00] text-black"
          : "border-[#2A2A2A] text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00]"
      }`}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      Search & Filter{activeCount > 0 ? ` · ${activeCount}` : ""}
    </button>
  );
}

export function SearchUI({
  appId,
  searchKey,
  indexName,
  initialQuery = "",
  initialSport = "",
  archetype,
  userEmail,
  hideProCtas = false,
  wimbledonOnly = false,
}: {
  appId: string;
  searchKey: string;
  indexName: string;
  initialQuery?: string;
  initialSport?: string;
  archetype?: string | null;
  userEmail?: string | null;
  hideProCtas?: boolean;
  wimbledonOnly?: boolean;
}) {
  const searchClient = useMemo(() => liteClient(appId, searchKey), [appId, searchKey]);

  const optionalFilters = useMemo<string[]>(() => {
    if (archetype === "pilgrim" || archetype === "first_pilgrim") {
      return ["experienceType:sports_venue<score=2>", "experienceType:fan_experience<score=2>"];
    }
    if (archetype === "connoisseur") {
      return ["budgetTier:luxury<score=2>", "budgetTier:splurge<score=2>", "curationTier:editorial<score=1>"];
    }
    if (archetype === "immersionist") {
      return ["experienceType:neighborhood<score=2>", "experienceType:dining<score=2>", "experienceType:activity<score=1>"];
    }
    return [];
  }, [archetype]);

  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      future={{ preserveSharedStateOnUnmount: true }}
      initialUiState={{ [indexName]: { query: initialQuery ?? "", ...(initialSport ? { refinementList: { sport: [initialSport] } } : {}) } }}
    >
      <Configure
        hitsPerPage={50}
        {...(optionalFilters.length > 0 ? { optionalFilters } : {})}
        {...(wimbledonOnly ? { filters: 'sport:"tennis" AND destinationId:"75758888-28b9-4e09-82ba-f05681ecc904"' } : {})}
      />

      <div className="min-h-screen bg-[#0A0A0A]">
        {/* Mobile filter drawer */}
        <MobileFilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />

        {/* Header */}
        <div className="border-b border-[#2A2A2A] bg-[#0A0A0A] sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 sm:gap-6 min-w-0">
            <Link
              href="/"
              className="text-xs sm:text-sm font-black tracking-widest text-[#6A6A6A] uppercase hover:text-[#AAFF00] transition-colors whitespace-nowrap flex-shrink-0"
            >
              Experiences | Curated
            </Link>
            <SearchBox
              placeholder="Search experiences, destinations…"
              classNames={{
                root: "hidden md:block flex-1 max-w-md",
                form: "relative",
                input:
                  "w-full rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-2.5 pr-10 text-sm text-white placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#AAFF00]",
                submit: "absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6A6A] hover:text-[#AAFF00]",
                submitIcon: "w-4 h-4",
                reset: "absolute right-8 top-1/2 -translate-y-1/2 text-[#6A6A6A] hover:text-white",
                resetIcon: "w-3.5 h-3.5",
                loadingIndicator: "absolute right-3 top-1/2 -translate-y-1/2",
                loadingIcon: "w-4 h-4 animate-spin text-[#6A6A6A]",
              }}
            />
            <Stats
              classNames={{ root: "hidden md:block text-xs text-[#6A6A6A] whitespace-nowrap" }}
              translations={{
                rootElementText: ({ nbHits }) =>
                  `${nbHits.toLocaleString()} result${nbHits !== 1 ? "s" : ""}`,
              }}
            />
            <div className="flex-1 md:hidden" />
            <MobileFilterButton onOpen={() => setFilterOpen(true)} />
            {!hideProCtas && (
              <span className="text-xs text-[#6A6A6A] whitespace-nowrap flex-shrink-0 hidden sm:flex items-center gap-1 ml-auto">
                Free users get 3 reads.{" "}
                <Link href="/pro" className="font-semibold underline underline-offset-2 text-[#AAFF00] hover:text-white transition-colors">Pro</Link>{" "}
                is unlimited.
              </span>
            )}
            {userEmail && (
              <Link
                href="/profile"
                className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#2A2A2A] text-white text-xs font-black uppercase flex-shrink-0 hover:bg-[#AAFF00] hover:text-black transition-colors"
                aria-label="Profile"
                title={userEmail}
              >
                {userEmail[0]}
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-8 min-w-0">
          {/* Sidebar filters */}
          <aside className="w-52 flex-shrink-0 hidden md:block space-y-8">
            <FilterSection title="Sport">
              <RefinementList
                attribute="sport"
                sortBy={["name:asc"]}
                transformItems={transformSportItems as any}
                classNames={refinementClassNames}
              />
            </FilterSection>

            <FilterSection title="Destination">
              <RefinementList
                attribute="destinationName"
                sortBy={["name:asc"]}
                classNames={refinementClassNames}
              />
            </FilterSection>

            <FilterSection title="Type">
              <RefinementList
                attribute="experienceType"
                sortBy={["name:asc"]}
                transformItems={transformTypeItems as any}
                classNames={refinementClassNames}
              />
            </FilterSection>

            <FilterSection title="Budget">
              <RefinementList
                attribute="budgetTier"
                sortBy={["name:asc"]}
                transformItems={transformBudgetItems as any}
                classNames={refinementClassNames}
              />
            </FilterSection>

            <FilterSection title="Pace">
              <RefinementList
                attribute="pace"
                sortBy={["name:asc"]}
                transformItems={transformPaceItems as any}
                classNames={refinementClassNames}
              />
            </FilterSection>
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            <HitsOrEmpty />
            {!hideProCtas && (
              <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
                <p className="text-xs text-[#6A6A6A] leading-6">
                  Free accounts include 3 experience reads.{" "}
                  <Link href="/pro" className="font-semibold text-[#AAFF00] hover:text-white transition-colors underline underline-offset-2">Pro</Link>{" "}
                  unlocks unlimited reads, plus booking contacts for concierge picks and sell-out reminders.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </InstantSearch>
  );
}
