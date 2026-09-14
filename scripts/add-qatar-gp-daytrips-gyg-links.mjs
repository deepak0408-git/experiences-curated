import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real GetYourGuide affiliate links, provided by the founder 14 Sep 2026,
// covering all 5 experiences in the Qatar GP Day Trips spoke. Verified as
// genuine getyourguide.com domains before writing, per isRealAffiliateLink()'s
// own detection logic. Never constructed by Claude, per
// feedback_affiliate_link_generation — founder supplied each URL directly.
const LINKS = [
  {
    slug: "qatar-gp-khor-al-adaid-mtyn3hq9",
    label: "Doha: Inland Sea 4x4 Desert Safari",
    url: "https://www.getyourguide.com/al-wakrah-l183168/doha-inland-sea-tour-4x4-desert-safariall-activities-t820185/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "qatar-gp-museum-islamic-art-mtyn1cdh",
    label: "Museum of Islamic Art Admission Ticket",
    url: "https://www.getyourguide.com/doha-l1885/doha-museum-of-islamic-art-admission-ticket-t820011/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "qatar-gp-national-museum-qatar-mtyn2dn1",
    label: "National Museum of Qatar Admission Ticket",
    url: "https://www.getyourguide.com/doha-l1885/national-museum-of-qatar-admission-ticket-t767840/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  // Same night city tour link on both Pearl-Katara and Souq Waqif — one
  // product covers all three stops (Souq Waqif, Katara, Pearl-Qatar), per
  // founder's explicit choice of the night tour over the private day tour.
  {
    slug: "qatar-gp-pearl-katara-mtyn4luu",
    label: "Doha Night City Tour: Souq Waqif, Katara & Pearl-Qatar",
    url: "https://www.getyourguide.com/doha-l1885/doha-night-city-tour-to-souq-waqif-katara-and-pearl-qatar-t509010/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "qatar-gp-souq-waqif-mtyn629z",
    label: "Doha Night City Tour: Souq Waqif, Katara & Pearl-Qatar",
    url: "https://www.getyourguide.com/doha-l1885/doha-night-city-tour-to-souq-waqif-katara-and-pearl-qatar-t509010/?partner_id=HCNITTS&utm_medium=online_publisher",
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
    { platform: "getyourguide.com", label, url },
  ];
  await sql`UPDATE experiences SET booking_links = ${sql.json(bookingLinks)} WHERE slug = ${slug}`;
  console.log(`✓ ${current.title} — GYG link added`);
}

await sql.end();
