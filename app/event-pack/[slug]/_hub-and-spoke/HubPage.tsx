import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import { getSpokeData, getSpokesForEvent, getSpokeImage, getPurchaseStatus } from "./_lib/getSpokeData";
import { getPackPricing } from "./_lib/packPricing";
import { STATUS_LABEL } from "./_components/SpokeShell";
import DodoCheckout from "../_components/DodoCheckout";
import LocalCurrencyHint from "../_components/LocalCurrencyHint";
import FavouriteToggle from "../_components/FavouriteToggle";
import ShareGuideButton from "../_components/ShareGuideButton";
import RateGuideButton from "../_components/RateGuideButton";
import { isEventPackSaved, getMyEventPackRating } from "../actions";

// Hub index for any hub_and_spoke-format event, rendered from
// app/event-pack/[slug]/page.tsx when event.packFormat === "hub_and_spoke".
// Masthead/nav markup deliberately matches the classic pack's masthead
// (same file, ~line 636) exactly — same HomepageNav (no overlay), same
// hero height/gradient, same pill/title/date sizing — so the two pack
// formats read as one continuous product, not two different sites.
// Filmstrip picks and intro copy stay per-event (real atmosphere/context,
// not generic) — see FILMSTRIP_SLUGS_BY_EVENT and INTRO_BY_EVENT below.
const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  football: "Football",
  rugby: "Rugby",
  golf: "Golf",
  formula_one: "Formula 1",
  cycling: "Cycling",
  athletics: "Athletics",
  other: "Sport",
};

const FILMSTRIP_SLUGS_BY_EVENT: Record<string, string[]> = {
  "bahrain-grand-prix": [
    "main-grandstand-sepang-start-finish",
    "f1-paddock-club-sepang-hospitality",
    "malaysia-f1-fans-nostalgia-2026-return",
    "petronas-twin-towers-kl-skybridge",
  ],
  "singapore-grand-prix": [
    "singapore-gp-turn1-grandstand",
    "singapore-gp-padang-stage-concerts",
    "singapore-gp-gardens-by-the-bay",
    "singapore-gp-waterfront-walk",
  ],
};

// "Quick Reference" — the classic pack's factual lookup table (address,
// official site, transport, emergencies). Added to the hub 1 Aug 2026 as a
// compact fact strip, same position as the classic pack (right after The
// Brief). address/ticketingUrl pull from the real event record where
// possible (see below); emergency numbers and hospital are real, sourced
// facts for the Sepang/KLIA area, not invented — see reference memory.
const QUICK_REFERENCE_BY_EVENT: Record<string, Array<{ label: string; value: string; href?: string; linkLabel?: string }>> = {
  "singapore-grand-prix": [
    { label: "Gates open", value: "F1 hasn't published exact 2026 gate-opening times yet. Based on the confirmed 2026 session schedule — Practice 1 Fri 4:30pm, Sprint Qualifying Fri 8:30pm, Sprint Sat 5pm, Qualifying Sat 9pm, Race Sun 8pm — expect gates to open roughly 2-3 hours before each day's first session. Confirm exact times closer to race week." },
    { label: "Emergencies", value: "Police: 999. Fire/ambulance (SCDF): 995 — the same number covers both. Non-emergency ambulance: 1777. Nearest 24-hour A&E to the circuit: Raffles Hospital, 585 North Bridge Road, Singapore 188770." },
    { label: "Tourism Infoline", value: "Singapore Tourism Board visitor hotline (info, not emergency dispatch): 1800-736 2000 (Mon-Fri, 9am-6pm), or +65 6736 2000 from overseas." },
  ],
  "bahrain-grand-prix": [
    { label: "Emergencies", value: "General emergency (police/ambulance/fire): 999, or 112 from a mobile with no SIM/credit. Nearest major A&E: Hospital Putrajaya, Presint 7, 62250 Putrajaya (~12-15 min from the circuit), tel 03-8312 4200." },
    { label: "Tourism Infoline", value: "Tourism Malaysia Infoline (info, not emergency dispatch): 1-300-88-5050" },
  ],
  "atp-finals": [
    { label: "Session times", value: "Group stage (15-20 Nov): day session 11:30am, evening session 6pm. Semifinals (21 Nov): 12pm and evening. Final (22 Nov): single session, 3pm. Gate-opening times ahead of each session aren't published by the tournament yet — confirm closer to the event." },
    { label: "Emergencies", value: "Single European emergency number: 112 (free, no prefix needed, English-speaking operators available in major cities). Health-specific: 118. Nearest hospital to the arena's Santa Rita area: Ospedale Mauriziano Umberto I." },
    { label: "Tourism Infoline", value: "Turismo Torino e Provincia contact centre: +39 011 535181, info.torino@turismotorino.org." },
  ],
  "shanghai-masters": [
    { label: "Emergencies", value: "Police: 110. Fire: 119. Medical/ambulance: 120. All free, but English-speaking operators aren't guaranteed even in Shanghai — having your hotel call on your behalf, or using Alipay's SOS function, is more reliable than dialing directly." },
    { label: "Gate times", value: "Not yet published for the 2026 tournament — confirm closer to the event via the official ticketing site." },
  ],
};

