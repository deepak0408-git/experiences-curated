"use client";

import { useState, useEffect } from "react";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DodoPayments } = require("dodopayments-checkout");

interface CustomItineraryCheckoutProps {
  successUrl: string;
  buttonClassName?: string;
  label?: string;
}

let dodoInitialised = false;

export default function CustomItineraryCheckout({
  successUrl,
  buttonClassName,
  label = "Pay & start your itinerary",
}: CustomItineraryCheckoutProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dodoInitialised) return;
    DodoPayments.Initialize({
      mode: (process.env.NEXT_PUBLIC_DODO_MODE === "test_mode" ? "test" : "live") as "test" | "live",
      displayType: "overlay",
      onEvent: (event: { event_type: string; data?: { message?: string } }) => {
        if (event.event_type === "checkout.opened") {
          setLoading(false);
        }
        if (event.event_type === "checkout.error") {
          setLoading(false);
          console.error("[dodo checkout]", event.data?.message);
        }
        if (event.event_type === "checkout.redirect") {
          setTimeout(() => { window.location.href = successUrl; }, 2500);
        }
      },
    });
    dodoInitialised = true;
  }, [successUrl]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/custom-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ successUrl }),
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

  return (
    <button onClick={handleClick} disabled={loading} className={buttonClassName}>
      {loading ? "Opening…" : label}
    </button>
  );
}
