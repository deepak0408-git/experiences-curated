"use server";

import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/schema/database";

export async function subscribeToNewsletter(email: string, source: string) {
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  await db
    .insert(newsletterSubscribers)
    .values({ email: email.trim().toLowerCase(), source })
    .onConflictDoNothing();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: "hello@experiences-curated.com",
      subject: "Newsletter — new signup",
      html: `<p><strong>${email}</strong> just subscribed (source: ${source || "unknown"}).</p>`,
    }),
  }).catch(() => null);

  if (res && !res.ok) {
    console.error("Failed to send newsletter signup notification email");
  }

  return { ok: true };
}
