"use client";

import { useState, useEffect } from "react";
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
}

let dodoInitialised = false;

export default function DodoCheckout({
  productId,
  sportingEventId,
  eventSlug,
  eventName,
  priceTier,
  successUrl,
  buttonClassName,
  label = "Get the Pack",
}: DodoCheckoutProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dodoInitialised) return;
    DodoPayments.Initialize({
      mode: (process.env.NEXT_PUBLIC_DODO_MODE === "test_mode" ? "test" : "live") as "test" | "live",
      displayType: "overlay",
      onEvent: (event: { event_type: string; data?: { message?: string } }) => {
        if (event.event_type === "checkout.opened") {
          setLoading(false);
          import("@/lib/posthog-events").then(({ phEvent }) =>
            phEvent.checkoutOpened({ eventSlug, eventName, priceTier })
          );
        }
        if (event.event_type === "checkout.error") {
          setLoading(false);
          console.error("[dodo checkout]", event.data?.message);
        }
        if (event.event_type === "checkout.redirect") {
          import("@/lib/posthog-events").then(({ phEvent }) =>
            phEvent.checkoutRedirected({ eventSlug, priceTier })
          );
          setTimeout(() => { window.location.href = successUrl; }, 2500);
        }
      },
    });
    dodoInitialised = true;
  }, [successUrl]);

  const handleClick = async () => {
    setLoading(true);
    import("@/lib/posthog-events").then(({ phEvent }) =>
      phEvent.packCtaClicked({ eventSlug, eventName, priceTier, label })
    );
    try {
      const res = await fetch("/api/checkout/dodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, sportingEventId, priceTier, successUrl }),
      });
      const { checkout_url, error } = await res.json();
      if (error || !checkout_url) {
        console.error("[dodo checkout] failed to get checkout URL:", error);
        setLoading(false);
        return;
      }
      await DodoPayments.Checkout.open({ checkoutUrl: checkout_url });
    } catch (err) {
      console.error("[dodo checkout] unexpected error:", err);
      setLoading(false);
    }
  };

  const defaultClass =
    "w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-60";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={buttonClassName ?? defaultClass}
    >
      {loading ? "Opening…" : label}
    </button>
  );
}
