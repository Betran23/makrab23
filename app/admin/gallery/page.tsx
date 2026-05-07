import Link from "next/link";
import GalleryUploader from "@/components/GalleryUploader";

export const metadata = {
  title: "Admin Gallery - Makrab SI ITK 2023",
};

export default function AdminGalleryPage() {
  return (
    <main className="relative z-10 min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-terracotta)]">
              Admin dokumentasi
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--color-brown-dark)] sm:text-5xl">
              Upload Gallery
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-[var(--color-warm-gray)] sm:text-base">
              Masukkan foto kegiatan, sistem akan mengubahnya menjadi WebP dan
              mengompresnya sebelum disimpan ke bucket Supabase.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex w-fit rounded-lg border border-[var(--color-beige)] bg-[var(--color-warm-white)] px-4 py-2 text-sm font-semibold text-[var(--color-brown-dark)] shadow-sm transition-all hover:bg-[var(--color-cream-dark)]"
          >
            Kembali ke halaman utama
          </Link>
        </div>

        <GalleryUploader />
      </div>
    </main>
  );
}
