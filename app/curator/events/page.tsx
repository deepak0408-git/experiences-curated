export const dynamic = "force-dynamic";

import { getEventsForSlotEditor } from "./actions";
import SlotEditorForm from "./_components/SlotEditorForm";

export const metadata = { title: "Events — Curator" };

export default async function EventsPage() {
  const events = await getEventsForSlotEditor();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Events</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Set which events appear in the homepage carousel. Slot 1 = first slide, Slot 2 = second slide. Max 2.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-neutral-400">No live or upcoming events in the next 3 months.</p>
      ) : (
        <SlotEditorForm events={events} />
      )}
    </div>
  );
}
