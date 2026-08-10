import Link from "next/link";

// Shared "This event" action block — two real states (live pack /
// coming-soon) plus an optional series/related block. Per Blog Design
// Document.txt's locked sidebar model: all real next actions shown at
// once, no forced sequencing — the reader's own intent decides which
// action they take. Only the live-pack CTA carries extra visual weight.
// Candidate for reuse on the Sports Calendar page.
//
// "Compare costs" (Planner deep-link) removed 8 Aug 2026 — it only ever
// sent `eventId`, which /planner/results doesn't read at all (it expects
// sports/budgetMin/budgetMax/timeWindow/tripLengthDays/originMarket), so
// the link always rendered "Any sport · US$0 · nothing matches." A real
// fix needs either an eventId-based pre-fill mode built into the Planner,
// or a genuine mapping from "one event" to a budget search, neither of
// which exists yet — out of scope for the blog for now. See Blog Design
// Document.txt.

type SiblingLink = { slug: string; title: string; seriesPosition?: number | null };

export default function ArticleActionSidebar({
  eventSlug,
  eventName,
  hasLivePack,
  seriesSlug,
  siblings,
  currentSlug,
  relatedLabel,
  categoryHref,
  categoryLabel,
}: {
  eventSlug?: string | null;
  eventName?: string | null;
  hasLivePack: boolean;
  seriesSlug?: string | null;
  siblings: SiblingLink[];
  currentSlug: string;
  relatedLabel: string;
  categoryHref: string;
  categoryLabel: string;
}) {
  const hasEventContext = !!eventSlug;
  const hasSiblings = siblings.length > 0;

  // Fallback block — added 8 Aug 2026. A standalone article (no
  // sportingEventId AND no series siblings yet, e.g. a series' first-ever
  // entry, or a genuinely event-agnostic piece) previously left this whole
  // column blank, which reads as broken rather than intentional. Always
  // render at least one block.
  const showFallback = !hasEventContext && !hasSiblings;

  return (
    <div className="flex flex-col gap-5">
      {hasEventContext && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
            This event
          </p>

          <Link
            href="/calendar"
            className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
          >
            <span className="text-base flex-shrink-0 w-5 text-center">📅</span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-[#A3A3A3]">See it on the calendar</span>
              <span className="block text-xs text-[#6A6A6A] mt-0.5">Dates, venue, full fixture</span>
            </span>
          </Link>

          {hasLivePack ? (
            <Link
              href={`/event-pack/${eventSlug}`}
              className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors"
            >
              <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
              <span className="flex-1">
                <span className="block text-sm font-black text-black">Get the full guide</span>
                <span className="block text-xs text-black/65 mt-0.5">Seating, arrival timing, where to stay</span>
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2.5 py-3">
              <span className="text-base flex-shrink-0 w-5 text-center">🔔</span>
              <span className="flex-1">
                <span className="block text-sm font-bold text-[#6A6A6A]">Guide coming — get notified</span>
                <span className="block text-xs text-[#6A6A6A] mt-0.5">We&apos;ll email you when it&apos;s live</span>
              </span>
            </div>
          )}
        </div>
      )}

      {hasSiblings && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
            {relatedLabel}
          </p>
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/blog/${s.slug}`}
              className={`flex items-baseline gap-2 py-2.5 border-b border-[#2A2A2A] last:border-b-0 hover:opacity-80 transition-opacity ${
                s.slug === currentSlug ? "text-[#AAFF00]" : ""
              }`}
            >
              {seriesSlug && s.seriesPosition != null && (
                <span className={`text-xs font-mono flex-shrink-0 ${s.slug === currentSlug ? "text-[#AAFF00]" : "text-[#6A6A6A]"}`}>
                  {s.seriesPosition}
                </span>
              )}
              <span className={`text-xs ${s.slug === currentSlug ? "text-[#AAFF00] font-bold" : "text-[#A3A3A3]"}`}>
                {s.title}
              </span>
            </Link>
          ))}
        </div>
      )}

      {showFallback && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
            Keep exploring
          </p>
          <Link
            href={categoryHref}
            className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
          >
            <span className="text-base flex-shrink-0 w-5 text-center">📰</span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-[#A3A3A3]">More {categoryLabel}</span>
              <span className="block text-xs text-[#6A6A6A] mt-0.5">See every piece in this category</span>
            </span>
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-base flex-shrink-0 w-5 text-center">←</span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-[#A3A3A3]">All articles</span>
              <span className="block text-xs text-[#6A6A6A] mt-0.5">Browse the full blog</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
