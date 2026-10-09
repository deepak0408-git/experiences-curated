import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// Sets sportingEvents.heroImageUrl for Border-Gavaskar Trophy 2027 to the
// same image already used as the hub page's heroFallbackImageSlug
// ("narendra-modi-stadium-mueclmpw") — explicit founder instruction during
// the pre-deployment audit, 9 Oct 2026, not a Claude-picked image.
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const HERO_URL =
  "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/bgt-narendra-modi-stadium-ahmedabad.jpg";

await sql`
  update sporting_events
  set hero_image_url = ${HERO_URL}
  where id = ${EVENT_ID}
`;

const [row] = await sql`select hero_image_url from sporting_events where id = ${EVENT_ID}`;
console.log("sportingEvents.heroImageUrl now:", row.hero_image_url);

await sql.end();
