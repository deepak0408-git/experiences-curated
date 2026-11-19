import posthog from "posthog-js";

export const phEvent = {
  // Auth
  signInStarted: (props: { next?: string }) =>
    posthog.capture("sign_in_started", props),

  signInCompleted: (email: string, props?: { next?: string }) => {
    posthog.identify(email, { email });
    posthog.capture("sign_in_completed", { email, ...props });
  },

  // Pack funnel. productType added 19 Nov 2026 (Issue 3 investigation) —
  // these 3 events are shared by every DodoCheckout caller (full pack,
  // mini-packs, AND Ticket Intelligence), but never carried a field
  // distinguishing which product the click/open/redirect was actually
  // for — every TI checkout event was indistinguishable from a full-pack
  // one in PostHog. Optional (not required) so every pre-existing
  // full-pack call site (which never set this) keeps working unchanged —
  // it was always implicitly "full_pack" and still is.
  packCtaClicked: (props: { eventSlug: string; eventName: string; priceTier: string; label: string; sport?: string; productType?: string }) =>
    posthog.capture("pack_cta_clicked", props),

  checkoutOpened: (props: { eventSlug: string; eventName?: string; priceTier: string; sport?: string; productType?: string }) =>
    posthog.capture("checkout_opened", props),

  checkoutRedirected: (props: { eventSlug: string; priceTier: string; sport?: string; productType?: string }) =>
    posthog.capture("checkout_redirected", props),

  purchaseCompleted: (props: { eventSlug: string; sport?: string }) =>
    posthog.capture("purchase_completed", props),

  // Pack access
  packAccessed: (props: { eventSlug: string; eventName: string; via: "purchase" | "free" | "annual_pro"; sport?: string }) =>
    posthog.capture("pack_accessed", props),

  // Experience
  experienceViewed: (props: { experienceSlug: string; experienceTitle: string; eventSlug?: string; eventName?: string; sport?: string }) =>
    posthog.capture("experience_viewed", props),

  // Shared "next step" sidebar click event — covers every one of the 8
  // hand-rolled sidebar components across the site (Experience, Destination,
  // Blog article, Hub-and-Spoke spoke pages + Price Radar, Ticket
  // Intelligence F1 + tennis, Trip Intelligence results F1 + tennis). All 8
  // follow the same "4-action model" (explicitly documented as copies of
  // each other in their own code comments) but none fired a single click
  // event — Issue 2 investigation, 18 Nov 2026. One shared event name,
  // filterable by `page`/`cta` in PostHog, rather than 8 near-identical
  // per-surface events. `slug` is whichever slug identifies the page the
  // sidebar renders on (experience/destination/event/article slug) — not
  // necessarily the link's destination. sport/eventSlug/eventName ride
  // along as super-properties already registered by the page-level tracker
  // components (ExperienceTracker, etc.) where present — not re-passed here.
  sidebarCtaClicked: (props: {
    page: "experience" | "destination" | "blog" | "spoke" | "price_radar" | "ticket_intelligence" | "ticket_intelligence_tennis" | "trip_intelligence_f1" | "trip_intelligence_tennis";
    cta: string;
    slug: string;
  }) => posthog.capture("sidebar_cta_clicked", props),

  // F1 Travel Planning Cockpit — $pageview already fires from PostHogProvider
  // on every route including /formula-1, so these cover outbound engagement
  // only, not page visits themselves.
  cockpitHomepageCtaClicked: () => posthog.capture("cockpit_homepage_cta_clicked"),
  cockpitCardClicked: (props: { card: "exploring" | "budget" | "chosen_gp" | "planning" }) =>
    posthog.capture("cockpit_card_clicked", props),
  cockpitModalOpened: (props: { modal: "gp_selector" | "trip_planning"; source: "card" | "calendar" }) =>
    posthog.capture("cockpit_modal_opened", props),
  cockpitGpSelected: (props: { eventSlug: string }) => posthog.capture("cockpit_gp_selected", props),
  cockpitCalendarCardClicked: (props: { eventSlug: string }) =>
    posthog.capture("cockpit_calendar_card_clicked", props),
  cockpitDeeperTileClicked: (props: { tile: "articles" | "experiences" | "destinations" }) =>
    posthog.capture("cockpit_deeper_tile_clicked", props),

  // Tennis Travel Planning Cockpit — separate namespace from the F1
  // cockpit* events above (same pattern as the two sports' already-separate
  // Trip Intelligence/Ticket Intelligence implementations), so each
  // Cockpit's engagement can be analyzed independently.
  tennisCockpitHomepageCtaClicked: () => posthog.capture("tennis_cockpit_homepage_cta_clicked"),
  tennisCockpitCardClicked: (props: { card: "exploring" | "budget" | "chosen_event" | "planning" }) =>
    posthog.capture("tennis_cockpit_card_clicked", props),
  tennisCockpitModalOpened: (props: { modal: "event_selector" | "trip_planning"; source: "card" | "calendar" }) =>
    posthog.capture("tennis_cockpit_modal_opened", props),
  tennisCockpitEventSelected: (props: { eventSlug: string }) =>
    posthog.capture("tennis_cockpit_event_selected", props),
  tennisCockpitCalendarCardClicked: (props: { eventSlug: string }) =>
    posthog.capture("tennis_cockpit_calendar_card_clicked", props),
  tennisCockpitDeeperTileClicked: (props: { tile: "articles" | "experiences" | "destinations" }) =>
    posthog.capture("tennis_cockpit_deeper_tile_clicked", props),

  // Ticket Intelligence funnel (F1 + tennis) — Issue 3 investigation, 19
  // Nov 2026: the entire quiz → teaser → payment → result journey fired
  // zero dedicated events, only the generic $pageview (itself fragmented
  // by the quiz's self-rewriting URL — see ticketIntelligenceQuizStarted's
  // comment). The shared checkout component's checkoutOpened/
  // checkoutRedirected/packCtaClicked events also exist already, but never
  // carried a productType, so a TI checkout click was indistinguishable
  // from an Event Guide checkout click in PostHog — fixed by passing
  // productType through from here on (see DodoCheckout.tsx). `sport`
  // distinguishes the F1/tennis funnels without needing two separate event
  // namespaces, since every event below is genuinely the same shape across
  // both — unlike Cockpit, which has real per-sport UI differences.
  ticketIntelligenceQuizStarted: (props: { eventSlug: string; sport: "formula_one" | "tennis" }) =>
    posthog.capture("ticket_intelligence_quiz_started", props),

  // Fired once per question on first answer (not on every change) — see
  // call site for the "first answer only" guard. questionKey is the
  // question's own key (e.g. "q1", "q1_trip_purpose") so progression can
  // be read as a real funnel step, not just a count.
  ticketIntelligenceQuestionAnswered: (props: {
    eventSlug: string;
    sport: "formula_one" | "tennis";
    questionKey: string;
    questionNumber: number;
  }) => posthog.capture("ticket_intelligence_question_answered", props),

  ticketIntelligenceQuizCompleted: (props: { eventSlug: string; sport: "formula_one" | "tennis" }) =>
    posthog.capture("ticket_intelligence_quiz_completed", props),

  // No dedicated "unlock clicked" event — the unlock button is a
  // DodoCheckout instance, which already fires packCtaClicked with
  // productType: "ticket_intelligence" (fixed the same day, see that
  // event's comment above). A second, TI-specific event here would just
  // duplicate that under a different name.
  ticketIntelligenceTeaserViewed: (props: { eventSlug: string; sport: "formula_one" | "tennis" }) =>
    posthog.capture("ticket_intelligence_teaser_viewed", props),
};
