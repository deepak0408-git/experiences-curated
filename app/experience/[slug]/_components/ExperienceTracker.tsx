"use client";

import { useEffect } from "react";

interface Props {
  experienceSlug: string;
  experienceTitle: string;
  eventSlug?: string;
  eventName?: string;
}

export default function ExperienceTracker({ experienceSlug, experienceTitle, eventSlug, eventName }: Props) {
  useEffect(() => {
    import("@/lib/posthog-events").then(({ phEvent }) =>
      phEvent.experienceViewed({ experienceSlug, experienceTitle, eventSlug, eventName })
    );
  }, [experienceSlug, experienceTitle, eventSlug, eventName]);

  return null;
}
