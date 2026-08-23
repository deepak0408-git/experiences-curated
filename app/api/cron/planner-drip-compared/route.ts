import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { plannerSessions, plannerDripSent } from "@/schema/database";
import { getPlannerEvents } from "@/app/planner/_lib/getPlannerEvents";
import { sumLineItems, buildSummaryLine } from "@/app/planner/_lib/mockEvents";
import { sendComparisonDripEmail, type ComparisonEmailEvent } from "@/app/planner/_lib/sendPlannerEmails";
import { dedupeLatestPerGroup } from "@/app/planner/_lib/dripDedup";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.experiences-curated.com";

// Post-Planner Drip Sequence — "compared" (Touchpoint 5, design doc). Same
// shape and stop-on-click rule as planner-drip-saved: day-3 nudge (references
// the auto-highlighted biggest-delta line item, same one shown on the
// Comparison screen), day-10 soft check-in. Unlike "saved" (which links to a
// single event's pack), the click-through here always goes back to the
// comparison page itself — there's no single "the" destination.
//
// Wired into vercel.json 8 Aug 2026, daily at 06:30 UTC — founder reviewed
// and approved the exact day-3/day-10 email copy (same review pass as
// planner-drip-saved). See feedback_no_dev_crons_against_prod_db memory:
// this route was tested via a direct localhost call against the production
// DB prior to scheduling — never do that again.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  const allComparedSessions = await db
    .select()
    .from(plannerSessions)
    .where(eq(plannerSessions.gateAction, "compared"));

  const deduped = dedupeLatestPerGroup(allComparedSessions);
  const candidates = deduped.filter((s) => s.clickedAt == null);

  let day3Sent = 0;
  let day10Sent = 0;

  for (const session of candidates) {
    const comparedEventIds = session.gateActionEventIds;
    if (comparedEventIds.length < 2) continue;

    const alreadySent = await db
      .select({ sequenceStep: plannerDripSent.sequenceStep })
      .from(plannerDripSent)
      .where(eq(plannerDripSent.plannerSessionId, session.id));
    const sentSteps = new Set(alreadySent.map((r) => r.sequenceStep));

    const step: "day_3" | "day_10" | null =
      session.createdAt <= tenDaysAgo && !sentSteps.has("day_10")
        ? "day_10"
        : session.createdAt <= threeDaysAgo && !sentSteps.has("day_3")
          ? "day_3"
          : null;

    if (!step) continue;

    const allEvents = await getPlannerEvents(session.tripLengthDays, session.originMarket);
    const comparedEvents = comparedEventIds
      .map((id) => allEvents.find((e) => e.id === id))
      .filter((e): e is NonNullable<typeof e> => !!e);
    if (comparedEvents.length < 2) continue;

    const emailEvents: ComparisonEmailEvent[] = comparedEvents.map((e) => ({
      name: e.name,
      slug: e.slug,
      sport: e.sport,
      venue: e.venue,
      city: e.city,
      dateRange: e.dateRange,
      totalLow: sumLineItems(e.lineItems, "low"),
      totalHigh: sumLineItems(e.lineItems, "high"),
      lineItems: e.lineItems.map((li) => ({ label: li.label, low: li.low, high: li.high })),
      isBuilt: e.packStatus === "live" || e.packStatus === "built_hidden",
    }));

    // Same biggest-delta calc as ComparisonView.tsx — reused server-side.
    const lineItemLabels = emailEvents[0].lineItems.map((item) => item.label);
    let biggestDeltaLabel = "";
    let biggestDelta = 0;
    for (const label of lineItemLabels) {
      const mids = emailEvents.map((e) => {
        const item = e.lineItems.find((i) => i.label === label)!;
        return (item.low + item.high) / 2;
      });
      const delta = Math.max(...mids) - Math.min(...mids);
      if (delta > biggestDelta) {
        biggestDelta = delta;
        biggestDeltaLabel = label;
      }
    }
    const highestEvent = emailEvents.reduce((a, b) => {
      const aItem = a.lineItems.find((i) => i.label === biggestDeltaLabel)!;
      const bItem = b.lineItems.find((i) => i.label === biggestDeltaLabel)!;
      return (aItem.low + aItem.high) / 2 > (bItem.low + bItem.high) / 2 ? a : b;
    });

    const params = new URLSearchParams({
      slugs: comparedEvents.map((e) => e.slug).join(","),
      sports: session.sports.join(","),
      budgetMin: session.budgetMin,
      budgetMax: session.budgetMax,
      timeWindow: session.timeWindow,
      tripLengthDays: String(session.tripLengthDays),
      originMarket: session.originMarket,
    });
    const destinationPath = `/planner/results/compare?${params.toString()}`;
    const clickUrl = `${SITE_URL}/api/planner/click?session=${session.id}&redirect=${encodeURIComponent(destinationPath)}`;

    try {
      const summaryLine = buildSummaryLine({
        sports: session.sports,
        budgetMin: Number(session.budgetMin),
        budgetMax: Number(session.budgetMax),
        timeWindow: session.timeWindow,
        tripLengthDays: session.tripLengthDays,
      });
      await sendComparisonDripEmail(session.email, step, emailEvents, biggestDeltaLabel, highestEvent.name, clickUrl, summaryLine);
      await db.insert(plannerDripSent).values({ plannerSessionId: session.id, sequenceStep: step }).onConflictDoNothing();
      if (step === "day_3") day3Sent++;
      else day10Sent++;
    } catch (err) {
      console.error(`[planner-drip-compared] failed to send ${step} for session ${session.id}`, err);
    }
  }

  console.log(`[planner-drip-compared] done — day_3: ${day3Sent}, day_10: ${day10Sent}`);
  return NextResponse.json({ ok: true, day3Sent, day10Sent });
}
