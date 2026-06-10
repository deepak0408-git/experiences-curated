"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, savedItems, tripBoards, travelLogs, communityFlags, tasteProfiles, userProfiles, proSubscriptions, purchases } from "@/schema/database";

export async function openPaddlePortal(paddleCustomerId: string) {
  const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "sandbox";
  const baseUrl = isSandbox
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";

  const res = await fetch(`${baseUrl}/customers/${paddleCustomerId}/portal-sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error("Failed to create Paddle portal session");
  }

  const json = await res.json();
  const portalUrl = json.data?.urls?.general?.overview;
  if (!portalUrl) throw new Error("No portal URL returned");

  redirect(portalUrl);
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // email is the stable identifier across auth + purchases
  const userEmail = user.email!;

  // Resolve public.users row if it exists
  const [publicUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  if (publicUser) {
    const userId = publicUser.id;

    // 1. saved_items (references users + trip_boards — must go before trip_boards)
    await db.delete(savedItems).where(eq(savedItems.userId, userId));
    // 2. trip_boards
    await db.delete(tripBoards).where(eq(tripBoards.userId, userId));
    // 3. travel_logs
    await db.delete(travelLogs).where(eq(travelLogs.userId, userId));
    // 4. community_flags
    await db.delete(communityFlags).where(eq(communityFlags.userId, userId));
    // 5. taste_profiles
    await db.delete(tasteProfiles).where(eq(tasteProfiles.userId, userId));
    // 6. user_profiles
    await db.delete(userProfiles).where(eq(userProfiles.userId, userId));
    // 7. pro_subscriptions
    await db.delete(proSubscriptions).where(eq(proSubscriptions.userId, userId));
    // 8. public.users
    await db.delete(users).where(eq(users.id, userId));
  }

  // Anonymise purchases by email — fires regardless of whether public.users existed
  // Personal identifiers stripped; transaction record retained for legal compliance
  await db.update(purchases)
    .set({ userId: null, paddleCustomerId: null, email: "[deleted]" })
    .where(eq(purchases.email, userEmail));

  // 10. Delete from Supabase Auth
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw new Error("Failed to delete account");

  await supabase.auth.signOut();
  redirect("/");
}
