"use client";

import { useEffect, useRef, useState } from "react";

const galleryItems = [
  { id: 1, label: "Dokumentasi Makrab 1" },
  { id: 2, label: "Dokumentasi Makrab 2" },
  { id: 3, label: "Dokumentasi Makrab 3" },
  { id: 4, label: "Dokumentasi Makrab 4" },
  { id: 5, label: "Dokumentasi Makrab 5" },
  { id: 6, label: "Dokumentasi Makrab 6" },
];

export default function GallerySection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, []);

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
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <pattern
                      id={`pattern-${item.id}`}
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                    </pattern>
                    <rect
                      width="100"
                      height="100"
                      fill={`url(#pattern-${item.id})`}
                      className="text-[var(--color-brown)]"
                    />
                  </svg>
                </div>

                {/* Camera icon placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-brown)] opacity-40 group-hover:opacity-60 transition-opacity">
                  <svg
                    className="w-12 h-12 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm font-[family-name:var(--font-lora)]">
                    {item.label}
                  </span>
                </div>

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
