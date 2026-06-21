"use client";

import { useState } from "react";

const DURATIONS = [
  { label: "30 min", value: 30 },
  { label: "1 hr",   value: 60 },
  { label: "2 hrs",  value: 120 },
  { label: "3 hrs",  value: 180 },
  { label: "Half day", value: 240 },
  { label: "Full day", value: 480 },
];

function defaultsForType(experienceType: string): { time: string; duration: number } {
  switch (experienceType) {
    case "accommodation": return { time: "22:00", duration: 480 };
    case "dining":        return { time: "19:00", duration: 90 };
    case "transit":       return { time: "09:00", duration: 60 };
    case "fan_experience":
    case "sports_venue":  return { time: "10:00", duration: 180 };
    default:              return { time: "10:00", duration: 120 };
  }
}

interface Props {
  savedItemId: string;
  experienceType: string;
  scheduledAt: string | null;
  durationMinutes: number | null;
  onSave: (savedItemId: string, scheduledAt: string, durationMinutes: number) => void;
  onRemove: (savedItemId: string) => void;
}

export default function SchedulePicker({
  savedItemId, experienceType, scheduledAt, durationMinutes, onSave, onRemove,
}: Props) {
  const defaults = defaultsForType(experienceType);
  const [open, setOpen] = useState(false);

  const existingDate = scheduledAt ? new Date(scheduledAt) : null;
  const [date, setDate] = useState(
    existingDate
      ? `${existingDate.getFullYear()}-${String(existingDate.getMonth() + 1).padStart(2, "0")}-${String(existingDate.getDate()).padStart(2, "0")}`
      : ""
  );
  const defaultHour = defaults.time.split(":")[0];
  const [hour, setHour] = useState(
    existingDate ? String(existingDate.getHours()).padStart(2, "0") : defaultHour
  );
  const [minute, setMinute] = useState(
    existingDate ? String(Math.round(existingDate.getMinutes() / 15) * 15 % 60).padStart(2, "0") : "00"
  );
  const time = `${hour}:${minute}`;
  const [duration, setDuration] = useState(durationMinutes ?? defaults.duration);
  const [saving, setSaving] = useState(false);

  const isScheduled = !!scheduledAt;

  const handleSave = async () => {
    if (!date) return;
    setSaving(true);
    const scheduledAtISO = new Date(`${date}T${time}:00`).toISOString();
    await fetch("/api/trip-board/schedule", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ savedItemId, scheduledAt: scheduledAtISO, durationMinutes: duration }),
    });
    onSave(savedItemId, scheduledAtISO, duration);
    setSaving(false);
    setOpen(false);
  };

  const handleRemove = async () => {
    await fetch("/api/trip-board/schedule", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ savedItemId }),
    });
    onRemove(savedItemId);
    setDate("");
    setHour(defaults.time.split(":")[0]);
    setMinute("00");
    setDuration(defaults.duration);
    setOpen(false);
  };

  const scheduledLabel = () => {
    if (!scheduledAt || !durationMinutes) return null;
    const start = new Date(scheduledAt);
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    const day = start.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const fmt = (d: Date) =>
      d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${day} · ${fmt(start)}–${fmt(end)}`;
  };

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors ${
          isScheduled
            ? "bg-[#AAFF00]/10 text-[#AAFF00] hover:bg-[#AAFF00]/20"
            : "bg-[#1A1A1A] text-[#6A6A6A] hover:bg-[#2A2A2A] hover:text-white"
        }`}
      >
        {isScheduled ? `📅 ${scheduledLabel()}` : "+ Schedule"}
      </button>

      {open && (
        <div className="mt-2 p-3 bg-[#141414] border border-[#2A2A2A] rounded-sm space-y-2.5">
          {/* Date */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#6A6A6A] mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 text-white bg-[#1A1A1A] focus:outline-none focus:border-[#AAFF00] [color-scheme:dark]"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#6A6A6A] mb-1">Start time</label>
            <div className="grid gap-[20%]" style={{ gridTemplateColumns: "40% 40%" }}>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="text-xs border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 text-white bg-[#1A1A1A] focus:outline-none focus:border-[#AAFF00]"
              >
                {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                  <option key={h} value={h}>{h}:00</option>
                ))}
              </select>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="text-xs border border-[#2A2A2A] rounded-sm px-2.5 py-1.5 text-white bg-[#1A1A1A] focus:outline-none focus:border-[#AAFF00]"
              >
                {["00", "15", "30", "45"].map((m) => (
                  <option key={m} value={m}>:{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#6A6A6A] mb-1">Duration</label>
            <div className="flex flex-wrap gap-1.5">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`px-2.5 py-1 rounded-sm text-xs font-medium transition-colors ${
                    duration === d.value
                      ? "bg-[#AAFF00] text-black"
                      : "bg-[#1A1A1A] border border-[#2A2A2A] text-[#A3A3A3] hover:border-[#AAFF00] hover:text-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-0.5">
            <button
              onClick={handleSave}
              disabled={!date || saving}
              className="flex-1 text-xs font-black px-3 py-1.5 rounded-sm bg-[#AAFF00] text-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40"
            >
              {saving ? "Saving…" : isScheduled ? "Update" : "Add to itinerary"}
            </button>
            {isScheduled && (
              <button
                onClick={handleRemove}
                className="text-xs font-medium px-3 py-1.5 rounded-sm border border-[#2A2A2A] text-[#6A6A6A] hover:border-red-800 hover:text-red-400 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
