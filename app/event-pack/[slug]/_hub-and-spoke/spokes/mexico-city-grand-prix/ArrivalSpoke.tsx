import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const arrivalGuide = linkedExperiences.find((e) => e.slug.includes("mexico-city-gp-arrival-queue-"));
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
      h1="Airport-style screening and a strict bag policy — pack light"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Exact 2026 gate-opening times haven&apos;t been published yet — expect roughly 2-3 hours before each
        day&apos;s first session, based on the confirmed session schedule. Security here runs closer to an airport
        checkpoint than a typical sporting-event bag check, and knowing the rules before you pack saves a real
        confiscation at the gate.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Metro to the circuit — three stations, by gate</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Metro Line 9 is the reliable way in, with three stations serving the circuit, each matched to different
          gates: Velódromo for Gate 1, Ciudad Deportiva for Gates 4-7, and Puebla for Gates 8, 9, and 12. Check
          your ticket for your assigned gate before you travel. On race day specifically, several Line 9 and
          Metrobús stations — including Ciudad Deportiva, Puebla, and Pantitlán — actually close to manage crowd
          flow; Velódromo stays open and becomes the reliable fallback regardless of your gate that day. Full
          route detail, plus the rideshare drop-off situation, is covered in the Getting There spoke.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Velódromo" value="Gate 1 — stays open on race day" />
          <FactRow label="Ciudad Deportiva" value="Gates 4, 5, 6, 7 — closes race day" />
          <FactRow label="Puebla" value="Gates 8, 9, 12 — closes race day" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Bag policy & security</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Bags are officially limited to roughly 10 x 15 x 30cm and should ideally be transparent. Every bag is
          subject to a search at the entrance, and thoroughness varies by gate and staff — budget extra time rather
          than assuming a quick wave-through. Chairs and seat cushions are explicitly prohibited, even for the
          concrete Foro Sol seating. Umbrellas are allowed only if small and non-pointed; professional camera
          lenses are capped at 300mm with a two-lens maximum.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Bag size" value="~10 x 15 x 30cm, ideally transparent" />
          <FactRow label="Chairs/cushions" value="Prohibited, commonly confiscated" />
          <FactRow label="Camera lenses" value="Max 300mm, 2-lens limit" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A confiscated item isn&apos;t returned</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          This isn&apos;t security theater — a confiscated prohibited item is disposed of, not held for pickup, and
          repeat or serious violations can mean being denied entry entirely. Treat the list above as real rules to
          plan around.
        </p>
      </div>

      {arrivalGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={arrivalGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Leaving your seat mid-session</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        In a reserved grandstand, your seat is yours for the session regardless of when you return. Foro Sol and
        general admission areas are different — there&apos;s no guaranteed return to the exact ground you claimed
        in an open zone, so treat a mid-session break as a real trade-off, especially in the hour before the race
        start when crowds around every entrance and food stand peak.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Arrive right as gates open on any day you genuinely care about your seat or sightline, especially at
            Foro Sol where good spots fill on merit rather than assigned arrival windows. On race day specifically —
            the single heaviest-traffic day of the weekend, with several Metro stations closing to manage crowd flow
            — build in real buffer time beyond what worked on practice or qualifying days.
          </p>
        </div>
      )}
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
