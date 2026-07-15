import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";

const preTripBriefLines = [
  "Weather: Spring across three very different climates — Durban is warm and humid, Johannesburg sits at 1,750m with strong UV even in September/October, Cape Town stays cool and changeable through late October. Pack for all three if you're covering the full three-city trip. Check each city's AccuWeather link in the Quick Reference table closer to your travel dates.",
  "Transport: Domestic flights (FlySafair, Airlink) are the practical way to move between Durban, Johannesburg, and Cape Town — book early, fares rise sharply closer to each leg. Within each city, Uber and Bolt are the reliable options; Johannesburg's Gautrain also covers the Sandton-airport run well. Don't plan on driving between cities — the distances run 600km-plus.",
  "What's special: This is Australia's first Test tour of South Africa since the 2018 ball-tampering scandal, with genuine World Test Championship points on the line. Newlands has a real history of selling out before general sale opens on TicketPro (tickets.cricket.co.za) — prioritise the Cape Town Test if you're only committing to one leg. Check cricket.co.za or the CSA app for the latest schedule confirmations as the tour approaches.",
];

try {
  await db.update(sportingEvents)
    .set({ preTripBriefLines, preTripBriefUpdatedAt: new Date() })
    .where(eq(sportingEvents.id, EVENT_ID));

  console.log("✓ Pre-trip brief updated — Transport line now covers actual transport, ticketing detail moved into 'One innovation'");
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}
