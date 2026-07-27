"use client";

import { useEffect, useState } from "react";
import { getTradeoffData, emailTradeoffPlan } from "../../_lib/actions";
import type { RagLevel } from "../../_lib/scoreTradeoffOptions";
import type { FlightsAdvisory } from "../../_lib/getFlightsAdvisory";
import type { TradeoffResult, TradeoffScenario } from "../../_lib/computeTradeoffScenarios";
import type { TripCommentary } from "../../_lib/getTripCommentary";
import { formatMoneyRange, type CostLineItem } from "../../_lib/mockEvents";

export type EventContext = {
  name: string;
  venue: string;
  dateRange: string;
  slug: string;
  isBuilt: boolean;
};

type TierSummary = { label: string; costLow: number; costHigh: number } | null;

type TradeoffData = {
  hotel: { current: TierSummary };
  tickets: { current: TierSummary };
  scenarioResult: TradeoffResult | null;
  flightsAdvisory: FlightsAdvisory | null;
  tripCommentary: TripCommentary | null;
};

function ragDot(rag: RagLevel) {
  if (rag === "green") return <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#AAFF00]" />;
  if (rag === "amber") return <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />;
  return <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />;
}

function ScenarioCard({
  scenario,
  budgetMax,
  index,
  eventContext,
  resultsUrl,
  userEmail,
  defaultEmail,
  onEmailSent,
}: {
  scenario: TradeoffScenario;
  budgetMax: number;
  index?: number;
  eventContext: EventContext;
  resultsUrl: string;
  userEmail: string | null;
  defaultEmail: string | null;
  onEmailSent: (email: string) => void;
}) {
  const leverEmployed =
    scenario.kind === "both"
      ? `Downgrade Hotel to ${(scenario.option as { hotel: { label: string } }).hotel.label} tier and Downgrade Tickets to ${(scenario.option as { tickets: { label: string } }).tickets.label} tier`
      : scenario.kind === "hotel"
        ? `Downgrade Hotel to ${(scenario.option as { label: string }).label} tier`
        : `Downgrade Tickets to ${(scenario.option as { label: string }).label} tier`;

  // "Both levers" means two compromises were needed (Hotel AND Tickets),
  // not just one — Amber when that combination fits, Red when even both
  // together aren't enough. Green is reserved for a single lever solving
  // it alone. Confirmed 19 Jul 2026: Amber signals "compromise count", not
  // a price-percentage guess at value lost.
  const rag = scenario.kind === "both"
    ? (scenario.fitsBudget ? "amber" : "red")
    : (scenario.option as { rag: RagLevel }).rag;

  // Based on Typical (mid), not low/high — a low/high-derived range produced
  // nonsense like "$0-$695 over" (the low end clamped to 0 when it was
  // actually $471 UNDER budget, not "zero over"), disconnected from the
  // Typical figure shown directly above this line. One number, matching
  // what the reader already anchors on. Fixed 26 Jul 2026.
  const typicalOverage = Math.max(0, Math.round(scenario.newTotalMid) - budgetMax);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState(userEmail ?? defaultEmail ?? "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendEmail = async () => {
    if (!isValidEmail || sending) return;
    setSending(true);
    const guideUrl = eventContext.isBuilt
      ? `${window.location.origin}/event-pack/${eventContext.slug}`
      : resultsUrl;
    await emailTradeoffPlan(
      email,
      eventContext.name,
      eventContext.venue,
      eventContext.dateRange,
      leverEmployed,
      scenario.lineItemBreakdown,
      scenario.newTotalLow,
      scenario.newTotalHigh,
      scenario.newTotalMid,
      budgetMax,
      guideUrl,
      resultsUrl,
      eventContext.isBuilt,
      scenario.fitsBudget
    );
    setSending(false);
    setSent(true);
    onEmailSent(email);
  };

  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#0A0A0A] p-4 mb-3">
      <div className="flex items-start gap-2 mb-3">
        {ragDot(rag)}
        <p className="text-sm font-black text-white">
          Lever employed{index !== undefined ? ` ${index + 1}` : ""}: {leverEmployed}
        </p>
      </div>

      <div className="space-y-1 mb-3 pl-1">
        {scenario.lineItemBreakdown.map((li) => (
          <p key={li.label} className="text-sm text-[#A3A3A3]">
            ▸ {li.label}: {formatMoneyRange(li.low, li.high)}
            <span className="text-xs text-[#6A6A6A]"> ({li.changed ? <strong className="font-black">Updated</strong> : "Unchanged"})</span>
          </p>
        ))}
      </div>

      <p className="text-sm font-black text-white pl-1">
        New estimated trip cost: {formatMoneyRange(scenario.newTotalLow, scenario.newTotalHigh)}
      </p>
      <p className="text-xs text-[#6A6A6A] pl-1 mb-1">
        Typical: ${Math.round(scenario.newTotalMid).toLocaleString()}
      </p>
      {scenario.fitsBudget ? (
        <p className={rag === "amber" ? "text-xs text-amber-400 pl-1 mt-1 mb-3" : "text-xs text-[#AAFF00] pl-1 mt-1 mb-3"}>
          ✓ This fits your ${Math.round(budgetMax).toLocaleString()} budget
        </p>
      ) : (
        <p className="text-xs text-red-500 pl-1 mt-1 mb-3">
          Even with both changes, you&apos;re still ~${typicalOverage.toLocaleString()} over — would you be flexible in considering this enhanced budget?
        </p>
      )}
      {sent ? (
        <p className="text-xs text-[#AAFF00] pl-1">✓ Sent — check your inbox.</p>
      ) : showEmailForm ? (
        // Stacked on mobile — "Send" was pushed off-screen next to the email
        // input on narrow widths. Fixed 26 Jul 2026.
        <div className="flex flex-col sm:flex-row gap-2 pl-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            readOnly={!!userEmail}
            className="flex-1 px-3 py-2 rounded-sm text-sm bg-[#141414] border border-[#2A2A2A] text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00]"
          />
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={!isValidEmail || sending}
            className="px-4 py-2 rounded-sm text-xs font-black bg-[#AAFF00] text-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {sending ? "Sending…" : "Send →"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowEmailForm(true)}
          className="ml-1 px-4 py-2 rounded-sm text-xs font-black bg-[#AAFF00] text-black hover:bg-[#BBFF33] transition-colors"
        >
          Email me this plan →
        </button>
      )}
    </div>
  );
}

