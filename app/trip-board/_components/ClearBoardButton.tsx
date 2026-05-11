"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearBoardButton({ boardId, onCleared }: { boardId: string; onCleared: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    clearBoard();
  };

  const clearBoard = async () => {
    setLoading(true);
    await fetch("/api/trip-board/clear", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId }),
    });
    onCleared();
    router.refresh();
    setLoading(false);
    setConfirming(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-colors disabled:opacity-50 ${
        confirming
          ? "border-red-400 text-red-600 hover:border-red-600"
          : "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
      }`}
    >
      {loading ? "Clearing…" : confirming ? "Tap again to confirm" : "Clear board"}
    </button>
  );
}
