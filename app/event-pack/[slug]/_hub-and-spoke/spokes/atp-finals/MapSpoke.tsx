import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const practiceCourts = linkedExperiences.find((e) => e.slug.includes("atp-finals-practice-courts"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="public"
      h1="A first-timer's guide to the venue site"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Inalpi Arena isn't just the seating bowl — the tournament runs a real, distinct set of spaces around it, and
        knowing where things actually are before you arrive means less time spent finding facilities and more time
        watching tennis. It's the same building that hosted ice hockey at the 2006 Winter Olympics, originally built
        as Palasport Olimpico — Inalpi Arena is its current sponsor name, and you'll see both used interchangeably by
        ticket resellers and local sources.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Site layout</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Inalpi Arena — the main venue</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            183 metres long, 100 metres wide, 4 levels — two above ground, two below, descending 7.5m to court
            level. General spectators use the north gates on Piazzale Grande Torino; corporate hospitality and media
            use the south gates on Via Filadelfia 82 — genuinely separate entrances on opposite sides of the
            building. Each of the arena's four seating sectors also has its own dedicated gate, which keeps queues
            split rather than funnelling everyone through one door. Gates open a maximum of 2 hours before the first
            match.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Fan Village</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            9,500sqm on Piazzale Grande Torino, right next to the arena, split into three zones: Partners Court
            (sponsor activations), Racquetland (pickleball, mini padel, mini beach tennis, and an eSports
            "Simulation Hub"), and the Food Court, which also hosts the eSeries Finals and a large screen for live
            entertainment. Entry is ticketed separately from the tennis, roughly €15-30 per session — it isn't a
            free walk-in add-on to a match ticket.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Facilities inside the arena</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food, drink, and luggage</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A Food &amp; Merchandising area sits on the walkway outside the arena, plus a ground-level food court
            with fast food, pizza, and sushi. All catering runs through CAMST Group, which uses paper or reusable
            cups rather than individual bottles as a stated sustainability policy. Luggage and helmet deposits are
            available at both the north gates (Piazzale Grande Torino) and south gates (Via Filadelfia) — useful if
            you're heading straight from the airport or a day trip.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Accessibility</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Accessible seating runs the full ground-floor perimeter with direct outside access — no stairs. Booking
            for accessible seats is handled by a dedicated service the event organiser chooses, which varies event
            to event, so confirm arrangements with the ticket office ahead of your visit rather than assuming a
            standing venue policy. There's no on-site parking, but public street parking nearby includes designated
            disability spaces.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Re-entry between sessions</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          If you've bought a day/night double ticket, you can wait in the Food &amp; Merchandising area between
          sessions and re-enter for the night session with your ticket's QR code re-scanned — a genuine, confirmed
          policy, not a workaround. What isn't confirmed is whether you can step out mid-session and return on the
          same ticket; the published policy covers the gap between sessions specifically, not a mid-match break, so
          don't assume you can leave and come back once a session's underway.
        </p>
      </div>

      {practiceCourts && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circolo della Stampa Sporting — Training Center</p>
          <SpokeExperienceCard experience={practiceCourts} isPro={isPro} />
        </div>
      )}

      <div className="relative w-full aspect-[1024/683] rounded-sm border border-[#2A2A2A] overflow-hidden mb-8 bg-[#141414]">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/atp-finals-inalpi-arena-sector-map.jpg"
          alt="Inalpi Arena sector map for the ATP Finals, showing the four seating sectors — North, South, East, West — and their dedicated gates"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">
        Sector map via Archistadia, a third-party Italian stadium-guide site — not an official tournament or venue
        publication. No official seating map is published on nittoatpfinals.com or inalpiarena.it as of this
        writing; check the official ticketing site's own seat-selection tool for the most current layout when you
        buy.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Sustainability certified</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Inalpi Arena holds UNI EN ISO 20121:2012 certification for event sustainability management — a signal of
          how professionally the venue is run day to day, beyond just the tournament week.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: nittoatpfinals.com (venue overview, Fan Village, prices), inalpiarena.it (facilities, accessibility,
        bag policy), archistadia.it (sector map). Verified 7 Aug 2026.
      </p>
    </SpokeShell>
  );
}
