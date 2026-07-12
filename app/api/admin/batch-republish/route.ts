import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { experiences } from "@/schema/database";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { indexExperience } from "@/lib/algolia";

// Temporary admin utility — re-stamps publishedAt and busts the 1hr experience
// page cache for a batch of already-published experiences whose content
// changed via a direct DB write. Same effect as re-clicking Publish in
// /curator/review for each row, done in bulk. Delete after use.
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids } = await request.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }

  const results: { id: string; slug: string | null }[] = [];

  for (const id of ids) {
    const [row] = await db.select({ slug: experiences.slug }).from(experiences).where(eq(experiences.id, id)).limit(1);
    if (!row) continue;

    await db.update(experiences).set({ publishedAt: new Date() }).where(eq(experiences.id, id));
    await indexExperience(id);
    revalidatePath(`/experience/${row.slug}`);
    results.push({ id, slug: row.slug });
  }

  revalidatePath("/curator/review");
  revalidatePath("/");

  return NextResponse.json({ ok: true, republished: results });
}
