import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET, getPublicUrl } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

// Simple in-memory rate limiter — 10 presign requests per user per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const contentType = searchParams.get("contentType");
  const sizeParam = searchParams.get("size");

  if (!filename || !contentType || !sizeParam) {
    return NextResponse.json({ error: "filename, contentType and size required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP and AVIF are allowed" }, { status: 400 });
  }
  const size = parseInt(sizeParam);
  if (isNaN(size) || size <= 0 || size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be under 15 MB" }, { status: 400 });
  }

  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const key = `experiences/hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 120 });
  const publicUrl = getPublicUrl(key);

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
