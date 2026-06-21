export const dynamic = "force-dynamic";

import Link from "next/link";
import { getEventsForRanker, getExperiencesForEvent } from "./actions";
import RankerForm from "./_components/RankerForm";

export const metadata = { title: "Pack Ranker" };

export default async function RankerPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event: eventId } = await searchParams;

  const events = await getEventsForRanker();

  const selectedEvent = eventId ? events.find((e) => e.id === eventId) : null;
  const experiences = selectedEvent ? await getExperiencesForEvent(selectedEvent.id) : [];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#AAFF00]">Pack Ranker</h1>
          <p className="mt-1 text-sm text-[#6A6A6A]">
            Set the display order for experiences inside each event pack.
          </p>
        </div>
      </div>

      {/* Event picker */}
      <div className="mb-8">
        <label className="block text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">
          Select event
        </label>
        <div className="flex gap-2 flex-wrap">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/curator/ranker?event=${event.id}`}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                selectedEvent?.id === event.id
                  ? "bg-[#AAFF00] text-black font-black"
                  : "border border-[#2A2A2A] text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00]"
              }`}
            >
              {event.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Ranker */}
      {!selectedEvent && (
        <p className="text-sm text-[#6A6A6A]">Select an event above to start ranking.</p>
      )}

      {selectedEvent && experiences.length === 0 && (
        <p className="text-sm text-[#6A6A6A]">
          No experiences linked to {selectedEvent.name} yet.
        </p>
      )}

      {selectedEvent && experiences.length > 0 && (
        <RankerForm key={selectedEvent.id} eventId={selectedEvent.id} experiences={experiences} />
      )}
    </div>
  );
}
