import type { SpokeConfig } from "./getSpokeData";

// One entry per hub_and_spoke-format event. Always the same 12 spoke ids
// (see hub-and-spoke-event-pack skill) — only label/question/imageSlug
// change per event. href is derived from the slug at render time, not
// stored here, so this config never goes stale if a route moves.
//
// imageSlug values are substrings matched against real seeded experience
// slugs (see getSpokeImage) — confirmed against the real Bahrain GP
// experience list before being wired in (29 Jul 2026).
export const SPOKES_BY_EVENT: Record<string, SpokeConfig[]> = {
  "bahrain-grand-prix": [
    { id: "cost", label: "Cost Guide", question: "How much does a Sepang weekend cost?", status: "teaser", imageSlug: "main-grandstand-sepang-start-finish", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost-circuit.jpg" },
    { id: "tickets", label: "Ticket Guide", question: "Which grandstand ticket is the best buy for Sepang?", status: "teaser", imageSlug: "hill-stand-c2-sepang-general-admission", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost.jpg" },
    { id: "hotels", label: "Where to Stay", question: "Where should I stay for the Bahrain GP in Malaysia?", status: "teaser", imageSlug: "staying-in-kuala-lumpur-klcc-bukit-bintang" },
    { id: "getting-there", label: "Getting There", question: "How do I get to Sepang Circuit, and how close is it really to KLIA?", status: "public", imageSlug: "getting-to-sepang-circuit-klia" },
    { id: "weather", label: "Weather & What to Pack", question: "What's the weather like at Sepang, and what should I pack?", status: "public", imageSlug: "sepang-circuit-history-f1-return", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-packing.jpg" },
    { id: "first-timer-guide", label: "First-Timer's Guide", question: "What do I need to know for my first Sepang race weekend?", status: "public", imageSlug: "malaysia-f1-fans-nostalgia-2026-return" },
    { id: "where-to-eat", label: "Where to Eat", question: "Where to eat in Kuala Lumpur during race weekend?", status: "teaser", imageSlug: "jalan-alor-night-food-street-kl" },
    { id: "day-trips", label: "Day Trips", question: "What are the best day trips from Kuala Lumpur?", status: "teaser", imageSlug: "genting-highlands-day-trip-cool-climate" },
    { id: "itinerary", label: "Trip Schedule", question: "What does a Sepang F1 race weekend actually look like?", status: "teaser", imageSlug: "petronas-twin-towers-kl-skybridge" },
    { id: "arrival", label: "Arrival & Queue Guide", question: "What time should I arrive at Sepang gates?", status: "public", imageSlug: "k1-grandstand-sepang-turn-1", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-arrival.jpg" },
    { id: "map", label: "Venue Map", question: "What facilities are available at Sepang International Circuit?", status: "public", imageSlug: "grandstand-f-sepang-panoramic", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-venue-map.jpg" },
    { id: "luxury", label: "Luxury Guide", question: "What's the best hospitality option at Sepang?", status: "teaser", imageSlug: "f1-paddock-club-sepang-hospitality" },
  ],
};
