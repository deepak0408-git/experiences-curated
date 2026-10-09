import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real GetYourGuide affiliate links, provided by the founder 9 Oct 2026,
// covering the Border-Gavaskar Trophy 2027 Day Trips spoke. Verified as
// genuine getyourguide.com domains before writing, per isRealAffiliateLink()'s
// own detection logic. Never constructed by Claude, per
// feedback_affiliate_link_generation — founder supplied each URL directly.
const LINKS = [
  {
    slug: "deekshabhoomi-muec81o8",
    label: "From Nagpur: Ramtek Temples & City Highlights Tour",
    url: "https://www.getyourguide.com/ramtek-l288208/from-nagpur-ramtek-temples-and-city-highlights-tour-t1491433/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "tadoba-tiger-safari-muec6gu2",
    label: "Tadoba Wildlife Tour",
    url: "https://www.getyourguide.com/nagpur-l95765/tadoba-wild-life-tour-t817085/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "marina-beach-kapaleeshwarar-mueci07c",
    label: "Best of Chennai: Guided Half-Day City Tour with Hotel Pickup",
    url: "https://www.getyourguide.com/chennai-l319/best-of-chennai-guided-half-day-city-tour-with-hotel-pickup-t1130466/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "mahabalipuram-daytrip-muecgrod",
    label: "From Chennai: Private Kanchipuram & Mahabalipuram Day Tour",
    url: "https://www.getyourguide.com/chennai-l319/from-chennai-private-kanchipuram-and-mahabalipuram-day-tour-t623023/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "sabarmati-ashram-muecqjmn",
    label: "Ahmedabad: Private Full-Day City Tour of Old & New Ahmedabad",
    url: "https://www.getyourguide.com/ahmedabad-l2635/ahmedabad-private-full-day-city-tour-of-old-new-ahmedabad-t1495026/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "statue-of-unity-muecwv9g",
    label: "From Ahmedabad: Statue of Unity Guided Tour",
    url: "https://www.getyourguide.com/ahmedabad-l2635/from-ahmedabad-statue-of-unity-guided-tour-t555549/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    slug: "gir-national-park-muecy99u",
    label: "Jeep Safari: Gir National Park Safari with Skip-the-Line Entry",
    url: "https://www.getyourguide.com/gujarat-l2634/jeep-safari-gir-national-park-safari-skip-the-line-entry-t476373/?partner_id=HCNITTS&utm_medium=online_publisher",
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
