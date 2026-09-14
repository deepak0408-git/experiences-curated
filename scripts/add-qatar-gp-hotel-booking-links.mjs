import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real Booking.com affiliate links, provided by the founder 14 Sep 2026 —
// CJ Affiliate redirect domains (anrdoezrs.net / jdoqocy.com / tkqlhce.com)
// with the real booking.com hotel URL encoded in each `url=` param, matching
// the documented real-link pattern in feedback_booking_com_affiliate_links.md.
// Never constructed by Claude, per feedback_affiliate_link_generation —
// founder supplied each URL directly.
const LINKS = [
  // "Raffles Doha & Fairmont Doha" is one combined experience — both hotel
  // links attach to the same slug, each with a distinct label.
  {
    slug: "qatar-gp-lusail-marina-hotels-mtymsd31",
    label: "Raffles Doha",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fqa%2Fraffles-doha.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AofxoNUGwAIB0gIkNzM2ZTRiODUtZDExOC00MGEwLWIzNzgtM2QxMzdkNjc5ZTg42AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D919491309_363570488_2_2_0%26checkin%3D2026-11-26%26checkout%3D2026-11-30%26dest_id%3D9194913%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D919491309_363570488_2_2_0%26hpos%3D1%26matching_block_id%3D919491309_363570488_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D919491309_363570488_2_2_0__1600000%26srepoch%3D1789409445%26srpvid%3Dffd57fd11dae019d%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    slug: "qatar-gp-lusail-marina-hotels-mtymsd31",
    label: "Fairmont Doha",
    url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fqa%2Ffairmont-doha.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AofxoNUGwAIB0gIkNzM2ZTRiODUtZDExOC00MGEwLWIzNzgtM2QxMzdkNjc5ZTg42AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26checkin%3D2026-11-26%26checkout%3D2026-11-30%26dest_id%3D9194915%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1789409472%26srpvid%3Dc9257fda379f0b1a%26type%3Dtotal%26ucfs%3D1%26%23no_availability_msg",
  },
  {
    slug: "qatar-gp-staybridge-suites-lusail-mtymtkn0",
    label: "Staybridge Suites Doha Lusail",
    url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fqa%2Fstaybridge-suites-doha-lusail.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AofxoNUGwAIB0gIkNzM2ZTRiODUtZDExOC00MGEwLWIzNzgtM2QxMzdkNjc5ZTg42AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26checkin%3D2026-11-26%26checkout%3D2026-11-30%26dest_id%3D3276672%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1789409487%26srpvid%3Dfb387fe6220d0436%26type%3Dtotal%26ucfs%3D1%26%23no_availability_msg",
  },
  {
    slug: "qatar-gp-pearl-hotel-mtymuro9",
    label: "Marsa Malaz Kempinski, The Pearl",
    url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fqa%2Fmarsa-malaz-kempinski-the-pearl-doha.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AofxoNUGwAIB0gIkNzM2ZTRiODUtZDExOC00MGEwLWIzNzgtM2QxMzdkNjc5ZTg42AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D118059518_427018617_2_0_0_611214%26checkin%3D2026-11-26%26checkout%3D2026-11-30%26dest_id%3D1180595%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D118059518_427018617_2_0_0_611214%26hpos%3D1%26matching_block_id%3D118059518_427018617_2_0_0_611214%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D118059518_427018617_2_0_0_611214_1174360%26srepoch%3D1789409509%26srpvid%3Da1617ff1283e02c1%26type%3Dtotal%26ucfs%3D1%26",
  },
  {
    slug: "qatar-gp-west-bay-hotel-mtymvrc6",
    label: "Four Seasons Hotel Doha",
    url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fqa%2Ffour-seasons-doha.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AofxoNUGwAIB0gIkNzM2ZTRiODUtZDExOC00MGEwLWIzNzgtM2QxMzdkNjc5ZTg42AIB4AIB%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D44682901_94468089_2_2_0%26checkin%3D2026-11-26%26checkout%3D2026-11-30%26dest_id%3D446829%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D44682901_94468089_2_2_0%26hpos%3D1%26matching_block_id%3D44682901_94468089_2_2_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D44682901_94468089_2_2_0__1100000%26srepoch%3D1789409528%26srpvid%3D66db7ffb9b41042c%26type%3Dtotal%26ucfs%3D1%26",
  },
];

for (const { slug, label, url } of LINKS) {
  const [current] = await sql`SELECT title, booking_links FROM experiences WHERE slug = ${slug}`;
  if (!current) {
    console.log(`✗ No experience found for slug ${slug}`);
    continue;
  }
  const existing = current.booking_links ?? [];
  const bookingLinks = [
    ...existing.filter((l) => l.label !== label),
    { platform: "booking.com", label, url },
  ];
  await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${slug}`;
  console.log(`✓ ${current.title} — ${label} link added`);
}

await sql.end();
