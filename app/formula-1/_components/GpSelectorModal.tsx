"use client";

import CockpitModal from "./CockpitModal";
import GpSelector from "./GpSelector";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

// Card 3 modal — "I've chosen my GP". Also opened from Next on the Calendar
// with a preselected event (Phase 1 spec: calendar card click → this same
// modal, GP preselected, not an invented event page).
export default function GpSelectorModal({
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
    <CockpitModal open={open} onClose={onClose} title="I've chosen my Grand Prix">
      <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Ticket Intelligence</p>
      <p className="text-sm text-[#A3A3A3] mb-4">Match Grandstand or GA seats as per your preference.</p>
      {/* key forces a remount whenever the modal reopens with a different
          preselected event (e.g. clicking two different calendar cards in a
          row) — this modal instance is otherwise reused, so GpSelector's own
          selectedId state would stay stuck on the previous selection. */}
      <GpSelector key={preselectedEventId ?? "none"} events={events} userEmail={userEmail} preselectedEventId={preselectedEventId} />
    </CockpitModal>
  );
}
