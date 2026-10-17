// Resolves the "from" context param into a real href + label, shared by the
// quiz page (TicketQuiz.tsx) and the result page (result/page.tsx) so a
// fan's entry point (F1 Cockpit, the main picker, an experience, a spoke, or
// the default event hub) stays attached to the back-link all the way through
// checkout to the final result. "from" is one of: "cockpit" (/formula-1),
// "picker" (main /ticket-intelligence page), "experience:<slug>" (an
// experience page), "spoke:<id>" (a spoke page, with ?fromLabel=<text> for
// its display name), or absent (default: the event hub page).
export function resolveBackLink(
  params: URLSearchParams,
  slug: string,
  eventName: string
): { href: string; label: string; isCockpit?: boolean } {
  const from = params.get("from");
  if (from === "cockpit") {
    return { href: "/formula-1", label: "← Back to F1 Cockpit", isCockpit: true };
  }
  if (from === "picker") {
    return { href: "/ticket-intelligence", label: "← Back to all events" };
  }
  if (from?.startsWith("experience:")) {
    const experienceSlug = from.slice("experience:".length);
    if (experienceSlug) {
      return { href: `/experience/${experienceSlug}`, label: "← Back to this experience" };
    }
  }
  if (from?.startsWith("spoke:")) {
    const spokeId = from.slice("spoke:".length);
    const fromLabel = params.get("fromLabel");
    if (spokeId) {
      return {
        href: `/event-pack/${slug}/${spokeId}`,
        label: fromLabel ? `← Back to ${fromLabel}` : `← Back to ${eventName} guide`,
      };
    }
  }
  return { href: `/event-pack/${slug}`, label: `← Back to ${eventName} guide` };
}

// The subset of "from" context worth re-attaching to a new URL (checkout
// successUrl, retake navigation, etc.) — just the two raw params, not a
// resolved href/label.
export function appendFromParams(params: URLSearchParams, target: URLSearchParams) {
  const from = params.get("from");
  if (from) target.set("from", from);
  const fromLabel = params.get("fromLabel");
  if (fromLabel) target.set("fromLabel", fromLabel);
}
