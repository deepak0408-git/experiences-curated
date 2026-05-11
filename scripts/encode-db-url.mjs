// Run: node scripts/encode-db-url.mjs
// Paste your raw password when prompted, get back a safe DATABASE_URL

import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({ input, output });

const projectRef = await rl.question("Supabase project ref (e.g. hqplnxyhszhkdkgkjbmk): ");
const region = await rl.question("Pooler region (e.g. aws-1-ap-northeast-1): ");
const password = await rl.question("Database password (raw, special chars OK): ");

rl.close();

const encodedPassword = encodeURIComponent(password);
const url = `postgresql://postgres.${projectRef.trim()}:${encodedPassword}@${region.trim()}.pooler.supabase.com:5432/postgres`;

console.log("\nYour encoded DATABASE_URL:");
console.log(url);
console.log("\nPaste this as both DATABASE_URL and DIRECT_URL in .env.local");
