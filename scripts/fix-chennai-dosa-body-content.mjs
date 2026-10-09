import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chennai-filter-coffee-dosa-muecju1c";

const OLD_RATNA = `Ratna Cafe, on Triplicane High Road, is the classic reference point. It's known for its idli-sambar and coffee served with genuinely unlimited refills, a real point of local pride rather than a marketing line, and it draws one of the largest, most consistent review bases of any traditional South Indian eatery in the city. It's a working, no-frills mess-style restaurant, not a polished cafe, and that's exactly the appeal. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16484723391347348095)`;

const NEW_RATNA = `Ratna Cafe, on Triplicane High Road, is the classic reference point. It's known for its idli-sambar and coffee served with genuinely unlimited refills, a real point of local pride rather than a marketing line, and it draws one of the largest, most consistent review bases of any traditional South Indian eatery in the city. On the dosa side, the Ghee Roast and Ghee Podi Dosai are the ones regulars order, a crisp, butter-dark dosa dusted with a dry spiced lentil powder, alongside a Mysore Masala Dosai for anyone who wants real chilli heat in the red chutney layer. The Rava Dosa, made from a thinner semolina batter rather than fermented rice, is lacier and more open-holed than the standard version, and comes in its own plain, onion, and masala variants. It's a working, no-frills mess-style restaurant, not a polished cafe, and that's exactly the appeal. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16484723391347348095)`;

const OLD_MURUGAN = `Murugan Idli Shop, now a small chain but rooted in Chennai, built its name on genuinely fluffy idlis and a filter coffee served the traditional way. It's a fair comparison point to Ratna Cafe if you want to try two well-regarded versions of the same basic meal and form your own opinion on which does it better, a debate Chennai locals have happily for hours. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16122206053461308279)`;

const NEW_MURUGAN = `Murugan Idli Shop, now a small chain but rooted in Chennai, built its name on genuinely fluffy idlis and a filter coffee served the traditional way. Its own dosa specialty is the Ghee Podi Dosa, served with four distinct chutneys rather than the usual one or two, which is the dish most reviewers single out over the idli itself. Beyond that there's a long dosa list to work through, Ghee Onion Rava, Garlic Podi, Butter Podi Masala, and Curry Leaf Podi among them, so it's a fair comparison point to Ratna Cafe if you want to try two well-regarded versions of the same basic meal and form your own opinion on which does it better, a debate Chennai locals have happily for hours. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16122206053461308279)`;

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD_RATNA)) {
  console.error("Ratna paragraph not found verbatim — aborting.");
  process.exit(1);
}
if (!row.bodyContent.includes(OLD_MURUGAN)) {
  console.error("Murugan paragraph not found verbatim — aborting.");
  process.exit(1);
}

const updatedBody = row.bodyContent
  .replace(OLD_RATNA, NEW_RATNA)
  .replace(OLD_MURUGAN, NEW_MURUGAN);

const [result] = await db.update(experiences)
  .set({ bodyContent: updatedBody })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
console.log("\n--- New body ---\n");
console.log(updatedBody);
process.exit(0);
