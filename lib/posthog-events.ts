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
  packCtaClicked: (props: { eventSlug: string; eventName: string; priceTier: string; label: string }) =>
    posthog.capture("pack_cta_clicked", props),

  checkoutOpened: (props: { eventSlug: string; eventName?: string; priceTier: string }) =>
    posthog.capture("checkout_opened", props),

  checkoutRedirected: (props: { eventSlug: string; priceTier: string }) =>
    posthog.capture("checkout_redirected", props),

  purchaseCompleted: (props: { eventSlug: string }) =>
    posthog.capture("purchase_completed", props),

  // Pack access
  packAccessed: (props: { eventSlug: string; eventName: string; via: "purchase" | "free" | "annual_pro" }) =>
    posthog.capture("pack_accessed", props),

  // Experience
  experienceViewed: (props: { experienceSlug: string; experienceTitle: string; eventSlug?: string; eventName?: string }) =>
    posthog.capture("experience_viewed", props),
};
