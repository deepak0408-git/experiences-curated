import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const hillstand = linkedExperiences.find((e) => e.slug.includes("hill-stand-c2"));
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell eventSlug={eventSlug} eventId={event.id} eventCurrency={event.packCurrency} spokeId={SPOKE_ID} justPurchased={justPurchased} eventName="Bahrain Grand Prix" status="public" h1="Arrival & queue strategy by stand" question="What time should I arrive at Sepang gates?" heroImageUrl={heroImageUrl} isUnlocked={isUnlocked}>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Exact 2026 gate times for this relocated race haven&apos;t been published yet — Sepang typically opens gates
        several hours before the first on-track session, with exact times released closer to the event. What&apos;s
        already clear from how the venue is built, though, is that arrival strategy genuinely differs by which stand
        you&apos;re heading for, so plan around your specific ticket, not a single blanket arrival time.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Reserved seating (Main Grandstand, K1, Grandstand F)</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Your seat is yours regardless of arrival time, but arriving early still matters for two reasons: the
          pre-race grid walk at the Main Grandstand is visible from almost pit-wall distance if you&apos;re seated
          before the cars roll out, and within K1&apos;s unreserved blocks, seating is first-come within your section
          — arrive early enough to claim a spot with a clear line to both Turn 1 and Turn 2, not just whichever seat
          is free.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">General admission (Hill Stand / C2)</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          This is where arrival time matters most. General admission means no reserved return to your exact spot if
          you leave — arrive early enough on race day to claim ground near the partial canopy rather than settling
          for whatever&apos;s left once the hill fills up. The canopy covers only part of the embankment, and
          Sepang&apos;s rain can turn heavy fast, so know where the covered sections are before the session starts,
          not after the sky turns.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting through the gates</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Mall — Sepang&apos;s main food-and-facilities hub — sits directly behind the Main Grandstand complex,
        which is a genuine practical advantage on a hot Malaysian afternoon: water, shade, and shorter toilet queues
        are all close by. K1 has its own on-site screens, a food-and-drink kiosk, toilets, and a prayer room, so
        there&apos;s little reason to leave your seat there either. Grandstand F is the outlier — it&apos;s the
        furthest of the three named grandstands from the paddock and the Mall, so bring your own water and snacks
        rather than planning on a mid-session food run, and budget real extra time for the walk in.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Leaving your seat mid-session</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Whether you can step out for lunch or the restroom and come back to the same spot depends entirely on
        whether your ticket is reserved. In the Main Grandstand, K1, and Grandstand F, your seat (or your block, for
        K1 and F&apos;s unreserved-within-block seating) is yours for the session regardless of when you arrive, so
        a food or bathroom break doesn&apos;t cost you your view — just factor in the walk for Grandstand F
        specifically, since it&apos;s genuinely further from facilities than the other two. The Hill Stand (general
        admission, C2) is different: there&apos;s no reserved return to your exact spot if you leave, so the ground
        you claimed near the canopy can be gone by the time you get back. If you&apos;re in general admission, treat
        a mid-session break as a real trade-off, not a given — bring water and snacks in with you rather than
        planning to step out.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest gap here</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang hasn&apos;t published exact 2026 gate-opening times for this relocated race yet, and we won&apos;t
          invent a specific hour. What&apos;s reliable is the pattern above — reserved stands reward early arrival
          for the atmosphere and sightlines, general admission rewards it for the ground itself. Check{" "}
          <a href="https://tickets.formula1.com/en/f1-83069-bahrain-in-malaysia" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            tickets.formula1.com
          </a>{" "}
          closer to race weekend for confirmed gate times.
        </p>
      </div>

      {hillstand?.whatToAvoid && (
        <p className="text-sm text-[#A3A3A3] leading-7 mt-8">{hillstand.whatToAvoid}</p>
      )}
    </SpokeShell>
  );
}
