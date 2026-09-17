import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { eq } from "drizzle-orm";
import InlineDodoCheckout from "./_components/InlineDodoCheckout";
import LocalCurrencyHint from "../_components/LocalCurrencyHint";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    productId?: string;
    priceTier?: string;
    productType?: string;
    successUrl?: string;
    productLabel?: string;
    priceDisplay?: string;
    priceCurrency?: string;
    eventName?: string;
  }>;
}

const VALID_PRODUCT_TYPES = ["tickets_guide", "hotels_guide", "itinerary_guide"] as const;

export default async function EventPackCheckoutPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const {
    productId,
    priceTier,
    productType,
    successUrl,
    productLabel,
    priceDisplay,
    priceCurrency,
    eventName,
  } = await searchParams;

  if (!productId || !successUrl) notFound();

  const [event] = await db
    .select({ id: sportingEvents.id, name: sportingEvents.name })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);

  if (!event) notFound();

  const resolvedProductType = VALID_PRODUCT_TYPES.includes(productType as (typeof VALID_PRODUCT_TYPES)[number])
    ? (productType as (typeof VALID_PRODUCT_TYPES)[number])
    : undefined;
  const resolvedPriceTier = priceTier === "early_bird" ? "early_bird" : "standard";
  const numericPrice = priceDisplay ? parseFloat(priceDisplay.replace(/[^0-9.]/g, "")) : undefined;

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-10 px-4">
      <div className="max-w-lg mx-auto">
        <Link href={`/event-pack/${slug}`} className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
          ← Back to {event.name}
        </Link>
        {(productLabel || priceDisplay) && (
          <div className="mt-6 rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6A6A6A]">{event.name}</p>
                {productLabel && <p className="text-sm font-semibold text-white">{productLabel}</p>}
              </div>
              {priceDisplay && (
                <p className="text-lg font-black text-white">
                  {priceDisplay}
                  <span className="text-xs font-normal text-[#6A6A6A]"> + tax</span>
                  {numericPrice !== undefined && (
                    <LocalCurrencyHint baseAmount={numericPrice} baseCurrency={priceCurrency ?? "USD"} />
                  )}
                </p>
              )}
            </div>
            {/* Our price is pre-tax; Dodo's own checkout form below calculates
                and charges the real tax-inclusive total once it knows the
                buyer's billing address (same as the overlay checkout's own
                subtotal/GST/total breakdown) — this line makes clear our
                number isn't the final charge, so it's never mistaken for one.
                Caught live 18 Sep 2026: showing a bare price here read as
                "we said $10, Dodo charged $11" even though the tax was
                always applied on the standard checkout too. */}
            <p className="text-xs text-[#6A6A6A] mt-2">
              Final total including tax is shown in the payment form below.
            </p>
          </div>
        )}
        <div className="mt-4 rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <InlineDodoCheckout
            productId={productId}
            sportingEventId={event.id}
            priceTier={resolvedPriceTier}
            productType={resolvedProductType}
            successUrl={successUrl}
            eventSlug={slug}
            eventName={eventName ?? event.name}
          />
        </div>
      </div>
    </div>
  );
}
