"use client";

import type { PlannerItem } from "./TripBoardPlanner";

const TYPE_COLORS: Record<string, string> = {
  fan_experience: "bg-blue-100 border-blue-300 text-blue-800",
  sports_venue:   "bg-blue-100 border-blue-300 text-blue-800",
  dining:         "bg-amber-100 border-amber-300 text-amber-800",
  accommodation:  "bg-purple-100 border-purple-300 text-purple-800",
  transit:        "bg-neutral-100 border-neutral-300 text-neutral-600",
  activity:       "bg-emerald-100 border-emerald-300 text-emerald-800",
  cultural_site:  "bg-rose-100 border-rose-300 text-rose-800",
  neighborhood:   "bg-teal-100 border-teal-300 text-teal-800",
  day_trip:       "bg-orange-100 border-orange-300 text-orange-800",
  natural_wonder: "bg-green-100 border-green-300 text-green-800",
  event:          "bg-indigo-100 border-indigo-300 text-indigo-800",
  multi_day:      "bg-orange-100 border-orange-300 text-orange-800",
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
      <div className="h-full flex items-center justify-center py-16 text-center">
        <p className="text-sm text-neutral-400">Your itinerary will appear here as you schedule experiences.</p>
      </div>
    );
  }

  // Group by date (YYYY-MM-DD local)
  const byDay = new Map<string, ScheduledItem[]>();
  for (const item of scheduled) {
    const d = new Date(item.scheduledAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(item);
  }

  // Sort days
  const sortedDays = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));
  // Sort items within each day by time
  for (const [, dayItems] of sortedDays) {
    dayItems.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  }

  return (
    <div className="space-y-6">
      {/* Days */}
      {sortedDays.map(([dateStr, dayItems]) => (
        <div key={dateStr}>
          <p className="text-xs font-bold text-neutral-700 mb-2 pb-1.5 border-b border-neutral-100">
            {formatDayHeading(dateStr)}
          </p>
          <div className="space-y-1.5">
            {dayItems.map((item) => {
              const start = new Date(item.scheduledAt);
              const end = new Date(start.getTime() + item.durationMinutes * 60_000);
              const color = TYPE_COLORS[item.experienceType] ?? "bg-neutral-100 border-neutral-200 text-neutral-700";
              return (
                <div
                  key={item.savedItemId}
                  className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 ${color}`}
                >
                  <span className="text-[10px] font-semibold tabular-nums whitespace-nowrap mt-0.5 opacity-70">
                    {formatTime(start)}–{formatTime(end)}
                  </span>
                  <span className="text-xs font-semibold leading-snug line-clamp-2">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {scheduled.length === 0 && (
        <p className="text-sm text-neutral-400 text-center py-8">
          Pick dates and times on the left to build your itinerary.
        </p>
      )}

      {/* Unscheduled */}
      {unscheduled.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">
            Not yet scheduled ({unscheduled.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {unscheduled.map((item) => (
              <span
                key={item.savedItemId}
                className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 text-xs font-medium truncate max-w-[160px]"
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
