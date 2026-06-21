"use client";

import { useTransition } from "react";
import { openPaddlePortal } from "../actions";

export default function ManageSubscriptionButton({ paddleCustomerId }: { paddleCustomerId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => openPaddlePortal(paddleCustomerId))}
      disabled={isPending}
      className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors underline underline-offset-2 disabled:opacity-50"
    >
      {isPending ? "Opening…" : "Manage subscription"}
    </button>
  );
}
