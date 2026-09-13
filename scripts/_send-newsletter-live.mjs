import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "fs";

const html = fs.readFileSync("scripts/_newsletter-issue2.html", "utf8");

const res = await fetch("https://www.experiences-curated.com/api/newsletter/send", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.CRON_SECRET}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    mode: "live",
    subject: "The US Open's loudest night — and Monza's biggest weekend",
    html,
  }),
});

console.log("Status:", res.status);
console.log(await res.text());
