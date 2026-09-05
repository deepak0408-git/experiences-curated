import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const today = new Date().toISOString().slice(0, 10);

const updates = [
  {
    slug: "burj-khalifa-dubai-day-trip-mtffjvgvvow3",
    links: [
      {
        platform: "getyourguide",
        label: "Burj Khalifa At the Top SKY (Level 148/124/125)",
        url: "https://www.getyourguide.com/dubai-l173/dubai-burj-khalifa-sky-level-148-124-125-entry-ticket-t49181/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
  },
  {
    slug: "sheikh-zayed-mosque-qasr-al-watan-mtffh4jnf7ao",
    links: [
      {
        platform: "getyourguide",
        label: "Sheikh Zayed Grand Mosque Guided Walking Tour",
        url: "https://www.getyourguide.com/abu-dhabi-l494/abu-dhabi-guided-walking-tour-at-sheikh-zayed-grand-mosque-t912924/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
      {
        platform: "getyourguide",
        label: "Qasr Al Watan Palace & Garden Entry Ticket",
        url: "https://www.getyourguide.com/abu-dhabi-l494/abu-dhabi-qasr-al-watan-palace-garden-entry-ticket-t962104/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
  },
  {
    slug: "louvre-abu-dhabi-yas-theme-parks-mtffjvgviamq",
    links: [
      {
        platform: "getyourguide",
        label: "Louvre Abu Dhabi Museum General Admission",
        url: "https://www.getyourguide.com/abu-dhabi-l494/louvre-abu-dhabi-museum-general-admission-ticket-t543875/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
      {
        platform: "getyourguide",
        label: "Yas Island Multi-Park Entry Ticket",
        url: "https://www.getyourguide.com/abu-dhabi-l494/abu-dhabi-yas-island-multi-park-entry-tickets-t962101/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
  },
];

for (const u of updates) {
  const [updated] = await db
    .update(experiences)
    .set({
      bookingLinks: u.links,
      lastVerifiedDate: today,
    })
    .where(eq(experiences.slug, u.slug))
    .returning({ id: experiences.id, slug: experiences.slug });

  console.log("Updated:", updated);
}

await client.end();
