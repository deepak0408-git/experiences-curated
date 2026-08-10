import CalendarEventRow from "./CalendarEventRow";
import type { getCalendarEvents } from "@/lib/queries/calendar";
import { getCtaState } from "@/lib/queries/calendar";

const MONTH_FMT: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function monthLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", MONTH_FMT);
}

function buildJsonLd(events: Awaited<ReturnType<typeof getCalendarEvents>>, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.name,
        startDate: e.startDate,
        endDate: e.endDate,
        location: e.venueOrCity ? { "@type": "Place", name: e.venueOrCity } : undefined,
        url: baseUrl,
      },
    })),
  };
}

export default function CalendarEventList({
  events,
  jsonLdUrl,
}: {
  events: Awaited<ReturnType<typeof getCalendarEvents>>;
  jsonLdUrl: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.endDate >= today);
  const past = events.filter((e) => e.endDate < today);

  const jsonLd = buildJsonLd(events, jsonLdUrl);

  // Group upcoming events under month headers once the list is long enough
  // to warrant it (design doc: past ~15-20 rows) — at pilot scale (47 F1
  // rows) this triggers immediately, which is the expected/designed state.
  const groups: { label: string; rows: typeof upcoming }[] = [];
  for (const event of upcoming) {
    const key = monthKey(event.startDate);
    const last = groups[groups.length - 1];
    if (last && monthKey(last.rows[0].startDate) === key) {
      last.rows.push(event);
    } else {
      groups.push({ label: monthLabel(event.startDate), rows: [event] });
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {upcoming.length === 0 ? (
        <p className="text-sm text-[#6A6A6A]">No upcoming events yet in this sport — check back soon.</p>
      ) : (
        groups.map((group, i) => (
          <div key={`${group.label}-${i}`} className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#6A6A6A] mb-2">
              {group.label}
            </h2>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-5">
              {group.rows.map((event) => (
                <CalendarEventRow key={event.id} event={event} cta={getCtaState(event)} isPast={false} />
              ))}
            </div>
          </div>
        ))
      )}

      {past.length > 0 && (
        <details className="mt-10 group">
          <summary className="cursor-pointer text-xs font-black uppercase tracking-widest text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
            Past events ({past.length}) — click to expand
          </summary>
          <div className="mt-4 rounded-sm border border-[#2A2A2A] bg-[#141414] px-5">
            {past.map((event) => (
              <CalendarEventRow key={event.id} event={event} cta={getCtaState(event)} isPast={true} />
            ))}
          </div>
        </details>
      )}
    </>
  );
}
