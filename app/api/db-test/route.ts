import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { experiences } from "@/schema/database";

export async function GET() {
  try {
    const result = await db.select({ id: experiences.id }).from(experiences).limit(1);
    return NextResponse.json({ ok: true, count: result.length });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      message: e.message,
      cause: e.cause?.message ?? String(e.cause ?? ""),
      code: e.cause?.code,
    }, { status: 500 });
  }
}
