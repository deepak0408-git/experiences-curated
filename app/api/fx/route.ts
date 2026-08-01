import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const currency = req.nextUrl.searchParams.get("currency");
  const from = req.nextUrl.searchParams.get("from") ?? "GBP";
  if (!currency || !/^[A-Z]{3}$/.test(currency) || !/^[A-Z]{3}$/.test(from)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }
  if (from === currency) {
    return NextResponse.json({ rate: 1 });
  }

  const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${currency}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return NextResponse.json({ error: "FX fetch failed" }, { status: 502 });

  const data = await res.json();
  return NextResponse.json({ rate: data?.rates?.[currency] ?? null });
}
