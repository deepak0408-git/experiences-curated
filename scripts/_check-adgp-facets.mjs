import { config } from "dotenv";
config({ path: ".env.local" });
import { algoliasearch } from "algoliasearch";

const algolia = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const INDEX = process.env.ALGOLIA_EXPERIENCES_INDEX;

const { results } = await algolia.search({
  requests: [{
    indexName: INDEX,
    query: "",
    filters: `sportingEventId:8f45cb75-f205-458b-8f31-48551e6d7cb8`,
    hitsPerPage: 30,
    attributesToRetrieve: ["title", "sport", "destinationName", "experienceType", "budgetTier", "neighborhood"]
  }]
});
const { hits, nbHits } = results[0];
console.log("Total hits:", nbHits);
hits.forEach(h => {
  const missing = [];
  if (!h.sport || h.sport.length === 0) missing.push("sport");
  if (!h.destinationName) missing.push("destinationName");
  if (!h.experienceType) missing.push("experienceType");
  if (!h.budgetTier) missing.push("budgetTier");
  console.log(h.title.slice(0,45).padEnd(45), missing.length ? "MISSING: " + missing.join(",") : "OK");
});
