import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const transitGuide = linkedExperiences.find((e) => e.slug.includes("getting-between-four-cities-flights-not-trains"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="public"
      h1="Flights, not trains — the real domestic-hop logistics of a 4-city Australian tour"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This is a genuinely different logistics problem from a single-city or single-country event pack. Perth to
        Adelaide to Melbourne to Sydney is roughly 4,300km end to end — Australia is enormous, and there is no
        practical rail option connecting all four host cities on any timeline a Test tour actually allows. Every
        leg is a domestic flight, full stop.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The four legs</p>
      <div className="flex flex-col gap-3 mb-8">
        <RouteRow route="Perth → Adelaide" detail="~50 flights/week, roughly 2h50-3h15 flight time. Qantas, Jetstar, and Virgin Australia all fly this route." />
        <RouteRow route="Adelaide → Melbourne" detail="~18 flights/day, roughly 1h20 flight time — one of the most frequent domestic routes in the country." />
        <RouteRow route="Melbourne → Sydney" detail="One of the world's top-10 busiest domestic air routes. Multiple flights per hour across Qantas, Jetstar, and Virgin Australia." />
        <RouteRow route="Sydney → home" detail="Your international departure — book this leg last, once your Fourth Test dates are locked." />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Ruled out — and why</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Indian Pacific train (Perth-Adelaide-Sydney) takes 2 nights one-way — genuinely impractical against a
          multi-Test itinerary with real dates to hit. The Overland (Adelaide-Melbourne) runs roughly 10.5 hours,
          once a week — workable only if your schedule happens to align with its single weekly departure. Flying is
          the only realistic way to see all four Tests on this tour.
        </p>
      </div>

      {transitGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={transitGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for this trip</p>
      <div className="flex flex-col gap-3 mb-8">
        <FactRow label="Transit journey planner" value="Each city runs its own app — Transperth (Perth), Adelaide Metro, PTV (Melbourne, myki-based), and Opal Travel (Sydney). Install the one for your current city, not all four at once." />
        <FactRow label="Ride-hailing" value="Uber and DiDi both operate reliably across all four cities — no tourist-eligibility restrictions in Australia, unlike some destinations." />
        <FactRow label="Flight booking/tracking" value="Qantas, Jetstar, and Virgin Australia all have their own apps for check-in and real-time gate/delay info — worth having whichever airline you're flying installed before your first domestic leg." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book domestic legs early, and watch sale patterns</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Domestic Australian airfares move with real seasonal demand, and a four-Test tour means booking four
          separate one-way domestic legs, not one round trip — each leg should be booked as soon as your dates for
          that city are fixed, not bundled together and left until closer to the trip. Qantas and Jetstar both run
          regular sale periods; Jetstar specifically tends to undercut on price at the cost of stricter baggage/
          change policies, worth checking against your actual itinerary flexibility before booking the cheapest
          fare by default.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Qantas, Jetstar, and Virgin Australia route/frequency data; Great Southern Rail (Indian Pacific,
        The Overland) schedules.
      </p>
    </SpokeShell>
  );
}

function RouteRow({ route, detail }: { route: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{route}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
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
