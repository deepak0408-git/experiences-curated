import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [updated] = await db
  .update(experiences)
  .set({
    bookingLinks: [
      {
        platform: "getyourguide",
        label: "Dubai Marina, Atlantis Palm & Burj Al Arab Speedboat Tour",
        url: "https://www.getyourguide.com/dubai-l173/dubai-marina-atlantis-palm-burj-al-arab-speedboat-tour-t90741/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
    lastVerifiedDate: new Date().toISOString().slice(0, 10),
  })
  .where(eq(experiences.slug, "dubai-by-night-mtffjvgvb5ks"))
  .returning({ id: experiences.id, slug: experiences.slug });

console.log("Updated:", updated);
await client.end();
