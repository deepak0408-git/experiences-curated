"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

interface Props {
  experienceSlug: string;
  experienceTitle: string;
  eventSlug?: string;
  eventName?: string;
  sport?: string;
}

export default function ExperienceTracker({ experienceSlug, experienceTitle, eventSlug, eventName, sport }: Props) {
  useEffect(() => {
    // Super properties so `sport`/`eventSlug`/`eventName` also land on the
    // $pageview PostHogProvider already fired for this page, and on any
    // other event captured while the visitor stays on it — not just this
    // one manual experienceViewed call. Unregister when absent (e.g. an
    // experience with no linked event) so a stale value from a previous
    // page doesn't leak onto this one.
    if (sport || eventSlug) {
      posthog.register({ sport, eventSlug, eventName });
    } else {
      posthog.unregister("sport");
      posthog.unregister("eventSlug");
      posthog.unregister("eventName");
    }

    import("@/lib/posthog-events").then(({ phEvent }) =>
      phEvent.experienceViewed({ experienceSlug, experienceTitle, eventSlug, eventName, sport })
    );
  }, [experienceSlug, experienceTitle, eventSlug, eventName, sport]);

  return null;
}
