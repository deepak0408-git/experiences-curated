"use server";

import { db } from "@/lib/db";
import { plannerSessions, sportingEvents } from "@/schema/database";
import type { sportEnum } from "@/schema/database";
import { eq } from "drizzle-orm";
import { getTradeoffOptions } from "./getTradeoffOptions";
import { scoreTierOptions } from "./scoreTradeoffOptions";
import { getFlightsAdvisory } from "./getFlightsAdvisory";
import { computeTradeoffScenarios } from "./computeTradeoffScenarios";
import { getTripCommentary } from "./getTripCommentary";
import { sendShortlistEmail, sendTradeoffPlanEmail, sendComparisonEmail, type ShortlistEmailEvent, type TradeoffEmailLineItem, type ComparisonEmailEvent } from "./sendPlannerEmails";
import { buildSummaryLine } from "./mockEvents";

type PlannerSport = (typeof sportEnum.enumValues)[number];

type PlannerIntake = {
  sports: string[];
  budgetMin: number;
  budgetMax: number;
  timeWindow: "next_3mo" | "next_6mo" | "next_9mo" | "flexible";
  tripLengthDays: number;
  originMarket: string;
};

export async function saveShortlist(
  email: string,
  intake: PlannerIntake,
  shortlistedEventIds: string[],
  events: ShortlistEmailEvent[],
  resultsUrl: string
) {
  await db.insert(plannerSessions).values({
    email,
    sports: intake.sports as PlannerSport[],
    budgetMin: String(intake.budgetMin),
    budgetMax: String(intake.budgetMax),
    timeWindow: intake.timeWindow,
    tripLengthDays: intake.tripLengthDays,
    originMarket: intake.originMarket,
    shortlistedEventIds,
    gateAction: "saved",
    gateActionEventIds: shortlistedEventIds,
  });

  try {
    await sendShortlistEmail(email, buildSummaryLine(intake), events, resultsUrl);
  } catch (err) {
    console.error("[planner] failed to send shortlist email", err);
  }
}

export async function notifyMe(
  email: string,
  intake: PlannerIntake,
  shortlistedEventIds: string[],
  notifyEventId: string
) {
  await db.insert(plannerSessions).values({
    email,
    sports: intake.sports as PlannerSport[],
    budgetMin: String(intake.budgetMin),
    budgetMax: String(intake.budgetMax),
    timeWindow: intake.timeWindow,
    tripLengthDays: intake.tripLengthDays,
    originMarket: intake.originMarket,
    shortlistedEventIds,
    gateAction: "notified",
    gateActionEventIds: [notifyEventId],
  });
}

export async function saveComparison(
  email: string,
  intake: PlannerIntake,
  comparedEventIds: string[],
  events: ComparisonEmailEvent[],
  biggestDeltaLabel: string,
  highestEventName: string,
  compareUrl: string
) {
  await db.insert(plannerSessions).values({
    email,
    sports: intake.sports as PlannerSport[],
    budgetMin: String(intake.budgetMin),
    budgetMax: String(intake.budgetMax),
    timeWindow: intake.timeWindow,
    tripLengthDays: intake.tripLengthDays,
    originMarket: intake.originMarket,
    shortlistedEventIds: comparedEventIds,
    gateAction: "compared",
    gateActionEventIds: comparedEventIds,
  });

  try {
    await sendComparisonEmail(email, events, biggestDeltaLabel, highestEventName, compareUrl, buildSummaryLine(intake));
  } catch (err) {
    console.error("[saveComparison] failed to send comparison email", err);
  }
}

// Email-my-plan — one email per fitting ScenarioCard, captured at the
// moment a user finds a scenario that works (confirmed 19 Jul 2026: "email
// my shortlisted options after tradeoff", scoped to one event + one
// scenario per email, no batching across events).
export async function emailTradeoffPlan(
  email: string,
  eventName: string,
  venue: string,
  dateRange: string,
  leverEmployed: string,
  lineItemBreakdown: TradeoffEmailLineItem[],
  newTotalLow: number,
  newTotalHigh: number,
  newTotalMid: number,
  budgetMax: number,
  guideUrl: string,
  resultsUrl: string,
  isBuilt: boolean,
  fitsBudget: boolean
) {
  await sendTradeoffPlanEmail(
    email,
    eventName,
    venue,
    dateRange,
    leverEmployed,
    lineItemBreakdown,
    newTotalLow,
    newTotalHigh,
    newTotalMid,
    budgetMax,
    guideUrl,
    resultsUrl,
    isBuilt,
    fitsBudget
  );
}

// Tradeoff Engine — fetched on demand when a user expands "See how to make
// this fit" on an over-budget Screen 2 card. Combines real tier options
// (scored, never excluded), the escalation-based scenario result (Green
// -> Amber -> Both, stopping at the first sufficient level, confirmed
// 19 Jul 2026), and the Flights sequencing advisory into one payload.
export async function getTradeoffData(
  eventId: string,
  tripLengthDays: number,
  timeWindow: string,
  unchangedLineItems: { label: string; low: number; high: number }[],
  budgetMax: number
) {
  try {
    return await getTradeoffDataUnsafe(eventId, tripLengthDays, timeWindow, unchangedLineItems, budgetMax);
  } catch (err) {
    // getTradeoffOptions/getFlightsAdvisory/getTripCommentary each already
    // guard their own queries, but the outer event-lookup query here
    // (destinationId) was still unguarded — a transient DB blip on just
    // that one query crashed the whole panel regardless of how defensive
    // everything downstream was. Caught live 26 Jul 2026 (ECONNRESET).
    console.error("[getTradeoffData] failed, returning null result", err);
    return { hotel: { current: null }, tickets: { current: null }, scenarioResult: null, flightsAdvisory: null, tripCommentary: null };
  }
}

async function getTradeoffDataUnsafe(
  eventId: string,
  tripLengthDays: number,
  timeWindow: string,
  unchangedLineItems: { label: string; low: number; high: number }[],
  budgetMax: number
) {
  const [event] = await db
    .select({ destinationId: sportingEvents.destinationId })
    .from(sportingEvents)
    .where(eq(sportingEvents.id, eventId));

  const options = await getTradeoffOptions(eventId, tripLengthDays);
  const flightsAdvisory = event?.destinationId
    ? await getFlightsAdvisory(event.destinationId, timeWindow)
    : null;
  const tripCommentary = event?.destinationId
    ? await getTripCommentary(event.destinationId)
    : null;

  const hotelScored = scoreTierOptions(options.hotel.current, options.hotel.cheaperOptions);
  const ticketsScored = scoreTierOptions(options.tickets.current, options.tickets.cheaperOptions);

  const scenarioResult =
    options.hotel.current && options.tickets.current
      ? computeTradeoffScenarios(
          hotelScored,
          ticketsScored,
          options.hotel.current,
          options.tickets.current,
          unchangedLineItems,
          budgetMax
        )
      : null;

  return {
    hotel: { current: options.hotel.current },
    tickets: { current: options.tickets.current },
    scenarioResult,
    flightsAdvisory,
    tripCommentary,
  };
}
