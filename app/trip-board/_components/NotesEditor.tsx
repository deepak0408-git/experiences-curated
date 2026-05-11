"use client";

import { useState, useTransition } from "react";
import { updateSavedItemNotes } from "../actions";

export default function NotesEditor({
  savedItemId,
  initialNotes,
}: {
  savedItemId: string;
  initialNotes: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialNotes ?? "");
  const [isPending, startTransition] = useTransition();

  const save = () => {
    setEditing(false);
    startTransition(() => updateSavedItemNotes(savedItemId, value));
  };

  if (editing) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        rows={2}
        placeholder="Add a note…"
        className="w-full text-xs text-neutral-700 border border-neutral-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-neutral-400 transition-colors"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      disabled={isPending}
      className="w-full text-left text-xs text-neutral-400 hover:text-neutral-700 transition-colors truncate"
    >
      {value || "Add a note…"}
    </button>
  );
}
