"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GateModal, { type GateTrigger } from "./GateModal";
import TradeoffPanel from "./TradeoffPanel";
import { SPORT_LABELS, TIME_WINDOW_LABELS, formatMoneyRange, rankEvents, type MockEvent } from "../../_lib/mockEvents";
import { saveShortlist, notifyMe } from "../../_lib/actions";

// Interim per-event hero image focal-point override, keyed by slug — same
// hardcoded-slug-check pattern already used for experiences (no
// heroImagePosition field exists on sportingEvents or experiences yet, see
// Operations Checklist). Only needed when object-cover's default centering
// crops something that matters (e.g. cuts off the subject's upper body).
const HERO_IMAGE_POSITION: Record<string, string> = {
  "england-in-south-africa-cricket-2026-27": "center 75%",
};

export default function ShortlistResults({
  events,
  sports,
  budgetMin,
  budgetMax,
  timeWindow,
  tripLengthDays,
  originMarket,
  userEmail,
  initialTradeoffSlug,
}: {
  events: MockEvent[];
  sports: string[];
  budgetMin: number;
  budgetMax: number;
  timeWindow: string;
  tripLengthDays: number;
  originMarket: string;
  userEmail: string | null;
  // Set from ?tradeoff=<slug> on the results URL — lets a link (e.g. from
  // the tradeoff email, which previously had no way back to this exact
  // view) land directly on the panel already expanded, instead of the user
  // having to re-find the event card and click "See how to make this fit"
  // again. Added 26 Jul 2026.
  initialTradeoffSlug?: string | null;
}) {
  const router = useRouter();
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [tradeoffSlug, setTradeoffSlug] = useState<string | null>(initialTradeoffSlug ?? null);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [gateTrigger, setGateTrigger] = useState<GateTrigger | null>(null);
  const [notifyEventId, setNotifyEventId] = useState<string | null>(null);
  const [lastUsedEmail, setLastUsedEmail] = useState<string | null>(null);

  // Time-window filter — previously never applied anywhere, so e.g.
  // Australian Open 2027 (~6 months out) showed up under "Next 3 months."
  // Rule: event's startDate must fall within the window from today.
  // "flexible" applies no date constraint at all.
  const now = new Date();
  const windowMonths = timeWindow === "next_3mo" ? 3 : timeWindow === "next_6mo" ? 6 : timeWindow === "next_9mo" ? 9 : null;
  const windowEnd = windowMonths !== null ? new Date(now.getFullYear(), now.getMonth() + windowMonths, now.getDate()) : null;

  const filtered = events
    .filter((e) => sports.length === 0 || sports.includes(e.sport))
    .filter((e) => {
      if (windowEnd === null) return true;
      const eventStart = new Date(e.startDate);
      return eventStart >= now && eventStart <= windowEnd;
    });

  // Ranking (budget-fit + sort) lives in rankEvents() (mockEvents.ts) — single
  // source of truth shared with the Compare screen, so the two can never show
  // events in a different order from each other.
  const matching = rankEvents(filtered, budgetMin, budgetMax).slice(0, 5);

  const maxCompare = Math.min(matching.length, 3);
  const compareLimitReached = compareSlugs.length >= maxCompare;

  const intake = {
    sports,
    budgetMin,
    budgetMax,
    timeWindow: timeWindow as "next_3mo" | "next_6mo" | "next_9mo" | "flexible",
    tripLengthDays,
    originMarket,
  };

  const handleGateSubmit = async (email: string) => {
    if (!gateTrigger) return;
    const shortlistedEventIds = matching.map((e) => e.id);
    if (gateTrigger.kind === "saved") {
      const params = new URLSearchParams({
        sports: sports.join(","),
        budgetMin: String(budgetMin),
        budgetMax: String(budgetMax),
        timeWindow,
        tripLengthDays: String(tripLengthDays),
        originMarket,
      });
      const resultsUrl = `${window.location.origin}/planner/results?${params.toString()}`;
      const emailEvents = matching.map((e) => ({
        name: e.name,
        venue: e.venue,
        dateRange: e.dateRange,
        totalLow: e.totalLow,
        totalHigh: e.totalHigh,
        lineItems: e.lineItems.map((li) => ({ label: li.label, low: li.low, high: li.high })),
      }));
      // buildSummaryLine() now runs server-side in saveShortlist() itself
      // (actions.ts), from the same `intake` already being passed — keeps
      // this in sync with saveComparison's identical pattern instead of
      // each call site building its own copy of the summary-line logic.
      await saveShortlist(email, intake, shortlistedEventIds, emailEvents, resultsUrl);
    } else if (gateTrigger.kind === "notified" && notifyEventId) {
      await notifyMe(email, intake, shortlistedEventIds, notifyEventId);
    }
    setLastUsedEmail(email);
  };

  const sportSummary = sports.map((s) => SPORT_LABELS[s] ?? s).join(", ") || "Any sport";
  const budgetSummary = budgetMax >= 100000 ? "Flexible" : formatMoneyRange(budgetMin, budgetMax);
  const windowSummary = TIME_WINDOW_LABELS[timeWindow] ?? timeWindow;

  const toggleCompare = (slug: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= maxCompare) return prev;
      return [...prev, slug];
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
        Trip Planner
      </p>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Here&apos;s what fits your budget
        </h1>
        <Link href="/planner" className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors whitespace-nowrap mt-2">
          ← Back to search
        </Link>
      </div>
      <p className="text-[#A3A3A3] text-sm mb-2">
        {sportSummary} · {budgetSummary} · {windowSummary}
        {tripLengthDays ? ` · ${tripLengthDays} day${tripLengthDays === 1 ? "" : "s"}` : ""}
      </p>
      <Link href="/planning-methodology" className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors underline underline-offset-2 mb-10 inline-block">
        How we estimate these costs
      </Link>

      {matching.length === 0 && (
        <p className="text-[#A3A3A3] text-sm">
          Nothing matches yet — try a wider budget or a different time window.
        </p>
      )}

      <div className="space-y-4">
        {matching.map((event, index) => {
          const isExpanded = expandedSlug === event.slug;
          const isBuilt = event.packStatus === "live" || event.packStatus === "built_hidden";
          const overage = Math.max(0, event.totalMid - budgetMax);

          return (
            <div key={event.slug} className="rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden">
              {event.heroImageUrl && (
                <div className="relative h-40 w-full">
                  <Image
                    src={event.heroImageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                    style={{ objectPosition: HERO_IMAGE_POSITION[event.slug] ?? "center" }}
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">
                    {SPORT_LABELS[event.sport] ?? event.sport}
                  </p>
                  {/* Badge stacks above the link/button on mobile instead of
                      sharing a row — "Guide coming soon" + "Notify me when
                      it's ready" together were too wide for a phone screen
                      and wrapped badly mid-word. Fixed 26 Jul 2026. */}
                  <div className="flex flex-col sm:flex-row sm:items-center items-end gap-1.5 sm:gap-3">
                    {isBuilt && index === 0 && (
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-black uppercase bg-[#AAFF00] text-black whitespace-nowrap">
                        Best fit
                      </span>
                    )}
                    {!isBuilt && (
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-black uppercase bg-[#1A1A1A] border border-[#2A2A2A] text-[#AAFF00] whitespace-nowrap">
                        Guide coming soon
                      </span>
                    )}
                    {isBuilt ? (
                      <Link
                        href={`/event-pack/${event.slug}`}
                        className="text-xs font-black text-[#AAFF00] hover:text-[#BBFF33] transition-colors whitespace-nowrap"
                      >
                        View full guide →
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setNotifyEventId(event.id);
                          setGateTrigger({ kind: "notified", eventName: event.name });
                        }}
                        className="text-xs font-black text-[#AAFF00] hover:text-[#BBFF33] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Notify me when it&apos;s ready →
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="text-lg font-black text-white mb-1">{event.name}</h2>
                {/* Venue and dates split to separate lines on mobile — a
                    long venue string (e.g. "Marina Bay Street Circuit,
                    Singapore") wrapped mid-word when sharing an inline
                    line with the date range. Desktop unchanged. Fixed
                    26 Jul 2026. */}
                <p className="text-sm text-[#6A6A6A] mb-4">
                  <span className="block sm:inline">{event.venue}</span>
                  <span className="hidden sm:inline"> · </span>
                  <span className="block sm:inline">{event.dateRange}</span>
                </p>

                <p className="text-base font-black text-white mb-1">
                  Estimated trip cost: {formatMoneyRange(event.totalLow, event.totalHigh)}
                </p>
                <p className="text-xs text-[#6A6A6A] mb-1">
                  Typical: US${Math.round(event.totalMid).toLocaleString()}
                </p>

                {overage > 0 ? (
                  <p className="text-xs text-red-500 mb-4">
                    US${Math.round(overage).toLocaleString()} over your budget
                  </p>
                ) : (
                  <p className="text-xs text-[#AAFF00] mb-4">✓ Fits your budget</p>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedSlug(isExpanded ? null : event.slug)}
                  className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors mb-4"
                >
                  {isExpanded ? "Hide breakdown ▴" : "Show breakdown ▾"}
                </button>

                {isExpanded && (
                  <div className="space-y-1 mb-4 pl-1">
                    {event.lineItems.map((item) => (
                      <p key={item.label} className="text-sm text-[#A3A3A3]">
                        ▸ {item.label}: {formatMoneyRange(item.low, item.high)}
                        {item.qualifier && <span className="text-xs text-[#6A6A6A]"> ({item.qualifier})</span>}
                      </p>
                    ))}
                    <p className="text-[11px] text-[#6A6A6A] pt-2">
                      Prices shown are indicative for planning purposes — check the event&apos;s official ticketing/booking pages, flight and hotel booking websites for current availability and pricing.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {overage > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const opening = tradeoffSlug !== event.slug;
                        setTradeoffSlug(opening ? event.slug : null);
                        // Compare must never show stale (un-optimized) prices
                        // while a tradeoff scenario is being reviewed for this
                        // event — uncheck it if it was already selected.
                        if (opening && compareSlugs.includes(event.slug)) {
                          setCompareSlugs((prev) => prev.filter((s) => s !== event.slug));
                        }
                      }}
                      className="px-4 py-2 rounded-sm text-sm font-black bg-[#AAFF00] text-black hover:bg-[#BBFF33] transition-colors whitespace-nowrap"
                    >
                      {tradeoffSlug === event.slug ? (
                        "Hide tradeoff options ▴"
                      ) : (
                        <>
                          <span className="sm:hidden">Help me fit →</span>
                          <span className="hidden sm:inline">See how to make this fit →</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span />
                  )}
                  {matching.length > 1 && (() => {
                    const tradeoffOpenHere = tradeoffSlug === event.slug;
                    const compareDisabled =
                      tradeoffOpenHere || (compareLimitReached && !compareSlugs.includes(event.slug));
                    const disabledTitle = tradeoffOpenHere
                      ? "Comparison unavailable while reviewing tradeoff options"
                      : compareLimitReached && !compareSlugs.includes(event.slug)
                        ? `Compare up to ${maxCompare} event${maxCompare === 1 ? "" : "s"}`
                        : undefined;
                    return (
                      <label
                        className={
                          compareDisabled
                            ? "flex items-center gap-2 text-xs text-[#6A6A6A] opacity-40 cursor-not-allowed"
                            : "flex items-center gap-2 text-xs text-[#6A6A6A] cursor-pointer"
                        }
                        title={disabledTitle}
                      >
                        <input
                          type="checkbox"
                          checked={compareSlugs.includes(event.slug)}
                          disabled={compareDisabled}
                          onChange={() => toggleCompare(event.slug)}
                          className="accent-[#AAFF00] disabled:cursor-not-allowed"
                        />
                        Compare
                      </label>
                    );
                  })()}
                </div>

                {tradeoffSlug === event.slug && (
                  <TradeoffPanel
                    eventId={event.id}
                    tripLengthDays={tripLengthDays}
                    timeWindow={timeWindow}
                    lineItems={event.lineItems}
                    budgetMax={budgetMax}
                    eventContext={{
                      name: event.name,
                      venue: event.venue,
                      dateRange: event.dateRange,
                      slug: event.slug,
                      isBuilt,
                    }}
                    // Lets the tradeoff email always include a working "back
                    // to your plan" link, independent of whether the pack is
                    // built yet — previously the email's only link was the
                    // event pack itself, which didn't exist for unbuilt
                    // packs, leaving no way back at all. Added 26 Jul 2026.
                    // `window` is unavailable during SSR — this panel can be
                    // open on first render (via ?tradeoff=<slug>), unlike the
                    // other window.location.origin usage in this file, which
                    // only runs inside a click handler after hydration.
                    resultsUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/planner/results?${new URLSearchParams({
                      sports: sports.join(","),
                      budgetMin: String(budgetMin),
                      budgetMax: String(budgetMax),
                      timeWindow,
                      tripLengthDays: String(tripLengthDays),
                      originMarket,
                      tradeoff: event.slug,
                    }).toString()}`}
                    userEmail={userEmail}
                    defaultEmail={lastUsedEmail}
                    onEmailSent={(email) => setLastUsedEmail(email)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {matching.length > 0 && (
        <div className="mt-10 pt-6 border-t border-[#2A2A2A] flex justify-center">
        <button
          type="button"
          onClick={() =>
            setGateTrigger({
              kind: "saved",
              summaryLine: `${sportSummary} · ${budgetSummary} · ${windowSummary}${tripLengthDays ? ` · ${tripLengthDays} days` : ""}`,
            })
          }
          className="px-6 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
        >
          Save this shortlist
        </button>
        </div>
      )}

      {compareSlugs.length >= 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#2A2A2A] py-4 z-40">
          <div className="max-w-2xl mx-auto px-6 sm:px-8 flex items-center justify-end gap-4">
            <p className="text-sm text-[#A3A3A3] whitespace-nowrap">
              <span className="sm:hidden">{compareSlugs.length} of {maxCompare} selected</span>
              <span className="hidden sm:inline">
                {compareLimitReached
                  ? `${maxCompare} of ${maxCompare} selected — max reached`
                  : `${compareSlugs.length} of ${maxCompare} selected`}
              </span>
            </p>
            <button
              type="button"
              disabled={compareSlugs.length < 2}
              onClick={() => {
                const params = new URLSearchParams({
                  slugs: compareSlugs.join(","),
                  sports: sports.join(","),
                  budgetMin: String(budgetMin),
                  budgetMax: String(budgetMax),
                  timeWindow,
                  tripLengthDays: String(tripLengthDays),
                  originMarket,
                });
                router.push(`/planner/results/compare?${params.toString()}`);
              }}
              className="px-6 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#AAFF00]"
            >
              Compare ({compareSlugs.length})
            </button>
          </div>
        </div>
      )}

      {gateTrigger && (
        <GateModal
          trigger={gateTrigger}
          onClose={() => setGateTrigger(null)}
          onSubmit={handleGateSubmit}
          userEmail={userEmail}
          defaultEmail={lastUsedEmail}
        />
      )}
    </div>
  );
}
