import { config } from "dotenv";
config({ path: ".env.local" });

let after = null;
let all = [];
let page = 0;
const found = [];
while (page < 30) {
  const url = new URL("https://api.resend.com/emails");
  url.searchParams.set("limit", "100");
  if (after) url.searchParams.set("after", after);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } });
  const data = await res.json();
  const batch = data.data || [];
  all = all.concat(batch);
  for (const e of batch) {
    const created = new Date(e.created_at);
    // window: 25 Aug - 5 Sep 2026
    if (created >= new Date("2026-08-25") && created <= new Date("2026-09-05")) {
      if (/partner|collab|gulliver|tour|travel agent|opportunit/i.test(e.subject||"") || /gulliver|sport|travel|tour/i.test((e.to||[]).join(","))) {
        found.push({to: e.to, subject: e.subject, created_at: e.created_at});
      }
    }
  }
  if (batch.length < 100) break;
  after = batch[batch.length - 1].id;
  page++;
}
console.log(JSON.stringify(found, null, 2));
console.log("scanned", all.length);
