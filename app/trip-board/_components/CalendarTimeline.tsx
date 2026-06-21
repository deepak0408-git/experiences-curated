"use client";

import type { PlannerItem } from "./TripBoardPlanner";

const TYPE_LABELS: Record<string, string> = {
  fan_experience: "Fan Experience",
  sports_venue:   "Sports Venue",
  dining:         "Dining",
  accommodation:  "Stay",
  transit:        "Transit",
  activity:       "Activity",
  cultural_site:  "Cultural Site",
  neighborhood:   "Neighbourhood",
  day_trip:       "Day Trip",
  natural_wonder: "Natural Wonder",
  event:          "Event",
  multi_day:      "Multi-day",
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDayHeading(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

interface ScheduledItem extends PlannerItem {
  scheduledAt: string;
  durationMinutes: number;
}

export default function CalendarTimeline({ items }: { items: PlannerItem[] }) {
  const scheduled = items.filter(
    (i): i is ScheduledItem => !!i.scheduledAt && !!i.durationMinutes
  );
  const unscheduled = items.filter((i) => !i.scheduledAt);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-[#6A6A6A]">Your itinerary will appear here as you schedule experiences.</p>
      </div>
    );
  }

  // Group by date
  const byDay = new Map<string, ScheduledItem[]>();
  for (const item of scheduled) {
    const d = new Date(item.scheduledAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(item);
  }

  const sortedDays = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));
  for (const [, dayItems] of sortedDays) {
    dayItems.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }

  return (
    <div className="space-y-6">
      {sortedDays.map(([dateStr, dayItems]) => (
        <div key={dateStr}>
          <p className="text-xs font-semibold text-[#A3A3A3] mb-2 pb-1.5 border-b border-[#2A2A2A]">
            {formatDayHeading(dateStr)}
          </p>
          <div className="space-y-1.5">
            {dayItems.map((item) => {
              const start = new Date(item.scheduledAt);
              const end = new Date(start.getTime() + item.durationMinutes * 60_000);
              return (
                <div
                  key={item.savedItemId}
                  className="flex items-start gap-2 rounded-sm border border-[#2A2A2A] bg-[#141414] px-2.5 py-2"
                >
                  <span className="text-[10px] font-semibold tabular-nums whitespace-nowrap mt-0.5 text-[#AAFF00]">
                    {formatTime(start)}–{formatTime(end)}
                  </span>
                  <span className="text-xs font-semibold text-white leading-snug line-clamp-2">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {scheduled.length === 0 && (
        <p className="text-sm text-[#6A6A6A] text-center py-8">
          Pick dates and times on the left to build your itinerary.
        </p>
      )}

      {unscheduled.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">
            Not yet scheduled ({unscheduled.length})
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {unscheduled.map((item) => (
              <span
                key={item.savedItemId}
                className="px-2.5 py-1 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-[#A3A3A3] text-xs font-medium truncate"
                title={item.title}
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
