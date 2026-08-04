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
  "singapore-grand-prix": [
    // Every imageSlug below is a distinct experience, chosen for real
    // thematic fit to that spoke's actual content — not a placeholder
    // reused across multiple spokes. Fixed 1 Aug 2026 after the curator
    // caught 4 spokes (Weather/First-Timer/Arrival/Map) sharing one image
    // and 3 spokes (Day Trips/Trip Schedule/Luxury) sharing another —
    // same class of bug also seen on the Bahrain GP build. See
    // feedback_spoke_image_assignment_unclear memory before touching this
    // table again.
    { id: "cost", label: "Cost Guide", question: "How much does a Singapore GP weekend cost?", status: "teaser", imageSlug: "singapore-gp-turn1-grandstand", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/singapore-gp-2026-cost-spoke.jpg" },
    { id: "tickets", label: "Ticket Guide", question: "Which Singapore GP ticket offers the best value?", status: "teaser", imageSlug: "singapore-gp-ticket-guide", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost.jpg" },
    { id: "hotels", label: "Where to Stay", question: "Where should I stay for the Singapore GP?", status: "teaser", imageSlug: "singapore-gp-trackside-hotels" },
    { id: "getting-there", label: "Getting There", question: "How do I get around Singapore during race weekend?", status: "public", imageSlug: "singapore-gp-getting-around" },
    { id: "weather", label: "Weather & What to Pack", question: "What's the weather like at the Singapore GP, and what should I pack?", status: "public", imageSlug: "singapore-gp-waterfront-walk", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-packing.jpg" },
    { id: "first-timer-guide", label: "First-Timer's Guide", question: "What do I need to know for my first Singapore GP?", status: "public", imageSlug: "singapore-gp-first-timer-orientation" },
    { id: "where-to-eat", label: "Where to Eat", question: "Where to eat during Singapore GP race weekend?", status: "teaser", imageSlug: "singapore-gp-lau-pa-sat" },
    { id: "day-trips", label: "Day Trips", question: "What are the best day trips during a Singapore GP weekend?", status: "teaser", imageSlug: "singapore-gp-gardens-by-the-bay" },
    { id: "itinerary", label: "Trip Schedule", question: "What does a Singapore GP race weekend actually look like?", status: "teaser", imageSlug: "singapore-gp-padang-stage-concerts" },
    { id: "arrival", label: "Arrival & Queue Guide", question: "What time should I arrive at Marina Bay Street Circuit gates?", status: "public", imageSlug: "singapore-gp-stamford-grandstand", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-arrival.jpg" },
    { id: "map", label: "Venue Map", question: "What facilities are available at Marina Bay Street Circuit?", status: "public", imageSlug: "__no-image-yet__", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/singapore-gp-marina-bay-street-circuit.jpg" },
    { id: "luxury", label: "Luxury Guide", question: "What does a genuinely luxury Singapore GP weekend look like?", status: "teaser", imageSlug: "singapore-gp-paddock-club", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/singapore-grand-prix-luxury.jpg" },
  ],
};
