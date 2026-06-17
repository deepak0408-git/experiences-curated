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
const threeMonthsFromNow = new Date();
threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
const threeMonthsCutoff = threeMonthsFromNow.toISOString().split("T")[0];

function isEditable(ev: Event) {
  // Editable if live or starting within 3 months
  return ev.endDate >= today && ev.startDate <= threeMonthsCutoff;
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

  return (
    <div>
      {/* Preview */}
      <div className="mb-8 p-4 rounded-xl bg-neutral-100 border border-neutral-200">
        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
          Carousel preview
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <SlotBadge slot={1} event={slot1Event} />
          <span className="text-neutral-300 text-sm">→</span>
          <SlotBadge slot={2} event={slot2Event} />
        </div>
      </div>

      {/* Event table */}
      <div className="rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-neutral-400">Event</th>
              <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-neutral-400">Sport</th>
              <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-neutral-400">Dates</th>
              <th className="text-center px-4 py-3 text-xs font-semibold tracking-widest uppercase text-neutral-400 w-40">Homepage slot</th>
              <th className="text-center px-4 py-3 text-xs font-semibold tracking-widest uppercase text-neutral-400">Deactivate</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev, i) => {
              const editable = isEditable(ev);
              const isDeactivated = hidden[ev.id] ?? false;
              return (
              <tr
                key={ev.id}
                className={`border-b border-neutral-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"} ${isDeactivated ? "opacity-50" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-neutral-900">{ev.name}</td>
                <td className="px-4 py-3 text-neutral-500">{SPORT_LABELS[ev.sport] ?? ev.sport}</td>
                <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                  {formatDate(ev.startDate)} – {formatDate(ev.endDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {(["", "1", "2"] as const).map((val) => (
                      <label key={val} className={`flex items-center gap-1.5 ${isDeactivated ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                        <input
                          type="radio"
                          name={`slot-${ev.id}`}
                          value={val}
                          checked={slots[ev.id] === val}
                          onChange={() => !isDeactivated && setSlots((prev) => ({ ...prev, [ev.id]: val }))}
                          disabled={isDeactivated}
                          className="accent-neutral-900"
                        />
                        <span className="text-xs text-neutral-600">
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
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                  ) : (
                    <span className="text-xs text-neutral-300">—</span>
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
          className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-sm text-emerald-600 font-medium">Saved — homepage updated.</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}

function SlotBadge({ slot, event }: { slot: 1 | 2; event?: Event }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${event ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-400"}`}>
      <span className="opacity-60">Slide {slot}</span>
      {event ? <span>{event.name}</span> : <span>— empty —</span>}
    </div>
  );
}
