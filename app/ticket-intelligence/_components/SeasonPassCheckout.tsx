"use client";

import { useState, useRef } from "react";
import { registerNonPackCheckout } from "@/app/event-pack/[slug]/_components/DodoCheckout";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DodoPayments } = require("dodopayments-checkout");

// Ticket Intelligence Season Pass checkout button. Own checkout route
// (/api/checkout/dodo-season-pass, no sportingEventId — this product has
// none), but deliberately does NOT run its own DodoPayments.Initialize()
// call. The Dodo SDK is a true page-level singleton — a second
// Initialize() call from this component clobbers DodoCheckout.tsx's
// onEvent handler at the SDK level, freezing the primary event checkout
// button whenever both render on the same page (TeaserResult.tsx: the
// main "Unlock your full match" DodoCheckout + this component's upsell,
// side by side). Bug found live 28 Sep 2026. Routes through
// DodoCheckout.tsx's registerNonPackCheckout() instead, so there is
// exactly one Initialize() call for the whole page no matter how many
// checkout buttons of either kind it renders.
//
// Used in two places: the main checkout box on /ticket-intelligence (the
// event picker's sidebar), and the per-event upsell line on the paywall
// teaser (TeaserResult.tsx) — same button, different copy/className passed
// in by the caller.

const LIVE_PRODUCT_ID = "pdt_0NoZDkyBBmaePFV5Hq9Ww";
const TEST_PRODUCT_ID = "pdt_0NoZIdoLaL3GxoWvIsg6D";
const SEASON_PASS_PRODUCT_ID =
  process.env.NEXT_PUBLIC_DODO_MODE === "test_mode" ? TEST_PRODUCT_ID : LIVE_PRODUCT_ID;

export default function SeasonPassCheckout({
  label = "Get the Season Pass",
  buttonClassName,
}: {
  label?: string;
  buttonClassName?: string;
}) {
  const [loading, setLoading] = useState(false);
  const setLoadingRef = useRef(setLoading);
  setLoadingRef.current = setLoading;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const successUrl =
        typeof window !== "undefined" ? `${window.location.origin}/ticket-intelligence` : "";
      // Claim the shared onEvent handler for this button before opening —
      // synchronously with the click, same reasoning as DodoCheckout.tsx's
      // activeCheckoutRef claim.
      registerNonPackCheckout({ successUrl, setLoading: (v) => setLoadingRef.current(v) });
      const res = await fetch("/api/checkout/dodo-season-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: SEASON_PASS_PRODUCT_ID, successUrl }),
      });
      const { checkout_url, error } = await res.json();
      if (error || !checkout_url) {
        console.error("[dodo season pass checkout] failed to get checkout URL:", error);
        setLoading(false);
        return;
      }
      // Re-claim immediately before opening, in case another button's
      // click resolved its own fetch in between.
      registerNonPackCheckout({ successUrl, setLoading: (v) => setLoadingRef.current(v) });
      if (DodoPayments.Checkout.isOpen()) {
        DodoPayments.Checkout.close();
      }
      DodoPayments.Checkout.open({ checkoutUrl: checkout_url });
    } catch (err) {
      console.error("[dodo season pass checkout] unexpected error:", err);
      setLoading(false);
    }
  };

  const defaultClass =
    "w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-60";

  return (
    <button onClick={handleCheckout} disabled={loading} className={buttonClassName ?? defaultClass}>
      {loading ? "Opening…" : label}
    </button>
  );
}
