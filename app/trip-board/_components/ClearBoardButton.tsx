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
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-medium transition-colors disabled:opacity-50 ${
        confirming
          ? "border-red-500 text-red-400 hover:border-red-400"
          : "border-[#2A2A2A] text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00]"
      }`}
    >
      {loading ? "Clearing…" : confirming ? "Tap again to confirm" : "Clear board"}
    </button>
  );
}
