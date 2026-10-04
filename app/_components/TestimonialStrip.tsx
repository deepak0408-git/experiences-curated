import { db } from "@/lib/db";
import { eventPackFeedback, sportingEvents } from "@/schema/database";
import { eq, desc } from "drizzle-orm";
import TestimonialCarousel from "./TestimonialCarousel";
import { stripYear } from "@/lib/eventShortNames";

// stripYear removes a trailing 4-digit year off an event name ("Italian
// Grand Prix 2027" -> "Italian Grand Prix"). sportingEvents.name reflects
// the CURRENT edition of an evergreen event, which rolls forward year to
// year — a testimonial captured against the 2026 edition otherwise ends up
// displayed under whatever year the event has since rolled to, which reads
// as a factual mismatch (caught live 28 Sep 2026: Italian GP testimonials
// from the 2026 edition showing "Italian Grand Prix 2027" once the DB
// rolled).

// Curator-owned: only rows with featuredTestimonial = true (set manually in
// event_pack_feedback via a curator script/query) ever render here. Never
// auto-surface every displayConsent=true row — consent alone doesn't mean
// the comment is ready for the homepage (see memory on real-testimonial
// verification, 27 Sep 2026 build).
export default async function TestimonialStrip() {
  const rows = await db
    .select({
      id: eventPackFeedback.id,
      displayName: eventPackFeedback.displayName,
      rating: eventPackFeedback.rating,
      comment: eventPackFeedback.comment,
      eventName: sportingEvents.name,
      createdAt: eventPackFeedback.createdAt,
    })
    .from(eventPackFeedback)
    .innerJoin(sportingEvents, eq(sportingEvents.id, eventPackFeedback.sportingEventId))
    .where(eq(eventPackFeedback.featuredTestimonial, true))
    .orderBy(desc(eventPackFeedback.createdAt));

  const testimonials = rows
    .filter((r) => r.displayName && r.comment)
    .map((r) => ({ ...r, eventName: stripYear(r.eventName) })) as {
    id: string;
    displayName: string;
    rating: number;
    comment: string;
    eventName: string;
  }[];
  if (testimonials.length === 0) return null;

  return (
    <div className="bg-[#141414]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-8">
          What travelers say
        </p>
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </div>
  );
}
