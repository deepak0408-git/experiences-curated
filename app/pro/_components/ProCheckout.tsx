"use client";

import { useState } from "react";
import Script from "next/script";

let paddleInitialised = false;

interface Props {
  monthlyPriceId: string;
  annualPriceId: string;
  clientToken: string;
  environment: "sandbox" | "production";
  monthlyDisplay: string;
  annualDisplay: string;
  annualMonthlyEquiv: string;
}

export default function ProCheckout({
  monthlyPriceId,
  annualPriceId,
  clientToken,
  environment,
  monthlyDisplay,
  annualDisplay,
  annualMonthlyEquiv,
}: Props) {
  const [cycle, setCycle] = useState<"monthly" | "annual">("annual");

  const ensurePaddleReady = () => {
    if (!window.Paddle || paddleInitialised) return;
    if (environment === "sandbox") window.Paddle.Environment.set("sandbox");
    window.Paddle.Initialize({
      token: clientToken,
      eventCallback: (event: { name: string }) => {
        if (event.name === "checkout.completed") {
          setTimeout(() => { window.location.href = "/pro/onboarding"; }, 2500);
        }
      },
    });
    paddleInitialised = true;
  };

  const handleCheckout = () => {
    ensurePaddleReady();
    if (!window.Paddle) return;
    const priceId = cycle === "annual" ? annualPriceId : monthlyPriceId;
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
    });
  };

  return (
    <>
    <Script
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      onLoad={ensurePaddleReady}
    />
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
        </p>
        <p className="text-sm text-neutral-400 mt-1">
          {cycle === "annual"
            ? `${annualDisplay} billed annually`
            : "Billed monthly"}
        </p>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors"
      >
        Get Pro
      </button>
    </div>
    </>
  );
}
