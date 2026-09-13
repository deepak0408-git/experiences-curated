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
const win = all.filter(e => {
  const d = new Date(e.created_at);
  return d >= new Date("2026-08-30") && d <= new Date("2026-09-04");
});
// exclude obvious transactional patterns
const noisy = /pack-feedback|checkin|How did the|How's the|magic link|sign.?in|receipt|welcome|newsletter|pre.?trip|activate|Trip Board/i;
const candidates = win.filter(e => !noisy.test(e.subject||""));
console.log(JSON.stringify(candidates.map(e=>({to:e.to,subject:e.subject,created_at:e.created_at})), null, 2));
console.log("total in window:", win.length, "candidates:", candidates.length);
