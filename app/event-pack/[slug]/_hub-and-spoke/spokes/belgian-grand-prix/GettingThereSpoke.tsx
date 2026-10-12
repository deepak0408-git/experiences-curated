import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real content sourced from the seeded Getting to the Circuit experience
// (getting-to-circuit-belgian-gp-), 12 Oct 2026: day-return shuttles from 14
// cities, Verviers-Central as the nearest train station, and genuinely slow
// exit queues on race Sunday.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("getting-to-circuit-belgian-gp-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Belgian Grand Prix"
      status="public"
      h1="Day shuttles from 14 cities, or the train to Verviers plus a local bus"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa-Francorchamps sits deep in the Ardennes forest, well outside any major city — reaching it is less
        straightforward than a city-centre circuit, and most visitors use one of three real routes: the official
        day-return shuttle, the train plus a local connection, or driving with a pre-booked parking spot.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The day-return shuttle — the route most fans actually use</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Day-return coaches run from 14 cities across Belgium and the Netherlands, including Brussels, Liège,
          Namur, and Antwerp — roughly €65–75 per day, booked via spagrandprix.com. Sales close around 26 June, so
          book well ahead of race weekend; this is genuinely the most popular way to reach the circuit without
          driving, and bookings fill before the race tickets themselves do.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">By train — Verviers-Central plus a bus or shuttle</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Verviers-Central is the nearest major train station, roughly 35km from the circuit. From there, TEC
          regional buses and a dedicated race-day shuttle connect to the circuit — a real option for anyone not
          driving, though the shuttle from a city like Brussels is the simpler single-ticket option for most
          visitors.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Driving — pre-booked parking only, and budget real time to leave</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          On-site parking is pre-booked only — arrive without a reservation and you&apos;ll be walking a long
          distance from off-site parking instead. Sunday exit queues after the race regularly run two hours on the
          circuit&apos;s single-carriageway roads; plan to stay for the podium ceremony rather than rush the car
          park, since leaving early rarely beats the queue anyway.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official Formula 1 app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Fastest way to catch schedule changes, Fan Zone driver appearances, and session timing updates in
              real time — often posted here before anywhere else. Download before you travel.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">SNCB (Belgian Railways)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Useful if you&apos;re routing via Verviers-Central from Brussels or another Belgian city before
              connecting to the circuit.
            </p>
          </div>
        </div>
      </div>

      {gettingThereGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={gettingThereGuide} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Book the day-return shuttle the moment your tickets are sorted — it&apos;s the simplest single-ticket
          route from most major Belgian and Dutch cities, and bookings close weeks before race weekend. If
          you&apos;re driving, pre-book parking and accept that Sunday evening means a genuinely slow exit — stay
          for the podium rather than racing the crowd to the car park.
        </p>
      </div>
    </SpokeShell>
  );
}
