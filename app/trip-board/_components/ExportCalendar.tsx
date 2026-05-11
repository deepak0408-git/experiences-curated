"use client";

import type { PlannerItem } from "./TripBoardPlanner";

function toIcsLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  );
}

function buildIcs(items: PlannerItem[]) {
  const scheduled = items.filter((i) => i.scheduledAt && i.durationMinutes);
  if (scheduled.length === 0) return null;

  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const events = scheduled.map((item) => {
    const start = new Date(item.scheduledAt!);
    const end = new Date(start.getTime() + item.durationMinutes! * 60_000);
    const location = [item.neighborhood, item.destinationName].filter(Boolean).join(", ");
    const description = [
      item.subtitle,
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/experience/${item.slug}`,
    ]
      .filter(Boolean)
      .join("\\n");

    return [
      "BEGIN:VEVENT",
      `DTSTAMP:${now}`,
      `DTSTART:${toIcsLocal(start)}`,
      `DTEND:${toIcsLocal(end)}`,
      `SUMMARY:${item.title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Experiences | Curated//EN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export default function ExportCalendar({ items }: { items: PlannerItem[] }) {
  const scheduledCount = items.filter((i) => i.scheduledAt && i.durationMinutes).length;
  if (scheduledCount === 0) return null;

  const download = () => {
    const ics = buildIcs(items);
    if (!ics) return;
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trip-itinerary.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors"
    >
      Export itinerary
      <span className="opacity-60">({scheduledCount})</span>
    </button>
  );
}
