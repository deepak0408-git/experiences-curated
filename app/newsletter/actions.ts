"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers, users } from "@/schema/database";

export async function subscribeToNewsletter(email: string, source: string) {
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser) {
    return { ok: true, alreadyMember: true };
  }

  const [inserted] = await db
    .insert(newsletterSubscribers)
    .values({ email: normalizedEmail, source })
    .onConflictDoNothing()
    .returning({ id: newsletterSubscribers.id });

  if (!inserted) {
    return { ok: true, alreadySubscribed: true };
  }

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
