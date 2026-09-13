import { config } from "dotenv";
config({ path: ".env.local" });

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
const dates = all.map(e => e.created_at).sort();
console.log("earliest:", dates[0]);
console.log("latest:", dates[dates.length-1]);
console.log("count:", all.length);
