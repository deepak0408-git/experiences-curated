import { config } from "dotenv";
config({ path: ".env.local" });

const query = process.argv[2];
if (!query) {
  console.error("Usage: node _places-lookup.mjs \"<venue name>, <city>, <country>\"");
  process.exit(1);
}

const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY,
    "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.googleMapsUri,places.id,places.primaryType",
  },
  body: JSON.stringify({ textQuery: query }),
});

const data = await res.json();
console.log(JSON.stringify(data, null, 2));
