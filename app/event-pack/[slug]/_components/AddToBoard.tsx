"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { addExperiencesToBoard, removeSavedItemByExperienceId } from "@/app/trip-board/actions";

export function AddAllToBoard({ experienceIds }: { experienceIds: string[] }) {
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handle = () => {
    startTransition(async () => {
      await addExperiencesToBoard(experienceIds);
      setDone(true);
    });
  };

  if (done) {
    return (
      <span className="text-sm text-emerald-600 font-medium">
        ✓ {experienceIds.length} experiences added to your Trip Board
      </span>
    );
  }

  return (
    <button
      onClick={handle}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors disabled:opacity-50"
    >
      {isPending ? "Adding…" : `+ Add all ${experienceIds.length} to Trip Board`}
    </button>
  );
}

export function AddOneToBoard({ experienceId }: { experienceId: string }) {
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startTransition(async () => {
      await addExperiencesToBoard([experienceId]);
      setSaved(true);
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startTransition(async () => {
      await removeSavedItemByExperienceId(experienceId);
      setSaved(false);
    });
  };

  if (saved) {
    return (
      <span
        className="flex items-center gap-2 flex-wrap"
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
      >
        <span className="text-xs text-emerald-600 font-medium">✓ Saved to your Trip Board</span>
        <Link
          href="/trip-board"
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-2"
          onClick={(e) => e.stopPropagation()}
        >
          View Board
        </Link>
        <button
          onClick={handleRemove}
          disabled={isPending}
          className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2 disabled:opacity-50"
        >
          Remove
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 text-xs font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors disabled:opacity-50"
    >
      {isPending ? "Saving…" : "Save to Trip Board"}
    </button>
  );
}
