import { db } from "@/lib/db";
import { eventPackFeedback } from "@/schema/database";
import { and, eq, desc } from "drizzle-orm";

// Curator-owned, per-event pull-quote — mirrors the homepage TestimonialStrip's
// featuredTestimonial gate, but filtered to this event's sportingEventId and
// rendered as a single editorial quote rather than a carousel, since most
// events have 0-2 featured rows (not enough volume for a card grid/marquee).
// Renders nothing if this event has no featured testimonial yet.
//
// Only shown pre-purchase (see !hasPurchased check at the call site) — same
// gate as the "Unlock the full guide" CTA box and mini-packs section above
// it on HubPage.tsx. A testimonial is there to support a purchase decision;
// once someone has bought the pack, it has nothing left to persuade them of,
// same reasoning that already hides those other two sections post-purchase.
export default async function EventTestimonial({ sportingEventId }: { sportingEventId: string }) {
  const [row] = await db
    .select({
      displayName: eventPackFeedback.displayName,
      rating: eventPackFeedback.rating,
      comment: eventPackFeedback.comment,
    })
    .from(eventPackFeedback)
    .where(and(
      eq(eventPackFeedback.sportingEventId, sportingEventId),
      eq(eventPackFeedback.featuredTestimonial, true),
    ))
    .orderBy(desc(eventPackFeedback.createdAt))
    .limit(1);

  if (!row || !row.displayName || !row.comment) return null;

  return (
    <div className="mt-10 grid grid-cols-[auto_1fr] gap-5 py-8 border-t border-b border-[#2A2A2A]">
      <span className="font-serif text-6xl leading-none text-[#AAFF00] -mt-2" aria-hidden="true">
        &ldquo;
      </span>
      <div>
        <blockquote className="text-xl sm:text-2xl font-semibold text-white leading-snug tracking-tight">
          {row.comment}
        </blockquote>
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <span className="text-[#AAFF00] text-sm tracking-wider" aria-label={`${row.rating} out of 5 stars`}>
            {"★".repeat(row.rating)}
            <span className="text-[#2A2A2A]">{"★".repeat(5 - row.rating)}</span>
          </span>
          <span className="text-sm font-black text-white">{row.displayName}</span>
        </div>
      </div>
    </div>
  );
}
