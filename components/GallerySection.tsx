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

const fallbackGalleryUrls = [
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/bytuglbpv0kpidil4f37.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/c9nyqwka0xfg9xpvukbq.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/dzwtr3htcb3zgy4fxtza.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/eu4et0rrhknu1j7iuui5.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/ezg8xnxjo3zaf4kmlmrp.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/hnkgnyjcq0p7fodc2bql.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/nn7tndlbzahlhnfiezfa.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/pe8xf2rtge9tqiplbwty.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/ptdksuc2uhsph7vvlwoa.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/qkdnphy7wjwndqehnb2o.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/qxqie8syqzknzyfwubt9.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/ssjfo8dddvvj75cduxzg.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/tdbrhmf6f9fpmjlvpnng.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/vkwaissl9peue2mw0bgr.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/wxcpy5eeswv1nc6yf0nh.webp",
  "https://rqxweqkpplzwjlvudgyq.supabase.co/storage/v1/object/public/gallery/xueks4pfrmjfv06wpemh.webp",
];

function photoLabelFromUrl(url: string) {
  const fileName = decodeURIComponent(url.split("/").pop() || "Foto Makrab");
  return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
}

const fallbackGalleryItems = fallbackGalleryUrls.map((src, index) => ({
  id: index + 1,
  label: photoLabelFromUrl(src),
  src,
}));

export default function GallerySection() {
  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(fallbackGalleryItems);
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

      if (photos.length > 0) {
        setGalleryItems(photos);
        setVisibleItems(new Set());
      }
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
              {/* Placeholder Image */}
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-beige)] to-[var(--color-cream-dark)] relative overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover zoom overlay */}
                <div className="absolute inset-0 bg-[var(--color-terracotta)] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-[family-name:var(--font-lora)]">
                  {item.label}
                </p>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[var(--color-gold)] opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[var(--color-gold)] opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-bl-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
