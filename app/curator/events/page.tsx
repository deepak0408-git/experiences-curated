export const dynamic = "force-dynamic";

import { getEventsForSlotEditor } from "./actions";
import SlotEditorForm from "./_components/SlotEditorForm";

export const metadata = { title: "Events — Curator" };

export default async function EventsPage() {
  const events = await getEventsForSlotEditor();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#AAFF00]">Events</h1>
        <p className="mt-1 text-sm text-[#6A6A6A]">
          Set which events appear on the homepage. Slots 1-4 — shown as a 2x2 grid on desktop, stacked on mobile.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-[#6A6A6A]">No live or upcoming events in the next 3 months.</p>
      ) : (
        <SlotEditorForm events={events} />
      )}
    </div>
  );
}
