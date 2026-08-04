"use client";

import { useState } from "react";

// Native Web Share API where available (mobile) — opens the real OS share
// sheet with WhatsApp/Instagram/Messages/etc. as actual targets. Desktop
// (no navigator.share support) keeps the original copy-link behavior, per
// explicit instruction — same split as event-pack's ShareGuideButton.
export default function ShareButton({ userId, boardId, boardTitle }: { userId: string; boardId: string; boardTitle: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/trip-board/share/${userId}?board=${boardId}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${boardTitle} — Experiences | Curated`, text: `Check out my ${boardTitle} trip board`, url });
      } catch {
        // User cancelled the share sheet — no fallback needed, not an error.
      }
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    window.prompt("Copy this link:", url);
  };

  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#2A2A2A] text-xs font-medium text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors"
    >
      {copied ? "✓ Link copied" : "Share board"}
    </button>
  );
}
