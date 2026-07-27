import type { plannerSessions } from "@/schema/database";
import type { InferSelectModel } from "drizzle-orm";

type PlannerSession = InferSelectModel<typeof plannerSessions>;

// Repeat-action interpretation rule (design doc, decided 18 Jul 2026,
// implemented 20 Jul 2026): a "qualifying event" is scoped to
// (email, gateAction, gateActionEventIds), not just email. Group by that
// key, keep only the latest row per group as the live drip signal — an
// older, superseded row (same email re-saving the same shortlist) must not
// run its own parallel drip sequence alongside the new one.
//
// Click state carries over across the group (decided 20 Jul 2026): if ANY
// row in the group was clicked, the group is treated as clicked — a fresh
// re-save of the same shortlist shouldn't reset engagement the person
// already showed. The returned "latest" session has its own clickedAt
// overridden to the earliest true click found in the group, if any.
export function dedupeLatestPerGroup(sessions: PlannerSession[]): PlannerSession[] {
  const groups = new Map<string, PlannerSession[]>();
  for (const s of sessions) {
    const key = `${s.email.toLowerCase()}|${s.gateAction}|${[...s.gateActionEventIds].sort().join(",")}`;
    const group = groups.get(key);
    if (group) group.push(s);
    else groups.set(key, [s]);
  }

  const result: PlannerSession[] = [];
  for (const group of groups.values()) {
    const latest = group.reduce((a, b) => (b.createdAt > a.createdAt ? b : a));
    const anyClicked = group.find((s) => s.clickedAt != null);
    result.push(anyClicked ? { ...latest, clickedAt: anyClicked.clickedAt } : latest);
  }
  return result;
}
