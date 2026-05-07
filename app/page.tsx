"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DivisionInfo from "@/components/DivisionInfo";
import DivisionCard from "@/components/DivisionCard";
import GallerySection from "@/components/GallerySection";
import { supabase } from "@/lib/supabase";

const HERO_PHOTOS_BUCKET = "gallery";
const HERO_PHOTOS_FOLDER = "";

type HeroPhoto = {
  name: string;
  url: string;
};

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const fallbackHeroPhotoUrls = [
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/anuvoijx34fjtygg2yev.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/bxjag15q4yfpogehhvwv.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSC01989.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSC01995.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSC02004.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSC02021.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSC02022.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0680.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0681.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0746.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0750.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0858.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0861.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0897.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0930.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF0947.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF6477.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF6571.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/DSCF6583.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/efdexohfvylikanxz2o2.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/iger9hqhrokat1nb69hk.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/IMG_6517%20(1).webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/IMG_6517.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/j6hyocfl40uin8przsni.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/optbrdwtoqsuafellzhg.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/qh7rxxq83tl9xl3otbqt.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/RMRO2081.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/RMRO2107.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/ws1lykbcrerzoruewjgw.webp",
];

function photoNameFromUrl(url: string) {
  const fileName = decodeURIComponent(url.split("/").pop() || "Foto Makrab");
  return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
}

const fallbackHeroPhotos = fallbackHeroPhotoUrls.map((url) => ({
  name: photoNameFromUrl(url),
  url,
}));

