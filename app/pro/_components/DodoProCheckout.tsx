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
      <div className="flex items-center justify-center gap-1 p-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-sm w-fit mx-auto">
        <button
          onClick={() => setCycle("annual")}
          className={`px-4 py-1.5 rounded-sm text-sm font-semibold transition-colors ${
            cycle === "annual"
              ? "bg-[#AAFF00] text-black"
              : "text-[#6A6A6A] hover:text-white"
          }`}
        >
          Annual
          <span className={`ml-1.5 text-xs font-semibold ${cycle === "annual" ? "text-black/60" : "text-[#AAFF00]"}`}>Save 30%</span>
        </button>
        <button
          onClick={() => setCycle("monthly")}
          className={`px-4 py-1.5 rounded-sm text-sm font-semibold transition-colors ${
            cycle === "monthly"
              ? "bg-[#AAFF00] text-black"
              : "text-[#6A6A6A] hover:text-white"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Price display */}
      <div className="text-center">
        <p className="text-4xl font-black text-white tracking-tight">
          {cycle === "annual" ? annualMonthlyEquiv : monthlyDisplay}
          <span className="text-base font-normal text-[#6A6A6A] ml-1">/month</span>
          <LocalCurrencyHint gbpAmount={cycle === "annual" ? 6.99 : 9.99} />
        </p>
        <p className="text-sm text-[#6A6A6A] mt-1">
          {cycle === "annual"
            ? `${annualDisplay} billed annually`
            : "Billed monthly"}
        </p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-40"
      >
        {loading ? "Opening…" : "Get Pro"}
      </button>
    </div>
  );
}
