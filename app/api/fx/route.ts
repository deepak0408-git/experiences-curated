import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const currency = req.nextUrl.searchParams.get("currency");
  if (!currency || !/^[A-Z]{3}$/.test(currency)) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  const res = await fetch(`https://api.frankfurter.app/latest?from=GBP&to=${currency}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return NextResponse.json({ error: "FX fetch failed" }, { status: 502 });

  const data = await res.json();
  return NextResponse.json({ rate: data?.rates?.[currency] ?? null });
}
