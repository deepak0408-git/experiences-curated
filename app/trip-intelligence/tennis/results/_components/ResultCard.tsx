// Adapted from app/trip-intelligence/formula-1/results/_components/ResultCard.tsx
// for Tennis's richer, contribution-based explanation shape rather than
// F1's rule-based matchReasons/comparativeEdges/gapFromHero. Reuses
// AlternativeGuideCta as-is (generic, no F1-specific logic).
//
// Revision 3 (explanation refinement): the old tradeOff/coLeaderAdvantage/
// marginSentence trio collapses into one `explanation` string — a single
// natural-language paragraph instead of mechanical fragments. Same visual
// slot and classes as before; only the prop shape and its position in the
// card changed (now directly under the date line, same amber-text styling
// margin comparisons used, applying to both co-leader and alternative cards).
import AlternativeGuideCta from "../../../formula-1/results/_components/AlternativeGuideCta";

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const year = end.getFullYear();
  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}–${end.getDate()}, ${year}`;
  }
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}, ${year}`;
}

export default function ResultCard({
  headline,
  grandSlamName,
  heroImageUrl,
  venueName,
  startDate,
  endDate,
  primaryReason,
  secondaryReason,
  explanation,
  isHero,
  isCoLeader,
  tiedExplanationLabel = "Why these are tied",
  eventSlug,
  eventId,
  sport,
  isEventGuideBuilt,
  userEmail,
}: {
  headline: string;
  grandSlamName: string;
  heroImageUrl: string | null;
  venueName: string | null;
  startDate: string | null;
  endDate: string | null;
  primaryReason: string | null;
  secondaryReason: string | null;
  explanation: string | null;
  isHero: boolean;
  isCoLeader?: boolean;
  tiedExplanationLabel?: string;
  eventSlug?: string | null;
  eventId?: string;
  sport?: string;
  isEventGuideBuilt?: boolean;
  userEmail?: string | null;
}) {
  const highlighted = isHero || isCoLeader;
  return (
    <div
      className={
        highlighted
          ? "rounded-sm border border-[#AAFF00] bg-[#141414] overflow-hidden"
          : "rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden"
      }
    >
      {heroImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt={grandSlamName} className="w-full h-56 object-cover" />
      )}
      <div className="p-6">
        <p
          className={
            highlighted
              ? "text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2"
              : "text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-2"
          }
        >
          {headline}
        </p>
        <h2 className={highlighted ? "text-2xl font-black text-white mb-1.5" : "text-lg font-black text-white mb-1.5"}>
          {grandSlamName}
        </h2>
        {(startDate || venueName) && (
          <p className="text-xs text-[#6A6A6A] mb-4">
            {startDate && endDate ? formatDateRange(startDate, endDate) : null}
            {startDate && venueName ? " · " : null}
            {venueName}
          </p>
        )}

        {!isHero && explanation && (
          <p className="text-sm text-amber-400 mb-3">{explanation}</p>
        )}

        {(primaryReason || secondaryReason) && (
          <div className="mb-4">
            <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-2">Why this fits you</p>
            <ul className="space-y-1.5">
              {primaryReason && (
                <li className="text-sm text-[#A3A3A3] flex gap-2">
                  <span className="text-[#AAFF00] flex-shrink-0">—</span>
                  <span>{primaryReason}</span>
                </li>
              )}
              {secondaryReason && (
                <li className="text-sm text-[#A3A3A3] flex gap-2">
                  <span className="text-[#AAFF00] flex-shrink-0">—</span>
                  <span>{secondaryReason}</span>
                </li>
              )}
            </ul>
          </div>
        )}

        {isCoLeader && explanation && (
          <div className="mb-4">
            <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-2">{tiedExplanationLabel}</p>
            <p className="text-sm text-[#A3A3A3]">{explanation}</p>
          </div>
        )}

        {(!isHero || isCoLeader) && eventSlug && eventId && sport && (
          <div className="mb-4">
            <AlternativeGuideCta
              eventSlug={eventSlug}
              eventId={eventId}
              sport={sport}
              isBuilt={isEventGuideBuilt ?? false}
              userEmail={userEmail ?? null}
            />
          </div>
        )}
      </div>
    </div>
  );
}
