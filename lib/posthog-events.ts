import posthog from "posthog-js";

export const phEvent = {
  // Auth
  signInStarted: (props: { next?: string }) =>
    posthog.capture("sign_in_started", props),

  signInCompleted: (email: string, props?: { next?: string }) => {
    posthog.identify(email, { email });
    posthog.capture("sign_in_completed", { email, ...props });
  },

  // Pack funnel
  packCtaClicked: (props: { eventSlug: string; eventName: string; priceTier: string; label: string; sport?: string }) =>
    posthog.capture("pack_cta_clicked", props),

  checkoutOpened: (props: { eventSlug: string; eventName?: string; priceTier: string; sport?: string }) =>
    posthog.capture("checkout_opened", props),

  checkoutRedirected: (props: { eventSlug: string; priceTier: string; sport?: string }) =>
    posthog.capture("checkout_redirected", props),

  purchaseCompleted: (props: { eventSlug: string; sport?: string }) =>
    posthog.capture("purchase_completed", props),

  // Pack access
  packAccessed: (props: { eventSlug: string; eventName: string; via: "purchase" | "free" | "annual_pro"; sport?: string }) =>
    posthog.capture("pack_accessed", props),

  // Experience
  experienceViewed: (props: { experienceSlug: string; experienceTitle: string; eventSlug?: string; eventName?: string; sport?: string }) =>
    posthog.capture("experience_viewed", props),

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
};
