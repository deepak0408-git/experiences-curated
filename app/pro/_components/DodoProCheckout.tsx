"use client";

import { useState, useEffect } from "react";
import LocalCurrencyHint from "@/app/event-pack/[slug]/_components/LocalCurrencyHint";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DodoPayments } = require("dodopayments-checkout");

let dodoInitialised = false;

interface Props {
  monthlyProductId: string;
  annualProductId: string;
  monthlyDisplay: string;
  annualDisplay: string;
  annualMonthlyEquiv: string;
}

export default function DodoProCheckout({
  monthlyProductId,
  annualProductId,
  monthlyDisplay,
  annualDisplay,
  annualMonthlyEquiv,
}: Props) {
  const [cycle, setCycle] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dodoInitialised) return;
    DodoPayments.Initialize({
      mode: (process.env.NEXT_PUBLIC_DODO_MODE === "test_mode" ? "test" : "live") as "test" | "live",
      displayType: "overlay",
      onEvent: (event: { event_type: string; data?: { message?: string } }) => {
        if (event.event_type === "checkout.opened") setLoading(false);
        if (event.event_type === "checkout.error") {
          setLoading(false);
          console.error("[dodo pro checkout]", event.data?.message);
        }
        if (event.event_type === "checkout.redirect") {
          setTimeout(() => { window.location.href = "/pro/onboarding"; }, 2500);
        }
      },
    });
    dodoInitialised = true;
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    const productId = cycle === "annual" ? annualProductId : monthlyProductId;
    try {
      const res = await fetch("/api/checkout/dodo-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const { checkout_url, error } = await res.json();
      if (error || !checkout_url) {
        console.error("[dodo pro checkout] failed:", error);
        setLoading(false);
        return;
      }
      await DodoPayments.Checkout.open({ checkoutUrl: checkout_url });
    } catch (err) {
      console.error("[dodo pro checkout] unexpected error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-1 p-1 bg-neutral-100 rounded-full w-fit mx-auto">
        <button
          onClick={() => setCycle("annual")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            cycle === "annual"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Annual
          <span className="ml-1.5 text-xs text-emerald-600 font-semibold">Save 30%</span>
        </button>
        <button
          onClick={() => setCycle("monthly")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            cycle === "monthly"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Price display */}
      <div className="text-center">
        <p className="text-4xl font-bold text-neutral-900 tracking-tight">
          {cycle === "annual" ? annualMonthlyEquiv : monthlyDisplay}
          <span className="text-base font-normal text-neutral-400 ml-1">/month</span>
          <LocalCurrencyHint gbpAmount={cycle === "annual" ? 6.99 : 9.99} />
        </p>
        <p className="text-sm text-neutral-400 mt-1">
          {cycle === "annual"
            ? `${annualDisplay} billed annually`
            : "Billed monthly"}
        </p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Opening…" : "Get Pro"}
      </button>
    </div>
  );
}
