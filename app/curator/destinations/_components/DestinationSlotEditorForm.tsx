"use client";

import { useState } from "react";
import { saveDestinationHomepageSlots } from "../actions";

type Destination = {
  id: string;
  name: string;
  countryCode: string;
  homepageSlot: number | null;
};

const SLOT_COUNT = 4;
const SLOT_VALUES = ["", ...Array.from({ length: SLOT_COUNT }, (_, i) => String(i + 1))];

export default function DestinationSlotEditorForm({ destinations }: { destinations: Destination[] }) {
  const [slots, setSlots] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const d of destinations) {
      init[d.id] = d.homepageSlot?.toString() ?? "";
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
    const result = await saveDestinationHomepageSlots(
      Object.entries(slots).map(([destinationId, slot]) => ({ destinationId, slot }))
    );
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const slotEvents = Array.from({ length: SLOT_COUNT }, (_, i) =>
    destinations.find((d) => slots[d.id] === String(i + 1))
  );

  return (
    <div>
      {/* Preview */}
      <div className="mb-8 p-4 rounded-sm bg-[#141414] border border-[#2A2A2A]">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
          Homepage preview — Where Sport Takes You
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {slotEvents.map((d, i) => (
            <SlotBadge key={i} slot={i + 1} destination={d} />
          ))}
        </div>
      </div>

      {/* Destination table */}
      <div className="rounded-sm border border-[#2A2A2A] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#141414]">
              <th className="text-left px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Destination</th>
              <th className="text-center px-4 py-3 text-xs font-semibold tracking-widest uppercase text-[#AAFF00] w-48">Homepage slot</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d, i) => (
              <tr
                key={d.id}
                className={`border-b border-[#2A2A2A] last:border-0 ${i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#141414]"}`}
              >
                <td className="px-4 py-3 font-medium text-white">
                  {d.name} <span className="text-[#6A6A6A]">({d.countryCode})</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {SLOT_VALUES.map((val) => (
                      <label key={val} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`slot-${d.id}`}
                          value={val}
                          checked={slots[d.id] === val}
                          onChange={() => setSlots((prev) => ({ ...prev, [d.id]: val }))}
                          className="accent-[#AAFF00]"
                        />
                        <span className="text-xs text-[#6A6A6A]">{val === "" ? "—" : val}</span>
                      </label>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
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

function SlotBadge({ slot, destination }: { slot: number; destination?: Destination }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-semibold ${destination ? "bg-[#AAFF00] text-black" : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#6A6A6A]"}`}>
      <span className="opacity-70">Slot {slot}</span>
      {destination ? <span className="font-black">{destination.name}</span> : <span>— empty —</span>}
    </div>
  );
}
