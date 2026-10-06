// Strips a trailing 4-digit year (and optional "-NN" second year, e.g.
// "2026-27") off an event name/label. sportingEvents.name and the
// SHORT_NAMES map below both carry the CURRENT edition's year, which rolls
// forward year to year for evergreen-slug events — callers that need a
// year-agnostic label (testimonials, cross-links) strip it here rather than
// duplicating this regex per call site.
export function stripYear(name: string): string {
  return name.replace(/\s+\d{4}(-\d{2,4})?\s*$/, "").trim();
}

export function shortEventName(name: string, slug: string): string {
  // Derive a short display name from the slug — more reliable than string-stripping
  const SHORT_NAMES: Record<string, string> = {
    // Real key for the evergreen-slug event (migrated 14 Aug 2026). Updated
    // to 2027 (16 Aug 2026 audit) after the sportingEvents row rolled to the
    // 2027 edition — this table doesn't update itself when a row's edition
    // changes, same class of gap as the pre-trip brief and hero image.
    "wimbledon": "Wimbledon 2027",
    // Kept for consistency with the other permanent-fallback tables, though
    // this map has no fallback-on-miss behavior of its own (falls back to
    // the real event name via `?? name`, per the hub-and-spoke skill's §4c).
    "wimbledon-2026": "Wimbledon 2026",
    "india-in-england-cricket-2026": "India in England 2026",
    "open-championship-2026": "The Open 2026",
    "belgian-gp-2026": "Belgian GP 2026",
    // Real key for the evergreen-slug event (migrated 5 Oct 2026), rolled
    // forward to the 2027 edition in the same migration.
    "us-open": "US Open 2027",
    // Kept for consistency with the other permanent-fallback tables (see
    // "wimbledon-2026" above) — no live row uses this key anymore.
    "us-open-2026": "US Open 2027",
    "hungarian-gp-2026": "Hungarian GP 2026",
    // Real key for the evergreen-slug event (migrated Sep 2026), rolled
    // forward to the 2027 edition in the same migration.
    "italian-grand-prix": "Italian GP 2027",
    // Kept for consistency with the other permanent-fallback tables (see
    // "wimbledon-2026" above) — no live row uses this key anymore.
    "italian-gp-2026": "Italian GP 2026",
    "bmw-pga-championship-2026": "BMW PGA 2026",
    "australia-in-south-africa-cricket-2026": "Aus in S. Afr. 2026",
    "bahrain-grand-prix": "Bahrain GP 2026",
    "singapore-grand-prix": "Singapore GP 2026",
    "atp-finals": "ATP Finals 2026",
    "shanghai-masters": "Shanghai Masters 2026",
    "new-zealand-in-australia-cricket-2026-27": "NZ in Australia 2026-27",
    "las-vegas-grand-prix": "Las Vegas GP 2026",
    "abu-dhabi-grand-prix": "Abu Dhabi GP 2026",
    "french-open": "French Open 2027",
    "united-states-grand-prix": "US GP 2026",
    "mexico-city-grand-prix": "Mexico City GP 2026",
    "brazilian-grand-prix": "São Paulo GP 2026",
    "qatar-grand-prix": "Qatar GP 2026",
    "australian-grand-prix": "Australian GP 2027",
    // Missing since the japanese-grand-prix-2027 -> japanese-grand-prix slug
    // correction (22 Sep 2026) — added 29 Sep 2026 alongside the
    // INTRO_BY_EVENT/PACK_PRICING_CONFIG fix.
    "japanese-grand-prix": "Japanese GP 2027",
    // Build-status memories for both these events claimed this entry was
    // already added — it wasn't. Added 29 Sep 2026 alongside the same
    // INTRO_BY_EVENT/PACK_PRICING_CONFIG fix.
    "chinese-grand-prix": "Chinese GP 2027",
    "border-gavaskar-trophy-2027": "Border-Gavaskar 2027",
  };
  return SHORT_NAMES[slug] ?? name;
}
