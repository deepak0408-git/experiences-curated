import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Real Google Places API lookups, 5 Sep 2026:
// The Alamo — 4.6/66,364 reviews
// San Antonio Missions National Historical Park — 4.8/9,026 reviews
const ALAMO_LINK = "https://maps.google.com/?cid=1727569228890358818&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const MISSIONS_LINK = "https://maps.google.com/?cid=16036162671398090939&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

const [row] = await db
  .select({ id: experiences.id, bodyContent: experiences.bodyContent, address: experiences.address, gettingThere: experiences.gettingThere })
  .from(experiences)
  .where(eq(experiences.slug, "us-gp-san-antonio-daytrip-mtns7igg"));

// Add inline rating link to The Alamo's first mention
const oldAlamoSentence = "The Alamo is the obvious starting point, and it's genuinely free to visit";
const newAlamoSentence = `The Alamo [See live rating and reviews on Google Maps](${ALAMO_LINK}) is the obvious starting point, and it's genuinely free to visit`;

// Add inline rating link to the Missions park mention
const oldMissionsSentence = "together form San Antonio Missions National Historical Park. This is the most complete, intact group";
const newMissionsSentence = `together form San Antonio Missions National Historical Park [See live rating and reviews on Google Maps](${MISSIONS_LINK}). This is the most complete, intact group`;

let bodyContent = row.bodyContent;
if (!bodyContent.includes(oldAlamoSentence)) throw new Error("Alamo sentence not found");
if (!bodyContent.includes(oldMissionsSentence)) throw new Error("Missions sentence not found");
bodyContent = bodyContent.replace(oldAlamoSentence, newAlamoSentence);
bodyContent = bodyContent.replace(oldMissionsSentence, newMissionsSentence);

// Address: add the Missions Visitor Center address alongside the existing Alamo address
const address = `${row.address}. San Antonio Missions National Historical Park Visitor Center (Mission San José): 6701 San Jose Dr, San Antonio, TX 78214.`;

// Getting there: clarify the Missions sit south of downtown, separate driving note
const gettingThere = `${row.gettingThere} The four park missions (Concepción, San José, San Juan, Espada) are spread along the Mission Reach south of downtown — driving or the free park shuttle between sites is more realistic than walking between all four in one visit.`;

await db.update(experiences).set({ bodyContent, address, gettingThere }).where(eq(experiences.id, row.id));

console.log("✓ Added Alamo (4.6/66,364) and San Antonio Missions (4.8/9,026) rating links to bodyContent");
console.log("✓ Added Missions Visitor Center address");
console.log("✓ Clarified getting-there for the four Mission sites");
await client.end();
