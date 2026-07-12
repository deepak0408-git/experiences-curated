import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "f809c882-3cc0-4088-bd60-cf5b11c3481c"; // Four Seasons Gresham Palace

const bodyContent = `The Four Seasons Gresham Palace is the only Forbes Five-Star hotel in Hungary, and it earns the rating on the room, not just the address. The 179 accommodations split into 160 rooms and 19 suites, Art Deco-styled with marble bathrooms, and the best of them come with floor-to-ceiling windows over the Danube or the courtyard. The Royal Suite is the one to know about: an open-plan layout with its own dining table for four, and a panorama that takes in the river, the Royal Castle, and Fisherman's Bastion all at once.

The spa is a genuine draw on its own, not a hotel amenity checkbox. Seven treatment rooms, a couples' suite, an infinity-edge lap pool, a whirlpool, and separate steam rooms, built around the signature Touch of the Earth treatment using Omorovicza, the Hungarian luxury cosmetics brand most visitors won't have tried before. Downstairs, MÚZSA does a modern take on Budapest's Golden Age drinking culture in the lobby bar, and Kollázs Brasserie pairs French technique with Hungarian ingredients, river view included.

The building itself, an Art Nouveau insurance-company headquarters from 1906, restored and reopened as a hotel in 2004 after decades as a Red Army barracks and then a plain apartment block, is part of what you're paying for. But the reason to actually book it is what Four Seasons built inside that shell: consistently rated service, a spa worth a full afternoon, and a Danube-front position five minutes from the Chain Bridge that no newer luxury build in the city can replicate.`;

const whyItsSpecial = `Budapest has other five-star hotels with river views. It has exactly one Forbes Five-Star property, and the difference shows up in details that are easy to take for granted until they're missing: staff who remember a preference from the first night, a spa program built around a genuinely local ingredient rather than an imported brand, a suite (the Royal Suite specifically) with a sightline over three of the city's most photographed landmarks at once. The Art Nouveau restoration gives the building its character, but it's the operational polish, service, spa, dining, all performing at the top of the market, that justifies booking here over a newer luxury property with an equally good address.`;

const insiderTips = [
  "Ask for a river-facing room specifically when booking, and ask about the Royal Suite if the trip is a genuine splurge, it's the one room with Danube, Castle, and Fisherman's Bastion all in the same view.",
  "Book a treatment at the spa even for a short stay, the Touch of the Earth experience uses Omorovicza, a Hungarian brand most guests haven't encountered before and won't find replicated at other luxury hotels in the city.",
];

const whatToAvoid = `Don't book here expecting a Hungaroring shortcut, it's a genuinely central Pest location, not a circuit-adjacent one, the transit time to the track is the same as most other central hotels. And don't skip the spa to save time, it's one of the property's genuine differentiators, not a generic add-on.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out, front desk staffed 24 hours",
  website: "https://www.fourseasons.com/budapest/",
  costRange: "Five-star luxury pricing, among Budapest's highest, check fourseasons.com/budapest for current rates",
  bookingMethod: "Book directly via fourseasons.com/budapest. Rooms fill quickly during race weekend given the hotel's combination of location and profile, book several months ahead if this is a must-have.",
  reservationsRequired: true,
};

const [result] = await db
  .update(experiences)
  .set({ bodyContent, whyItsSpecial, insiderTips, whatToAvoid, practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Rewritten: ${result.title}`);

await client.end();
