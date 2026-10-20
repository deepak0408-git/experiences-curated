// Deterministic image-asset mapping for the 43 Tennis Ticket Intelligence
// options — results-page design spec, 20 Oct 2026, section 10. Kept fully
// separate from scoring/explanation logic (imports nothing from
// scoreTennisOptions.ts or selectExplanation.ts).
//
// No approved spectator-perspective photography exists yet. Every option
// below is explicitly mapped to `null` (not omitted) so the 43-entry
// coverage is auditable — a future approved asset is wired in by setting
// its URL here, keyed by option number; multiple option numbers may point
// at the same URL when their viewing perspective is equivalent (e.g. two
// options differing only by day/night session but sharing a seating
// zone), once real assets exist to justify that sharing — never assumed
// now.

export const TENNIS_OPTION_IMAGE_BY_NUMBER: Record<number, string | null> = Object.fromEntries(
  Array.from({ length: 43 }, (_, i) => [i + 1, null])
);

export function getOptionImageUrl(optionNumber: number): string | null {
  return TENNIS_OPTION_IMAGE_BY_NUMBER[optionNumber] ?? null;
}
