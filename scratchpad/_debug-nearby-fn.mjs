import { config } from "dotenv";
config({ path: ".env.local" });
import { getNearbyDestinationEvents, getDestinationBySlug } from "../lib/queries/destinations.ts";

const dest = await getDestinationBySlug("london-gb");
console.log("dest:", dest.id, dest.lat, dest.lng, typeof dest.lat);
const nearby = await getNearbyDestinationEvents({ id: dest.id, lat: dest.lat, lng: dest.lng });
console.log("nearby count:", nearby.length);
console.log(nearby);
process.exit(0);
