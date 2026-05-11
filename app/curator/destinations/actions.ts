"use server";

import { db } from "@/lib/db";
import { destinations } from "@/schema/database";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createDestination(formData: FormData) {
  const name = formData.get("name") as string;
  const countryCode = (formData.get("countryCode") as string).toUpperCase();
  const region = formData.get("region") as string;
  const destinationType = formData.get("destinationType") as string;
  const currency = formData.get("currency") as string;
  const language = formData.get("language") as string;
  const editorialOverview = formData.get("editorialOverview") as string;
  const timezone = formData.get("timezone") as string;

  const slug = slugify(name) + "-" + countryCode.toLowerCase();

  await db.insert(destinations).values({
    name,
    slug,
    countryCode,
    region: region || null,
    destinationType: (destinationType as any) || "city",
    currency: currency || null,
    language: language || null,
    timezone: timezone || null,
    editorialOverview: editorialOverview || null,
  });

  redirect("/curator/destinations");
}

export async function getAllDestinations() {
  return db
    .select({
      id: destinations.id,
      name: destinations.name,
      countryCode: destinations.countryCode,
      region: destinations.region,
      destinationType: destinations.destinationType,
      currency: destinations.currency,
    })
    .from(destinations)
    .orderBy(destinations.name);
}
