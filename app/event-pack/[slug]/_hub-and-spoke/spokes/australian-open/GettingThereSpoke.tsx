import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const transit = linkedExperiences.find((e) => e.slug.includes("getting-to-melbourne-park-transit"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="public"
      h1="Your match ticket is also a free tram ticket"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Melbourne Park sits right at the edge of the CBD, across the Yarra from Flinders Street Station — this is
        one of the most walkable Grand Slam venues there is, and the one genuinely useful fact that simplifies
        almost everything else: any valid same-day Australian Open ticket makes trams 70 and 70a free.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On foot from Flinders Street</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A 10-minute walk via Batman Avenue and Birrarung Marr, right along the Yarra — genuinely one of the
          nicer stadium walks in world sport, not just a functional route. This is the option most first-timers
          underrate in favour of the tram.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">By free tram</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Trams 70 and 70a run free on the day of any valid match ticket — no tap-on needed, just board at the
          Flinders St/Swanston St corner. For every other Melbourne public transport trip, you need a myki card,
          available at stations, convenience stores, or the myki app.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Cost with a match ticket" value="Free — no tap-on required" />
          <FactRow label="Cost without a ticket" value="Standard myki fare, capped daily/weekly" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">By train</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Jolimont Station (Hurstbridge/Mernda lines) serves the northern entrances to the precinct. Richmond
          Station (Dandenong/Frankston/Sandringham/Glen Waverley lines) serves the southern approach, past the MCG
          — useful if you&apos;re coming from further out and those lines suit your route better than a change at
          Flinders Street.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Taxi / rideshare</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A dedicated taxi rank sits next to Melbourne Park Oval on Olympic Boulevard, and rideshare pickup/drop-off
          is a separate designated point outside John Cain Arena, also on Olympic Boulevard — both inside the
          precinct, not off-site. Given the venue is a 10-minute walk from Flinders Street and Olympic Boulevard
          gets genuinely congested around session start and end times, a taxi or Uber rarely beats walking or the
          free tram for anyone already in or near the CBD. Melbourne Park&apos;s own guidance is to only request
          your ride once you&apos;ve physically reached the pickup point, specifically to stop the street backing
          up further — worth following even if it means a short wait.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Driving &amp; parking</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          The official option is Eastern Plaza Car Park at Entrance D, Olympic Boulevard — AU$20 pre-booked or
          AU$30 drive-up on tournament days (AU$7.50 flat on non-event days), with online bookings closing at
          midnight the night before. If Eastern Plaza is full or unavailable, Yarra Park (the MCG&apos;s car park),
          Secure Parking, and Wilson Parking all operate nearby as fallback options. Given the free tram and the
          short walk from Flinders Street, driving only really makes sense if you&apos;re combining the trip with
          somewhere a car is genuinely useful — for tennis alone, it&apos;s the slowest and most expensive way in.
        </p>
        <FactRow label="Pre-booked, event day" value="AU$20 — Eastern Plaza Car Park, Entrance D" />
        <FactRow label="Drive-up, event day" value="AU$30" />
      </div>

      {transit && (
        <div className="mb-8">
          <SpokeExperienceCard experience={transit} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Plan your exact journey</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Transport Victoria&apos;s own journey planner covers the last-mile walk or tram connection from wherever
          you&apos;re starting to Melbourne Park, plus any live disruption on the day.
        </p>
        <a
          href="https://transport.vic.gov.au/journey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Plan your journey on Transport Victoria →
        </a>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Transport Victoria (transport.vic.gov.au), Melbourne Park (melbournepark.com.au — getting here and
        parking).
      </p>

    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
