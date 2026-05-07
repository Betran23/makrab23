import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GALLERY_BUCKET = "gallery";
const GALLERY_FOLDER = "";
const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

function photoLabelFromName(name: string) {
  return name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
}

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.storage
      .from(GALLERY_BUCKET)
      .list(GALLERY_FOLDER || undefined, {
        limit: 200,
        sortBy: { column: "name", order: "asc" },
      });

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Gagal memuat bucket gallery." },
        { status: 500 },
      );
    }

    const photos = data
      .filter((file) =>
        imageExtensions.some((extension) =>
          file.name.toLowerCase().endsWith(extension),
        ),
      )
      .map((file, index) => {
        const path = GALLERY_FOLDER
          ? `${GALLERY_FOLDER}/${file.name}`
          : file.name;
        const { data: publicUrl } = supabase.storage
          .from(GALLERY_BUCKET)
          .getPublicUrl(path);

        return {
          id: index + 1,
          name: file.name,
          label: photoLabelFromName(file.name),
          url: publicUrl.publicUrl,
        };
      });

    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal memuat bucket gallery.",
      },
      { status: 500 },
    );
  }
}
