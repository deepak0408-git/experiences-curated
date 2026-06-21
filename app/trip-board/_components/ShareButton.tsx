"use client";

import { useState } from "react";

export default function ShareButton({ userId, boardId }: { userId: string; boardId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/trip-board/share/${userId}?board=${boardId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#2A2A2A] text-xs font-medium text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors"
    >
      {copied ? "✓ Link copied" : "Share board"}
    </button>
  );
}
