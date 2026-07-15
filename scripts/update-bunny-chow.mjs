import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences } from "../schema/database.ts";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "2271b631-4f0c-48e7-90b8-08a8ff843f70";

const bodyContent = `Durban has the largest Indian diaspora outside of India itself, and the city's food culture reflects that history directly rather than as an imported trend. Bunny chow — a hollowed-out loaf of bread filled with curry — is the dish that best represents it, and it was invented in Durban, not brought here fully formed from elsewhere.

The dish's origins trace to Indian indentured labourers and traders in early-to-mid 20th century Durban, who needed a portable, contained way to eat curry without cutlery — the bread became both container and food. It's since become the city's defining street food, sold everywhere from casual takeaway spots to established sit-down restaurants, typically ordered by the "quarter," "half," or "full" loaf depending on how hungry you are, and by filling (mutton, chicken, bean, or vegetable curries are all standard). CaneCutters, with locations in Glenwood and Umhlanga, is one currently-trading spot worth naming directly — a quarter mutton bunny runs around R65-R100 depending on filling, prawn curry included.

Beyond bunny chow specifically, Durban's Indian Ocean cuisine draws on decades of Indian culinary tradition adapted with local ingredients and spice blends distinct from Indian subcontinental cooking — Durban curries tend to run hotter and use different spice combinations than their Indian counterparts, having evolved separately for well over a century. The signature dish beyond bunny chow is Durban king prawn curry, a fiery, tomato-and-spice-heavy preparation that draws on the warm Indian Ocean waters off KwaZulu-Natal, where prawns, crayfish, and line fish are abundant. Several established hotel restaurants along the coast run dedicated curry buffets — a practical way to sample a wide spread of Durban curry styles, from fish to lamb to vegetarian, in one sitting rather than committing to a single dish.

The Victoria Street Market in the CBD is the traditional starting point for understanding this food culture — a covered market selling spices, ingredients, and quick eats that's been part of Durban's Indian community life for generations, worth a visit even if you're eating your actual meals elsewhere.`;

const practicalInfo = {
  hours: "Bunny chow spots and the Victoria Street Market keep standard daytime and evening trading hours — check individual venues",
  website: null,
  costRange: "Bunny chow is genuinely inexpensive street food — a quarter loaf typically runs R37-R100 depending on filling (bean and chicken cheapest, mutton and prawn at the top), enough for a full meal; sit-down Indian Ocean cuisine restaurants and hotel curry buffets sit in the moderate range, roughly R245-R295 per person for a buffet, less for an à la carte main.",
  bookingMethod: "Bunny chow spots are walk-in, no reservation needed. Sit-down restaurants and hotel curry buffets may be worth booking ahead for dinner, particularly during the tour's peak weeks.",
  reservationsRequired: false,
};

const insiderTips = [
  "Order a 'quarter' bunny if you're not sure how hungry you are — it's a genuinely substantial portion despite the name.",
  "Bean bunny chow is the vegetarian option and is just as traditional as the meat versions — don't assume it's an afterthought on the menu.",
];

const whatToAvoid = "Don't judge Durban curry heat by Indian subcontinental standards — Durban's spice tradition evolved separately and can run hotter than visitors expect. And don't order a bunny chow expecting to eat it neatly with cutlery at a formal table — the bread-as-container format is designed to be eaten by hand, gravy soaking into the loaf as you go, and a knife-and-fork approach at a casual takeaway spot will mark you out as a tourist without actually improving the eating experience.";

try {
  const imageKey = "experiences/hero/durban-bunny-chow-indian-ocean-cuisine.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync("Images/Chicken_Curry_Bunny_Chow.jpg"),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [result] = await db.update(experiences).set({
    heroImageUrl,
    heroImageAlt: "Chicken curry bunny chow, a hollowed-out loaf filled with curry, Durban's signature street food",
    heroImageCredit: "Lucinda jolly, CC BY-SA 4.0",
    bodyContent,
    practicalInfo,
    insiderTips,
    whatToAvoid,
    editorialNote: "Sources: eatout.co.za (5 great bunny chows in Durban), canecutters.com + tripadvisor.com (CaneCutters, confirmed currently trading 2026, real menu prices), southafrica.net (Durban Indian cuisine history), hobbychefbloke.com/eatmeerecipes.co.za (Durban king prawn curry), oysterboxhotel.com + tripadvisor.com (hotel curry buffet pricing). Verified 14 Jul 2026.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
