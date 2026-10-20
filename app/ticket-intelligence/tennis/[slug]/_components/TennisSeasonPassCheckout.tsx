"use client";

import { useState, useRef } from "react";
import { registerNonPackCheckout } from "@/app/event-pack/[slug]/_components/DodoCheckout";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DodoPayments } = require("dodopayments-checkout");

// Tennis Ticket Intelligence Season Pass checkout button — same shape as
// app/ticket-intelligence/_components/SeasonPassCheckout.tsx (F1's), its
// own Dodo product (US$15, no sportingEventId). Routes through
// DodoCheckout.tsx's registerNonPackCheckout() for the same reason F1's
// does: the Dodo SDK is a true page-level singleton, and this button can
// render alongside the main per-event DodoCheckout on the same teaser page.
//
// NO TEST_MODE product exists yet for this pass — founder direction, 20
// Oct 2026: live IDs only for now. Local test-mode checkout testing will
// NOT work until a test product is created and swapped in here.
const LIVE_PRODUCT_ID = "pdt_0Nq8A2yPMuxyADLUBZqkl";
const TENNIS_SEASON_PASS_PRODUCT_ID = LIVE_PRODUCT_ID;

export default function TennisSeasonPassCheckout({
  label = "Get Season Pass",
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
        typeof window !== "undefined" ? `${window.location.origin}/ticket-intelligence/tennis` : "";
      registerNonPackCheckout({ successUrl, setLoading: (v) => setLoadingRef.current(v) });
      const res = await fetch("/api/checkout/dodo-season-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: TENNIS_SEASON_PASS_PRODUCT_ID, successUrl }),
      });
      const { checkout_url, error } = await res.json();
      if (error || !checkout_url) {
        console.error("[tennis season pass checkout] failed to get checkout URL:", error);
        setLoading(false);
        return;
      }
      registerNonPackCheckout({ successUrl, setLoading: (v) => setLoadingRef.current(v) });
      if (DodoPayments.Checkout.isOpen()) {
        DodoPayments.Checkout.close();
      }
      DodoPayments.Checkout.open({ checkoutUrl: checkout_url });
    } catch (err) {
      console.error("[tennis season pass checkout] unexpected error:", err);
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
