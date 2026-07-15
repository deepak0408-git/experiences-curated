import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { gt } from "drizzle-orm";
import { newsletterSubscribers, proSubscriptions } from "../schema/database.ts";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function fetchAllEmails() {
  let all = [];
  let cursor = null;
  for (let page = 0; page < 10; page++) {
    const url = new URL("https://api.resend.com/emails");
    url.searchParams.set("limit", "100");
    if (cursor) url.searchParams.set("after", cursor);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${RESEND_API_KEY}` } });
    if (!res.ok) { console.error("Resend API error:", res.status, await res.text()); break; }
    const data = await res.json();
    all = all.concat(data.data ?? []);
    if (!data.has_more || !data.data?.length) break;
    cursor = data.data[data.data.length - 1].id;
  }
  return all;
}

const allEmails = await fetchAllEmails();
console.log("Total emails fetched:", allEmails.length);

const hungarianEmails = allEmails.filter(e => e.subject?.includes("Hungarian Grand Prix 2026"));
const usOpenEmails = allEmails.filter(e => e.subject?.includes("US Open 2026"));

console.log("\nHungarian GP emails found:", hungarianEmails.length);
for (const e of hungarianEmails) console.log(" ", e.to[0], "|", e.last_event, "|", e.created_at);

console.log("\nUS Open emails found:", usOpenEmails.length);
for (const e of usOpenEmails) console.log(" ", e.to[0], "|", e.last_event, "|", e.created_at);

// Cross-reference against actual DB subscriber list
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const allSubs = await db.select({ email: newsletterSubscribers.email }).from(newsletterSubscribers);
const activePro = await db.select({ email: proSubscriptions.email }).from(proSubscriptions).where(gt(proSubscriptions.currentPeriodEnd, new Date()));
const proSet = new Set(activePro.map(p => p.email.toLowerCase()));
const expectedRecipients = allSubs.map(s => s.email).filter(e => !proSet.has(e.toLowerCase()));

console.log("\n=== Expected recipients (non-Pro subscribers):", expectedRecipients.length, "===");

const hungarianDeliveredSet = new Set(hungarianEmails.filter(e => e.last_event === "delivered").map(e => e.to[0].toLowerCase()));
const usOpenDeliveredSet = new Set(usOpenEmails.filter(e => e.last_event === "delivered").map(e => e.to[0].toLowerCase()));

const hungarianMissing = expectedRecipients.filter(e => !hungarianDeliveredSet.has(e.toLowerCase()));
const usOpenMissing = expectedRecipients.filter(e => !usOpenDeliveredSet.has(e.toLowerCase()));

console.log("\n=== HUNGARIAN GP — MISSING (" + hungarianMissing.length + ") ===");
console.log(hungarianMissing);

console.log("\n=== US OPEN — MISSING (" + usOpenMissing.length + ") ===");
console.log(usOpenMissing);

await client.end();