const INTRO_BY_EVENT: Record<string, { displayName: string; venueLine: string; heroFallbackImageSlug: string; introText: string }> = {
  "bahrain-grand-prix": {
    displayName: "Bahrain Grand Prix in Malaysia",
    venueLine: "Held at Sepang International Circuit, Malaysia — same \"Bahrain Grand Prix\" name on the calendar, a different country hosting it this year.",
    heroFallbackImageSlug: "sepang-circuit-history-f1-return",
    // "The Brief" — the classic pack's editorial pack-opener, folded into
    // the hub's intro text 1 Aug 2026 (see hub-and-spoke-event-pack skill
    // discussion). Built from real source content already in the DB
    // (sepang-circuit-history-f1-return and malaysia-f1-fans-nostalgia-2026-
    // return experiences' whyItsSpecial fields), not invented.
    introText:
      "F1 hasn't raced in Malaysia since 2017. A regional conflict left a gap in the 2026 calendar, and Sepang — a circuit that once set the template for modern F1 venues — was ready to fill it. Nobody engineered a homecoming here, which is rare in a sport that almost never gives its dropped venues a second chance.\n\nNearly 191,000 fans turned out for a single Sepang MotoGP weekend in 2025 — proof demand here never left, it just had no F1 race to attach to for nine years. You're watching a generation of Malaysian fans meet a real piece of their own sporting history, in person, for the first time.\n\nEverything you need to plan the trip: costs, tickets, where to stay, where to eat, and the detail that only matters once you're actually going.",
  },
  "singapore-grand-prix": {
    displayName: "Singapore Grand Prix",
    venueLine: "Held at the Marina Bay Street Circuit — F1's original night race, run under floodlights through the streets of downtown Singapore.",
    heroFallbackImageSlug: "singapore-gp-turn1-grandstand",
    // Built from real sourced facts already researched during experience
    // seeding (F1's official heat-hazard designation, the concert lineup,
    // the night-race format) — not invented, matches the Bahrain GP
    // pattern of drawing The Brief from real underlying content.
    introText:
      "Singapore is F1's only true night race, run entirely under floodlights through the streets of Marina Bay, and it's officially been classified F1's first-ever \"heat hazard\" event — the humidity here is a real, documented part of the challenge, not just race-weekend colour.\n\nIt's also the one Grand Prix built as much around the music as the racing. Ten stages run across the circuit park all weekend, headlined this year by Lana Del Rey's first-ever Singapore show, The Killers, and JJ Lin, so a full race day genuinely runs from afternoon sessions through to a late-night set under the same lights.\n\nEverything you need to plan the trip: costs, tickets, where to stay, where to eat, and the detail that only matters once you're actually going.",
  },
  "atp-finals": {
    displayName: "Nitto ATP Finals",
    venueLine: "Held at Inalpi Arena — an Olympic ice hockey venue turned season-finale tennis arena in Turin, Italy.",
    heroFallbackImageSlug: "__no-image-yet__",
    // Built from real sourced facts researched during experience seeding
    // (round-robin format, the venue's Olympic/Games history, the Fan
    // Village's genuine free access) — not invented, matches the
    // Bahrain GP / Singapore GP pattern of drawing The Brief from real
    // underlying content.
    introText:
      "This is the only tournament all season where the eight best players in the world are guaranteed to show up — no qualifying rounds, no early upsets taking a name off the draw. Round-robin means every group-stage session gets a real match between top-8 players, not a filler contest, right through to the semifinals and final.\n\nInalpi Arena wasn't built for tennis — it went up in 2005 as the ice hockey venue for Turin's 2006 Winter Olympics, and the scale still shows. You're watching the season finale inside the largest indoor arena in Italy, a building that's since hosted Eurovision and stadium tours from Madonna and Harry Styles, not a boutique tennis venue.\n\nEverything you need to plan the trip: costs, tickets, where to stay, where to eat, and the detail that only matters once you're actually going.",
  },
  "shanghai-masters": {
    displayName: "Shanghai Masters",
    venueLine: "Held at Qizhong Forest Sports City Arena — the only ATP Masters 1000 not played in Europe or North America.",
    heroFallbackImageSlug: "qizhong-forest-sports-city-arena-",
    // Built from real sourced facts researched during experience seeding
    // (attendance figures, the magnolia-roof design, Federer's Shanghai
    // record) — not invented, matches the Bahrain GP/Singapore GP/ATP
    // Finals pattern of drawing The Brief from real underlying content.
    introText:
      "Shanghai draws more spectators than any other Masters 1000 on the calendar — over 220,000 across a single tournament, with more than 70% of that crowd travelling in from outside the city itself. This isn't a regional stop with a big venue; it's a genuine national event, and the atmosphere reflects it.\n\nQizhong Arena's eight-petal retractable roof, styled after Shanghai's magnolia city flower, opens and closes in a spiral over about eight minutes — the same building that hosted the year-end ATP Finals from 2005 to 2008 before Shanghai earned its own Masters 1000 in 2009. Roger Federer returns again this year for a celebrity exhibition on 16 October, extending a Shanghai record that includes two titles and a 77% win rate at this exact venue.\n\nEverything you need to plan the trip: costs, tickets, where to stay, where to eat, and the detail that only matters once you're actually going.",
  },
};

