import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

// "On-site facilities" expanded 12 Sep 2026 to match Bahrain/Brazilian GP's
// MapSpoke pattern (food/payment, access policy, accessibility, phone
// signal, noise) instead of just Fan Zone + a generic food blurb. Real facts
// verified via mexico.gp's "At the Circuit"/rules-for-visitors pages and
// corroborating spectator-guide sources, 12 Sep 2026: Citibanamex Cashless
// system, no outside food/drink, no pass-outs/re-entry, Green/Blue Zone
// accessible seating, alcohol service hours, 12 free water stations.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const whereToSit = linkedExperiences.find((e) => e.slug.includes("mexico-city-gp-where-to-sit-"));
  const fanZone = linkedExperiences.find((e) => e.slug.includes("mexico-city-gp-fan-zone-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Mexico City Grand Prix"
      status="public"
      h1="A circuit built inside a public sports park, threaded through a baseball stadium"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Autódromo Hermanos Rodríguez opened in 1959 inside the Magdalena Mixhuca public sports complex, and it
        still sits there today — which is part of why this circuit doesn&apos;t feel like a purpose-built racing
        facility the way Silverstone or Spa do. When F1 returned in 2015 after a redesign, the track&apos;s final
        sector was cut straight through Foro Sol, a baseball stadium built on the site in the 1990s — nowhere else
        on the calendar does a Grand Prix run through a venue built for a completely different sport.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where each zone actually sits</p>
      <div className="relative w-full aspect-[3840/2548] rounded-sm border border-[#2A2A2A] overflow-hidden mb-4 bg-white">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/mexico-city-grand-prix-venue-map.png"
          alt="Autódromo Hermanos Rodríguez circuit layout with grandstand zones marked"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-4">Map: Wikimedia Commons, WL2392, CC BY 4.0.</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Blue Zone (Grandstands 3-6) lines the run from the start/finish straight through turns 1-3, where
          cars brake from over 300kph for the first corner — this is where the real racing and overtaking happens.
          Grandstand 12 (Yellow Zone) covers the slower, technical turns 4-6, with a partial roof over the top rows —
          one of the only sections offering real shade. Foro Sol (Grandstands 14 and 15, Grey and Brown Zones) forms
          the stadium section at turns 12-15, where the track threads between what was once a baseball diamond —
          slower corners, but the loudest, most atmospheric part of the circuit, and the site of the podium
          ceremony. General admission areas and most remaining grandstands are fully uncovered.
        </p>
      </div>

      {whereToSit && (
        <div className="mb-8">
          <SpokeExperienceCard experience={whereToSit} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">The Fan Zone</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Included with any race ticket, no separate purchase — driver and team principal appearances, F1
            simulators, a Pit Stop Challenge, and cultural programming that leans harder into local mariachi and
            folk-dance performances than most other Grands Prix.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food & drink — cashless only, no outside food</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            More than 50 food options run across temporary stalls and food trucks — tacos, seafood, pizza, churros,
            and more — but you can&apos;t bring your own food or drink onto the circuit, and every purchase goes
            through the Citibanamex Cashless card system rather than cash-in-hand. Load the card before you&apos;re
            actually hungry. Beer is sold 11:00-19:00 and spirits 12:00-19:00; up to 12 free water stations are
            spread across the fan zones if you just need to refill.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">No pass-outs</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Once you leave the circuit, you can&apos;t re-enter that same day — treat this as a one-way gate for
            the full session, not a venue you can duck out of for a break.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Accessibility</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Designated accessible seating sits in the Green Zone and Blue Zone specifically, with accessible
            facilities built into those areas — worth confirming directly with the ticketing team if this matters
            to your booking, since it&apos;s not evenly spread across every grandstand.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Phone signal on race day</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Mobile networks genuinely struggle under race-weekend crowds, Sunday worst of all — agree a physical
            meeting point with anyone you might get separated from rather than counting on being able to call or
            message them.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Noise — bring earplugs if you're close to the track</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The standard grandstands are loud but manageable; anywhere genuinely close to the cars is not, and
            earplugs are a real, practical add rather than overcaution — worth it for kids specifically.
          </p>
        </div>
      </div>

      {fanZone && (
        <div className="mb-8">
          <SpokeExperienceCard experience={fanZone} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Getting between zones</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Because the circuit sits inside a working public sports complex rather than a facility built solely for
          racing, large parts of the race-weekend infrastructure — stages, some food areas, fan zone structures —
          are temporary builds rather than permanent fixtures. Follow the Metro station matched to your specific
          gate (see the Getting There guide) to reach your zone directly, rather than crossing the venue on foot from
          a different entrance.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually check before buying</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            If racing action is the priority, confirm your grandstand sits in the Blue Zone (turns 1-3) before
            buying — the seating chart alone doesn&apos;t always make this obvious. If you specifically want the
            Foro Sol atmosphere, understand you&apos;re trading racing quality for crowd energy, not getting both;
            neither Foro Sol stand gets you close to the pit lane or paddock, so if garage proximity matters, look at
            Grandstands 1 and 2 on the front straight instead.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
