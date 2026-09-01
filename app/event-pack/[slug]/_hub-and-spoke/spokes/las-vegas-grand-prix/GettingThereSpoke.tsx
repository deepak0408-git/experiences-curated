import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const transit = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-getting-around"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="public"
      h1="The Strip closes to build the circuit — plan around that, not around traffic"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Las Vegas Grand Prix runs through the middle of the Strip, which means the roads you&apos;d normally
        use to get around are the same roads that close to build the circuit. Soft closures begin at 3pm each day
        of race weekend — Thursday through Saturday — with full closures following at 5pm, staying in place into
        the early hours the next morning. Driving is actively discouraged during this window; once full closures
        are in effect, a car genuinely cannot get you where you need to go on the Strip.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Your three real options</p>
      <div className="flex flex-col gap-4 mb-8">
        <TransitCard
          title="Walking"
          detail="If you're staying anywhere on the Strip, walking is often the most predictable choice — you already know your route, and it avoids the crowd bottlenecks that build up around monorail platforms and rideshare zones right after sessions end."
        />
        <TransitCard
          title="Las Vegas Monorail"
          detail="Runs 24 hours during race weekend. The Flamingo/Caesars Palace and Horseshoe/Paris stations both drop you within a short walk of major circuit entry zones."
        />
        <TransitCard
          title="Rideshare"
          detail="Operates from designated pickup and drop-off points only — Virgin Hotels Las Vegas (closest to the start/finish straight and East Harmon Zone) and the Hughes Center (closest to T-Mobile Zone at Sphere). Both get genuinely busy right after a session ends."
        />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paying for the monorail</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-8">
        <p className="text-sm font-bold text-white mb-1">Las Vegas Monorail</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Single ride from roughly US$6, tap-to-pay at station kiosks — no advance booking or transit card needed.
          Runs 24 hours during race weekend specifically, well past its normal operating hours.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Rideshare — why it isn&apos;t always the faster call</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Rideshare fares surge significantly around session start and end times, and both designated pickup points
          (Virgin Hotels Las Vegas, Hughes Center) see genuine crowd surges the moment a session finishes — curbside
          pickup elsewhere on the Strip isn&apos;t available once closures are active. A 15-20 minute walk to your
          zone directly is often faster and cheaper than waiting out a rideshare queue at peak times, not just a
          fallback if the app fails you.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Download the official app before you land</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The official Las Vegas Grand Prix app shows real-time road openings and closures and can build a custom
          walking route from wherever you are to your specific ticketed zone — genuinely useful on a street circuit
          where the road you walked in on might be closed by the time you head back.
        </p>
      </div>

      {transit && (
        <div className="mb-8">
          <SpokeExperienceCard experience={transit} isPro={isPro} />
        </div>
      )}

      <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The route we&apos;d actually plan</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          If your hotel sits between Virgin Hotels Las Vegas and the Hughes Center, note which one aligns with
          your ticketed zone before booking a rideshare — picking the wrong pickup point can mean a longer walk
          than heading to your zone directly. Don&apos;t plan to drive anywhere near the Strip during soft-closure
          hours (from 3pm) expecting to beat the full 5pm closure — cutting it close risks getting stuck on the
          wrong side of a barrier with no way through.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: formula1.com official &quot;How to get to and from the Las Vegas Grand Prix&quot; article
        (closure timing, monorail, rideshare pickup points), f1lasvegasgp.com A-Z Guide.
      </p>
    </SpokeShell>
  );
}

function TransitCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-sm font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
