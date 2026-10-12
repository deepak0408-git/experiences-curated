// Hero vs alternative, differentiated by a `headline` prop — mirrors Ticket
// Intelligence's SeatCard pattern (one shared component, "Runner-up"/"3rd
// option" headline for alternatives).

import type { FanInsightsData } from "../../_lib/getGrandPrixData";
import AlternativeGuideCta from "./AlternativeGuideCta";

// "Month D" or "Month D–D" (same month) or "Month D – Month D" (spanning
// months) — e.g. "7-8 Nov" style used elsewhere in this codebase, written
// out here as "Nov 7–9, 2026" for a standalone card with no surrounding
// date context to lean on.
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
  grandPrixName,
  heroImageUrl,
  venueName,
  startDate,
  endDate,
  matchReasons,
  gapFromHero,
  comparativeEdges,
  tradeOff,
  insights,
  isHero,
  eventSlug,
  eventId,
  sport,
  isEventGuideBuilt,
  userEmail,
}: {
  headline: string;
  grandPrixName: string;
  heroImageUrl: string | null;
  venueName: string | null;
  startDate: string | null;
  endDate: string | null;
  matchReasons: string[];
  gapFromHero: string | null;
  comparativeEdges: string[];
  tradeOff: string | null;
  insights: FanInsightsData | null;
  isHero: boolean;
  eventSlug?: string | null;
  eventId?: string;
  sport?: string;
  isEventGuideBuilt?: boolean;
  userEmail?: string | null;
}) {
  return (
    <div
      className={
        isHero
          ? "rounded-sm border border-[#AAFF00] bg-[#141414] overflow-hidden"
          : "rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden"
      }
    >
      {heroImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={heroImageUrl} alt={grandPrixName} className="w-full h-56 object-cover" />
      )}
      <div className="p-6">
        <p
          className={
            isHero
              ? "text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2"
              : "text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-2"
          }
        >
          {headline}
        </p>
        <h2 className={isHero ? "text-2xl font-black text-white mb-1.5" : "text-lg font-black text-white mb-1.5"}>
          {grandPrixName}
        </h2>
        {(startDate || venueName) && (
          <p className="text-xs text-[#6A6A6A] mb-4">
            {startDate && endDate ? formatDateRange(startDate, endDate) : null}
            {startDate && venueName ? " · " : null}
            {venueName}
          </p>
        )}

        {!isHero && gapFromHero && (
          <p className="text-xs text-amber-400 mb-3">{gapFromHero}</p>
        )}

        {matchReasons.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-2">Why this fits you</p>
            <ul className="space-y-1.5">
              {matchReasons.map((reason, i) => (
                <li key={i} className="text-sm text-[#A3A3A3] flex gap-2">
                  <span className="text-[#AAFF00] flex-shrink-0">—</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isHero && eventSlug && eventId && sport && (
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

        {isHero && comparativeEdges.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-2">
              Why this comparatively ranks higher
            </p>
            <ul className="space-y-1.5">
              {comparativeEdges.map((edge, i) => (
                <li key={i} className="text-sm text-[#A3A3A3] flex gap-2">
                  <span className="text-[#AAFF00] flex-shrink-0">—</span>
                  <span>{edge}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tradeOff && (
          <p className="text-xs text-[#6A6A6A] mb-4 border-l-2 border-[#2A2A2A] pl-3">
            <span className="font-semibold text-[#A3A3A3]">Trade-off: </span>
            {tradeOff}
          </p>
        )}

        {insights && isHero && (
          <div className="mt-5 pt-5 border-t border-[#2A2A2A] space-y-4">
            {insights.experienceHighlights.length > 0 && (
              <div>
                <p className="text-xs font-black tracking-widest uppercase text-white mb-2">Experience highlights</p>
                <ul className="space-y-1">
                  {insights.experienceHighlights.map((h, i) => (
                    <li key={i} className="text-sm text-[#A3A3A3]">{h}</li>
                  ))}
                </ul>
              </div>
            )}
            {insights.goodToKnow.length > 0 && (
              <div>
                <p className="text-xs font-black tracking-widest uppercase text-white mb-2">Good to know</p>
                <ul className="space-y-1">
                  {insights.goodToKnow.map((h, i) => (
                    <li key={i} className="text-sm text-[#A3A3A3]">{h}</li>
                  ))}
                </ul>
              </div>
            )}
            {insights.tradeOffs.length > 0 && (
              <div>
                <p className="text-xs font-black tracking-widest uppercase text-white mb-2">Trade-offs</p>
                <ul className="space-y-1">
                  {insights.tradeOffs.map((h, i) => (
                    <li key={i} className="text-sm text-[#A3A3A3]">{h}</li>
                  ))}
                </ul>
              </div>
            )}
            {insights.insiderTip && (
              <div>
                <p className="text-xs font-black tracking-widest uppercase text-white mb-2">Insider tip</p>
                <p className="text-sm text-[#A3A3A3]">{insights.insiderTip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
