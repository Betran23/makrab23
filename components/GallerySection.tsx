"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const GALLERY_BUCKET = "gallery";
const GALLERY_FOLDER = "";

type GalleryItem = {
  id: number;
  label: string;
  src: string;
};

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

export default function GallerySection() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGalleryItems() {
      const { data, error } = await supabase.storage
        .from(GALLERY_BUCKET)
        .list(GALLERY_FOLDER || undefined, {
          limit: 200,
          sortBy: { column: "name", order: "asc" },
        });

      if (error || !data || !isMounted) {
        if (isMounted) {
          setLoadError("Gagal memuat foto dari bucket gallery.");
          setLoading(false);
        }
        return;
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
            label: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            src: publicUrl.publicUrl,
          };
        });

      setGalleryItems(photos);
      setVisibleItems(new Set());
      setLoading(false);
    }

    loadGalleryItems();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-id"));
            setVisibleItems((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = containerRef.current?.querySelectorAll("[data-id]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [galleryItems]);

  return (
    <section id="dokumentasi" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[var(--color-brown-dark)] mb-3">
            Dokumentasi Makrab
          </h2>
          <p className="font-[family-name:var(--font-lora)] text-[var(--color-warm-gray)] text-lg">
            Momen-momen berharga yang telah kita lalui bersama
          </p>
          <div className="vintage-divider mt-6 max-w-xs mx-auto">
            <span className="text-[var(--color-gold)] text-xl">&#10045;</span>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/3] rounded-2xl skeleton shadow-md"
              />
            ))}
          </div>
        )}

        {!loading && loadError && (
          <div className="rounded-2xl border border-[var(--color-beige)] bg-[var(--color-warm-white)] px-6 py-10 text-center shadow-sm">
            <p className="font-[family-name:var(--font-lora)] text-[var(--color-terracotta)]">
              {loadError}
            </p>
          </div>
        )}

        {!loading && !loadError && galleryItems.length === 0 && (
          <div className="rounded-2xl border border-[var(--color-beige)] bg-[var(--color-warm-white)] px-6 py-10 text-center shadow-sm">
            <p className="font-[family-name:var(--font-lora)] text-[var(--color-warm-gray)]">
              Belum ada foto di bucket gallery.
            </p>
          </div>
        )}

        {!loading && !loadError && galleryItems.length > 0 && (
          <div
            ref={containerRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                data-id={item.id}
                className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer ${
                  visibleItems.has(item.id)
                    ? "animate-fade-in-up"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-beige)] to-[var(--color-cream-dark)] relative overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-[var(--color-terracotta)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-[family-name:var(--font-lora)]">
                    {item.label}
                  </p>
                </div>

                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[var(--color-gold)] opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[var(--color-gold)] opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-bl-lg" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
