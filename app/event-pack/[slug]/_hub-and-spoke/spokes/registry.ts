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

import SGCostSpoke from "./singapore-grand-prix/CostSpoke";
import SGTicketsSpoke from "./singapore-grand-prix/TicketsSpoke";
import SGHotelsSpoke from "./singapore-grand-prix/HotelsSpoke";
import SGGettingThereSpoke from "./singapore-grand-prix/GettingThereSpoke";
import SGWeatherSpoke from "./singapore-grand-prix/WeatherSpoke";
import SGFirstTimerGuideSpoke from "./singapore-grand-prix/FirstTimerGuideSpoke";
import SGWhereToEatSpoke from "./singapore-grand-prix/WhereToEatSpoke";
import SGDayTripsSpoke from "./singapore-grand-prix/DayTripsSpoke";
import SGItinerarySpoke from "./singapore-grand-prix/ItinerarySpoke";
import SGArrivalSpoke from "./singapore-grand-prix/ArrivalSpoke";
import SGMapSpoke from "./singapore-grand-prix/MapSpoke";
import SGLuxurySpoke from "./singapore-grand-prix/LuxurySpoke";

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
  "singapore-grand-prix": {
    cost: SGCostSpoke,
    tickets: SGTicketsSpoke,
    hotels: SGHotelsSpoke,
    "getting-there": SGGettingThereSpoke,
    weather: SGWeatherSpoke,
    "first-timer-guide": SGFirstTimerGuideSpoke,
    "where-to-eat": SGWhereToEatSpoke,
    "day-trips": SGDayTripsSpoke,
    itinerary: SGItinerarySpoke,
    arrival: SGArrivalSpoke,
    map: SGMapSpoke,
    luxury: SGLuxurySpoke,
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
  "singapore-grand-prix": {
    cost: "How Much Does the Singapore Grand Prix Cost? — Budget Guide",
    tickets: "Grandstand vs Walkabout — Singapore GP Ticket Guide",
    hotels: "Where to Stay for the Singapore Grand Prix — Marina Bay vs Chinatown",
    "getting-there": "Getting Around Singapore for the Grand Prix",
    weather: "Singapore GP Weather — What to Pack for F1's Heat Hazard Race",
    "first-timer-guide": "First-Timer's Guide — Singapore Grand Prix",
    "where-to-eat": "Where to Eat — Singapore Grand Prix Weekend",
    "day-trips": "Best Day Trips — Singapore Grand Prix Weekend",
    itinerary: "Sample 4-Day Singapore Grand Prix Itinerary",
    arrival: "Singapore Grand Prix — Arrival & Gate Guide",
    map: "Marina Bay Street Circuit Map — Zones and Facilities",
    luxury: "Luxury Guide for Singapore GP — including F1 Paddock Club",
  },
};
