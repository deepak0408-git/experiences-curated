import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { plannerFlightCost } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c"; // Mexico City
const SEASONAL_BAND = "oct"; // Mexico City GP 2026 event month

// Researched via planner-data-researcher skill's locked Flights methodology
// (Google Flights + Kayak, combined-dataset density-boundary outlier
// exclusion), 6 Sep 2026. 5 rows below use the founder's manually-approved
// wider range (raw combined low/high) instead of the tool's own narrower
// density-boundary output: Dubai, Johannesburg, Munich, Sao Paulo,
// Singapore — founder reviewed the full artifact table and chose the wider
// range for these 5 specifically. Rest use the tool's computed final range
// as-is. Moscow and Nairobi are single-source (see notes below).
const rows = [
  { city: "Atlanta", low: 439, high: 1044 },
  { city: "Boston", low: 630, high: 1257 },
  { city: "Chicago", low: 437, high: 1064 },
  { city: "Dallas", low: 338, high: 1137 },
  { city: "Los Angeles", low: 420, high: 942 },
  { city: "Miami", low: 436, high: 1069 },
  { city: "Montreal", low: 734, high: 1065 },
  { city: "New York City", low: 550, high: 1126 },
  { city: "Philadelphia", low: 629, high: 970 },
  { city: "San Francisco", low: 526, high: 941 },
  { city: "Toronto", low: 423, high: 1031 },
  { city: "Vancouver", low: 390, high: 985 },
  { city: "Washington D.C.", low: 573, high: 1555 },
  { city: "Mexico City", low: 0, high: 0 }, // same-city origin, standing rule
  { city: "Amsterdam", low: 1151, high: 1619 },
  { city: "Barcelona", low: 1264, high: 1677 },
  { city: "Berlin", low: 1202, high: 1532 },
  { city: "Dublin", low: 1129, high: 1636 },
  { city: "London", low: 1009, high: 1753 },
  { city: "Madrid", low: 1108, high: 2154 },
  { city: "Manchester", low: 1320, high: 1703 },
  { city: "Milan", low: 1097, high: 1601 },
  { city: "Moscow", low: 2806, high: 3287 }, // single-source: Google Flights only, Kayak timeout (known route gap)
  { city: "Munich", low: 999, high: 1703 }, // founder override: wider combined range
  { city: "Paris", low: 1249, high: 1812 },
  { city: "Bangalore", low: 1651, high: 2109 },
  { city: "Beijing", low: 1215, high: 1565 },
  { city: "Doha", low: 1922, high: 2115 },
  { city: "Dubai", low: 1386, high: 2015 }, // founder override: wider combined range
  { city: "Hong Kong", low: 1369, high: 2169 },
  { city: "Manila", low: 1438, high: 1640 },
  { city: "Melbourne", low: 1484, high: 1633 },
  { city: "Mumbai", low: 1354, high: 1672 },
  { city: "New Delhi", low: 1531, high: 1817 },
  { city: "Seoul", low: 1319, high: 1578 },
  { city: "Shanghai", low: 1328, high: 1684 },
  { city: "Singapore", low: 1292, high: 1555 }, // founder override: wider combined range
  { city: "Sydney", low: 1231, high: 1649 },
  { city: "Tokyo", low: 1222, high: 1873 },
  { city: "Buenos Aires", low: 938, high: 1546 },
  { city: "Rio de Janeiro", low: 1105, high: 1398 },
  { city: "Sao Paulo", low: 676, high: 1366 }, // founder override: wider combined range
  { city: "Cairo", low: 1112, high: 1476 },
  { city: "Casablanca", low: 1463, high: 1793 },
  { city: "Johannesburg", low: 1399, high: 1617 }, // founder override: wider combined range
  { city: "Nairobi", low: 1385, high: 1499 }, // single-source: Kayak only, GF returned 0 results
];

