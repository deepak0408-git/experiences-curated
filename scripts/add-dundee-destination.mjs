import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Minimal Dundee destination row, created 22 Jul 2026 as a hotel-satellite
// anchor for St Andrews (Alfred Dunhill Links Championship). No experiences,
// no hero image, no event-builder skill run against it -- purely to give
// St Andrews' nextClosestHotelDestinationId a real, queryable target,
// since the column has no enforced FK and would otherwise silently resolve
// to nothing if pointed at a non-existent ID. User does not expect future
// sporting events in Dundee itself.

const result = await sql`
  INSERT INTO destinations (name, slug, region, currency, country_code)
  VALUES ('Dundee', 'dundee', 'Angus, Scotland', 'GBP', 'GB')
  RETURNING id, name, region, currency
`;
console.log("Created:", JSON.stringify(result, null, 2));

// Link St Andrews -> Dundee
const STANDREWS_ID = "6672a395-f471-4b9e-9d1a-0f567441470a";
const dundeeId = result[0].id;

await sql`
  UPDATE destinations
  SET next_closest_hotel_destination_id = ${dundeeId}
  WHERE id = ${STANDREWS_ID}
`;

const check = await sql`
  SELECT id, name, next_closest_hotel_destination_id
  FROM destinations
  WHERE id = ${STANDREWS_ID}
`;
console.log("St Andrews now linked:", JSON.stringify(check, null, 2));

await sql.end();
