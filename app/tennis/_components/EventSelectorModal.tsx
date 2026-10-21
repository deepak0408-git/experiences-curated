"use client";

import CockpitModal from "./CockpitModal";
import EventSelector from "./EventSelector";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

// Card 3 modal — "I've chosen my tournament". Also opened from Next on the
// Calendar with a preselected event. Mirrors
// app/formula-1/_components/GpSelectorModal.tsx.
export default function EventSelectorModal({
  open,
  onClose,
  events,
  userEmail,
  preselectedEventId,
}: {
  open: boolean;
  onClose: () => void;
  events: CockpitEvent[];
  userEmail: string | null;
  preselectedEventId?: string | null;
}) {
  return (
    <CockpitModal open={open} onClose={onClose} title="I've chosen my tournament">
      <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Ticket Intelligence</p>
      <p className="text-sm text-[#A3A3A3] mb-4">Match the arena, stage and seating that fits your preference.</p>
      {/* key forces a remount whenever the modal reopens with a different
          preselected event — this modal instance is otherwise reused, so
          EventSelector's own selectedId state would stay stuck on the
          previous selection. */}
      <EventSelector key={preselectedEventId ?? "none"} events={events} userEmail={userEmail} preselectedEventId={preselectedEventId} />
    </CockpitModal>
  );
}
