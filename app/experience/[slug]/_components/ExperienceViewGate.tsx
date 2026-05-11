"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_NAME = "ec_views";
const FREE_VIEWS = 3;
const COOKIE_DAYS = 30;

function getViewedSlugs(): string[] {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    if (!match) return [];
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return [];
  }
}

function saveViewedSlugs(slugs: string[]) {
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(slugs))}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function ExperienceViewGate({
  slug,
  eventPackSlug,
  eventPackName,
  priceDisplay,
  isPro,
}: {
  slug: string;
  eventPackSlug: string;
  eventPackName: string;
  priceDisplay: string;
  isPro: boolean;
}) {
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (isPro) return;

    const viewed = getViewedSlugs();
    const alreadySeen = viewed.includes(slug);

    if (!alreadySeen) {
      const updated = [...viewed, slug];
      saveViewedSlugs(updated);
      // Show paywall if this view pushed them past the free limit
      if (viewed.length >= FREE_VIEWS) {
        setShowPaywall(true);
      }
    } else {
      // Repeat view — show paywall only if already over limit
      if (viewed.length > FREE_VIEWS) {
        setShowPaywall(true);
      }
    }
  }, [slug, isPro]);

  if (!showPaywall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop — not clickable, content is locked */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
          You&apos;ve read {FREE_VIEWS} free experiences
        </p>
        <h2 className="text-2xl font-bold text-neutral-900 leading-snug mb-3">
          Enjoying the guide?
        </h2>
        <p className="text-sm text-neutral-600 leading-6 mb-6">
          The full {eventPackName} pack has everything you need — where to eat,
          where to stay, how to get there, and the insider moves that make the difference.
          Hand-picked, not aggregated.
        </p>

        <Link
          href={`/event-pack/${eventPackSlug}`}
          className="block w-full text-center px-6 py-3.5 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors mb-3"
        >
          Get the full pack — {priceDisplay}
        </Link>

        <Link
          href="/"
          className="block w-full text-center text-xs text-neutral-400 hover:text-neutral-700 transition-colors py-2"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
