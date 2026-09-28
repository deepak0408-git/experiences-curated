import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const hillstand = linkedExperiences.find((e) => e.slug.includes("hill-stand-c2"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell eventSlug={eventSlug} eventId={event.id} eventCurrency={event.packCurrency} spokeId={SPOKE_ID} justPurchased={justPurchased} eventName="Bahrain Grand Prix" status="public" h1="Arrival & queue strategy by stand" question="What time should I arrive at Sepang gates?" heroImageUrl={heroImageUrl} isUnlocked={isUnlocked}>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Race day is Sunday 4 October, with the main event at 15:00 (qualifying is Saturday 3 October at 16:00) — but
        the grounds are running a full morning of on-track action and fan activities well before that, so treat
        &quot;race start&quot; as the last thing you&apos;d arrive for, not the first. Plan to be through the gates by
        mid-morning, around 10:00–11:00, rather than cutting it to the standard 2-to-3-hour pre-race window — that
        window still applies as a bare minimum, especially for general admission, but it puts you at the gates closer
        to 12:00–13:00, missing everything that happens earlier in the day. Arrival strategy genuinely differs by
        which ticket you&apos;re holding, so plan around your specific stand as well as your own appetite for the
        full day.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Reserved seating (Main Grandstand, K1, Grandstand F)</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Your seat is yours regardless of arrival time, so you have more flexibility than general admission — the
          latest sensible arrival is around 13:00–13:30 (roughly 90 minutes before the 15:00 start) to catch the grid
          walk, which is visible from almost pit-wall distance from the Main Grandstand. But since there&apos;s a
          full morning of on-track action before that, coming earlier — mid-morning rather than early afternoon —
          gets you the rest of the day, not just the last hour of it. Within K1&apos;s unreserved blocks, seating is
          first-come within your section, so lean toward the earlier arrival to claim a spot with a clear line to
          both Turn 1 and Turn 2, not just whichever seat is free.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">General admission (Hill Stand / C2)</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          This is where arrival time matters most. General admission means no reserved return to your exact spot if
          you leave, and the hill fills from the morning&apos;s on-track sessions onward — aim to be through the
          gates by mid-morning, around 10:00–11:00, to claim ground near the partial canopy rather than settling for
          whatever&apos;s left once the day builds toward the 15:00 start. The canopy covers only part of the
          embankment, and Sepang&apos;s rain can turn heavy fast, so know where the covered sections are before you
          settle in, not after the sky turns.
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
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">One gap that&apos;s still open</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Confirmed 2026 session times put race start at 15:00 on Sunday and qualifying at 16:00 on Saturday, and
          the arrival guidance above is built around those. What Sepang hasn&apos;t published yet is the exact
          gate-opening time itself — the hour the turnstiles actually start letting people in. Check{" "}
          <a href="https://tickets.formula1.com/en/f1-83069-bahrain-in-malaysia" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            tickets.formula1.com
          </a>{" "}
          closer to race weekend for the confirmed gate-opening time.
        </p>
      </div>

      {hillstand?.whatToAvoid && (
        <p className="text-sm text-[#A3A3A3] leading-7 mt-8 mb-8">{hillstand.whatToAvoid}</p>
      )}

      {hillstand && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The general admission stand</p>
          <SpokeExperienceCard eventSlug={eventSlug} experience={hillstand} isPro={isPro} />
        </div>
      )}
    </SpokeShell>
  );
}
