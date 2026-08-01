"use client";

import { useEffect, useState } from "react";

const LOCALE_CURRENCY: Record<string, string> = {
  "en-IN": "INR", "hi-IN": "INR", "bn-IN": "INR", "ta-IN": "INR",
  "en-US": "USD", "en-CA": "CAD", "en-AU": "AUD", "en-SG": "SGD",
  "en-AE": "AED", "ar-AE": "AED", "en-ZA": "ZAR",
  "de-DE": "EUR", "fr-FR": "EUR", "es-ES": "EUR", "it-IT": "EUR",
  "en-NZ": "NZD", "en-PK": "PKR", "en-NG": "NGN",
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹", USD: "US$", CAD: "CA$", AUD: "A$", SGD: "S$",
  AED: "AED", ZAR: "R", EUR: "€", NZD: "NZ$", PKR: "₨", NGN: "₦",
};

function detectCurrency(): string | null {
  const locales = navigator.languages?.length ? navigator.languages : [navigator.language ?? ""];
  for (const locale of locales) {
    if (LOCALE_CURRENCY[locale]) return LOCALE_CURRENCY[locale];
    // fallback: match region tag e.g. "en-IN" from "en"
    const match = Object.entries(LOCALE_CURRENCY).find(([k]) => k === locale || k.startsWith(locale + "-") || locale.startsWith(k.split("-")[0] + "-") && k.endsWith(locale.split("-")[1] ?? ""));
    if (match) return match[1];
  }
  return null;
}

export default function LocalCurrencyHint({ baseAmount, baseCurrency = "USD" }: { baseAmount: number; baseCurrency?: string }) {
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const currency = detectCurrency();
    if (!currency || currency === baseCurrency) return;

    fetch(`/api/fx?currency=${currency}&from=${baseCurrency}`)
      .then(r => r.json())
      .then(data => {
        const rate = data?.rate;
        if (!rate) return;
        const converted = Math.round(baseAmount * rate);
        const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
        setHint(`≈ ${symbol}${converted.toLocaleString()}`);
      })
      .catch(() => {});
  }, [baseAmount, baseCurrency]);

  if (!hint) return null;

  return (
    <span className="text-sm font-normal text-neutral-400 ml-2">{hint}</span>
  );
}
