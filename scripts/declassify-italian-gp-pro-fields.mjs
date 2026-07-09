import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq, sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const UPDATES = [
  {
    id: "037780a7-2d9b-4ee9-84ac-b4bc094614f2", // Getting to the Circuit
    bookingMethod:
      "Trenord tickets (€3.10 single) at the station or via the app — no advance booking needed. Driving? Blue and Red parking zones sell through f1italy.com and go fast, so book with your grandstand ticket.",
  },
  {
    id: "741de32c-5d71-4873-842b-288504c0f15d", // The Fan Zone
    bookingMethod:
      "Included with any race weekend ticket — nothing to book. Thursday 13:00–20:00 is free public entry via Gate G, even without a ticket.",
  },
  {
    id: "e88a5b99-286a-4335-8fa9-7cbb79bd11f3", // The Tifosi
    bookingMethod:
      "No separate ticket — any race day ticket gets you the full atmosphere and, if confirmed for the season, the post-race track invasion. Check f1italy.com closer to the date, as invasion access isn't guaranteed every year.",
  },
  {
    id: "3b290e97-4c0d-4440-8579-34856b0b8168", // Curva Grande
    bookingMethod:
      "General Admission goes on sale via monzanet.it or Formula1.com roughly a year out (2026 sales opened September 2025) — it's the cheapest tier and moves fast, so buy early.",
  },
  {
    id: "dc7329c7-82e9-412c-9cb0-9e53fb044d22", // Staying in Milan
    bookingMethod:
      "Book directly or via Booking.com as early as possible — race weekend drives demand across Milan, not just near the circuit. Confirm you're booked on the direct 9-minute Trenord service to Monza, not a slower connecting one.",
  },
  {
    id: "581b601a-b614-4d53-9c24-8472b2dfd9bb", // Eating in Monza
    bookingMethod:
      "Il Feudo dei Sapori: call +39 039 387423. La Cucina di Via Zucchi: TheFork or info@lacucinadiviazucchi.it. Trattoria Mercato: walk-ins fine. Book Il Feudo and La Cucina as soon as your dates are set — both fill on GP weekend evenings.",
  },
  {
    id: "7335f2bc-2a98-44d9-967a-b924513f961b", // Aperitivo Before the Race
    bookingMethod:
      "No reservations needed for a standard aperitivo — just walk in during the 6–8pm window. N'Ombra de Vin's seats fill fast on busy evenings, so arrive a little earlier there.",
  },
  {
    id: "217fd272-f8f4-40ea-889e-d7a9d51332bb", // Eating in Milan
    bookingMethod:
      "Masuelli: phone or email (prenotazioni@masuellitrattoria.it). Cracco: book online well ahead — race weekend plus any overlapping fashion/design week traffic squeezes tables fast; call +39 02 876774 if the site shows nothing. Cracco's ground-floor café is walk-in, no booking, open all day.",
  },
  {
    id: "d93634df-2f83-4654-84e3-0c6acdfe7f79", // Monza Town & the Royal Villa
    bookingMethod:
      "Iron Crown chapel tour: call +39 039 326383 as soon as your dates are set — limited capacity per slot. Villa Reale: villarealemonza.org or 039 5787160. The combined Museum + Chapel + Crown ticket (€14) covers everything in one 90-minute visit.",
  },
  {
    id: "e359a21d-2013-4504-97d2-04edc8d90ba8", // The History of Monza
    bookingMethod:
      "Grounds and the old banking are free to enter on non-race days. Guided tours (Sopraelevata Tour ~€10, Tour Experience ~€25, Premium ~€60, min. 6 people) book through ticketone.it or the on-site shop.",
  },
];

for (const { id, bookingMethod } of UPDATES) {
  const [result] = await db
    .update(experiences)
    .set({
      practicalInfo: sql`jsonb_set(
        jsonb_set(practical_info, '{bookingMethod}', ${JSON.stringify(bookingMethod)}::jsonb),
        '{howToBook}', 'null'::jsonb
      )`,
    })
    .where(eq(experiences.id, id))
    .returning({ title: experiences.title });

  console.log(`✓ Updated "${result?.title ?? id}"`);
}

console.log("\nDone.");
await client.end();
