// Resolves a shared "from" cockpit-origin param into the correct Cockpit
// href/label. Each sport's Travel Planning Cockpit (currently /formula-1
// and /tennis) links out to shared, cross-sport destinations — the Season
// Planner, Trip Board, Custom Itinerary — using its own distinct "from"
// value ("cockpit" for F1, "tennis-cockpit" for tennis) specifically so
// these shared destinations can tell which Cockpit a visitor came from and
// send them back to the right one, instead of every Cockpit colliding on
// the same generic value. Add a new entry here whenever a new sport's
// Cockpit is built, rather than hardcoding another one-off check.
const COCKPIT_FROM_VALUES: Record<string, { href: string; label: string; shortLabel: string }> = {
  cockpit: { href: "/formula-1", label: "← Back to F1 Cockpit", shortLabel: "← F1 Cockpit" },
  "tennis-cockpit": { href: "/tennis", label: "← Back to Tennis Cockpit", shortLabel: "← Tennis Cockpit" },
};

export function resolveCockpitBackLink(
  from: string | null | undefined
): { href: string; label: string; shortLabel: string } | null {
  if (!from) return null;
  return COCKPIT_FROM_VALUES[from] ?? null;
}

export function isCockpitFrom(from: string | null | undefined): boolean {
  return !!from && from in COCKPIT_FROM_VALUES;
}
