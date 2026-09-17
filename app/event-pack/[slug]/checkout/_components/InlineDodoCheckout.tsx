"use client";

import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DodoPayments } = require("dodopayments-checkout");

interface InlineDodoCheckoutProps {
  productId: string;
  sportingEventId: string;
  priceTier: "early_bird" | "standard";
  successUrl: string;
  productType?: "tickets_guide" | "hotels_guide" | "itinerary_guide";
  eventSlug: string;
  eventName: string;
}

const ELEMENT_ID = "dodo-inline-checkout";

// "inline" mode embeds the checkout as an iframe directly into our own DOM
// via elementId, on a dedicated page — no popup, no window.open, no
// top-level position:fixed overlay appended to document.body the way
// DodoCheckout.tsx's "overlay" mode does. Instagram/Facebook's in-app
// browser silently blocks that overlay behavior: the SDK still reports
// checkout.opened (so our own telemetry looked healthy) but the iframe
// never becomes visible, leaving a dead "Get the Guide" button with zero
// error trace. Confirmed live 18 Sep 2026 — reproduced only when the pack
// link was opened from Instagram/Facebook's in-app browser, never in a
// regular mobile or desktop browser. This is the real fix, not a
// workaround: it changes the checkout mechanism itself so it never depends
// on popup-like behavior an in-app browser can block.
export default function InlineDodoCheckout({
  productId,
  sportingEventId,
  priceTier,
  successUrl,
  productType,
  eventSlug,
  eventName,
}: InlineDodoCheckoutProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const initialisedRef = useRef(false);

  useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;

    DodoPayments.Initialize({
      mode: (process.env.NEXT_PUBLIC_DODO_MODE === "test_mode" ? "test" : "live") as "test" | "live",
      displayType: "inline",
      onEvent: (event: { event_type: string; data?: { message?: string } }) => {
        if (event.event_type === "checkout.opened") {
          setStatus("ready");
          import("@/lib/posthog-events").then(({ phEvent }) =>
            phEvent.checkoutOpened({ eventSlug, eventName, priceTier })
          );
        }
        if (event.event_type === "checkout.error") {
          setStatus("error");
          console.error("[dodo inline checkout]", event.data?.message);
        }
        if (event.event_type === "checkout.redirect") {
          import("@/lib/posthog-events").then(({ phEvent }) =>
            phEvent.checkoutRedirected({ eventSlug, priceTier })
          );
          setTimeout(() => { window.location.href = successUrl; }, 2500);
        }
      },
    });

    (async () => {
      try {
        const res = await fetch("/api/checkout/dodo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, sportingEventId, priceTier, productType, successUrl }),
        });
        const { checkout_url, error } = await res.json();
        if (error || !checkout_url) {
          console.error("[dodo inline checkout] failed to get checkout URL:", error);
          setStatus("error");
          return;
        }
        // The Dodo SDK is a page-lifetime singleton (window.DodoCheckoutWebSDK),
        // not scoped to this component or this route. A Next.js client-side
        // navigation back to this page (e.g. clicking "Back to Bahrain...",
        // then a different mini-guide CTA) unmounts the previous checkout's
        // DOM node but never sends the SDK a clean checkout.closed handshake
        // — so $.iframe/$.container on the SDK's internal state still point
        // at a now-detached element. open() then silently no-ops with only a
        // console.warn("Checkout is already open"), checkout.opened never
        // fires, and the page is stuck on "Loading checkout..." forever.
        // Forcing a close() first guarantees a clean slate. Caught live 18
        // Sep 2026: second mini-guide checkout stuck loading after going
        // back from the first one without completing payment.
        if (DodoPayments.Checkout.isOpen()) {
          DodoPayments.Checkout.close();
        }
        DodoPayments.Checkout.open({ checkoutUrl: checkout_url, elementId: ELEMENT_ID });
      } catch (err) {
        console.error("[dodo inline checkout] unexpected error:", err);
        setStatus("error");
      }
    })();
  }, [productId, sportingEventId, priceTier, successUrl, productType]);

  return (
    <div>
      {status === "loading" && (
        <p className="text-sm text-[#6A6A6A] text-center py-8">Loading checkout…</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400 text-center py-8">
          Something went wrong loading checkout. Please refresh and try again.
        </p>
      )}
      <div id={ELEMENT_ID} />
    </div>
  );
}
