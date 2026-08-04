"use client";

import { useState, useTransition } from "react";
import { unsaveEventPack } from "@/app/event-pack/[slug]/actions";

// Click-again-to-confirm, same pattern as ClearBoardButton (trip-board) —
// no modal, 3s window to confirm the second tap.
export default function RemoveFavouriteButton({
  sportingEventId,
  slug,
}: {
  sportingEventId: string;
  slug: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      await unsaveEventPack(sportingEventId, slug);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label="Remove from Favourites"
      className={`flex-shrink-0 px-3 py-1.5 rounded-sm border text-xs font-medium transition-colors disabled:opacity-50 ${
        confirming
          ? "border-red-500 text-red-400 hover:border-red-400"
          : "border-transparent text-[#6A6A6A] hover:border-[#2A2A2A] hover:text-red-500"
      }`}
    >
      {isPending ? "Removing…" : confirming ? "Tap again to confirm" : "Remove"}
    </button>
  );
}
