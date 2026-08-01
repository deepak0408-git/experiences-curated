import type { ComponentType } from "react";
import CostSpoke from "./bahrain-grand-prix/CostSpoke";
import TicketsSpoke from "./bahrain-grand-prix/TicketsSpoke";
import HotelsSpoke from "./bahrain-grand-prix/HotelsSpoke";
import GettingThereSpoke from "./bahrain-grand-prix/GettingThereSpoke";
import WeatherSpoke from "./bahrain-grand-prix/WeatherSpoke";
import FirstTimerGuideSpoke from "./bahrain-grand-prix/FirstTimerGuideSpoke";
import WhereToEatSpoke from "./bahrain-grand-prix/WhereToEatSpoke";
import DayTripsSpoke from "./bahrain-grand-prix/DayTripsSpoke";
import ItinerarySpoke from "./bahrain-grand-prix/ItinerarySpoke";
import ArrivalSpoke from "./bahrain-grand-prix/ArrivalSpoke";
import MapSpoke from "./bahrain-grand-prix/MapSpoke";
import LuxurySpoke from "./bahrain-grand-prix/LuxurySpoke";

type SpokeComponent = ComponentType<{ eventSlug: string }>;

// Registry mapping eventSlug -> spokeId -> component. A new hub_and_spoke
// event adds one new inner object here (plus its own spokes/<event-slug>/
// folder and a SPOKES_BY_EVENT entry in _lib/spokeConfig.ts) — nothing
// else in the routing layer changes.
export const SPOKE_COMPONENTS: Record<string, Record<string, SpokeComponent>> = {
  "bahrain-grand-prix": {
    cost: CostSpoke,
    tickets: TicketsSpoke,
    hotels: HotelsSpoke,
    "getting-there": GettingThereSpoke,
    weather: WeatherSpoke,
    "first-timer-guide": FirstTimerGuideSpoke,
    "where-to-eat": WhereToEatSpoke,
    "day-trips": DayTripsSpoke,
    itinerary: ItinerarySpoke,
    arrival: ArrivalSpoke,
    map: MapSpoke,
    luxury: LuxurySpoke,
  },
};

export const SPOKE_METADATA: Record<string, Record<string, string>> = {
  "bahrain-grand-prix": {
    cost: "How Much Does the Bahrain Grand Prix (Malaysia) Cost? — Budget Guide",
    tickets: "Sepang Grandstand vs General Admission — Ticket Guide",
    hotels: "Where to Stay for the Bahrain Grand Prix (Malaysia) — KL vs Sepang",
    "getting-there": "How to Get to Sepang for the Bahrain Grand Prix (Malaysia)",
    weather: "Sepang Weather in October — What to Pack for the Bahrain GP (Malaysia)",
    "first-timer-guide": "First-Timer's Guide — Bahrain Grand Prix (Malaysia) at Sepang",
    "where-to-eat": "Where to Eat in Kuala Lumpur — Bahrain Grand Prix Weekend",
    "day-trips": "Best Day Trips from Kuala Lumpur — Bahrain Grand Prix Weekend",
    itinerary: "Sample 3-Day Bahrain Grand Prix (Malaysia) Itinerary",
    arrival: "Bahrain Grand Prix (Malaysia) — Sepang Arrival & Queue Guide",
    map: "Sepang Circuit Map — Where Are the Grandstands?",
    luxury: "F1 Paddock Club at Sepang — Luxury Guide",
  },
};