export default function TradeoffPanel({
  eventId,
  tripLengthDays,
  timeWindow,
  lineItems,
  budgetMax,
  eventContext,
  resultsUrl,
  userEmail,
  defaultEmail,
  onEmailSent,
}: {
  eventId: string;
  tripLengthDays: number;
  timeWindow: string;
  lineItems: CostLineItem[];
  budgetMax: number;
  eventContext: EventContext;
  resultsUrl: string;
  userEmail: string | null;
  defaultEmail: string | null;
  onEmailSent: (email: string) => void;
}) {
  const [data, setData] = useState<TradeoffData | null>(null);
  const [loading, setLoading] = useState(true);

  const unchangedLineItems = lineItems
    .filter((li) => li.label !== "Hotel" && li.label !== "Tickets")
    .map((li) => ({ label: li.label, low: li.low, high: li.high }));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTradeoffData(eventId, tripLengthDays, timeWindow, unchangedLineItems, budgetMax).then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, tripLengthDays, timeWindow, budgetMax]);

  if (loading) {
    return <p className="text-xs text-[#6A6A6A] mt-4">Loading options…</p>;
  }

  if (!data) {
    return <p className="text-xs text-[#6A6A6A] mt-4">Couldn't load tradeoff options.</p>;
  }

  return (
    <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-4">
        How to make this fit
      </p>

      {data.scenarioResult && data.scenarioResult.scenarios.length > 0 ? (
        data.scenarioResult.scenarios.map((scenario, i) => (
          <ScenarioCard
            key={i}
            scenario={scenario}
            budgetMax={budgetMax}
            index={data.scenarioResult!.scenarios.length > 1 ? i : undefined}
            eventContext={eventContext}
            resultsUrl={resultsUrl}
            userEmail={userEmail}
            defaultEmail={defaultEmail}
            onEmailSent={onEmailSent}
          />
        ))
      ) : (
        /* Only reached when NEITHER hotel nor tickets has any cheaper tier
           at all for this event/destination — a real data-coverage gap, not
           a verified "you're already optimal" claim. Never imply we checked
           and confirmed there's no better deal; state the fact plainly. */
        <p className="text-xs text-[#6A6A6A] mb-4">No cheaper hotel or ticket tier is available for this trip.</p>
      )}

      {data.flightsAdvisory && (
        <div className="mt-5 mb-5">
          <p className="text-sm font-black text-white mb-2">✈️ Flights</p>
          <ul className="pl-5 space-y-2 list-disc marker:text-[#AAFF00]">
            <li className="text-sm text-[#A3A3A3]">{data.flightsAdvisory.sequencingAdvice}</li>
            {data.flightsAdvisory.alternateAirport && (
              <li className="text-sm text-[#A3A3A3]">
                Consider alternate airport ({data.flightsAdvisory.alternateAirport.iata}): {data.flightsAdvisory.alternateAirport.note}
              </li>
            )}
          </ul>
          <p className="text-xs text-[#6A6A6A] mt-2">{data.flightsAdvisory.legalCaveat}</p>
        </div>
      )}

      {data.tripCommentary?.localTravelNote && (
        <div className="mb-5">
          <p className="text-sm font-black text-white mb-2">🚌 Local Travel</p>
          <p className="text-sm text-[#A3A3A3] pl-5">{data.tripCommentary.localTravelNote}</p>
        </div>
      )}

      {data.tripCommentary?.foodNote && (
        <div className="mb-5">
          <p className="text-sm font-black text-white mb-2">🍽️ Food</p>
          <p className="text-sm text-[#A3A3A3] pl-5">{data.tripCommentary.foodNote}</p>
        </div>
      )}

      <p className="text-[11px] text-[#6A6A6A] pt-2 border-t border-[#2A2A2A]">
        Prices shown are indicative for planning purposes — check the event&apos;s official ticketing/booking pages, flight and hotel booking websites for current availability and pricing.
      </p>
    </div>
  );
}
