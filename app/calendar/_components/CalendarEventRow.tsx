import Link from "next/link";
import NotifyMeButton from "./NotifyMeButton";
import { canPlanCosts, type getCalendarEvents, type CalendarCtaState } from "@/lib/queries/calendar";

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  golf: "Golf",
  formula_one: "Formula 1",
};

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startFmt = start.toLocaleDateString("en-GB", { day: "numeric", month: sameMonth ? undefined : "short" });
  const endFmt = end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${startFmt}–${endFmt}`;
}

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function ctaContent(cta: CalendarCtaState, eventName: string) {
  if (cta.type === "live_guide") {
    return (
      <Link
        href={cta.href}
        className="text-xs font-black text-[#AAFF00] hover:text-[#BBFF33] transition-colors"
      >
        See the full guide →
      </Link>
    );
  }
  if (cta.type === "guide_coming") {
    return <NotifyMeButton eventName={eventName} />;
  }
  return null;
}

export default function CalendarEventRow({
  event,
  cta,
  isPast,
}: {
  event: Awaited<ReturnType<typeof getCalendarEvents>>[number];
  cta: CalendarCtaState;
  isPast: boolean;
}) {
  const inDays = isPast ? null : daysUntil(event.startDate);

  return (
    <div className={`py-4 border-b border-[#2A2A2A] last:border-b-0 ${isPast ? "opacity-50" : ""}`}>
      <div className="sm:flex sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-4 sm:gap-y-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#AAFF00] whitespace-nowrap">
              {SPORT_LABELS[event.sport] ?? event.sport}
            </span>
            {event.isProvisional && (
              <span className="text-[9px] font-bold uppercase tracking-wide text-[#6A6A6A] border border-[#2A2A2A] rounded-sm px-1.5 py-0.5 whitespace-nowrap">
                Provisional
              </span>
            )}
          </div>
          <p className="text-sm font-black text-white leading-snug">{event.name}</p>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            {formatDateRange(event.startDate, event.endDate)}
            {event.venueOrCity && (
              <>
                <span className="mx-1.5 opacity-50">·</span>
                {event.venueOrCity}
              </>
            )}
            {inDays !== null && inDays >= 0 && (
              <>
                <span className="mx-1.5 opacity-50">·</span>
                <span className="text-[#6A6A6A]">in {inDays} day{inDays === 1 ? "" : "s"}</span>
              </>
            )}
          </p>
        </div>

        {/* Mobile: CTAs flow below the date/venue line, left-aligned — the
            previous right-aligned flex-column squeezed into a cramped,
            justified-right stack at phone widths. sm: and up keeps the
            original right-aligned side-by-side layout. Fixed 16 Aug 2026
            per direct mobile screenshot feedback. */}
        <div className="flex flex-col items-start gap-1.5 mt-2 sm:items-end sm:mt-0 sm:flex-shrink-0">
          {ctaContent(cta, event.name)}
          {!isPast && canPlanCosts(event) && (
            <Link
              href="/planner"
              className="text-[11px] text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
            >
              Plan costs for this trip →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
