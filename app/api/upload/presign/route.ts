import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, R2_BUCKET, getPublicUrl } from "@/lib/r2";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const contentType = searchParams.get("contentType");
  const sizeParam = searchParams.get("size");

  if (!filename || !contentType) {
    return NextResponse.json({ error: "filename and contentType required" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP and AVIF are allowed" }, { status: 400 });
  }
  if (sizeParam && parseInt(sizeParam) > MAX_BYTES) {
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
