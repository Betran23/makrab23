import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const GALLERY_BUCKET = "gallery";
const MAX_WEBP_BYTES = 8 * 1024 * 1024;

function safeCompare(value: string, expected: string) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

function sanitizeFileName(value: FormDataEntryValue | null) {
  const rawName = typeof value === "string" ? value : "";
  const fallback = `foto-makrab-${new Date()
    .toISOString()
    .replace(/\D/g, "")
    .slice(0, 14)}.webp`;

  const name = rawName
    .toLowerCase()
    .replace(/\.webp$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

  return `${name || fallback.replace(/\.webp$/i, "")}.webp`;
}

export async function POST(request: Request) {
  const uploadPassword = process.env.GALLERY_UPLOAD_PASSWORD;

  if (!uploadPassword) {
    return NextResponse.json(
      { error: "Password upload belum dikonfigurasi di server." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const password = formData.get("password");

  if (
    typeof password !== "string" ||
    !safeCompare(password, uploadPassword)
  ) {
    return NextResponse.json(
      { error: "Password upload salah." },
      { status: 401 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "File gambar tidak ditemukan." },
      { status: 400 },
    );
  }

  if (file.type !== "image/webp") {
    return NextResponse.json(
      { error: "File harus sudah berbentuk WebP." },
      { status: 400 },
    );
  }

  if (file.size <= 0 || file.size > MAX_WEBP_BYTES) {
    return NextResponse.json(
      { error: "Ukuran WebP hasil kompresi tidak valid." },
      { status: 400 },
    );
  }

  const fileName = sanitizeFileName(formData.get("fileName"));
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(fileName, buffer, {
      cacheControl: "31536000",
      contentType: "image/webp",
      upsert: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Upload ke Supabase gagal." },
      { status: 500 },
    );
  }

  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(fileName);

  return NextResponse.json({
    name: fileName,
    path: fileName,
    url: data.publicUrl,
  });
}