export default async function HubPage({ slug }: { slug: string }) {
  const { event, dateRange, linkedExperiences } = await getSpokeData(slug);
  const spokes = getSpokesForEvent(slug);
  const config = INTRO_BY_EVENT[slug];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { hasPurchased, justPurchased } = await getPurchaseStatus(slug, event.id, event.isHidden);
  const pricing = getPackPricing(slug, event.packCurrency);
  const initiallySaved = user ? await isEventPackSaved(event.id) : false;
  const myRating = user ? await getMyEventPackRating(event.id) : null;

  const hubHeroUrl = event.heroImageUrl ?? (config ? getSpokeImage(linkedExperiences, config.heroFallbackImageSlug) : null);

  // Quick reference rows — address and official ticketing link are built
  // from the real sportingEvents record (not hardcoded), prepended to any
  // event-specific rows (emergencies, etc.) from QUICK_REFERENCE_BY_EVENT.
  const quickReference: Array<{ label: string; value: string; href?: string; linkLabel?: string }> = [];
  if (event.venueName && event.venueAddress) {
    quickReference.push({
      label: "Address",
      value: `${event.venueName}, ${event.venueAddress}`,
      href: `https://maps.google.com/?q=${encodeURIComponent(`${event.venueName}, ${event.venueAddress}`)}`,
      linkLabel: "Open in Maps",
    });
  }
  if (event.ticketingUrl) {
    quickReference.push({ label: "Official ticketing", value: new URL(event.ticketingUrl).hostname.replace("www.", ""), href: event.ticketingUrl, linkLabel: "Visit" });
  }
  quickReference.push(...(QUICK_REFERENCE_BY_EVENT[slug] ?? []));

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />

      {/* Hero — same structure, sizes, and gradient as the classic pack's
          masthead (app/event-pack/[slug]/page.tsx) so a visitor moving
          between a classic pack and a hub-and-spoke pack sees continuous
          site chrome, not two different products. */}
      <div className="relative h-[38vh] min-h-[220px] overflow-hidden bg-[#0A0A0A]">
        {hubHeroUrl && (
          <Image
            src={hubHeroUrl}
            alt={config?.displayName ?? event.name}
            fill
            className={`object-cover opacity-90 ${slug === "shanghai-masters" ? "lg:object-[center_65%]" : ""}`}
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 max-w-5xl mx-auto">
          <span className="inline-block text-xs font-black tracking-widest uppercase text-black bg-[#AAFF00] px-3 py-1 rounded-sm mb-3">
            {SPORT_LABELS[event.sport] ?? event.sport} · Event Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight max-w-2xl">
            {config?.displayName ?? event.name}
          </h1>
          <p className="mt-1.5 text-white/70 text-sm">{dateRange}</p>
          <p className="mt-0.5 text-white/50 text-xs">
            {event.venueName}
            {event.venueAddress ? ` · ${event.venueAddress.split(",").slice(2).join(",").trim()}` : ""}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
        {/* One-time celebratory banner — justPurchased is derived
            server-side from the real purchases.createdAt timestamp (see
            getPurchaseStatus), never from a client-controlled query param.
            A ?purchased=1-style flag would be trivially fakeable by hand-
            editing the URL; this can't be, since it's checked against our
            own DB write. */}
        {justPurchased && (
          <div className="mb-8 rounded-sm border border-[#AAFF00]/40 bg-[#AAFF00]/10 px-5 py-4 max-w-2xl">
            <p className="text-sm font-black text-[#AAFF00]">🎉 You&apos;re in — {config?.displayName ?? event.name} is unlocked</p>
            <p className="text-xs text-[#A3A3A3] mt-1">Every spoke below now shows our full curated picks and booking detail.</p>
          </div>
        )}

        {/* Favourite/Share row — per beta feedback 4 Aug 2026. Favouriting
            requires sign-in (same as saving an experience); a signed-out
            visitor sees only Share, not a toggle they can't use. */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {user && <FavouriteToggle sportingEventId={event.id} slug={slug} initiallySaved={initiallySaved} />}
          <ShareGuideButton slug={slug} eventName={event.name} />
          {user && <RateGuideButton sportingEventId={event.id} slug={slug} initialRating={myRating} />}
        </div>

        {/* Intro + purchase CTA — same 2-column layout as the classic pack
            (page.tsx ~line 622: lg:grid lg:grid-cols-3 lg:gap-12, text in
            lg:col-span-2, pricing aside sticky in the 3rd column). Fixed
            1 Aug 2026 — this previously stacked the CTA below Quick
            Reference/Pre-trip brief instead of docking it beside the
            intro, pushing it far down the page compared to every classic
            pack event. */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            {config?.venueLine && (
              <p className="text-sm text-[#A3A3A3] leading-7 mb-3 max-w-2xl">{config.venueLine}</p>
            )}
            {config?.introText && (
              <div className="max-w-2xl">
                {config.introText.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm text-[#A3A3A3] leading-7 mb-3 last:mb-0">{para}</p>
                ))}
              </div>
            )}
          </div>

          {/* Purchase CTA — real Dodo checkout, gated by the same
              server-verified hasPurchased check every spoke uses (see
              getPurchaseStatus in _lib/getSpokeData.ts). Not shown once
              purchased — the spoke tiles below already read "Unlocked"
              content for a returning buyer, so a second buy prompt here
              would be redundant. Free-event branch mirrors the classic
              pack's exact markup (page.tsx ~line 731) — an anonymous
              visitor still needs to sign in to actually get free access
              (grantFreeAccess only runs for a logged-in user), so this is
              a real "Sign in for free access" CTA, not a no-button dead
              end. Label style matches Quick Reference/Pre-trip brief
              (font-semibold, not font-black) for visual consistency. */}
          {!hasPurchased && pricing && (
            <aside className="mt-8 lg:mt-0">
              <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 lg:sticky lg:top-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">Unlock the full guide</p>
                <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
                  While most information for this event is free to read, buying the Event Pack unlocks our curated
                  picks, tactical booking detail, and the full day-by-day itinerary across all of them.
                </p>
                {pricing.freeAccessEnabled ? (
                  <>
                    <p className="text-2xl font-black text-white mb-1">Free</p>
                    <p className="text-xs text-[#6A6A6A] mb-4">Free access, no card needed</p>
                    <Link
                      href={`/sign-in?next=/event-pack/${slug}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                    >
                      Sign in for free access
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-black text-white">
                      {pricing.priceDisplay}
                      <LocalCurrencyHint baseAmount={parseFloat(pricing.priceDisplay.replace(/[^0-9.]/g, ""))} baseCurrency={pricing.currency} />
                    </p>
                    {pricing.isEarlyBird && pricing.earlyBirdDisplay !== pricing.standardDisplay && (
                      <p className="mt-0.5 text-xs text-[#6A6A6A] mb-4">
                        Rises to {pricing.standardDisplay} after{" "}
                        {new Date(pricing.earlyBirdCutoff).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                      </p>
                    )}
                    {pricing.dodoProductId ? (
                      <DodoCheckout
                        productId={pricing.dodoProductId}
                        sportingEventId={event.id}
                        eventSlug={slug}
                        eventName={config?.displayName ?? event.name}
                        priceTier={pricing.isEarlyBird ? "early_bird" : "standard"}
                        successUrl={user?.email
                          ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}`
                          : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${slug}/welcome`}
                        buttonClassName="w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                      />
                    ) : (
                      <p className="text-xs text-[#6A6A6A]">Checkout coming soon.</p>
                    )}
                  </>
                )}
              </div>
            </aside>
          )}
        </div>

        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mt-10 mb-4">Plan your trip</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {spokes.map((spoke) => {
            const imageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
            return (
              <Link
                key={spoke.id}
                href={`/event-pack/${slug}/${spoke.id}`}
                className={`group relative rounded-sm overflow-hidden border transition-colors min-h-[180px] flex flex-col justify-end ${
                  hasPurchased ? "border-[#AAFF00]/60 hover:border-[#AAFF00]" : "border-[#2A2A2A] hover:border-[#AAFF00]"
                }`}
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

                {/* Unlocked state applies uniformly to every tile once
                    hasPurchased is true, regardless of each spoke's own
                    status (public/teaser/gated) — the whole grid should
                    visibly read as transformed post-purchase, not just
                    individual spoke pages. Solid fill (not just an outline)
                    is the deliberate visual difference from the free-state
                    badges below. */}
                {hasPurchased ? (
                  <span className="absolute top-3 right-3 text-[9px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 bg-[#AAFF00] text-black">
                    ✓ Unlocked
                  </span>
                ) : (
                  <span
                    className={`absolute top-3 right-3 text-[9px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm ${
                      spoke.status === "teaser"
                        ? "text-[#AAFF00] border-[#AAFF00]/50 bg-black/30"
                        : "text-white/70 border-white/20 bg-black/30"
                    }`}
                  >
                    {STATUS_LABEL[spoke.status]}
                  </span>
                )}

                <div className="relative p-5">
                  <p className="text-base font-black text-white group-hover:text-[#AAFF00] transition-colors leading-tight">
                    {spoke.label}
                  </p>
                  <p className="text-xs text-white/60 mt-1.5 leading-5">&quot;{spoke.question}&quot;</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick reference — compact fact strip. Address/ticketing link are
            real event-record data; other rows are real, sourced facts (see
            QUICK_REFERENCE_BY_EVENT above) — never invented. Moved below
            the spoke tile grid per user feedback, 1 Aug 2026 — was
            crowding the main intro/CTA area near the top, same reasoning
            as the Pre-trip brief move. */}
        {quickReference.length > 0 && (
          <div className="mt-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">Quick reference</p>
            <div className="rounded-sm border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
              {quickReference.map((row) => (
                <div key={row.label} className="flex gap-4 px-4 py-3 sm:items-start">
                  <dt className="w-[30%] sm:w-32 flex-shrink-0 text-xs font-semibold text-[#6A6A6A] pt-0.5">{row.label}</dt>
                  <dd className="text-sm text-[#A3A3A3] leading-6 flex-1 break-words min-w-0">
                    {row.value}
                    {row.href && (
                      <a href={row.href} target="_blank" rel="noopener noreferrer" className="ml-2 text-xs text-[#AAFF00] underline hover:text-[#BBFF33] transition-colors">
                        {row.linkLabel} ↗
                      </a>
                    )}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pre-trip brief — same underlying system as the classic pack
            (sportingEvents.preTripBriefLines/LiveAt/UpdatedAt, curator
            approval-token flow, cron activation ~7 days before the event).
            No new mechanism added here, 1 Aug 2026 — just rendered as a
            strip on the hub. Moved below the spoke tile grid per user
            feedback (was crowding the main intro/CTA/Quick Reference
            elements near the top). Body-text sizing (text-sm/leading-6)
            matches Quick Reference exactly — was text-[15px]/leading-8,
            a real mismatch. Dormant/live dual state (grey vs amber)
            still matches PackView.tsx's classic-pack markup. */}
        {event.preTripBriefLines && event.preTripBriefLines.length > 0 && (
          <div className={`mt-10 rounded-sm border p-5 ${event.preTripBriefLiveAt ? "border-amber-400/30 bg-amber-400/5" : "border-[#2A2A2A] bg-[#141414]"}`}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-semibold tracking-widest uppercase ${event.preTripBriefLiveAt ? "text-amber-400" : "text-[#AAFF00]"}`}>
                Pre-trip brief
              </p>
              {event.preTripBriefUpdatedAt && (
                <p className={`text-xs ${event.preTripBriefLiveAt ? "text-amber-400/60" : "text-[#6A6A6A]"}`}>
                  Updated {new Date(event.preTripBriefUpdatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
            <ul className="space-y-2">
              {event.preTripBriefLines.map((line, i) => (
                <li key={i} className={`flex gap-2.5 text-sm leading-6 ${event.preTripBriefLiveAt ? "text-amber-200" : "text-[#A3A3A3]"}`}>
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${event.preTripBriefLiveAt ? "bg-amber-400" : "bg-[#6A6A6A]"}`} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
