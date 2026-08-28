"use client";

import { useRef, useState } from "react";
import { updateEventPackPricing } from "../actions";

type Event = {
  id: string;
  name: string;
  slug: string;
  startDate: string;
  endDate: string;
  earlyBirdDisplay: string | null;
  standardDisplay: string | null;
  earlyBirdCutoff: string;
  pricingUpdatedAt: Date | null;
  pricingUpdatedBy: string | null;
};

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatUpdatedAt(d: Date) {
  return new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

// "US$10" -> "10" — the curator only ever types/sees the digits; "US$" is
// appended on save so a typo can't produce a malformed display string.
function stripDollarPrefix(display: string | null): string {
  return display?.replace(/^US\$/, "") ?? "";
}

// Desktop grid: Event | Early-bird | Standard | Cutoff | Last updated | Save
const DESKTOP_GRID = "sm:grid-cols-[2fr_100px_100px_140px_140px_150px]";

const CONFIRM_WINDOW_MS = 4000;

export default function PriceEditorForm({ events, curatorEmail }: { events: Event[]; curatorEmail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] overflow-hidden">
      <div className={`hidden sm:grid ${DESKTOP_GRID} gap-3 px-4 py-3 border-b border-[#2A2A2A] bg-[#141414]`}>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Event</span>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Early-bird</span>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Standard</span>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Cutoff</span>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">Last updated</span>
        <span />
      </div>

      {events.map((ev, i) => (
        <PriceRow
          key={ev.id}
          event={ev}
          curatorEmail={curatorEmail}
          rowBg={i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#141414]"}
        />
      ))}
    </div>
  );
}

function PriceNumberInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] focus-within:border-[#AAFF00] ${className ?? ""}`}
    >
      <span className="pl-2 text-sm text-[#6A6A6A]">US$</span>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        placeholder="10"
        className="w-full min-w-0 px-1.5 py-1.5 bg-transparent text-white text-sm focus:outline-none"
      />
    </div>
  );
}

function CutoffDateInput({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-2 py-1.5 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#AAFF00] ${className ?? ""}`}
    />
  );
}

