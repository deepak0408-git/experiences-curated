import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";
const VENUE_MAP_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/chinese-grand-prix-circuit-map.jpg";

// Real content sourced from formula1.com/en/racing/2027/china (official —
// 5.451km, hosting since 2004, Turn 13-14 straight, Grandstand K/Turn 6
// recommendation) and the seeded Shanghai Circuit venue experience
// (chinese-gp-circuit-venue-), 23 Sep 2026.
//
// Circuit map image added 4 Oct 2026 — the earlier version of this spoke
// said no map existed, which was wrong: a real circuit layout image
// (Will Pittenger, CC BY 3.0) is already hosted on R2 and in active use by
// Ticket Intelligence's FullResult.tsx (CIRCUIT_MAP_BY_EVENT["chinese-
// grand-prix"]), just never wired into this spoke. Reused here rather than
// re-sourced. "Where each zone actually sits" description below the map
// follows Brazilian GP's MapSpoke pattern — only states grandstand
// positions already verified elsewhere in this pack (circuit_seating_profile
// zoneLabel fields, cross-checked against TicketsSpoke's TIER_META 4 Oct
// 2026), not invented track positions for anything unconfirmed.
//
// "On-site facilities" rebuilt 4 Oct 2026 to match Brazilian GP's depth —
// the prior 3-card version was comparatively thin. New facts WebFetch-
// verified directly 4 Oct 2026 against formula1shanghai.com/en/
// rules-for-visitors-30 (own food/drink allowed if non-glass, cash/card/
// Alipay, circuit hours proxy), formula1.com's official "Helpful
// information" article (2025 edition — toilets, accessibility, children,
// payment), and formula1shanghai.com/en/at-the-circuit-30 (phone signal
// overload, noise/earplugs, weather, large-umbrella restriction) plus
// /en/access-for-disabled-people-12 (Grandstands H/K accessible seating,
// special-ticket request path). Reconciled one real conflict across
// sources: an early "food and drink banned" framing from a different page
// was superseded by the more specific "own food okay, no glass" rule
// carried through to this spoke. "A 200,000-capacity venue" card removed
// per founder request.
//
// "Getting between zones" fixed 4 Oct 2026 — the first version wrongly
// described Metro Line 11 (which only gets you TO the circuit) as the way
// to move BETWEEN zones INSIDE it. Corrected using formula1shanghai.com's
// own search-indexed copy ("distances...can be pretty long, and some
// transitions between stands can take tens of minutes") and
// /en/entering-the-circuit-31 (Gate 1 sits just behind Grandstand A, near
// the metro station) — walking is the real answer for most of the venue.
// The one genuine shuttle (P5↔P13, serving Grandstand E specifically) was
// already sourced in circuit_seating_profile's Grandstand E row and is
// reused here rather than re-verified from scratch.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const venueGuide = linkedExperiences.find((e) => e.slug.includes("chinese-gp-circuit-venue-"));
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
      h1="A 5.451km 'shang'-shaped layout, hosting F1 since 2004"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Shanghai International Circuit&apos;s layout traces the Chinese character &quot;shang&quot; (上) — the
        first character in the city&apos;s own name, meaning &quot;above&quot; or &quot;ascend.&quot; It measures
        5.451km, confirmed directly on Formula 1&apos;s own event page, and has hosted the Chinese Grand Prix since
        2004.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit map</p>
      <div className="relative w-full aspect-[3840/2433] rounded-sm border border-[#2A2A2A] overflow-hidden mb-4 bg-white">
        <Image
          src={VENUE_MAP_URL}
          alt="Shanghai International Circuit layout, tracing the 'shang' (上) character shape with Turns 13-14's long straight and hairpin marked"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-4">Credit: Will Pittenger, CC BY 3.0.</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Grandstands H and K face each other across the Turn 14 hairpin at the end of the circuit&apos;s 1.2km
          back straight — H sees the braking attempt into the corner, K sees the exit and resolution, and Formula
          1&apos;s own race guide names K the best seat at the circuit for watching overtakes outright. Grandstand
          B sits at the opposite end of the lap, covering the opening Turns 1-3 sequence and the first-lap fight
          right off the main straight. Grandstand A, the circuit&apos;s largest stand, runs along the main straight
          itself — start, finish, pit lane, and podium all in view from one seat. Grandstand E is the newest
          addition, built into the Turn 11-13 complex on the run toward the back straight; see the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>{" "}
          for pricing and seating type on each, plus General Admission&apos;s roaming zones around the rest of the
          lap.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The layout that shapes every grandstand</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The circuit&apos;s signature feature is a 1.2km straight linking Turns 13 and 14 — one of the longest
          continuous runs on the current F1 calendar. That straight ends in the tight hairpin Grandstands H and K
          face each other across. A second genuine passing zone sits at Turn 6, a second-gear hairpin with
          generous run-off — worth knowing about even if you&apos;re not sitting there, since it&apos;s a reminder
          this circuit&apos;s racing doesn&apos;t happen in just one place.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Beyond race weekend</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        This circuit is a genuine year-round destination, not just a three-day race venue — a national 4A-rated
        tourist attraction with guided facility tours, a serious FIA-grade karting track, and one of only six
        Porsche Experience Centres in the world sharing its address.
      </p>
      {venueGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={venueGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food & drink — bringing your own is allowed</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Confirmed directly on Formula 1 Shanghai&apos;s own site: you&apos;re allowed to bring your own food and
            drink in, as long as it&apos;s not in glass containers. On-site, cash, cards, and Alipay are all
            accepted — basic food menus start around ¥110 (roughly US$16), and alcohol is served on-site in
            moderation with valid ID.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Toilets & accessibility</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Every grandstand is a permanent structure with ground-level toilets, plus additional levels inside the
            larger Grandstand A — temporary toilets also run through the fan zone and behind each stand. Grandstands
            H and K are specifically equipped and reserved for spectators with disabilities, and dedicated staff are
            on hand circuit-wide to guide and assist throughout the weekend; reduced-mobility visitors can request
            special tickets ahead of the event.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Phone signal on race day</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Mobile networks can overload under race-weekend crowds, Sunday worst of all — agree a physical meeting
            point with anyone you might get separated from rather than counting on being able to call or message
            them. There&apos;s no public wifi for visitors either, so don&apos;t plan around having one.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Noise — bring earplugs if you're close to the track</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The standard grandstands are loud but tolerable; anywhere genuinely close to the cars is not, and
            earplugs are a real, practical add rather than overcaution — worth it for kids specifically.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Shade, seating & water</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Free water refill stations, shaded areas, and seating are available around the circuit, alongside
            medical facilities — bring a refillable bottle rather than relying on buying water on-site all weekend.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Age restrictions</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            No minimum age limit for entry, though the circuit recommends children be over three years of age —
            genuinely more family-friendly than circuits with a hard age cutoff. Bring valid ID for any child
            attending, the same as adults.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Getting between zones — mostly on foot</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Walking is the main way to move around once you&apos;re inside — this is a genuinely large circuit, and
            moving between stands on opposite sides of the lap can take tens of minutes, more with race-weekend
            crowds, so don&apos;t plan a tight switch between zones on the same day. Shanghai Circuit station (Metro
            Line 11) sits a few minutes&apos; walk from Gate 1, just behind Grandstand A. The one real exception is
            Grandstand E, the circuit&apos;s newest and most remote stand: a dedicated shuttle runs between parking
            lots P5 (near Grandstand J) and P13 (near Grandstand E) on race days, with walking there via on-site
            signage also an option if you&apos;d rather skip the shuttle queue.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Passport check at entry</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Every attendee needs passport details registered against their ticket ahead of the event, verified by
            facial recognition at circuit and grandstand entry — see the{" "}
            <a href={`/event-pack/${eventSlug}/arrival`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Arrival guide
            </a>{" "}
            for the full requirement.
          </p>
        </div>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually check before buying</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          If racing action is the priority, confirm your grandstand faces the Turn 14 hairpin (H or K) rather than
          assuming any covered stand gives you the same view. If a single complete view of the whole race weekend
          matters more than one corner&apos;s drama, Grandstand A on the main straight is the honest step-up —
          start, pit strategy, and finish, all from one seat, trading that specific hairpin drama for the fuller
          picture.
        </p>
      </div>
    </SpokeShell>
  );
}
