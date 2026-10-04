import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-arrival-guide-mud2316w";

const newBodyContent = `Every attendee, regardless of ticket tier or nationality, including Chinese citizens, must register their full name and passport number against their ticket several weeks before the event — stated plainly on Formula 1's own ticketing site. Do this the moment your ticket is confirmed, and bring the physical passport itself on the day, not just a photo of it.

From Shanghai Circuit metro station (Line 11), take Exit 6 and walk north — it's about a five-minute walk to the site, no shuttle needed. Which gate you want depends on your seat: Gate 1 sits directly behind the main grandstand (Grandstand A) and is the closest entrance from the metro exit; Gate 11 is a few minutes further but serves Grandstand K specifically. Grandstand H has its own separate entrance on the circuit's east side, near Baiyin Road station — a different station from the main Shanghai Circuit stop, so check which one your ticket actually routes you to rather than assuming it's the same walk. Gate numbers for Grandstand B, Grandstand E, and the general admission zones aren't published yet; your ticket itself should confirm the correct gate once that detail is finalized.

Gates generally open around 8:00 AM on session days, per Formula 1's own circuit page — well ahead of the first session, which matters at a venue built to move 200,000 people through security across a single weekend. Arrive earlier than you think you need to, especially on race day, and expect the queue to move slower the closer you get to the first session's start time.

Every grandstand comes fitted with a large screen, so even if a security queue costs you a few minutes of missed track action, you won't lose the thread of the session once you're through.`;

const newWhyItsSpecial = `Most circuit arrival guides are about timing — how early, which queue. Shanghai adds a real wrinkle most first-timers don't expect: a passport registration requirement that has nothing to do with the circuit's layout and everything to do with getting it handled weeks ahead, at home, calmly. Pair that with gate access that genuinely varies by grandstand — Gate 1 for the main stand, Gate 11 for K, a separate entrance entirely for H near a different metro station — and this is a circuit where arriving at the wrong gate can cost real time on a morning you don't have to spare. Getting both pieces right before you land is worth more than any amount of gate-time optimization on the day itself.`;

const newPracticalInfo = {
  hours: "Gates generally open around 8:00 AM on session days, per Formula 1's own circuit page. Exact 2027 gate times beyond that aren't published yet — plan to arrive well ahead of the first session given the circuit's 200,000 capacity.",
  website: "https://www.formula1shanghai.com/en/entering-the-circuit-31, https://ticketing.formula1.com/china/",
  costRange: "N/A — arrival logistics, not a ticketed experience",
  bookingMethod: "Register full passport details against your ticket as soon as it's purchased — required for every attendee, every tier, per ticketing.formula1.com's stated policy.",
};

const newGettingThere = "Shanghai Circuit metro station (Line 11), Exit 6, then a 5-minute walk north to the site — no shuttle needed. Gate 1 (main grandstand/Grandstand A) is the closest entrance from the metro exit; Gate 11 serves Grandstand K; Grandstand H has its own separate entrance near Baiyin Road station on the circuit's east side. See the Getting to the Circuit experience in this pack for the full Metro Line 11 journey from central Shanghai.";

const newInsiderTips = [
  "Check which gate your ticket actually routes you to before race day — Gate 1 (behind the main grandstand), Gate 11 (behind Grandstand K), and Grandstand H's separate east-side entrance near Baiyin Road station are genuinely different walks, and showing up at the wrong one costs real time on a morning you don't have to spare.",
  "Register your passport details the day you buy your ticket — this is a genuine requirement stated directly on F1's own ticketing site, not a formality, and leaving it until race week adds real, avoidable friction.",
];

const newWhatToAvoid = "Don't assume every grandstand shares the same entrance as the main grandstand — Grandstand H's gate is on the opposite side of the circuit near a different metro station entirely (Baiyin Road, not Shanghai Circuit station), so confirm your specific gate rather than defaulting to Gate 1 because it's the one most commonly mentioned. Don't wait until race week to handle passport registration — it's designed to be completed well in advance, and doing it early removes one entire category of last-minute stress from your trip.";

await db.update(experiences)
  .set({
    bodyContent: newBodyContent,
    whyItsSpecial: newWhyItsSpecial,
    practicalInfo: newPracticalInfo,
    gettingThere: newGettingThere,
    insiderTips: newInsiderTips,
    whatToAvoid: newWhatToAvoid,
    editorialNote: "Sourced from ticketing.formula1.com/china (official — passport registration requirement, 200,000 capacity), formula1shanghai.com/en/entering-the-circuit-31 (official circuit site — gates generally open ~8:00 AM). Gate-to-grandstand mapping (Gate 1/Grandstand A, Gate 11/Grandstand K, Grandstand H's separate east-side entrance near Baiyin Road station) via gpdestinations.com Trackside guide — a specialized F1 travel resource, not an official F1/circuit source, cited as the best available detail since official sources don't publish gate numbers. Metro Exit 6 / 5-minute walk via travelchinaguide.com, cross-checked against thef1spectator.com. Gate numbers for Grandstand B, Grandstand E, and GA zones not found in any source — stated honestly as unpublished rather than guessed; ticket itself is the authoritative source once published.",
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated", SLUG, ": body, whyItsSpecial, practicalInfo, gettingThere, insiderTips, whatToAvoid, editorialNote.");

await client.end();
