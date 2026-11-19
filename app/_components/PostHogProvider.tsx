"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();
  // Issue 3 investigation, 19 Nov 2026 — confirmed live via PostHog's own
  // "pageview count" insight (11 pageviews recorded for one 6-question
  // Ticket Intelligence attempt). Cause: all 4 quiz components site-wide
  // (Ticket + Trip Intelligence, F1 + tennis) use window.history.
  // replaceState to sync in-progress answers into the URL — required so
  // a mid-flow sign-in (full navigation to /sign-in and back) can restore
  // answers from the URL on return, not just from in-memory React state.
  // That replaceState call DOES re-trigger useSearchParams() here in Next
  // 16's App Router, even though it bypasses the router's own navigation
  // APIs — confirmed wrong assumption otherwise, verified live rather than
  // asserted. Fix: only capture a new $pageview when pathname itself
  // changes (a real route, i.e. a different page) — not on every
  // searchParams-only change, which includes every one of those quiz
  // answer syncs. No other route on the site changes searchParams without
  // also changing pathname via a real navigation (checked: the only other
  // router.replace() call site, app/auth/confirm/page.tsx, changes route
  // too), so this doesn't lose any genuine page-to-page tracking.
  const lastPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname && ph && lastPathnameRef.current !== pathname) {
      lastPathnameRef.current = pathname;
      let url = window.origin + pathname;
      const search = searchParams.toString();
      if (search) url += "?" + search;
      ph.capture("$pageview", { $current_url: url });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}
