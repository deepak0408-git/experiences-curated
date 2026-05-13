"use client";

import Script from "next/script";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle: any;
  }
}

interface PaddleCheckoutProps {
  priceId: string;
  sportingEventId: string;
  priceTier: "early_bird" | "standard";
  clientToken: string;
  successUrl: string;
  environment: "sandbox" | "production";
  userEmail?: string;
  buttonClassName?: string;
  label?: string;
}

// Module-level guards — survive re-renders, reset on hard refresh.
let paddleInitialised = false;
let pendingSuccessUrl: string | null = null;

function ensurePaddleReady(clientToken: string, environment: "sandbox" | "production") {
  if (!window.Paddle || paddleInitialised) return;
  if (environment === "sandbox") window.Paddle.Environment.set("sandbox");
  window.Paddle.Initialize({
    token: clientToken,
    eventCallback: (event: { name: string; data?: unknown }) => {
      // Let Paddle show its own success screen, then redirect after a short pause.
      if (event.name === "checkout.completed" && pendingSuccessUrl) {
        const url = pendingSuccessUrl;
        pendingSuccessUrl = null;
        setTimeout(() => { window.location.href = url; }, 2500);
      }
    },
  });
  paddleInitialised = true;
}

export default function PaddleCheckout({
  priceId,
  sportingEventId,
  priceTier,
  clientToken,
  successUrl,
  environment,
  userEmail,
  buttonClassName,
  label = "Get the Pack",
}: PaddleCheckoutProps) {
  const openCheckout = () => {
    ensurePaddleReady(clientToken, environment);
    if (!window.Paddle) return;
    pendingSuccessUrl = successUrl;
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { sporting_event_id: sportingEventId, price_tier: priceTier },
      ...(userEmail ? { customer: { email: userEmail } } : {}),
    });
  };

  const defaultClass =
    "w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 rounded-full bg-neutral-900 text-white text-sm font-semibold tracking-wide hover:bg-neutral-700 transition-colors";

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={() => ensurePaddleReady(clientToken, environment)}
      />
      <button onClick={openCheckout} className={buttonClassName ?? defaultClass}>
        {label}
      </button>
    </>
  );
}
