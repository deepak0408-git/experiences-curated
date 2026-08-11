import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "currency-conversion-mistake-international-sports-trip";

const bodyContent = `A card machine asks: "Would you like to pay in US dollars, or in the local currency?" The dollar option sounds like a convenience. It's actually the more expensive choice, every time, and almost nobody realizes it.

## The question itself is the trap

That prompt is called dynamic currency conversion, or DCC — the merchant's own payment terminal converting the charge to your home currency on the spot, instead of letting your bank or card issuer handle the conversion afterward. It's framed as a helpful option, sometimes dressed up as "locking in" or "guaranteeing" a rate. In reality, DCC providers build in a real markup over the actual interbank exchange rate — typically 3-7%, though independently measured cases have ranged from 2.6% all the way up to 18% above the fair rate. Every one of those percentage points is money the merchant's payment processor keeps, not a service being done for you.

## It's not a rare trap — it's the default in a lot of places

DCC isn't some obscure scam running at one shady kiosk. It's standard functionality built into countless card terminals and ATMs worldwide, actively offered — sometimes with confusing or misleading wording specifically designed to make declining harder — at hotels, restaurants, and ticket booths in exactly the kind of tourist-heavy, event-adjacent spots a sports trip runs through constantly. Some card issuers even charge a separate foreign transaction fee on top of a DCC transaction, despite it technically being processed in your home currency.

## The fix is one sentence, every single time

Always choose to pay in the local currency, never your home currency, whenever a card machine or ATM gives you the option. If a merchant processes the transaction in your home currency without asking, you're entitled to have it voided and rerun in local currency before signing anything. That's the entire fix — no app, no research, no advance planning required, just the same one-sentence answer every time the question comes up.

## Why this matters

A single DCC transaction might only cost a few extra dollars. A full trip's worth of hotel bills, meals, and merchandise, each quietly run through a 3-18% markup without you noticing, adds up to a real, avoidable cost — one entirely created by answering a question wrong, over and over, without realizing it was ever a question worth getting right.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Currency-Conversion Mistake That Quietly Wrecks Every International Sports Trip",
    sport: ["tennis", "cricket", "golf", "formula_one"],
    sportingEventId: null,
    contentCategory: "travel_craft",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "\"Pay in your home currency?\" is never the better option — dynamic currency conversion markups run 3-7%, sometimes as high as 18%, on every hotel bill, meal, and purchase you say yes to.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: DCC mechanism, misleading terminal wording, right to void and rerun in local currency — ricksteves.com and wallethub.com. DCC markup range (3-7% typical, 2.6-18% measured range over interbank rate) — beancount.io and the referenced DCC research summary. Verified 11 Aug 2026.",
    publishedAt: new Date("2026-08-07T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();