const cityToId = {
  Atlanta: "b16d6e24-de29-4f63-a09c-ba23147574df",
  Boston: "a52d7171-5427-40e0-bdac-3c92a0a04485",
  Chicago: "2e2d00f2-5ec5-471b-9134-7cf42fcd0984",
  Dallas: "949a1ba8-7875-45db-8d99-88e907344221",
  "Los Angeles": "c5e4e9be-9d14-43c9-a432-a354124c17fa",
  Miami: "df8d509c-b0ef-4a38-a1cf-43ddfe2ae87c",
  Montreal: "b0e17643-3556-4df3-9e58-a0373aaf50b6",
  "New York City": "597cb1e6-6ccc-4d12-9f71-689d50b3bdd2",
  Philadelphia: "93a612af-366e-4b3a-bcd9-7246bf08175b",
  "San Francisco": "973d3d57-2565-4067-aac1-8525de179bfa",
  Toronto: "ba1bea4e-7056-4515-a476-ad186185590a",
  Vancouver: "32f0d8c3-776a-4a99-8f66-0ec0cb7d7572",
  "Washington D.C.": "0d0abf6e-25ef-4ddb-82f4-2422b698bfad",
  "Mexico City": "d58cfcfd-50b1-4d76-b0b4-4624968a775d",
  Amsterdam: "fe171f54-8a19-4412-830f-787e54baeacb",
  Barcelona: "18f683db-22dd-4340-89f7-7536304f9c8b",
  Berlin: "5cdbbd4d-000b-4535-a57c-23a6d285d1bb",
  Dublin: "e4813c88-5cad-46f5-a73b-bacacbd771f2",
  London: "27c646a7-0e42-4109-8707-483d13bf8ad2",
  Madrid: "0341994f-b6b6-4eae-9d04-b1741ce9359b",
  Manchester: "6949fd47-a854-4b01-bdb1-c05143c99309",
  Milan: "23503e0b-3ee9-4f22-8188-474354886e77",
  Moscow: "f7ba8d74-7b55-48ef-bbd5-3b5361006a45",
  Munich: "98d9dc12-a2a2-4491-9520-5b82cbaf23fa",
  Paris: "b26dcca3-8b5f-484c-b39d-e721b06d0ad8",
  Bangalore: "7bc6a55c-34e1-4172-827b-fe09fabd16df",
  Beijing: "e8f46bd3-3cc0-44ed-bd89-e954e476673d",
  Doha: "85eb8e87-cebe-492c-ad27-849276ce3100",
  Dubai: "f4d62ca8-f46f-47ad-97cf-752da3a0cf90",
  "Hong Kong": "73583fe5-0877-4cf0-8210-98461e1b929a",
  Manila: "5f527f82-ab24-4bb9-b617-a71bcc5cc598",
  Melbourne: "7e952bbe-6dbd-4c05-a9df-1d03ada05679",
  Mumbai: "93f8f154-4b05-4a85-b519-103df8d7ee40",
  "New Delhi": "a66dcff2-d533-4393-8020-55b1c35a0bca",
  Seoul: "48c98899-fa79-493f-81df-95f81cea6e31",
  Shanghai: "db560817-35db-4e8e-93c4-af77eeac6e08",
  Singapore: "7af8227c-62fa-4772-92fd-a39eb45ed439",
  Sydney: "094d8a80-1191-4b25-9426-0934fe5cb549",
  Tokyo: "0b9e1b61-4d0b-49ef-96f5-f97ff8cbe498",
  "Buenos Aires": "5685efa4-5918-45ec-b8bf-6545dda0166d",
  "Rio de Janeiro": "84266ad4-c20e-4481-bc41-7542c21cc7e7",
  "Sao Paulo": "9e7a1102-c6ca-446a-990d-513d465d43da",
  Cairo: "dedc6c13-3c09-4460-af93-2963b709c2ee",
  Casablanca: "3c161cd2-b896-4951-ac04-63857bcc4f57",
  Johannesburg: "3868e552-8b06-4f2d-b9e8-695006b1f068",
  Nairobi: "5201c4ff-8c6a-4bff-8d79-ef0fba78dbca",
};

let inserted = 0;
for (const r of rows) {
  const originMarket = r.city;
  await db.insert(plannerFlightCost).values({
    destinationId: DESTINATION_ID,
    originMarket,
    seasonalBand: SEASONAL_BAND,
    costLow: r.low.toFixed(2),
    costHigh: r.high.toFixed(2),
    currency: "USD",
  }).onConflictDoNothing();
  inserted++;
  console.log(`Seeded: ${originMarket} — $${r.low}-${r.high}`);
}

console.log(`\n✓ ${inserted} routes seeded for Mexico City, seasonal band "${SEASONAL_BAND}".`);
console.log("⚠ NOT YET SEEDED (missed from original batch, flagged to founder): Rome, Stockholm, Zurich — need separate research pass.");

await client.end();
