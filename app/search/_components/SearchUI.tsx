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
} from "react-instantsearch";
import type { Hit } from "instantsearch.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
        <p className="text-neutral-700 font-medium mb-1">No results for &ldquo;{results.query}&rdquo;</p>
        <p className="text-neutral-400 text-sm">Try a different search or remove filters.</p>
      </div>
    );
  }

  return (
    <Hits
      hitComponent={HitCard}
      classNames={{
        root: "",
        list: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5",
        item: "",
      }}
    />
  );
}

function HitCard({ hit }: { hit: ExperienceHit }) {
  return (
    <Link
      href={`/experience/${hit.slug}`}
      className="group rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors block"
    >
      {hit.heroImageUrl ? (
        <div className="h-40 overflow-hidden bg-neutral-100">
          <img
            src={hit.heroImageUrl}
            alt={hit.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-40 bg-neutral-100 flex items-center justify-center">
          <span className="text-xs text-neutral-400 tracking-widest uppercase">
            {TYPE_LABELS[hit.experienceType] ?? hit.experienceType}
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
            {TYPE_LABELS[hit.experienceType] ?? hit.experienceType}
          </span>
          {hit.budgetTier && (
            <span className="text-xs text-neutral-400">{BUDGET_LABELS[hit.budgetTier] ?? hit.budgetTier}</span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors truncate">
          {hit.title}
        </h3>
        {hit.subtitle && (
          <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-5">{hit.subtitle}</p>
        )}
        <p className="mt-2 text-xs text-neutral-400">
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
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">{title}</p>
      {children}
    </div>
  );
}

const refinementClassNames = {
  list: "space-y-1.5",
  item: "",
  label: "flex items-center gap-2 cursor-pointer group/label",
  checkbox: "rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer",
  labelText: "text-sm text-neutral-700 group-hover/label:text-neutral-900 transition-colors flex-1",
  count: "text-xs text-neutral-400 tabular-nums",
  selectedItem: "[&_span]:font-medium [&_span]:text-neutral-900",
};

export function SearchUI({
  appId,
  searchKey,
  indexName,
  initialQuery = "",
  archetype,
  userEmail,
}: {
  appId: string;
  searchKey: string;
  indexName: string;
  initialQuery?: string;
  archetype?: string | null;
  userEmail?: string | null;
}) {
  const searchClient = liteClient(appId, searchKey);

  const optionalFilters: string[] = (() => {
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
  })();

  const router = useRouter();
  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      future={{ preserveSharedStateOnUnmount: true }}
      initialUiState={{ [indexName]: { query: initialQuery ?? "" } }}
    >
      <Configure hitsPerPage={24} {...(optionalFilters.length > 0 ? { optionalFilters } : {})} />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-neutral-100 bg-white sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold tracking-widest text-neutral-400 uppercase hover:text-neutral-600 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Experiences | Curated
            </Link>
            <SearchBox
              placeholder="Search experiences, destinations…"
              classNames={{
                root: "flex-1 max-w-md",
                form: "relative",
                input:
                  "w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent",
                submit: "absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700",
                submitIcon: "w-4 h-4",
                reset: "absolute right-8 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700",
                resetIcon: "w-3.5 h-3.5",
                loadingIndicator: "absolute right-3 top-1/2 -translate-y-1/2",
                loadingIcon: "w-4 h-4 animate-spin text-neutral-400",
              }}
            />
            <Stats
              classNames={{ root: "text-xs text-neutral-400 whitespace-nowrap" }}
              translations={{
                rootElementText: ({ nbHits }) =>
                  `${nbHits.toLocaleString()} result${nbHits !== 1 ? "s" : ""}`,
              }}
            />
            <span className="text-xs text-neutral-400 whitespace-nowrap flex-shrink-0 hidden sm:flex items-center gap-1 ml-auto">
              Free users get 3 reads.{" "}
              <Link href="/pro" className="font-semibold underline underline-offset-2 text-neutral-600 hover:text-neutral-900 transition-colors">Pro</Link>{" "}
              is unlimited.
            </span>
            {userEmail && (
              <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                <p className="text-xs text-neutral-400">{userEmail}</p>
                <button
                  onClick={signOut}
                  className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
          {/* Sidebar filters */}
          <aside className="w-52 flex-shrink-0 hidden md:block space-y-8">
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
            <div className="mt-12 pt-8 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 leading-6">
                Free accounts include 3 experience reads.{" "}
                <Link href="/pro" className="font-semibold text-neutral-600 hover:text-neutral-900 transition-colors underline underline-offset-2">Pro</Link>{" "}
                unlocks unlimited reads, plus booking contacts for concierge picks and sell-out reminders.
              </p>
            </div>
          </main>
        </div>
      </div>
    </InstantSearch>
  );
}
