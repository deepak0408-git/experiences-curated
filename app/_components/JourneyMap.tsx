import { getJourneyStages, type JourneyStageKey, type JourneyMapVariant } from "@/lib/journeyStages";

// Shared Journey Map — visual identity reproduced exactly from the F1
// Travel Planning Cockpit's HowItWorks.tsx (app/formula-1/_components/
// HowItWorks.tsx), which stays the single rendering of that component and
// is NOT modified by this file. Canonical stage titles/descriptions live in
// lib/journeyStages.ts — no product may redefine them locally.
//
// `variant` selects wording only (titles/icons never change): "formula_one"
// for F1 Trip/Ticket Intelligence, "tennis" for Tennis Trip/Ticket
// Intelligence, "neutral" (default) for cross-sport surfaces (Trip Planner,
// Event Guides, Trip Board).
//
// Product-specific messaging (continuation copy, CTAs) is never embedded
// here — callers render that separately, adjacent to this component.
export default function JourneyMap({
  currentStage,
  completedStages = [],
  variant = "neutral",
}: {
  currentStage: JourneyStageKey;
  completedStages?: JourneyStageKey[];
  variant?: JourneyMapVariant;
}) {
  const stages = getJourneyStages(variant);
  const current = stages.find((s) => s.key === currentStage)!;

  return (
    <div>
      {/* Below `sm`, the full 5-caption layout wraps onto several lines and
          stops reading as a horizontal journey, so this stays a compact
          icon-only row (numbers, no titles/descriptions) with just the
          current stage's title + description printed once underneath —
          founder direction, 20 Nov 2026: keep it horizontal on mobile
          rather than switching to a static image (two assets to keep in
          sync, worse accessibility) or letting it wrap. */}
      <div className="flex sm:hidden items-center justify-between">
        {stages.map(({ key, order, Icon }, i) => {
          const isCurrent = key === currentStage;
          const isCompleted = completedStages.includes(key) && !isCurrent;
          return (
            <div key={key} className="flex items-center flex-1 last:flex-none">
              <div
                className={
                  isCurrent || isCompleted
                    ? "w-9 h-9 rounded-full border border-[#AAFF00] bg-[#0A0A0A] flex items-center justify-center flex-shrink-0"
                    : "w-9 h-9 rounded-full border border-[#2A2A2A] bg-[#0A0A0A] flex items-center justify-center flex-shrink-0"
                }
                aria-label={`${order}. ${stages[i].title}`}
              >
                <Icon size={15} strokeWidth={2} className={isCurrent || isCompleted ? "text-[#AAFF00]" : "text-[#6A6A6A]"} aria-hidden="true" />
              </div>
              {i < stages.length - 1 && <div className="flex-1 h-px bg-[#2A2A2A] mx-1" />}
            </div>
          );
        })}
      </div>
      <div className="sm:hidden mt-3">
        <p className="text-sm font-black text-white">{current.order}. {current.title}</p>
        <p className="text-xs text-[#A3A3A3] mt-1">{current.description}</p>
      </div>

      <div className="hidden sm:grid sm:grid-cols-5 gap-2">
        {stages.map(({ key, order, title, description, Icon }, i) => {
          const isCurrent = key === currentStage;
          const isCompleted = completedStages.includes(key) && !isCurrent;

          return (
            <div key={key} className="relative flex flex-col items-center text-center gap-3">
              <div className="relative flex-shrink-0">
                <div
                  className={
                    isCurrent || isCompleted
                      ? "w-11 h-11 rounded-full border border-[#AAFF00] bg-[#0A0A0A] flex items-center justify-center"
                      : "w-11 h-11 rounded-full border border-[#2A2A2A] bg-[#0A0A0A] flex items-center justify-center"
                  }
                >
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className={isCurrent || isCompleted ? "text-[#AAFF00]" : "text-[#6A6A6A]"}
                    aria-hidden="true"
                  />
                </div>
                {i < stages.length - 1 && (
                  <div
                    className="absolute top-1/2 left-full w-full h-px bg-[#2A2A2A] -translate-y-1/2"
                    style={{ width: "calc(100% - 2.75rem)", marginLeft: "0.5rem" }}
                  />
                )}
              </div>
              <div>
                <p className={isCurrent ? "text-sm font-black text-white" : "text-sm font-black text-[#A3A3A3]"}>
                  {order}. {title}
                </p>
                <p className="text-xs text-[#A3A3A3] mt-1 max-w-[9rem]">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
