"use client";

import { useState } from "react";

// Uses the native Web Share API where available (iOS Safari, Android
// Chrome) — opens the real OS share sheet with WhatsApp/Instagram/
// Messages/etc. as actual targets, not just a copied link. Falls back to
// clipboard-copy (the original behavior) on desktop browsers that don't
// support navigator.share — most desktop Chrome/Firefox/Safari as of
// Aug 2026. Same canonical-URL pattern as before, no per-user scoping.
export default function ShareGuideButton({ slug, eventName }: { slug: string; eventName: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${window.location.origin}/event-pack/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${eventName} — Experiences | Curated`, text: `Check out this ${eventName} guide`, url });
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

    // Neither API available — happens on a non-secure-context origin
    // (plain http:// on a device other than localhost). Last-resort
    // fallback so the button never hard-crashes.
    window.prompt("Copy this link:", url);
  };

  return (
    <button
      onClick={share}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#2A2A2A] text-xs font-medium text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors"
    >
      {copied ? "✓ Link copied" : "Share guide"}
    </button>
  );
}
