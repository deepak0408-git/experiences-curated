"use client";

import { useState } from "react";
import Link from "next/link";
import { SPORT_LABELS, TIME_WINDOW_LABELS, sumLineItems, formatMoneyRange, rankEvents, type MockEvent } from "../../../_lib/mockEvents";
import { saveComparison } from "../../../_lib/actions";

// Mobile-only swipeable single-event view — the desktop table's horizontal
// scroll defeats the point of "side by side" comparison on a phone (you
// can only see slivers of each column at once). Swiping between full,
// unsquashed event cards is more usable than a table on narrow screens.
// Desktop keeps the table entirely unchanged — this renders in parallel,
// gated by Tailwind breakpoint (sm:hidden / hidden sm:block), not instead
// of it. Added 26 Jul 2026.
function MobileComparisonSwiper({
  rows,
}: {
  rows: (MockEvent & { totalLow: number; totalHigh: number; isBuilt: boolean })[];
}) {
  const [index, setIndex] = useState(0);
  const row = rows[index];

  return (
    <div className="sm:hidden">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="px-3 py-1.5 rounded-sm text-sm font-black bg-[#141414] border border-[#2A2A2A] text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous event"
        >
          ←
        </button>
        <p className="text-xs text-[#6A6A6A]">
          {index + 1} of {rows.length}
        </p>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(rows.length - 1, i + 1))}
          disabled={index === rows.length - 1}
          className="px-3 py-1.5 rounded-sm text-sm font-black bg-[#141414] border border-[#2A2A2A] text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next event"
        >
          →
        </button>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-1">
          {SPORT_LABELS[row.sport] ?? row.sport}
        </p>
        <p className="text-lg font-black text-white leading-tight">{row.name}</p>
        <p className="text-xs text-[#6A6A6A] mt-0.5 mb-4">{row.city}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
            <span className="text-sm text-[#6A6A6A]">Dates</span>
            <span className="text-sm text-[#A3A3A3]">{row.dateRange}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
            <span className="text-sm text-[#6A6A6A]">Estimated total</span>
            <span className="text-sm text-white font-black">{formatMoneyRange(row.totalLow, row.totalHigh)}</span>
          </div>
          {row.lineItems.map((li) => (
            <div key={li.label} className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
              <span className="text-sm text-[#6A6A6A]">{li.label}</span>
              <span className="text-sm text-[#A3A3A3]">{formatMoneyRange(li.low, li.high)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
            <span className="text-sm text-[#6A6A6A]">Guide status</span>
            <span className="text-sm text-[#A3A3A3]">{row.isBuilt ? "Live pack" : "Guide coming soon"}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#2A2A2A]">
          {row.isBuilt && (
            <Link
              href={`/event-pack/${row.slug}`}
              className="inline-block px-4 py-2 rounded-sm text-xs font-black bg-[#AAFF00] text-black hover:bg-[#BBFF33] transition-colors"
            >
              View guide →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComparisonView({
  events: allEvents,
  slugs,
  userEmail,
  intake,
}: {
  events: MockEvent[];
  slugs: string[];
  userEmail: string | null;
  intake: {
    sports: string[];
    budgetMin: number;
    budgetMax: number;
    timeWindow: "next_3mo" | "next_6mo" | "next_9mo" | "flexible";
    tripLengthDays: number;
    originMarket: string;
  };
}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sort order must match Screen 2 exactly (rankEvents is the single shared
  // source of truth) — previously this just filtered to the raw DB-fetch
  // order, which had no relationship to what the user actually saw/checked
  // on the results list.
  const events = rankEvents(
    allEvents.filter((e) => slugs.includes(e.slug)),
    intake.budgetMin,
    intake.budgetMax
  );

  const sportSummary = intake.sports.map((s) => SPORT_LABELS[s] ?? s).join(", ") || "Any sport";
  const budgetSummary = intake.budgetMax >= 100000 ? "Flexible" : formatMoneyRange(intake.budgetMin, intake.budgetMax);
  const windowSummary = TIME_WINDOW_LABELS[intake.timeWindow] ?? intake.timeWindow;

  // Bug fix (19 Jul 2026): both "Back to shortlist" links previously pointed
  // to a bare /planner/results with no query params, silently discarding the
  // original search (sport/budget/window/trip length/origin) — landing on
  // "Any sport · $0-0 · Nothing matches" instead of the real results. Always
  // reconstruct the full search from `intake`, same pattern used elsewhere
  // in this file for the compare/click-tracking URLs.
  const backToResultsUrl = `/planner/results?${new URLSearchParams({
    sports: intake.sports.join(","),
    budgetMin: String(intake.budgetMin),
    budgetMax: String(intake.budgetMax),
    timeWindow: intake.timeWindow,
    tripLengthDays: String(intake.tripLengthDays),
    originMarket: intake.originMarket,
  }).toString()}`;

  if (events.length < 2) {
    return (
      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16">
        <p className="text-[#A3A3A3] text-sm">
          Pick at least 2 events on your shortlist to compare them here.
        </p>
        <Link href={backToResultsUrl} className="text-sm text-[#AAFF00] hover:underline mt-4 inline-block">
          ← Back to shortlist
        </Link>
      </div>
    );
  }

  const rows = events.map((e) => ({
    ...e,
    totalLow: sumLineItems(e.lineItems, "low"),
    totalHigh: sumLineItems(e.lineItems, "high"),
    isBuilt: e.packStatus === "live" || e.packStatus === "built_hidden",
  }));

  // Find the single biggest delta line item across all compared events
  const lineItemLabels = rows[0].lineItems.map((item) => item.label);
  let biggestDeltaLabel = "";
  let biggestDelta = 0;
  for (const label of lineItemLabels) {
    const mids = rows.map((r) => {
      const item = r.lineItems.find((i) => i.label === label)!;
      return (item.low + item.high) / 2;
    });
    const delta = Math.max(...mids) - Math.min(...mids);
    if (delta > biggestDelta) {
      biggestDelta = delta;
      biggestDeltaLabel = label;
    }
  }
  const highestRow = rows.reduce((a, b) => {
    const aItem = a.lineItems.find((i) => i.label === biggestDeltaLabel)!;
    const bItem = b.lineItems.find((i) => i.label === biggestDeltaLabel)!;
    return (aItem.low + aItem.high) / 2 > (bItem.low + bItem.high) / 2 ? a : b;
  });

  // PlannerSession is email-only by design, same identity model as every
  // other gate action (Save/Notify) — no userId (standing correction).
  const handleSaveComparison = async () => {
    if (!userEmail || saving) return;
    setSaving(true);
    const comparedEventIds = events.map((e) => e.id);
    const emailEvents = rows.map((r) => ({
      name: r.name,
      slug: r.slug,
      sport: r.sport,
      venue: r.venue,
      city: r.city,
      dateRange: r.dateRange,
      totalLow: r.totalLow,
      totalHigh: r.totalHigh,
      lineItems: r.lineItems.map((li) => ({ label: li.label, low: li.low, high: li.high })),
      isBuilt: r.isBuilt,
    }));
    const compareUrl = `${window.location.origin}/planner/results/compare?${new URLSearchParams({
      slugs: slugs.join(","),
      sports: intake.sports.join(","),
      budgetMin: String(intake.budgetMin),
      budgetMax: String(intake.budgetMax),
      timeWindow: intake.timeWindow,
      tripLengthDays: String(intake.tripLengthDays),
      originMarket: intake.originMarket,
    }).toString()}`;
    await saveComparison(userEmail, intake, comparedEventIds, emailEvents, biggestDeltaLabel, highestRow.name, compareUrl);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto px-6 sm:px-8 py-16">
      <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
        Trip Planner
      </p>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Your event comparison
        </h1>
        <Link href={backToResultsUrl} className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors whitespace-nowrap mt-2">
          ← Back to shortlist
        </Link>
      </div>
      <p className="text-[#A3A3A3] text-sm mb-10">
        {sportSummary} · {budgetSummary} · {windowSummary}
        {intake.tripLengthDays ? ` · ${intake.tripLengthDays} day${intake.tripLengthDays === 1 ? "" : "s"}` : ""}
      </p>

      <MobileComparisonSwiper rows={rows} />

      <div className="hidden sm:block overflow-x-auto">
        {/* table-fixed + explicit col widths — a long venue string previously
            pushed one column wide and squeezed the others unevenly. Fixed
            layout keeps every event column the same width regardless of
            content length. */}
        <table className="w-full min-w-[600px] text-sm border-collapse table-fixed">
          <colgroup>
            <col className="w-32" />
            {rows.map((r) => (
              <col key={r.slug} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="text-left py-2 pr-4 text-xs font-semibold tracking-widest uppercase text-[#6A6A6A]"></th>
              {rows.map((r) => (
                <th key={r.slug} className="text-left py-2 px-4 text-xs font-semibold tracking-widest uppercase text-[#AAFF00] align-top">
                  {SPORT_LABELS[r.sport] ?? r.sport}
                  <div className="text-white text-sm font-black normal-case tracking-normal mt-1 leading-tight">{r.name}</div>
                  <div className="text-[#6A6A6A] text-xs font-normal normal-case tracking-normal mt-0.5">{r.city}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#2A2A2A]">
              <td className="py-3 pr-4 text-[#6A6A6A]">Dates</td>
              {rows.map((r) => (
                <td key={r.slug} className="py-3 px-4 text-[#A3A3A3]">{r.dateRange}</td>
              ))}
            </tr>
            <tr className="border-t border-[#2A2A2A]">
              <td className="py-3 pr-4 text-[#6A6A6A]">Estimated total</td>
              {rows.map((r) => (
                <td key={r.slug} className="py-3 px-4 text-white font-black">
                  {formatMoneyRange(r.totalLow, r.totalHigh)}
                </td>
              ))}
            </tr>
            {rows[0].lineItems.map((_, i) => (
              <tr key={i} className="border-t border-[#2A2A2A]">
                <td className="py-3 pr-4 text-[#6A6A6A]">{rows[0].lineItems[i].label}</td>
                {rows.map((r) => (
                  <td key={r.slug} className="py-3 px-4 text-[#A3A3A3]">
                    {formatMoneyRange(r.lineItems[i].low, r.lineItems[i].high)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-[#2A2A2A]">
              <td className="py-3 pr-4 text-[#6A6A6A]">Guide status</td>
              {rows.map((r) => (
                <td key={r.slug} className="py-3 px-4 text-[#A3A3A3]">
                  {r.isBuilt ? "Live pack" : "Guide coming soon"}
                </td>
              ))}
            </tr>
            <tr className="border-t border-[#2A2A2A]">
              <td className="py-3 pr-4"></td>
              {rows.map((r) => (
                <td key={r.slug} className="py-3 px-4">
                  {r.isBuilt && (
                    <Link
                      href={`/event-pack/${r.slug}`}
                      className="inline-block px-4 py-2 rounded-sm text-xs font-black bg-[#AAFF00] text-black hover:bg-[#BBFF33] transition-colors"
                    >
                      View guide →
                    </Link>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {biggestDeltaLabel && (
        <p className="mt-8 text-sm text-[#A3A3A3]">
          💡 The main difference is {biggestDeltaLabel.toLowerCase()} — {highestRow.name}&apos;s is {rows.length > 2 ? "the highest" : "higher"}.
        </p>
      )}

      <div className="mt-10 pt-6 border-t border-[#2A2A2A] flex justify-center">
        {userEmail ? (
          saved ? (
            <p className="text-sm text-[#AAFF00]">✓ Comparison saved to your account — check your inbox</p>
          ) : (
            <button
              type="button"
              onClick={handleSaveComparison}
              disabled={saving}
              className="px-6 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save this comparison to your account"}
            </button>
          )
        ) : (
          <Link
            href={`/sign-in?next=${encodeURIComponent(
              `/planner/results/compare?${new URLSearchParams({
                slugs: slugs.join(","),
                sports: intake.sports.join(","),
                budgetMin: String(intake.budgetMin),
                budgetMax: String(intake.budgetMax),
                timeWindow: intake.timeWindow,
                tripLengthDays: String(intake.tripLengthDays),
                originMarket: intake.originMarket,
              }).toString()}`
            )}`}
            className="px-6 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
          >
            Keep this comparison — sign in →
          </Link>
        )}
      </div>
    </div>
  );
}
