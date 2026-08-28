// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/australian-open/GettingThereSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const australianOpenGettingThereSpokeContent = {
  intro:
    "Melbourne Park sits right at the edge of the CBD, across the Yarra from Flinders Street Station — this is one of the most walkable Grand Slam venues there is, and the one genuinely useful fact that simplifies almost everything else: any valid same-day Australian Open ticket makes trams 70 and 70a free.",

  onFoot: {
    label: "On foot from Flinders Street",
    body: "A 10-minute walk via Batman Avenue and Birrarung Marr, right along the Yarra — genuinely one of the nicer stadium walks in world sport, not just a functional route. This is the option most first-timers underrate in favour of the tram.",
  },

  freeTram: {
    label: "By free tram",
    body: "Trams 70 and 70a run free on the day of any valid match ticket — no tap-on needed, just board at the Flinders St/Swanston St corner. For every other Melbourne public transport trip, you need a myki card, available at stations, convenience stores, or the myki app.",
    facts: [
      { label: "Cost with a match ticket", value: "Free — no tap-on required" },
      { label: "Cost without a ticket", value: "Standard myki fare, capped daily/weekly" },
    ],
  },

  byTrain: {
    label: "By train",
    body: "Jolimont Station (Hurstbridge/Mernda lines) serves the northern entrances to the precinct. Richmond Station (Dandenong/Frankston/Sandringham/Glen Waverley lines) serves the southern approach, past the MCG — useful if you're coming from further out and those lines suit your route better than a change at Flinders Street.",
  },

  taxiRideshare: {
    label: "Taxi / rideshare",
    body: "A dedicated taxi rank sits next to Melbourne Park Oval on Olympic Boulevard, and rideshare pickup/drop-off is a separate designated point outside John Cain Arena, also on Olympic Boulevard — both inside the precinct, not off-site. Given the venue is a 10-minute walk from Flinders Street and Olympic Boulevard gets genuinely congested around session start and end times, a taxi or Uber rarely beats walking or the free tram for anyone already in or near the CBD. Melbourne Park's own guidance is to only request your ride once you've physically reached the pickup point, specifically to stop the street backing up further.",
  },

  drivingParking: {
    label: "Driving & parking",
    body: "The official option is Eastern Plaza Car Park at Entrance D, Olympic Boulevard — AU$20 pre-booked or AU$30 drive-up on tournament days (AU$7.50 flat on non-event days), with online bookings closing at midnight the night before. If Eastern Plaza is full or unavailable, Yarra Park (the MCG's car park), Secure Parking, and Wilson Parking all operate nearby as fallback options.",
    facts: [
      { label: "Pre-booked, event day", value: "AU$20 — Eastern Plaza Car Park, Entrance D" },
      { label: "Drive-up, event day", value: "AU$30" },
    ],
  },

  sourcesFooter: "Sources: Transport Victoria (transport.vic.gov.au), Melbourne Park (melbournepark.com.au — getting here and parking).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "getting-to-melbourne-park-transit" (transit)
