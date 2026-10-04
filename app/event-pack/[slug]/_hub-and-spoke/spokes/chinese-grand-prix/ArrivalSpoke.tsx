import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Real content sourced from the seeded Arrival & Entry Guide and Fan Zone
// experiences (chinese-gp-arrival-guide-, chinese-gp-fan-zone-), 23 Sep
// 2026. Per skill §2a-3: 2027 gate times are NOT yet published on any
// official F1 channel — this spoke leads with the one entry requirement
// that IS confirmed (passport registration) rather than inventing gate
// times.
//
// Prohibited-items list added 4 Oct 2026 — the earlier version of this
// comment said no list was published yet; that was wrong. Formula 1
// Shanghai's own official "Rules for visitors" page
// (formula1shanghai.com/en/rules-for-visitors-30) is a real, dedicated
// 2027-specific source (confirmed "F1 GP China 16-18 April 2027" on the
// page itself) and lists a full prohibited-items set, WebFetch-verified
// directly against the live page 4 Oct 2026. No bag-size limit or umbrella
// length specified — long-handled/pointed umbrellas specifically banned,
// not umbrellas generally.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const arrivalGuide = linkedExperiences.find((e) => e.slug.includes("chinese-gp-arrival-guide-"));
  const fanZone = linkedExperiences.find((e) => e.slug.includes("chinese-gp-fan-zone-"));
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
      eventName="Chinese Grand Prix"
      status="public"
      h1="Passport registration matters more than gate timing — the one requirement that's actually confirmed"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Every attendee at this circuit, regardless of ticket tier or nationality, including Chinese citizens, must
        register their full name and passport number against their ticket several weeks before the event. This is
        stated plainly on Formula 1&apos;s own ticketing site, not buried in fine print — and it&apos;s a genuinely
        different process from buying F1 tickets in most other countries on the calendar. Do this the moment your
        ticket is confirmed.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Gate times: not yet published</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Exact gate opening times for 2027 aren&apos;t confirmed as of this writing — session times across the
          whole weekend are still marked TBC on Formula 1&apos;s own site. What is confirmed is the weekend&apos;s
          shape: Friday practice, Saturday qualifying, Sunday race, at a circuit built to handle 200,000 attendees
          across the full event. A venue at that scale means gates that open well ahead of the first session each
          day — plan to arrive earlier than you think you need to, especially on race day.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to bring</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Bring your physical passport, not just a photo of it — the registration requirement implies real ID
          verification at some point in the entry process, and a physical document is the safer assumption until
          2027&apos;s exact entry procedure is published in more detail. Every grandstand comes fitted with a large
          screen, so even if a queue costs you a few minutes of missed track action, you won&apos;t lose the thread
          of the session once you&apos;re through.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Prohibited items</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Confirmed directly on Formula 1 Shanghai&apos;s own official &quot;Rules for visitors&quot; page for the
          2027 race. If you&apos;re caught with a prohibited item, you won&apos;t be granted entry unless you
          discard it — don&apos;t pack anything on this list expecting a bag check to be lenient.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Alcohol, glass bottles, cups & fragile containers" value="Banned" />
          <FactRow label="Animals" value="Banned, except service animals" />
          <FactRow label="Firearms, knives & other weapons" value="Banned, including replicas or imitations" />
          <FactRow label="Fireworks, flares, lasers & balloons" value="Banned, along with other flammable materials" />
          <FactRow label="Toxic, corrosive or hazardous chemicals" value="Banned" />
          <FactRow label="Sticks, bats & other sharp objects" value="Banned" />
          <FactRow label="Umbrellas" value="Long-handled or pointed ones banned — bring a rain jacket instead" />
          <FactRow label="Professional cameras & broadcasting equipment" value="Banned outright, no exceptions" />
          <FactRow label="Drones or similar aircraft" value="Banned" />
          <FactRow label="Radios, walkie-talkies & other communication devices" value="Banned" />
          <FactRow label="Musical instruments, air horns & other noise-makers" value="Banned" />
          <FactRow label="Selfie sticks, monopods & unauthorised camera mounts" value="Banned" />
          <FactRow label="Prams, strollers & oversized items" value="Banned if it doesn't fit under a seat" />
          <FactRow label="Bicycles, scooters, skateboards & similar mobility devices" value="Banned" />
        </div>
      </div>

      {arrivalGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={arrivalGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Fan Zone &amp; off-track activities</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A 200,000-capacity race weekend always fills the hours between sessions with something — 2027&apos;s
        specific fan-zone programming for this circuit hasn&apos;t been published on any official F1 channel yet,
        but every previous edition of this race has run some form of it. Check back on formula1.com as the event
        approaches for confirmed detail.
      </p>
      {fanZone && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={fanZone} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Register your passport details the day you buy your ticket, not as a pre-trip checklist item to handle
          later — it&apos;s a genuine requirement, not a formality. Check your bag against the prohibited-items
          list before you pack it, not when you&apos;re already in the security queue — a long-handled umbrella or
          a drone you forgot about means discarding it or not getting in. Since exact gate times aren&apos;t
          published yet, build flexibility into your first session-day plan rather than cutting it close to a
          specific assumed time, and check formula1.com again as the event approaches for the confirmed schedule.
        </p>
      </div>
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
