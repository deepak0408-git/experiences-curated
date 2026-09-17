"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DodoPayments } = require("dodopayments-checkout");

interface DodoCheckoutProps {
  productId: string;
  sportingEventId: string;
  eventSlug: string;
  eventName: string;
  priceTier: "early_bird" | "standard";
  successUrl: string;
  buttonClassName?: string;
  label?: string;
  // Mini-packs pilot — omitted for the full pack, so the checkout route's
  // existing full-pack behavior (and the webhook's "full_pack" default)
  // still apply for every purchase that predates this prop.
  productType?: "tickets_guide" | "hotels_guide" | "itinerary_guide";
  // Routes to /event-pack/[eventSlug]/checkout (Dodo "inline" display mode,
  // an iframe embedded directly in our own DOM) instead of calling the
  // overlay SDK's Checkout.open() in this component. Overlay mode behaves
  // enough like a popup that Instagram/Facebook's in-app browser silently
  // blocks it — the SDK still reports checkout.opened, so our telemetry
  // looks healthy, but the iframe never becomes visible. Confirmed live 18
  // Sep 2026 on Bahrain GP's mini-guides, opened from an Instagram/Facebook
  // in-app browser. Inline mode never behaves like a popup, so it isn't
  // subject to that block. Default false — every caller that hasn't opted
  // in keeps today's overlay behavior unchanged.
  useInlineCheckout?: boolean;
  // Product name + display price shown on the inline checkout page's own
  // order summary. Overlay mode renders this itself inside the Dodo iframe;
  // inline mode doesn't, so without these the user sees a payment form with
  // no visible price at all before entering their details. Only used when
  // useInlineCheckout is true. priceCurrency (default USD, matching every
  // event's packCurrency) drives the same LocalCurrencyHint conversion shown
  // next to the price everywhere else on the pack page — dropping it here
  // would silently regress that for non-USD visitors at checkout, the exact
  // moment it matters most.
  productLabel?: string;
  priceDisplay?: string;
  priceCurrency?: string;
}

// The Dodo SDK is a true global singleton (one `window.DodoCheckoutWebSDK`,
// one CheckoutState) — it supports exactly one Initialize()/onEvent per page,
// not one per button. A hub-and-spoke pack page can render several
// DodoCheckout instances at once (full pack + up to 3 mini-pack guides), so
// Initialize() and its onEvent handler are set up once here, globally, and
// every button instance registers/deregisters itself as the "active" click
// via activeCheckoutRef instead of relying on its own closure — otherwise
// whichever button mounted first "wins" the onEvent closure permanently, and
// every other button's overlay silently never opens (caught live 16 Sep 2026
// via PostHog replay: user clicked every mini-pack CTA on Bahrain GP and none
// of them opened the Dodo overlay).
let dodoInitialised = false;
const activeCheckoutRef: {
  current: {
    successUrl: string;
    eventSlug: string;
    eventName: string;
    priceTier: "early_bird" | "standard";
    setLoading: (loading: boolean) => void;
  } | null;
} = { current: null };

function ensureDodoInitialised() {
  if (dodoInitialised) return;
  DodoPayments.Initialize({
    mode: (process.env.NEXT_PUBLIC_DODO_MODE === "test_mode" ? "test" : "live") as "test" | "live",
    displayType: "overlay",
    onEvent: (event: { event_type: string; data?: { message?: string } }) => {
      const active = activeCheckoutRef.current;
      if (event.event_type === "checkout.opened") {
        active?.setLoading(false);
        if (active) {
          import("@/lib/posthog-events").then(({ phEvent }) =>
            phEvent.checkoutOpened({ eventSlug: active.eventSlug, eventName: active.eventName, priceTier: active.priceTier })
          );
        }
      }
      if (event.event_type === "checkout.error") {
        active?.setLoading(false);
        console.error("[dodo checkout]", event.data?.message);
      }
      if (event.event_type === "checkout.closed") {
        // User closed the overlay (X, Esc, click-outside) without
        // completing or erroring — no other event fires in this case, so
        // without this the button hangs on "Opening…" forever (caught live
        // 16 Sep 2026: mini-pack CTA stuck after closing the Dodo overlay).
        active?.setLoading(false);
      }
      if (event.event_type === "checkout.redirect") {
        if (active) {
          import("@/lib/posthog-events").then(({ phEvent }) =>
            phEvent.checkoutRedirected({ eventSlug: active.eventSlug, priceTier: active.priceTier })
          );
          const { successUrl } = active;
          setTimeout(() => { window.location.href = successUrl; }, 2500);
        }
      }
    },
  });
  dodoInitialised = true;
}

