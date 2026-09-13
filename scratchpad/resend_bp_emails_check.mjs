import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { businessPartners } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const rows = await db.select({ email: businessPartners.contactEmail, org: businessPartners.organizationName }).from(businessPartners);
await client.end();

const emailSet = new Set(rows.map(r => r.email.toLowerCase()));

let after = null;
let all = [];
let page = 0;
while (page < 30) {
  const url = new URL("https://api.resend.com/emails");
  url.searchParams.set("limit", "100");
  if (after) url.searchParams.set("after", after);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } });
  const data = await res.json();
  const batch = data.data || [];
  all = all.concat(batch);
  if (batch.length < 100) break;
  after = batch[batch.length - 1].id;
  page++;
}

const found = all.filter(e => (e.to||[]).some(t => {
  const lower = t.toLowerCase();
  return [...emailSet].some(em => lower.includes(em));
}));
console.log(JSON.stringify(found.map(e=>({to:e.to,subject:e.subject,created_at:e.created_at})), null, 2));
console.log("total scanned", all.length, "matches", found.length);
