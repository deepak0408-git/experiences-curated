"use client";

import { useState } from "react";
import { saveHomepageSlots } from "../actions";

type Event = {
  id: string;
  name: string;
  slug: string;
  sport: string;
  startDate: string;
  endDate: string;
  homepageSlot: number | null;
  isHidden: boolean;
};

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  football: "Football",
  rugby: "Rugby",
  golf: "Golf",
  formula_one: "Formula 1",
  cycling: "Cycling",
  athletics: "Athletics",
  other: "Sport",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const today = new Date().toISOString().split("T")[0];
const sixMonthsFromNow = new Date();
sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
const sixMonthsCutoff = sixMonthsFromNow.toISOString().split("T")[0];

function isExpired(ev: Event) {
  return ev.endDate < today;
}

function isEditable(ev: Event) {
  // Editable if live or starting within 6 months, and not yet expired.
  // Widened from 3 to 6 months (14 Jul 2026) — events are now built and
  // released further in advance to give travelers more planning lead time.
  // Expired events show a locked "Deactivated" state instead — the
  // expire-homepage-slots cron already clears their slot automatically.
  return !isExpired(ev) && ev.startDate <= sixMonthsCutoff;
}

export default function SlotEditorForm({ events }: { events: Event[] }) {
  const [slots, setSlots] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const e of events) {
      init[e.id] = e.homepageSlot?.toString() ?? "";
    }
    return init;
  });
  const [hidden, setHidden] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const e of events) {
      init[e.id] = e.isHidden;
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const result = await saveHomepageSlots(
      Object.entries(slots).map(([eventId, slot]) => ({ eventId, slot })),
      Object.entries(hidden).map(([eventId, isHidden]) => ({ eventId, isHidden }))
    );
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const slot1Event = events.find((e) => slots[e.id] === "1");
  const slot2Event = events.find((e) => slots[e.id] === "2");
  const slot3Event = events.find((e) => slots[e.id] === "3");
  const slot4Event = events.find((e) => slots[e.id] === "4");

  return (
    <div>
      {/* Preview */}
      <div className="mb-8 p-4 rounded-sm bg-[#141414] border border-[#2A2A2A]">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          Homepage preview — shown 2x2 on desktop, stacked on mobile
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <SlotBadge slot={1} event={slot1Event} />
          <span className="text-[#6A6A6A] text-sm">→</span>
          <SlotBadge slot={2} event={slot2Event} />
          <span className="text-[#6A6A6A] text-sm">→</span>
          <SlotBadge slot={3} event={slot3Event} />
          <span className="text-[#6A6A6A] text-sm">→</span>
          <SlotBadge slot={4} event={slot4Event} />
        </div>
      </div>

      {/* Event table */}
      <div className="rounded-sm border border-[#2A2A2A] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#141414]">
              <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Event</th>
              <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Sport</th>
              <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Dates</th>
              <th className="text-center px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00] w-40">Homepage slot</th>
              <th className="text-center px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Deactivate</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev, i) => {
              const editable = isEditable(ev);
              const isDeactivated = (hidden[ev.id] ?? false) || isExpired(ev);
              return (
              <tr
                key={ev.id}
                className={`border-b border-[#2A2A2A] last:border-0 ${i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#141414]"} ${isDeactivated ? "opacity-50" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-white">{ev.name}</td>
                <td className="px-4 py-3 text-[#6A6A6A]">{SPORT_LABELS[ev.sport] ?? ev.sport}</td>
                <td className="px-4 py-3 text-[#6A6A6A] whitespace-nowrap">
                  {formatDate(ev.startDate)} – {formatDate(ev.endDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {(["", "1", "2", "3", "4"] as const).map((val) => (
                      <label key={val} className={`flex items-center gap-1.5 ${isDeactivated ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                        <input
                          type="radio"
                          name={`slot-${ev.id}`}
                          value={val}
                          checked={slots[ev.id] === val}
                          onChange={() => !isDeactivated && setSlots((prev) => ({ ...prev, [ev.id]: val }))}
                          disabled={isDeactivated}
                          className="accent-[#AAFF00]"
                        />
                        <span className="text-xs text-[#6A6A6A]">
                          {val === "" ? "—" : val}
                        </span>
                      </label>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {editable ? (
                    <input
                      type="checkbox"
                      checked={isDeactivated}
                      onChange={(e) => {
                        const nowHidden = e.target.checked;
                        setHidden((prev) => ({ ...prev, [ev.id]: nowHidden }));
                        // Clear slot immediately in UI when deactivating
                        if (nowHidden) setSlots((prev) => ({ ...prev, [ev.id]: "" }));
                      }}
                      className="w-4 h-4 accent-red-500 cursor-pointer"
                    />
                  ) : isExpired(ev) ? (
                    <input
                      type="checkbox"
                      checked
                      disabled
                      title="Automatically deactivated — event has ended"
                      className="w-4 h-4 accent-[#6A6A6A] cursor-not-allowed"
                    />
                  ) : (
                    <span className="text-xs text-[#6A6A6A]">—</span>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-sm text-[#AAFF00] font-medium">Saved — homepage updated.</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </div>
  );
}

function SlotBadge({ slot, event }: { slot: 1 | 2 | 3 | 4; event?: Event }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-semibold ${event ? "bg-[#AAFF00] text-black" : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#6A6A6A]"}`}>
      <span className="opacity-70">Slide {slot}</span>
      {event ? <span className="font-black">{event.name}</span> : <span>— empty —</span>}
    </div>
  );
}
