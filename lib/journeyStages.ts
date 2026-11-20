// Canonical five-stage customer journey — single source of truth for
// labels/descriptions, per the approved End-to-End Customer Journey & UX
// Communication Specification (root of repo). Do not redefine these stage
// titles/descriptions anywhere else; import getJourneyStages() instead.
import { Search, CalendarDays, Ticket, MapPin, Flag, type LucideIcon } from "lucide-react";

export type JourneyStageKey = "discover" | "compare" | "find" | "plan" | "prepare";

// Three wording variants, corrected 20 Nov 2026 after the shared copy was
// wrongly collapsed to one set:
// - "formula_one": F1-specific (Grand Prix / race weekend / circuit) — F1
//   Trip Intelligence + Ticket Intelligence.
// - "tennis": tennis-specific (tournament / ticket / grounds) — Tennis Trip
//   Intelligence + Ticket Intelligence.
// - "neutral": sport-agnostic (event / trip) — cross-sport surfaces only
//   (Trip Planner, Event Guides, Trip Board).
// Titles and icons never vary by variant — only the description line does.
export type JourneyMapVariant = "formula_one" | "tennis" | "neutral";

type JourneyStageBase = { key: JourneyStageKey; order: number; title: string; Icon: LucideIcon };

const STAGE_BASE: readonly JourneyStageBase[] = [
  { key: "discover", order: 1, title: "Discover", Icon: Search },
  { key: "compare", order: 2, title: "Compare", Icon: CalendarDays },
  { key: "find", order: 3, title: "Find", Icon: Ticket },
  { key: "plan", order: 4, title: "Plan", Icon: MapPin },
  { key: "prepare", order: 5, title: "Prepare", Icon: Flag },
];

const DESCRIPTIONS: Record<JourneyMapVariant, Record<JourneyStageKey, string>> = {
  formula_one: {
    discover: "Find the Grand Prix that fits you.",
    compare: "Explore dates, costs and options.",
    find: "Get the right seats and plan race weekend.",
    plan: "Build your itinerary and explore beyond the circuit.",
    prepare: "Get race-weekend ready and make every moment count.",
  },
  tennis: {
    discover: "Find the tournament that fits you.",
    compare: "Explore dates, costs and options.",
    find: "Get the right ticket and plan your week.",
    plan: "Build your itinerary and explore beyond the grounds.",
    prepare: "Get tournament-ready and make every moment count.",
  },
  neutral: {
    discover: "Find the event that fits you.",
    compare: "Explore dates, costs and options.",
    find: "Get the right seats.",
    plan: "Explore beyond the event and build your itinerary.",
    prepare: "Get trip ready and make every moment count.",
  },
};

export type JourneyStage = JourneyStageBase & { description: string };

export function getJourneyStages(variant: JourneyMapVariant): readonly JourneyStage[] {
  return STAGE_BASE.map((stage) => ({ ...stage, description: DESCRIPTIONS[variant][stage.key] }));
}
