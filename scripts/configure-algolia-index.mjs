import { config } from "dotenv";
config({ path: ".env.local" });

import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);
const INDEX = process.env.ALGOLIA_EXPERIENCES_INDEX;

await client.setSettings({
  indexName: INDEX,
  indexSettings: {
    searchableAttributes: [
      "title",
      "subtitle",
      "destinationName",
      "neighborhood",
      "moodTags",
      "interestCategories",
    ],
    attributesForFaceting: [
      "filterOnly(destinationCountry)",
      "destinationName",
      "experienceType",
      "budgetTier",
      "pace",
      "moodTags",
      "interestCategories",
      "availability",
    ],
    customRanking: [
      "desc(eventBoost)",
      "desc(curationTierRank)",
      "desc(hasHeroImage)",
      "desc(lastVerifiedTimestamp)",
      "desc(saveCount)",
      "desc(publishedAt)",
    ],
    attributesToRetrieve: [
      "objectID",
      "title",
      "subtitle",
      "slug",
      "experienceType",
      "heroImageUrl",
      "budgetTier",
      "pace",
      "neighborhood",
      "destinationName",
      "destinationCountry",
      "moodTags",
    ],
  },
});

console.log(`Index "${INDEX}" settings applied.`);
console.log("Searchable: title, subtitle, destinationName, neighborhood, moodTags, interestCategories");
console.log("Facets: destinationName, experienceType, budgetTier, pace, moodTags");
console.log("Custom ranking: eventBoost → curationTierRank → hasHeroImage → lastVerifiedTimestamp → saveCount → publishedAt");
