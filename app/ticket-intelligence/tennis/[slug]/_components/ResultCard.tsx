import { CalendarDays, Sun, Moon, Armchair, Sparkles } from "lucide-react";
import type { ScoredOption } from "../_lib/types";
import type { Rationale } from "../_lib/recommendationRationale";
import { stageExplanation, sessionExplanation, wimbledonDaySessionExplanation, seatingPresentation, experiencePresentation, arenaDisplayName } from "../_lib/presentationMappings";

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
  eventName,
  scored,
  explanation,
  comparisonHeading,
}: {
  label: "BEST MATCH" | "ALTERNATIVE";
  // Full event name + edition year (e.g. "Australian Open 2027", "French
  // Open 2027") — replaces a literal "Australian Open 2027" string that
  // was hardcoded here for every tournament. For AO this renders
  // byte-identically to before, since AO's real eventName is that exact
  // string.
  eventName: string;
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
  // stageExplanation(stageCode) alone collapses French Open's Semifinals
  // and Finals into one generic "Final rounds" label, since both share
  // stageCode "Late" by design (they score identically in the approved
  // C2 model — see scoreTennisOptions.ts). roundsLabel already carries
  // the real distinction ("Semifinal rounds" / "Championship finals"),
  // so it's read here, at the French Open call site only, rather than
  // inside stageExplanation() itself — Australian Open's Late-stage
  // options use roundsLabel values ("Final rounds") that don't match
  // either override string below, so they fall through to
  // stageExplanation()'s own unchanged "Final rounds" output, byte-
  // identical to before this change.
  const stage =
    option.stageCode === "Late" && option.roundsLabel === "Semifinal rounds"
      ? { value: "Semifinal rounds", explanation: "The semifinal matches, as the tournament nears its concluding stages." }
      : option.stageCode === "Late" && option.roundsLabel === "Championship finals"
        ? { value: "Championship finals", explanation: "The men's and women's singles finals, the tournament's final matches." }
        : stageExplanation(option.stageCode);
  // P1 fix, 25 Oct 2026: arenaCode === "GP" is the only reliable "is this
  // Ground Pass" signal — sessionCode === null alone isn't, since Wimbledon's
  // 22 reserved-court options also carry sessionCode=null (no separate
  // ticketed day/night session to score against; see Q4-neutrality smoke
  // tests). session stays null only for Ground Pass now, so the ternary
  // below still renders the Ground Pass branch correctly for GP.
  const isGroundPass = option.arenaCode === "GP";
  const session = isGroundPass ? null : sessionExplanation(option.sessionCode) ?? wimbledonDaySessionExplanation();
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
        <p className={`text-sm text-[#A3A3A3] ${option.stand ? "mb-1" : "mb-4"}`}>{eventName}</p>

        {/* Stand — Philippe-Chatrier French Open recommendations only.
            Reads the exact approved value stored on the option row
            (tennisTicketIntelligenceOptions.stand); never inferred from
            seating_code. Omitted entirely when null — Australian Open and
            every other French Open court never render this line. Per the
            approved stand-implementation handoff: placed directly below
            the title/identity and before the attribute panel/explanation. */}
        {option.stand && (
          <p className="text-sm text-[#A3A3A3] mb-4">
            <span className="font-black text-white">Stand:</span> {option.stand}
          </p>
        )}

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
