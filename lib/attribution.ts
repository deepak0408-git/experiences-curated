"use client";

// Issue 12, 20 Nov 2026 — first-touch UTM capture for purchase attribution.
// A visitor usually lands on a UTM-tagged page, then navigates elsewhere
// before buying — by checkout time, window.location no longer has the
// UTM params. This persists them (first-touch only, via sessionStorage) so
// any later checkout call in the same browser tab session can still read
// them. Session-scoped deliberately, not localStorage: attribution should
// reflect the session that actually converted, not carry forever across
// unrelated future visits.
const STORAGE_KEY = "ec_first_touch_utm";

type FirstTouchUtm = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export function captureFirstTouchUtm(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return; // already captured this session
    const params = new URLSearchParams(window.location.search);
    const utm: FirstTouchUtm = {};
    if (params.get("utm_source")) utm.utmSource = params.get("utm_source")!;
    if (params.get("utm_medium")) utm.utmMedium = params.get("utm_medium")!;
    if (params.get("utm_campaign")) utm.utmCampaign = params.get("utm_campaign")!;
    if (Object.keys(utm).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // sessionStorage can throw in private-browsing/blocked-storage contexts — attribution is best-effort, never fatal.
  }
}

export function getFirstTouchUtm(): FirstTouchUtm {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FirstTouchUtm) : {};
  } catch {
    return {};
  }
}
