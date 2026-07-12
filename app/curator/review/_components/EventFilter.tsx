"use client";

import { useRouter } from "next/navigation";

interface EventOption {
  id: string;
  name: string;
  slug: string;
}

export function EventFilter({
  events,
  activeSlug,
}: {
  events: EventOption[];
  activeSlug?: string;
}) {
  const router = useRouter();

  return (
    <select
      value={activeSlug ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        router.push(value ? `/curator/review?event=${value}` : "/curator/review");
      }}
      className="px-3 py-2 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-white focus:outline-none focus:border-[#AAFF00]"
    >
      <option value="">All events</option>
      <option value="none">No event (general experiences)</option>
      {events.map((event) => (
        <option key={event.id} value={event.slug}>
          {event.name}
        </option>
      ))}
    </select>
  );
}