export default function DodoCheckout({
  productId,
  sportingEventId,
  eventSlug,
  eventName,
  priceTier,
  successUrl,
  buttonClassName,
  label = "Get the Pack",
  productType,
  useInlineCheckout = false,
  productLabel,
  priceDisplay,
  priceCurrency,
}: DodoCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const setLoadingRef = useRef(setLoading);
  setLoadingRef.current = setLoading;
  const router = useRouter();

  useEffect(() => {
    if (!useInlineCheckout) ensureDodoInitialised();
  }, [useInlineCheckout]);

  const handleInlineClick = () => {
    setLoading(true);
    import("@/lib/posthog-events").then(({ phEvent }) =>
      phEvent.packCtaClicked({ eventSlug, eventName, priceTier, label })
    );
    const params = new URLSearchParams({ productId, priceTier, successUrl, eventName });
    if (productType) params.set("productType", productType);
    if (productLabel) params.set("productLabel", productLabel);
    if (priceDisplay) params.set("priceDisplay", priceDisplay);
    if (priceCurrency) params.set("priceCurrency", priceCurrency);
    router.push(`/event-pack/${eventSlug}/checkout?${params.toString()}`);
  };

  const handleClick = async () => {
    setLoading(true);
    // Claim the shared onEvent handler for this button's context before
    // opening the overlay — must happen synchronously with the click, not
    // after the fetch, so a second button clicked while this one is still
    // loading can't steal it back before Checkout.open() actually runs.
    activeCheckoutRef.current = {
      successUrl,
      eventSlug,
      eventName,
      priceTier,
      setLoading: (v) => setLoadingRef.current(v),
    };
    import("@/lib/posthog-events").then(({ phEvent }) =>
      phEvent.packCtaClicked({ eventSlug, eventName, priceTier, label })
    );
    try {
      const res = await fetch("/api/checkout/dodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, sportingEventId, priceTier, productType, successUrl }),
      });
      const { checkout_url, error } = await res.json();
      if (error || !checkout_url) {
        console.error("[dodo checkout] failed to get checkout URL:", error);
        setLoading(false);
        return;
      }
      // Re-claim immediately before opening, in case another button's click
      // resolved its own fetch in between and overwrote the ref.
      activeCheckoutRef.current = {
        successUrl,
        eventSlug,
        eventName,
        priceTier,
        setLoading: (v) => setLoadingRef.current(v),
      };
      // The SDK is a true singleton with internal iframe/container state that
      // only clears on a clean checkout.closed postMessage from its own
      // iframe. A client-side route change between spoke pages (no full
      // reload) can leave that internal state stale from a previous click,
      // and open() silently no-ops with just a console.warn("Checkout is
      // already open") in that case — no error event fires, so our loading
      // state still resets and the button looks normal, but no overlay ever
      // appears. Forcing a close() first guarantees a clean slate.
      if (DodoPayments.Checkout.isOpen()) {
        DodoPayments.Checkout.close();
      }
      DodoPayments.Checkout.open({ checkoutUrl: checkout_url });
    } catch (err) {
      console.error("[dodo checkout] unexpected error:", err);
      setLoading(false);
    }
  };

  const defaultClass =
    "w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-60";

  return (
    <button
      onClick={useInlineCheckout ? handleInlineClick : handleClick}
      disabled={loading}
      className={buttonClassName ?? defaultClass}
    >
      {loading ? "Opening…" : label}
    </button>
  );
}
