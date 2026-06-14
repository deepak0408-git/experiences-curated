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
          <h1 className="text-2xl font-bold text-neutral-900">Pack Ranker</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Set the display order for experiences inside each event pack.
          </p>
        </div>
      </div>

      {/* Event picker */}
      <div className="mb-8">
        <label className="block text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2">
          Select event
        </label>
        <div className="flex gap-2 flex-wrap">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/curator/ranker?event=${event.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedEvent?.id === event.id
                  ? "bg-neutral-900 text-white"
                  : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400"
              }`}
            >
              {event.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Ranker */}
      {!selectedEvent && (
        <p className="text-sm text-neutral-400">Select an event above to start ranking.</p>
      )}

      {selectedEvent && experiences.length === 0 && (
        <p className="text-sm text-neutral-400">
          No experiences linked to {selectedEvent.name} yet.
        </p>
      )}

      {selectedEvent && experiences.length > 0 && (
        <RankerForm key={selectedEvent.id} eventId={selectedEvent.id} experiences={experiences} />
      )}
    </div>
  );
}
