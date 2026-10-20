import { CalendarDays, Sun, Moon, Armchair, Sparkles } from "lucide-react";
import type { ScoredOption } from "../_lib/types";
import type { Rationale } from "../_lib/recommendationRationale";
import { stageExplanation, sessionExplanation, seatingPresentation, experiencePresentation, arenaDisplayName } from "../_lib/presentationMappings";

// Results-page card — design spec 20 Oct 2026. Built fresh to this spec's
// explicit instructions (image-above-name, 4-row stacked icon panel,
// BEST MATCH/ALTERNATIVE labels) rather than as a literal copy of the real
// F1 FullResult.tsx/SeatCard, which uses a different 4-row panel (What it
// shows/Seating/Weather cover/Seat type) with no icons and different
// label text ("Best match"/"Runner-up"/"3rd option") — see completion
// report for the discrepancy this was found against. Reuses only the
// genuinely shared design tokens (dark-canvas palette, rounded-sm,
// border-[#2A2A2A], aspect-[16/9] image box, the cost-star lime-green/
// muted pattern) rather than F1's specific row structure.

function AttributeRow({
  icon,
  label,
  value,
  explanation,
  borderRight,
  borderBottom,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  explanation: string;
  borderRight?: boolean;
  borderBottom?: boolean;
}) {
  const borderClasses = [
    borderRight ? "sm:border-r sm:border-[#2A2A2A]" : "",
    borderBottom ? "border-b border-[#2A2A2A]" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={`p-4 ${borderClasses}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#AAFF00]">{icon}</span>
        <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">{label}</p>
      </div>
      <p className="text-base font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{explanation}</p>
    </div>
  );
}

function CostStars({ costStars }: { costStars: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Relative cost</span>
      <span aria-label={`${costStars} out of 5`} className="text-sm tracking-wider">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < costStars ? "text-[#AAFF00]" : "text-[#2A2A2A]"}>
            ★
          </span>
        ))}
      </span>
    </div>
  );
}

export default function ResultCard({
  label,
  scored,
  explanation,
  comparisonHeading,
}: {
  label: "BEST MATCH" | "ALTERNATIVE";
  scored: ScoredOption;
  explanation: Rationale;
  // "WHY THIS SUITS YOU" for the hero, "WHY CONSIDER THIS INSTEAD?" for an
  // alternative — passed by the caller rather than derived from `label`
  // here, since that distinction is presentation-only and the caller
  // already knows which card this is.
  comparisonHeading: string;
}) {
  const { option } = scored;
  const imageUrl = option.heroImage;
  const stage = stageExplanation(option.stageCode);
  const session = sessionExplanation(option.sessionCode);
  const seating = seatingPresentation(option);
  const experience = experiencePresentation(option.arenaCode);

  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden mb-6">
      {/* 4.1 / 10 — image immediately above the arena identity. Read from
          tennisTicketIntelligenceOptions.heroImage (DB-backed, uploaded to
          R2 20 Oct 2026) — falls back to the "coming soon" placeholder
          whenever heroImage is null, preserving the original layout. */}
      <div className="relative w-full aspect-[16/9] bg-[#1A1A1A] flex items-center justify-center">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`Illustrative spectator view at ${arenaDisplayName(option)}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Preserve layout if the asset ever fails to load — hide the
              // broken image, fall back visually to the empty placeholder
              // box rather than a broken-image icon.
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A]">Arena view coming soon</p>
        )}
      </div>
      {imageUrl && (
        <p className="px-6 pt-2 text-xs text-[#6A6A6A] italic">
          Illustrative arena view — actual seating perspective may vary.
        </p>
      )}

      <div className="p-6">
        {/* 4.2 — recommendation label, exact text per spec */}
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">{label}</p>

        {/* 4.3 — arena name */}
        <h3 className="text-2xl font-black text-white mb-1">{arenaDisplayName(option)}</h3>

        {/* 4.4 — supporting identity */}
        <p className="text-sm text-[#A3A3A3] mb-4">Australian Open 2027</p>

        {/* 5 — bordered attribute panel, 2x2 grid on sm+ (Seating/Time on
            top, When/Experience below), single stacked column on mobile.
            Founder direction, 20 Oct 2026. */}
        <div className="rounded-sm border border-[#2A2A2A] bg-[#1A1A1A] mb-4 grid sm:grid-cols-2">
          <AttributeRow
            icon={<Armchair size={14} />}
            label="Your seating"
            value={seating.value}
            explanation={seating.explanation}
            borderRight
            borderBottom
          />
          {session ? (
            <AttributeRow
              icon={option.sessionCode === "Night" ? <Moon size={14} /> : <Sun size={14} />}
              label="Time of day"
              value={session.value}
              explanation={session.explanation}
              borderBottom
            />
          ) : (
            <AttributeRow
              icon={<Sun size={14} />}
              label="Time of day"
              value="Flexible timing"
              explanation="Ground Pass access isn't tied to one fixed ticketed session."
              borderBottom
            />
          )}
          <AttributeRow
            icon={<CalendarDays size={14} />}
            label="When in the tournament"
            value={stage.value}
            explanation={stage.explanation}
            borderRight
          />
          <AttributeRow
            icon={<Sparkles size={14} />}
            label="The experience"
            value={experience.value}
            explanation={experience.explanation}
          />
        </div>

        {/* 6 — relative cost, frozen five-tier model, direct pass-through
            of option.costStars with zero recalculation */}
        <CostStars costStars={option.costStars} />

        {/* 7 / 8 — explanation section */}
        <div className="pt-4 border-t border-[#2A2A2A]">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">{comparisonHeading}</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{explanation.text}</p>
        </div>
      </div>
    </div>
  );
}
