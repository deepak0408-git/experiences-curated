import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import ZoomableImage from "../../_components/ZoomableImage";

const SPOKE_ID = "map";
const CIRCUIT_MAP_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/qatar-grand-prix-circuit-map.png";

// Real facts sourced from Inside Lusail Circuit (qatar-gp-inside-lusail-
// circuit-mtymp2ma), 13 Sep 2026: 2023 rebuild to 52,000 capacity, 50-box
// pit lane building (largest on the calendar), 85 screens, three access
// tunnels, 15,000 parking spaces, Lusail Hill's own origin as a purpose-
// built elevated viewing area. 5.419km, 16 turns, 1.068km main straight,
// Lando Norris' 1:22.384 lap record (2024), artificial-grass track border,
// MotoGP's first night race (2008), F1 debut 2021.
//
// Depth pass 14 Sep 2026, matching Brazilian GP's MapSpoke pattern
// (previously missing entirely — no circuit map image, no zone-by-zone
// breakdown, no facilities section): official circuit map uploaded
// (Images/Qatar GP - LIC_Map_Ticketshop_F1_2026.png, curator-supplied,
// from the official F1 ticketshop) showing every grandstand (T16, T2, T3,
// Main, North) and hospitality unit (Paddock Club, Premiere Hospitality,
// Champions Club, Lusail Hill Lounge) plus Lusail Hill GA/Fan Zone — this
// resolves the earlier T16-vs-North-vs-Main tier confusion definitively,
// since the map shows T16 as a genuinely separate stand at Turn 16, not
// related to North or Main. On-site facilities sourced from tickets.gp's
// official rules-for-visitors page (cashless payment, hearing protection
// recommended) and corroborated via independent search (TripAdvisor,
// The Peninsula Qatar) for food/toilet detail. Children's ticket policy
// (under-12 free, up to 6 per adult; under-2 free, no seat) sourced from
// marhaba.qa and qatarmotogp.com's own ticket-info page, cross-checked —
// no phone-signal or hard age-minimum facts found for this venue
// specifically, so neither is stated (unlike São Paulo's, which has both
// sourced).
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const venueGuide = linkedExperiences.find((e) => e.slug.includes("qatar-gp-inside-lusail-circuit-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="public"
      h1="A 2023 rebuild took capacity from 8,000 to over 52,000 without touching the actual track layout"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Lusail International Circuit opened in 2004 as a motorcycle venue and spent nearly two decades as one before
        F1 arrived in 2021. The venue most fans see today is largely a 2023 rebuild, done ahead of that year&apos;s
        race without altering the 5.419km, 16-turn layout underneath it.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <FactCard label="Capacity" value="52,000+ (up from the original 8,000)" />
        <FactCard label="Pit lane building" value="50 individual pit boxes — more than any other circuit on the F1 calendar" />
        <FactCard label="Screens around the venue" value="85 — a screen nearby wherever your seat can't see the action directly" />
        <FactCard label="Parking" value="15,000 spaces, plus three dedicated access tunnels to improve crowd flow" />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Three access tunnels, not one main gate</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Part of the 2023 rebuild, the tunnels were built specifically to spread arriving and departing crowds
          across multiple routes into the venue rather than funneling everyone through a single main entrance —
          real infrastructure for a circuit that nearly sextupled its capacity without changing its footprint.
          Which tunnel and gate you actually want depends on your grandstand, and that assignment isn&apos;t
          published in advance — check the official Qatar GP app&apos;s Maps feature or on-site signage and
          marshals once you arrive, rather than guessing based on your drop-off point.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The layout behind the numbers</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The lap runs 5.419km over 16 turns, with a 1.068km main straight — fast and flowing by modern F1
          standards. Lando Norris holds the outright lap record, a 1:22.384 set in 2024. One detail that&apos;s easy
          to miss on a broadcast but obvious in person: the track is bordered by artificial grass rather than real
          turf, a practical fix to stop desert sand blowing onto the racing line. Lusail also carries real
          motorsport history that predates F1 entirely — it hosted MotoGP&apos;s first-ever night race back in
          2008, more than a decade before Formula 1&apos;s Qatar debut in 2021.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit map</p>
      <ZoomableImage
        src={CIRCUIT_MAP_URL}
        alt="Lusail International Circuit layout with every grandstand and hospitality unit marked"
        aspectClassName="aspect-[2050/1260]"
      />
      <p className="text-xs text-[#6A6A6A] mb-4">Credit: lcsc.qa. Click the map to zoom in.</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          North Grandstand and Main Grandstand sit opposite each other across the front straight, with Paddock
          Club directly above the pit garages between them. T2 and T3 Grandstands cover the tight middle-sector
          chicane, and T16 Grandstand sits alone at the final corner leading onto the main straight — a genuinely
          separate stand from North or Main, not a cheaper version of either. Lusail Hill, at Turn 1, holds both
          the General Admission viewing area and the Lusail Hill Lounge hospitality product on the same elevated
          ground. Premiere Hospitality and Champions Club sit trackside near the pit exit, marked separately on the
          map from the numbered grandstands. See the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>{" "}
          for pricing and seating type on each.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Lusail Hill — purpose-built, not a leftover space</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The elevated public viewing area at Turn 1 was new with the 2023 rebuild, purpose-built as a genuine
          viewing area rather than a repurposed space — which is why the General Admission and Lusail Hill Lounge
          products both sit there today. See the Ticket Guide for the full breakdown of what each tier at Lusail
          Hill actually gets you.
        </p>
      </div>

      {venueGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={venueGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Payment — cashless</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The circuit runs largely cashless — have a card or contactless payment method ready rather than relying
            on cash for food, drink, or merchandise anywhere on site.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food & drink</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Stalls run throughout the venue, concentrated in the Fan Zone behind Main Grandstand and near the
            primary entrance. Toilets sit near the Fan Zone too, cleaned regularly through the day, though not
            every block stays open at every hour — budget real walking time if you&apos;re seated further from that
            zone.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Hearing protection</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The official visitor guidance explicitly recommends hearing protection as something to pack — worth
            taking seriously anywhere close to the track, and a real consideration for kids specifically.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Children&apos;s tickets</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Up to 6 children under 12 can attend free per adult holding a full-price ticket, though a free ticket
            still needs reserving through the official platform to guarantee entry. Children 2 and under enter
            without a ticket at all, but don&apos;t get their own seat and must stay with a parent or guardian.
          </p>
        </div>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Check the official Qatar GP app for your specific tunnel and gate before you leave the hotel, rather than
          defaulting to whichever entrance is closest to your rideshare drop-off — the tunnels exist specifically
          to spread crowd flow around the site, and the busiest single entrance on a full-capacity race day is
          rarely the fastest way in. If your seat is anywhere that doesn&apos;t
          have a clean sightline to a corner you care about, the venue&apos;s 85 screens are genuinely dense enough
          that you won&apos;t lose the action — check where the nearest one is to your section on arrival rather
          than assuming you&apos;ll have to rely on the big screens at the main straight alone.
        </p>
      </div>
    </SpokeShell>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">{label}</p>
      <p className="text-sm text-white font-bold">{value}</p>
    </div>
  );
}
