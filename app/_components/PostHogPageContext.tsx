"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface Props {
  sport?: string | null;
  eventSlug?: string | null;
  eventName?: string | null;
}

// Registers sport/eventSlug/eventName as PostHog super properties for as
// long as this page is mounted, so $pageview (fired by PostHogProvider) and
// every other event captured on this page inherit them automatically —
// without this, pageviews on event-pack, hub-and-spoke, and blog article
// pages carry no sport/event context at all, making it impossible to slice
// raw traffic by sport or event in PostHog. Unregisters on unmount so a
// value from this page doesn't leak onto the next page the visitor lands on
// before that page's own effect (if any) runs.
export default function PostHogPageContext({ sport, eventSlug, eventName }: Props) {
  useEffect(() => {
    if (sport || eventSlug) {
      posthog.register({
        ...(sport ? { sport } : {}),
        ...(eventSlug ? { eventSlug } : {}),
        ...(eventName ? { eventName } : {}),
      });
    }
    return () => {
      posthog.unregister("sport");
      posthog.unregister("eventSlug");
      posthog.unregister("eventName");
    };
  }, [sport, eventSlug, eventName]);

  return null;
}
