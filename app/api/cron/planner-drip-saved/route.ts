import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { plannerSessions, plannerDripSent } from "@/schema/database";
import { getPlannerEvents } from "@/app/planner/_lib/getPlannerEvents";
import { sumLineItems, buildSummaryLine } from "@/app/planner/_lib/mockEvents";
import { sendSavedDripEmail } from "@/app/planner/_lib/sendPlannerEmails";
import { dedupeLatestPerGroup } from "@/app/planner/_lib/dripDedup";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

// Post-Planner Drip Sequence — "saved" (Touchpoint 5, design doc). Daily cron:
// for every saved PlannerSession with no click-through yet, sends the day-3
// "still thinking about it?" nudge (referencing the user's own #1 closest-
// match event, never fabricated aggregate stats) and, if still unclicked,
// a softer day-10 check-in. Hard stop after day 10 — no indefinite nurture,
// and stops immediately on click-through (checked via clickedAt, set by the
// /api/planner/click tracked redirect every drip link uses).
//
// Wired into vercel.json 8 Aug 2026, daily at 06:00 UTC — founder reviewed
// and approved the exact day-3/day-10 email copy in sendPlannerEmails.ts
// (sendSavedDripEmail) before this was scheduled. See
// feedback_no_dev_crons_against_prod_db memory: this route was tested via a
// direct localhost call against the production DB prior to scheduling —
// never do that again; test via a read-only reconstruction of the send
// function instead, or via the real deployed route.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  const allSavedSessions = await db
    .select()
    .from(plannerSessions)
    .where(eq(plannerSessions.gateAction, "saved"));

  // Dedup by (email, gateAction, gateActionEventIds) — a superseded row
  // (same email re-saved the same shortlist) must not run its own parallel
  // drip. Click state carries over across the group.
  const deduped = dedupeLatestPerGroup(allSavedSessions);
  const candidates = deduped.filter((s) => s.clickedAt == null);

  let day3Sent = 0;
  let day10Sent = 0;

  for (const session of candidates) {
    const topEventId = session.shortlistedEventIds[0];
    if (!topEventId) continue;

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

    const events = await getPlannerEvents(session.tripLengthDays, session.originMarket);
    const topEvent = events.find((e) => e.id === topEventId);
    if (!topEvent) continue;

    const totalLow = sumLineItems(topEvent.lineItems, "low");
    const totalHigh = sumLineItems(topEvent.lineItems, "high");
    const isBuilt = topEvent.packStatus === "live" || topEvent.packStatus === "built_hidden";

    const destinationPath = isBuilt
      ? `/event-pack/${topEvent.slug}`
      : (() => {
          const params = new URLSearchParams({
            sports: session.sports.join(","),
            budgetMin: session.budgetMin,
            budgetMax: session.budgetMax,
            timeWindow: session.timeWindow,
            tripLengthDays: String(session.tripLengthDays),
            originMarket: session.originMarket,
          });
          return `/planner/results?${params.toString()}`;
        })();

    const clickUrl = `${SITE_URL}/api/planner/click?session=${session.id}&redirect=${encodeURIComponent(destinationPath)}`;

    try {
      await sendSavedDripEmail(
        session.email,
        step,
        topEvent.name,
        topEvent.venue,
        topEvent.dateRange,
        topEvent.lineItems.map((li) => ({ label: li.label, low: li.low, high: li.high })),
        totalLow,
        totalHigh,
        Number(session.budgetMin),
        Number(session.budgetMax),
        clickUrl,
        isBuilt,
        buildSummaryLine({
          sports: session.sports,
          budgetMin: Number(session.budgetMin),
          budgetMax: Number(session.budgetMax),
          timeWindow: session.timeWindow,
          tripLengthDays: session.tripLengthDays,
        })
      );
      await db.insert(plannerDripSent).values({ plannerSessionId: session.id, sequenceStep: step }).onConflictDoNothing();
      if (step === "day_3") day3Sent++;
      else day10Sent++;
    } catch (err) {
      console.error(`[planner-drip-saved] failed to send ${step} for session ${session.id}`, err);
    }
  }

  console.log(`[planner-drip-saved] done — day_3: ${day3Sent}, day_10: ${day10Sent}`);
  return NextResponse.json({ ok: true, day3Sent, day10Sent });
}
