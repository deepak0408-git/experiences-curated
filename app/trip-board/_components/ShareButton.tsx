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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 text-xs font-medium text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
    >
      {copied ? "✓ Link copied" : "Share board"}
    </button>
  );
}
