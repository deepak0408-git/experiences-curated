"use server";

import { and, asc, eq, isNotNull } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { newsletterSubscribers, users, sportingEvents } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

async function sendWelcomeEmail(email: string, subscriberId: string) {
  const featured = await db
    .select({ name: sportingEvents.name, slug: sportingEvents.slug })
    .from(sportingEvents)
    .where(and(isNotNull(sportingEvents.homepageSlot), eq(sportingEvents.isHidden, false)))
    .orderBy(asc(sportingEvents.homepageSlot))
    .limit(4);

  const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe/${subscriberId}`;

  const eventLinks = featured.map(
    (e) => `<a href="${SITE_URL}/event-pack/${e.slug}" style="color:#171717;font-weight:600">${e.name}</a>`
  );

  let eventSentence: string;
  if (eventLinks.length === 0) {
    eventSentence = `Right now you can see what's live at <a href="${SITE_URL}" style="color:#171717;font-weight:600">experiences-curated.com</a>.`;
  } else if (eventLinks.length === 1) {
    eventSentence = `Right now we've got a full guide for ${eventLinks[0]} — worth a look if it's on your calendar.`;
  } else {
    const last = eventLinks[eventLinks.length - 1];
    const rest = eventLinks.slice(0, -1).join(", ");
    eventSentence = `Right now we've got full guides for ${rest}, and ${last} — worth a look if any of them are on your calendar.`;
  }

  await resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: email,
    subject: "You're on the list",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
        <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
        <h1 style="font-size:22px;font-weight:700;margin-bottom:12px">You&apos;re subscribed.</h1>
        <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:20px">
          We&apos;ll email you when a new event guide goes live. ${eventSentence}
        </p>
        <p style="font-size:12px;color:#a3a3a3;line-height:1.6">
          Didn&apos;t sign up for this? <a href="${unsubscribeUrl}" style="color:#a3a3a3">Unsubscribe here</a>.
        </p>
      </div>
    `,
  }).catch((err) => console.error("Failed to send welcome email:", err));
}

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

  await sendWelcomeEmail(normalizedEmail, inserted.id);

  await resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: "hello@experiences-curated.com",
    subject: "Newsletter — new signup",
    html: `<p><strong>${email}</strong> just subscribed (source: ${source || "unknown"}).</p>`,
  }).catch(() => console.error("Failed to send newsletter signup notification email"));

  return { ok: true };
}