const divisions = [
  {
    id: "perkamjin" as const,
    name: "Perkamjin",
    pj: { name: "Betran", nim: "10231023" },
  },
  {
    id: "pdd" as const,
    name: "PDD",
    pj: { name: "Pangeran Borneo Silaen", nim: "10231073" },
  },
  {
    id: "acara" as const,
    name: "Acara",
    pj: { name: "Micka Mayulia Utama", nim: "10231053" },
  },
  {
    id: "konkos" as const,
    name: "KESI",
    pj: { name: "Tiya Mitra Ayu", nim: "10231088" },
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [heroPhotos, setHeroPhotos] =
    useState<HeroPhoto[]>(fallbackHeroPhotos);

  useEffect(() => {
    let isMounted = true;

    async function loadHeroPhotos() {
      if (!HERO_PHOTOS_BUCKET) {
        return;
      }

      const { data, error } = await supabase.storage
        .from(HERO_PHOTOS_BUCKET)
        .list(HERO_PHOTOS_FOLDER || undefined, {
          limit: 200,
          sortBy: { column: "name", order: "asc" },
        });

      if (error || !data || !isMounted) {
        return;
      }

      const photos = data
        .filter((file) =>
          imageExtensions.some((extension) =>
            file.name.toLowerCase().endsWith(extension),
          ),
        )
        .map((file) => {
          const path = HERO_PHOTOS_FOLDER
            ? `${HERO_PHOTOS_FOLDER}/${file.name}`
            : file.name;
          const { data: publicUrl } = supabase.storage
            .from(HERO_PHOTOS_BUCKET)
            .getPublicUrl(path);

          return {
            name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            url: publicUrl.publicUrl,
          };
        });

      if (photos.length > 0) {
        setHeroPhotos(photos);
      }
    }

    loadHeroPhotos();

    return () => {
      isMounted = false;
    };
  }, []);

  const marqueePhotos = [...heroPhotos, ...heroPhotos];

  return (
    <main className="relative z-10">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-marquee relative min-h-screen overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[#120d09]">
        {heroPhotos.length > 0 && (
          <div className="absolute inset-0 flex items-center pointer-events-none">
            <div className="hero-marquee-track flex min-w-max items-center gap-4 sm:gap-6">
              {marqueePhotos.map((photo, index) => (
                <figure
                  key={`${photo.url}-${index}`}
                  className={`hero-photo hero-photo-${(index % 5) + 1} relative`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 70vw, 34vw"
                    className="object-cover"
                    loading={index < heroPhotos.length ? "eager" : "lazy"}
                  />
                </figure>
              ))}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.18),rgba(0,0,0,0.72)_62%,rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/80" />

        <div className="relative z-10 text-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none text-[var(--color-warm-white)] drop-shadow-[0_14px_42px_rgba(0,0,0,0.65)] animate-fade-in-up">
            INVICTUS 23
          </h1>
        </div>
      </section>

      {/* ===== DIVISION INFO SECTION ===== */}
      <DivisionInfo />

      {/* ===== COMMITTEE STRUCTURE SECTION ===== */}
      <section id="struktur" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[var(--color-brown-dark)] mb-3">
              Pohon Struktur Kepanitiaan
            </h2>
            <p className="font-[family-name:var(--font-lora)] text-[var(--color-warm-gray)] text-lg max-w-2xl mx-auto">
              Pilih divisi, isi namamu, dan ambil bagian dalam cerita Makrab SI
              2023.
            </p>
            <div className="vintage-divider mt-6 max-w-xs mx-auto">
              <span className="text-[var(--color-gold)] text-xl">&#10045;</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {divisions.map((div) => (
              <a
                key={div.id}
                href={`#division-${div.id}`}
                className="px-4 py-2 bg-[var(--color-cream-dark)] hover:bg-[var(--color-beige)] text-[var(--color-brown-dark)] font-[family-name:var(--font-lora)] text-sm font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >
                {div.name}
              </a>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-warm-gray)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau NIM anggota..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-beige)] bg-[var(--color-warm-white)] text-[var(--color-brown-dark)] font-[family-name:var(--font-lora)] text-sm placeholder:text-[var(--color-warm-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-warm-gray)] hover:text-[var(--color-brown-dark)] transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Org Chart Tree Connector (Desktop) */}
          <div className="hidden lg:flex justify-center mb-8">
            <div className="relative">
              {/* Central node */}
              <div className="w-48 mx-auto bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-gold)] text-white text-center py-3 px-6 rounded-xl font-[family-name:var(--font-playfair)] font-bold shadow-lg">
                Panitia Makrab 2023
              </div>
              {/* Vertical line down */}
              <div className="w-px h-8 bg-[var(--color-brown)] mx-auto" />
              {/* Horizontal line */}
              <div className="w-full max-w-4xl h-px bg-[var(--color-brown)] mx-auto" />
              {/* Vertical lines to each division */}
              <div className="flex justify-between max-w-4xl mx-auto">
                {divisions.map((_, i) => (
                  <div
                    key={i}
                    className="w-px h-8 bg-[var(--color-brown)]"
                    style={{
                      marginLeft: i === 0 ? "0" : "auto",
                      marginRight: i === divisions.length - 1 ? "0" : "auto",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Division Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {divisions.map((div) => (
              <DivisionCard
                key={div.id}
                divisionId={div.id}
                divisionName={div.name}
                pj={div.pj}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <GallerySection />

      {/* ===== FOOTER ===== */}
      <footer className="py-10 px-4 bg-[var(--color-brown-dark)] text-[var(--color-cream)]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="vintage-divider mb-6 max-w-xs mx-auto">
            <span className="text-[var(--color-gold)] text-lg">&#10045;</span>
          </div>
          <p className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-2">
            Makrab SI ITK 2023
          </p>
          <p className="font-[family-name:var(--font-lora)] text-sm text-[var(--color-cream-dark)] opacity-80">
            Bangun kebersamaan, isi peranmu, dan jadi bagian dari cerita kita.
          </p>
          <p className="font-[family-name:var(--font-lora)] text-xs text-[var(--color-cream-dark)] opacity-50 mt-4">
            &copy; 2023 Sistem Informasi - Institut Teknologi Kalimantan
          </p>
        </div>
      </footer>
    </main>
  );
}
