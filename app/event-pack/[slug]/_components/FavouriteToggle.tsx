"use client";

import { useState, useTransition } from "react";
import { saveEventPack, unsaveEventPack } from "../actions";

// Whole-pack favoriting toggle, per beta feedback 4 Aug 2026. Initial saved
// state is passed as a prop (resolved server-side in HubPage.tsx via
// isEventPackSaved) rather than fetched client-side on mount — avoids a
// loading flicker and an extra round trip.
export default function FavouriteToggle({
  sportingEventId,
  slug,
  initiallySaved,
}: {
  sportingEventId: string;
  slug: string;
  initiallySaved: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      if (saved) {
        await unsaveEventPack(sportingEventId, slug);
        setSaved(false);
      } else {
        await saveEventPack(sportingEventId, slug);
        setSaved(true);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className={
        saved
          ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#AAFF00]/40 bg-[#AAFF00]/10 text-xs font-medium text-[#AAFF00] transition-colors disabled:opacity-50"
          : "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#2A2A2A] text-xs font-medium text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors disabled:opacity-50"
      }
    >
      {saved ? "♥ Saved to Favourites" : "♡ Save to Favourites"}
    </button>
  );
}
