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
  "atp-finals": [
    // Real experience slugs assigned 6 Aug 2026, once hero images existed
    // to draw from — see feedback_hub_and_spoke_missing_tripboard_and_pro_gate
    // and project_atp_finals_experiences memory for build history. No
    // dedicated spoke-tile imageOverride assets exist for this event yet;
    // these map each spoke to its closest-fit real, image-bearing experience.
    { id: "cost", label: "Cost Guide", question: "How much does an ATP Finals trip to Turin cost?", status: "teaser", imageSlug: "atp-finals-royal-palace-" },
    { id: "tickets", label: "Ticket Guide", question: "Which ATP Finals ticket is the best buy?", status: "teaser", imageSlug: "atp-finals-ticket-guide-", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost.jpg", heroImagePosition: "center 25%" },
    { id: "hotels", label: "Where to Stay", question: "Where should I stay for the ATP Finals in Turin?", status: "teaser", imageSlug: "atp-finals-luxury-hotels-", heroImagePosition: "center 88%" },
    { id: "getting-there", label: "Getting There", question: "How do I get to Inalpi Arena, and around Turin?", status: "public", imageSlug: "atp-finals-getting-to-inalpi-arena-" },
    { id: "weather", label: "Weather & What to Pack", question: "What's the weather like in Turin in November, and what should I pack?", status: "public", imageSlug: "atp-finals-inalpi-arena-", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-packing.jpg" },
    { id: "first-timer-guide", label: "First-Timer's Guide", question: "What do I need to know for my first ATP Finals?", status: "public", imageSlug: "atp-finals-mole-antonelliana-" },
    { id: "where-to-eat", label: "Where to Eat", question: "Where to eat in Turin during the ATP Finals?", status: "teaser", imageSlug: "atp-finals-piedmontese-dining-" },
    { id: "day-trips", label: "Day Trips", question: "What are the best day trips from Turin?", status: "teaser", imageSlug: "atp-finals-barolo-langhe-daytrip-" },
    { id: "itinerary", label: "Trip Schedule", question: "What does an ATP Finals week in Turin actually look like?", status: "teaser", imageSlug: "atp-finals-piazza-san-carlo-" },
    { id: "arrival", label: "Arrival & Queue Guide", question: "What time should I arrive at Inalpi Arena?", status: "public", imageSlug: "atp-finals-inalpi-arena-", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-arrival.jpg" },
    { id: "map", label: "Venue Map", question: "What facilities are available at Inalpi Arena?", status: "public", imageSlug: "atp-finals-inalpi-arena-" },
    { id: "luxury", label: "Luxury Guide", question: "What's the best hospitality option at the ATP Finals?", status: "teaser", imageSlug: "atp-finals-gianduja-chocolate-" },
  ],
  // Shanghai Masters 2026 — built overnight 8-9 Aug 2026, 18 experiences
  // seeded (status: in_review, not yet published — spoke tiles will show no
  // experience cards until the curator publishes via /curator/review).
  // imageSlug values match real seeded experience slugs; no dedicated
  // spoke-tile imageOverride assets exist yet (hero images not yet sourced
  // as of this scaffolding — see project memory).
  "shanghai-masters": [
    { id: "cost", label: "Cost Guide", question: "How much does a Shanghai Masters trip cost?", status: "teaser", imageSlug: "lujiazui-skyline-shanghai-" },
    { id: "tickets", label: "Ticket Guide", question: "Which Shanghai Masters ticket is the best buy?", status: "teaser", imageSlug: "qizhong-forest-sports-city-arena-", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost.jpg" },
    { id: "hotels", label: "Where to Stay", question: "Where should I stay for the Shanghai Masters?", status: "teaser", imageSlug: "where-to-stay-shanghai-masters-" },
    { id: "getting-there", label: "Getting There", question: "How do I get to Qizhong, and is the metro enough?", status: "public", imageSlug: "getting-to-qizhong-shanghai-masters-" },
    { id: "weather", label: "Weather & What to Pack", question: "What's the weather like in Shanghai in October?", status: "public", imageSlug: "the-bund-shanghai-dusk-", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-packing.jpg" },
    { id: "first-timer-guide", label: "First-Timer's Guide", question: "What do I need to know before my first trip to China?", status: "public", imageSlug: "china-visa-apps-payments-guide-" },
    { id: "where-to-eat", label: "Where to Eat", question: "Where to eat in Shanghai during Masters week?", status: "teaser", imageSlug: "xiaolongbao-shanghai-guide-" },
    { id: "day-trips", label: "Day Trips", question: "What are the best day trips from Shanghai?", status: "teaser", imageSlug: "hangzhou-west-lake-day-trip-" },
    { id: "itinerary", label: "Trip Schedule", question: "What does a Shanghai Masters week actually look like?", status: "teaser", imageSlug: "shanghai-masters-crowds-atmosphere-" },
    { id: "arrival", label: "Arrival & Queue Guide", question: "Pudong or Hongqiao, and how do I get into the city?", status: "public", imageSlug: "shanghai-maglev-airport-question-" },
    { id: "map", label: "Venue Map", question: "What facilities are available at Qizhong?", status: "public", imageSlug: "qizhong-forest-sports-city-arena-" },
    { id: "luxury", label: "Luxury Guide", question: "What's the best luxury hospitality in Shanghai?", status: "teaser", imageSlug: "luxury-shanghai-peninsula-bulgari-" },
  ],
  // Wimbledon — classic-to-hub-and-spoke conversion, 14 Aug 2026 (bundled
  // with the evergreen-slug migration per the hub-and-spoke skill's standing
  // rule). All 19 experiences are real, published, pack-ranked, and already
  // hero-imaged (this pack shipped under the old classic format first, so
  // unlike a brand-new build, real images already exist — no
  // "__no-image-yet__" sentinel needed here). imageSlug values are distinct
  // real experience slugs, one per spoke, no forced duplication (see
  // feedback_spoke_image_assignment_unclear memory).
  //
  // Weather/Arrival/Tickets use the skill's standing cross-event default
  // images (imageOverride) — same 3 fixed Bahrain GP-sourced files every
  // hub-and-spoke event uses for these 3 spokes, confirmed 1 Aug 2026.
  // Missed on Wimbledon's first pass (14 Aug 2026, caught by the founder
  // reviewing the rendered hub) — fixed here.
  wimbledon: [
    { id: "cost", label: "Cost Guide", question: "How much does a Wimbledon trip cost?", status: "teaser", imageSlug: "wimbledon-centre-court-" },
    { id: "tickets", label: "Ticket Guide", question: "Which Wimbledon ticket is the best buy — Centre Court, No. 1 Court, or the grounds?", status: "teaser", imageSlug: "wimbledon-no1-court-", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost.jpg" },
    { id: "hotels", label: "Where to Stay", question: "Where should I stay for Wimbledon?", status: "teaser", imageSlug: "wimbledon-cannizaro-house-" },
    { id: "getting-there", label: "Getting There", question: "How do I get to the All England Club?", status: "public", imageSlug: "traveling-to-the-all-england-club-" },
    { id: "weather", label: "Weather & What to Pack", question: "What's the weather like at Wimbledon, and what should I pack?", status: "public", imageSlug: "wimbledon-when-it-rains-", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-packing.jpg" },
    { id: "first-timer-guide", label: "First-Timer's Guide", question: "What do I need to know for my first Wimbledon?", status: "public", imageSlug: "preparing-for-your-wimbledon-visit-" },
    { id: "where-to-eat", label: "Where to Eat", question: "Where to eat at and around Wimbledon during the Fortnight?", status: "teaser", imageSlug: "wimbledon-eating-" },
    { id: "day-trips", label: "Day Trips", question: "What's the best day trip during Wimbledon — Windsor, or a day in London?", status: "teaser", imageSlug: "windsor-castle-long-walk-" },
    { id: "itinerary", label: "Trip Schedule", question: "What does a Wimbledon Fortnight trip actually look like?", status: "teaser", imageSlug: "sw19-during-the-fortnight-" },
    { id: "arrival", label: "Arrival & Queue Guide", question: "What time should I join the Wimbledon Queue?", status: "public", imageSlug: "the-wimbledon-queue-", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-arrival.jpg" },
    { id: "map", label: "Venue Map", question: "What facilities are available at the All England Club?", status: "public", imageSlug: "wimbledon-outer-courts-" },
    { id: "luxury", label: "Luxury Guide", question: "What's the best hospitality option at Wimbledon?", status: "teaser", imageSlug: "wimbledon-the-lawn-hospitality-" },
  ],
  // New Zealand tour of Australia 2026-27 — 4-Test cricket series across
  // Perth, Adelaide, Melbourne, and Sydney. Scaffolded 16 Aug 2026, all 24
  // experiences already real/seeded/hero-imaged (built before this spoke
  // config, see project_nz_in_australia_experiences memory) — real
  // imageSlug values used directly, no "__no-image-yet__" sentinel needed.
  // Weather/Arrival/Tickets use the skill's standing cross-event default
  // images (imageOverride), same 3 fixed Bahrain-GP-sourced files every
  // hub-and-spoke event uses for these 3 spokes.
  "new-zealand-in-australia-cricket-2026-27": [
    { id: "cost", label: "Cost Guide", question: "How much does a full NZ-Australia series trip cost?", status: "teaser", imageSlug: "mcg-boxing-day-test-msvo4eko" },
    { id: "tickets", label: "Ticket Guide", question: "Which NZ-Australia Test ticket is the best buy?", status: "teaser", imageSlug: "nz-australia-series-ticket-guide-msvod4sn", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost.jpg" },
    { id: "hotels", label: "Where to Stay", question: "Where should I stay across the four Test cities?", status: "teaser", imageSlug: "where-to-stay-melbourne-boxing-day-msvp80zu" },
    { id: "getting-there", label: "Getting There", question: "How do I get between Perth, Adelaide, Melbourne, and Sydney?", status: "public", imageSlug: "getting-between-four-cities-flights-not-trains-msvrvq4aq2" },
    { id: "weather", label: "Weather & What to Pack", question: "What's the weather like across an Australian summer tour, and what should I pack?", status: "public", imageSlug: "perth-stadium-series-opener-msvnyanm", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-packing.jpg" },
    { id: "first-timer-guide", label: "First-Timer's Guide", question: "What do I need to know for my first NZ-Australia Test series?", status: "public", imageSlug: "beige-brigade-nz-traveling-support-msvrvq4a15" },
    { id: "where-to-eat", label: "Where to Eat", question: "Where to eat across Perth, Adelaide, Melbourne, and Sydney during the series?", status: "teaser", imageSlug: "where-nz-fans-actually-eat-city-guide-msvrvq4acy" },
    { id: "day-trips", label: "Day Trips", question: "What are the best day trips across a four-city Australian tour?", status: "teaser", imageSlug: "fremantle-day-trip-from-perth-msvq3fc0" },
    { id: "itinerary", label: "Trip Schedule", question: "What does a full four-Test NZ-Australia series trip actually look like?", status: "teaser", imageSlug: "blue-mountains-day-trip-from-sydney-msvq9l5b" },
    { id: "arrival", label: "Arrival & Queue Guide", question: "What time should I arrive at each Test venue?", status: "public", imageSlug: "adelaide-oval-most-beautiful-ground-msvo1gxa", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-arrival.jpg" },
    { id: "map", label: "Venue Map", question: "What facilities are available at each of the four Test grounds?", status: "public", imageSlug: "scg-fourth-test-sydney-summer-msvoaji7" },
    { id: "luxury", label: "Luxury Guide", question: "What does a genuinely luxury NZ-Australia series trip look like?", status: "teaser", imageSlug: "scg-luxury-invincibles-lounge-members-pavilion-msvosomt" },
  ],
  // Australian Open 2027 — built 24 Aug 2026. All 20 experiences already
  // real/seeded/hero-imaged (research + hero-image passes both completed
  // before this scaffolding), so real imageSlug values are used directly,
  // no "__no-image-yet__" sentinel needed. Weather/Arrival/Tickets use the
  // skill's standing cross-event default images (imageOverride), same 3
  // fixed Bahrain-GP-sourced files every hub-and-spoke event uses for these
  // 3 spokes — set here at config-creation time, not deferred.
  "australian-open": [
    { id: "cost", label: "Cost Guide", question: "How much does an Australian Open trip cost?", status: "teaser", imageSlug: "rod-laver-arena-inside-main-court-o0lvsc", heroImagePosition: "center 75%" },
    { id: "tickets", label: "Ticket Guide", question: "Which Australian Open ticket is the best buy — grounds pass, reserved seat, or finals?", status: "teaser", imageSlug: "ao-ticket-guide-grounds-session-finals-p0773j", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-cost.jpg" },
    { id: "hotels", label: "Where to Stay", question: "Where should I stay for the Australian Open?", status: "teaser", imageSlug: "where-to-stay-melbourne-boxing-day-msvp80zu" },
    { id: "getting-there", label: "Getting There", question: "How do I get to Melbourne Park?", status: "public", imageSlug: "getting-to-melbourne-park-transit-ddujvz" },
    { id: "weather", label: "Weather & What to Pack", question: "What's the weather like at the Australian Open, and what should I pack?", status: "public", imageSlug: "melbourne-january-heat-what-to-pack-df5qwz", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-packing.jpg" },
    { id: "first-timer-guide", label: "First-Timer's Guide", question: "What do I need to know for my first Australian Open?", status: "public", imageSlug: "first-timers-guide-etiquette-crowd-culture-fdp4b7" },
    { id: "where-to-eat", label: "Where to Eat", question: "Where to eat at and around the Australian Open?", status: "teaser", imageSlug: "melbourne-coffee-food-culture-guide-bt5u1c" },
    { id: "day-trips", label: "Day Trips", question: "What are the best day trips during the Australian Open?", status: "teaser", imageSlug: "great-ocean-road-twelve-apostles-daytrip-msxbk23p" },
    { id: "itinerary", label: "Trip Schedule", question: "What does an Australian Open trip actually look like?", status: "teaser", imageSlug: "late-night-melbourne-park-midnight-finishes-svfimc", heroImagePosition: "center 32%" },
    { id: "arrival", label: "Arrival & Queue Guide", question: "What time should I arrive at Melbourne Park?", status: "public", imageSlug: "outside-courts-grounds-pass-strategy-cxqxp7", imageOverride: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events%2Fhero%2Fbahrain-grand-prix-arrival.jpg" },
    { id: "map", label: "Venue Map", question: "What facilities are available at Melbourne Park?", status: "public", imageSlug: "margaret-court-john-cain-arenas-cnqerg" },
    { id: "luxury", label: "Luxury Guide", question: "What's the best hospitality option at the Australian Open?", status: "teaser", imageSlug: "corporate-hospitality-premium-suites-qspcms" },
  ],
};
