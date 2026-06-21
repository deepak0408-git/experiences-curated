"use client";

import { useTransition } from "react";
import { removeSavedItem } from "../actions";

export default function RemoveSavedItem({
  savedItemId,
  experienceSlug,
  onRemove,
}: {
  savedItemId: string;
  experienceSlug: string;
  onRemove?: (savedItemId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    onRemove?.(savedItemId);
    startTransition(() => removeSavedItem(savedItemId, experienceSlug));
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="px-2.5 py-1 rounded-sm text-xs font-medium bg-[#1A1A1A] text-[#6A6A6A] hover:text-red-400 transition-colors disabled:opacity-50"
    >
      {isPending ? "Removing…" : "− Remove"}
    </button>
  );
}
