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

  const eventLinksHtml = featured.length
    ? `<ul style="padding-left:20px;margin:0 0 32px;color:#171717">
        ${featured
          .map(
            (e) =>
              `<li style="margin-bottom:8px"><a href="${SITE_URL}/event-pack/${e.slug}" style="color:#171717;font-weight:600">${e.name}</a></li>`
          )
          .join("")}
      </ul>`
    : `<p style="font-size:14px;color:#525252;margin-bottom:32px">
        <a href="${SITE_URL}" style="color:#171717;font-weight:600">See what's live →</a>
      </p>`;

  await resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: email,
    subject: "You're on the list",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
        <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
        <h1 style="font-size:22px;font-weight:700;margin-bottom:12px">You&apos;re subscribed.</h1>
        <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:32px">
          We&apos;ll email you when a new event guide goes live — the best experiences,
          where to eat, where to stay, how to actually get there. That&apos;s it. No noise, no spam.
        </p>
        <p style="font-size:13px;font-weight:600;color:#171717;margin-bottom:12px">Live right now:</p>
        ${eventLinksHtml}
        <p style="font-size:12px;color:#a3a3a3;line-height:1.6">
          If you didn't sign up for this, you can <a href="${unsubscribeUrl}" style="color:#a3a3a3">unsubscribe here</a>.
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
