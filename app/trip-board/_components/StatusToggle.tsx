"use client";

import { useTransition } from "react";
import { updateSavedItemStatus } from "../actions";

const STATUSES = ["to_do", "booked", "done"] as const;
type Status = typeof STATUSES[number];

const LABELS: Record<Status, string> = {
  to_do: "To do",
  booked: "Booked",
  done: "Done",
};

const STYLES: Record<Status, string> = {
  to_do: "bg-neutral-100 text-neutral-500",
  booked: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

export default function StatusToggle({
  savedItemId,
  status,
}: {
  savedItemId: string;
  status: Status;
}) {
  const [isPending, startTransition] = useTransition();

  const cycle = () => {
    const next = STATUSES[(STATUSES.indexOf(status) + 1) % STATUSES.length];
    startTransition(() => updateSavedItemStatus(savedItemId, next));
  };

  return (
    <button
      onClick={cycle}
      disabled={isPending}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${STYLES[status]}`}
    >
      {LABELS[status]}
    </button>
  );
}