function PriceRow({ event, curatorEmail, rowBg }: { event: Event; curatorEmail: string; rowBg: string }) {
  const [earlyBird, setEarlyBird] = useState(stripDollarPrefix(event.earlyBirdDisplay));
  const [standard, setStandard] = useState(stripDollarPrefix(event.standardDisplay));
  const [cutoff, setCutoff] = useState(event.earlyBirdCutoff);
  const [baselineEarlyBird, setBaselineEarlyBird] = useState(earlyBird);
  const [baselineStandard, setBaselineStandard] = useState(standard);
  const [baselineCutoff, setBaselineCutoff] = useState(cutoff);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(event.pricingUpdatedAt);
  const [updatedBy, setUpdatedBy] = useState(event.pricingUpdatedBy);
  const [confirmPending, setConfirmPending] = useState(false);
  const confirmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cutoffDirty = cutoff !== baselineCutoff;
  const dirty = earlyBird !== baselineEarlyBird || standard !== baselineStandard || cutoffDirty;
  const canSave = dirty && earlyBird !== "" && standard !== "" && cutoff !== "" && !saving;

  function clearConfirm() {
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    setConfirmPending(false);
  }

  function onFieldChange<T>(setter: (v: T) => void) {
    return (v: T) => {
      clearConfirm();
      setter(v);
    };
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const result = await updateEventPackPricing(event.id, {
      earlyBirdDisplay: `US$${earlyBird}`,
      standardDisplay: `US$${standard}`,
      earlyBirdCutoff: cutoff,
    });
    setSaving(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setSaved(true);
      setBaselineEarlyBird(earlyBird);
      setBaselineStandard(standard);
      setBaselineCutoff(cutoff);
      setUpdatedAt(new Date());
      setUpdatedBy(curatorEmail);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  // Changing the cutoff changes what a customer is actually charged at
  // checkout, not just a display label — so a cutoff-dirty save requires a
  // second click within CONFIRM_WINDOW_MS before it actually commits. Same
  // click-again-to-confirm pattern already used by ClearBoardButton/
  // RemoveFavouriteButton elsewhere in the app. Price-only edits (no cutoff
  // change) save on the first click, same as before.
  function handleSaveClick() {
    if (cutoffDirty && !confirmPending) {
      setConfirmPending(true);
      confirmTimeoutRef.current = setTimeout(() => setConfirmPending(false), CONFIRM_WINDOW_MS);
      return;
    }
    clearConfirm();
    handleSave();
  }

  const saveButton = (
    <button
      onClick={handleSaveClick}
      disabled={!canSave}
      className={`px-3 py-1.5 rounded-sm text-xs font-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap ${
        confirmPending ? "bg-red-500 text-white hover:bg-red-400" : "bg-[#AAFF00] text-black hover:bg-[#BBFF33]"
      }`}
    >
      {saving ? "Saving…" : confirmPending ? "Confirm — changes checkout price" : "Save"}
    </button>
  );

  return (
    <div className={`border-b border-[#2A2A2A] last:border-0 ${rowBg} px-4 py-3`}>
      {/* Desktop */}
      <div className={`hidden sm:grid ${DESKTOP_GRID} gap-3 items-center`}>
        <div>
          <div className="font-medium text-white">{event.name}</div>
          <div className="text-xs text-[#6A6A6A]">{formatDate(event.startDate)} – {formatDate(event.endDate)}</div>
        </div>
        <PriceNumberInput value={earlyBird} onChange={onFieldChange(setEarlyBird)} />
        <PriceNumberInput value={standard} onChange={onFieldChange(setStandard)} />
        <CutoffDateInput value={cutoff} onChange={onFieldChange(setCutoff)} />
        <span className="text-xs text-[#6A6A6A]">
          {updatedAt ? (
            <>
              {formatUpdatedAt(updatedAt)}
              {updatedBy && <div>{updatedBy}</div>}
            </>
          ) : (
            "—"
          )}
        </span>
        <div className="flex flex-col items-start gap-1">
          {saveButton}
          {saved && <span className="text-xs text-[#AAFF00] font-medium">Saved</span>}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      </div>

      {/* Mobile — stacked: event name + dates; early-bird; standard + cutoff + save.
          "Last updated" still dropped to stop the page from scrolling
          horizontally on narrow screens (founder feedback, 29 Aug 2026);
          dates brought back under the event name since the curator needs
          them to sanity-check the cutoff date, now that it's editable here
          too (founder feedback, 29 Aug 2026). */}
      <div className="sm:hidden">
        <div className="font-medium text-white">{event.name}</div>
        <div className="text-xs text-[#6A6A6A] mb-2">{formatDate(event.startDate)} – {formatDate(event.endDate)}</div>
        <div className="mb-2">
          <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#AAFF00] mb-1">
            Early-bird
          </label>
          <PriceNumberInput value={earlyBird} onChange={onFieldChange(setEarlyBird)} className="w-24" />
        </div>
        <div className="mb-2">
          <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#AAFF00] mb-1">
            Standard
          </label>
          <PriceNumberInput value={standard} onChange={onFieldChange(setStandard)} className="w-24" />
        </div>
        <div className="mb-2">
          <label className="block text-[10px] font-semibold tracking-widest uppercase text-[#AAFF00] mb-1">
            Cutoff
          </label>
          <CutoffDateInput value={cutoff} onChange={onFieldChange(setCutoff)} />
        </div>
        {saveButton}
        {(saved || error) && (
          <div className="mt-1.5">
            {saved && <span className="text-xs text-[#AAFF00] font-medium">Saved</span>}
            {error && <span className="text-xs text-red-400">{error}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
