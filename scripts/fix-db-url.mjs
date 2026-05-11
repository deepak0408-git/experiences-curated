// Reads DATABASE_URL from .env.local, percent-encodes the password, writes it back.
// Run: node scripts/fix-db-url.mjs

import { readFileSync, writeFileSync } from "fs";

const envPath = ".env.local";
const content = readFileSync(envPath, "utf8");

// Extract the raw DATABASE_URL line
const match = content.match(/^DATABASE_URL=(.+)$/m);
if (!match) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

const rawUrl = match[1].trim();

// Parse: postgresql://user:pass@host:port/db
// The password may contain @ so we work backwards from the last @ before the host.
// Strategy: split on "://" to get the authority, then find the last @ to split user:pass from host.
const schemeEnd = rawUrl.indexOf("://");
const scheme = rawUrl.slice(0, schemeEnd);         // postgresql
const authority = rawUrl.slice(schemeEnd + 3);     // user:pass@host:port/db

const lastAt = authority.lastIndexOf("@");
const userInfo = authority.slice(0, lastAt);       // user:pass (pass may contain @)
const hostPart = authority.slice(lastAt + 1);      // host:port/db

const colonIdx = userInfo.indexOf(":");
const user = userInfo.slice(0, colonIdx);
const rawPassword = userInfo.slice(colonIdx + 1);  // everything after first colon

const encodedPassword = encodeURIComponent(rawPassword);
const fixedUrl = `${scheme}://${user}:${encodedPassword}@${hostPart}`;

if (fixedUrl === rawUrl) {
  console.log("DATABASE_URL looks fine — no encoding needed.");
  process.exit(0);
}

// Replace in file (both DATABASE_URL and DIRECT_URL if they match)
let updated = content.replace(
  /^(DATABASE_URL)=.+$/m,
  `DATABASE_URL=${fixedUrl}`
);
updated = updated.replace(
  /^(DIRECT_URL)=.+$/m,
  `DIRECT_URL=${fixedUrl}`
);

writeFileSync(envPath, updated, "utf8");
console.log("✓ .env.local updated with encoded DATABASE_URL and DIRECT_URL");
console.log(`  User:     ${user}`);
console.log(`  Host:     ${hostPart}`);
console.log(`  Password: [${rawPassword.length} chars, encoded]`);
