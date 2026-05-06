"use client";

import { useEffect, useRef, useState } from "react";

type DivisionData = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const divisions: DivisionData[] = [
  {
    id: "perkamjin",
    title: "Divisi Perkamjin",
    subtitle: "Perlengkapan, Keamanan, dan Perizinan",
    description:
      "Divisi Perkamjin bertanggung jawab dalam menyiapkan perlengkapan acara, kebutuhan teknis lapangan, pengaturan keamanan, dan pengurusan izin kegiatan. Divisi ini memastikan semua kebutuhan acara tersedia dan kegiatan berjalan dengan tertib.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "terracotta",
  },
  {
    id: "pdd",
    title: "Divisi PDD",
    subtitle: "Publikasi, Dekorasi, dan Dokumentasi",
    description:
      "Divisi PDD bertanggung jawab dalam membuat desain publikasi, mendokumentasikan kegiatan, mengatur dekorasi, serta mengelola tampilan visual acara. Divisi ini menjadi penjaga memori dan wajah visual dari kegiatan makrab.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "gold",
  },
  {
    id: "acara",
    title: "Divisi Acara",
    subtitle: "Konsep, Rundown, dan Pelaksanaan",
    description:
      "Divisi Acara bertanggung jawab dalam menyusun konsep kegiatan, membuat rundown, mengatur games, ice breaking, sesi sharing, serta memastikan alur acara berjalan seru, rapi, dan sesuai jadwal.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "olive",
  },
  {
    id: "konkos",
    title: "Divisi Konkos",
    subtitle: "Kesehatan dan Konsumsi",
    description:
      "Divisi Konkos bertanggung jawab dalam memastikan kebutuhan konsumsi peserta dan panitia terpenuhi, serta menjaga kesiapan kesehatan selama kegiatan berlangsung. Divisi ini memastikan peserta tetap aman, nyaman, dan bertenaga selama acara.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: "brown",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  terracotta: {
    bg: "bg-[#FEF0EC]",
    border: "border-[var(--color-terracotta-light)]",
    text: "text-[var(--color-terracotta)]",
    iconBg: "bg-[var(--color-terracotta)]",
  },
  gold: {
    bg: "bg-[#FDF8E8]",
    border: "border-[var(--color-gold-light)]",
    text: "text-[var(--color-gold)]",
    iconBg: "bg-[var(--color-gold)]",
  },
  olive: {
    bg: "bg-[#F2F5E8]",
    border: "border-[var(--color-olive-light)]",
    text: "text-[var(--color-olive)]",
    iconBg: "bg-[var(--color-olive)]",
  },
  brown: {
    bg: "bg-[#F8F0E8]",
    border: "border-[var(--color-brown)]",
    text: "text-[var(--color-brown)]",
    iconBg: "bg-[var(--color-brown)]",
  },
};

export default function DivisionInfo() {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-division-id");
            if (id) setVisibleItems((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const items = containerRef.current?.querySelectorAll("[data-division-id]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="divisi" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--color-warm-white)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-[var(--color-brown-dark)] mb-3">
            Kenali Divisi Kami
          </h2>
          <p className="font-[family-name:var(--font-lora)] text-[var(--color-warm-gray)] text-lg max-w-2xl mx-auto">
            Setiap divisi punya peran penting dalam menyukseskan Makrab SI 2023.
            Temukan divisi yang cocok untukmu!
          </p>
          <div className="vintage-divider mt-6 max-w-xs mx-auto">
            <span className="text-[var(--color-gold)] text-xl">&#10045;</span>
          </div>
        </div>

        {/* Division Cards */}
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {divisions.map((division, index) => {
            const colors = colorMap[division.color];
            return (
              <div
                key={division.id}
                data-division-id={division.id}
                className={`${colors.bg} border ${colors.border} rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 group ${
                  visibleItems.has(division.id)
                    ? "animate-fade-in-up"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div
                  className={`${colors.iconBg} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {division.icon}
                </div>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--color-brown-dark)] mb-1">
                  {division.title}
                </h3>

                {/* Subtitle */}
                <p className={`${colors.text} font-[family-name:var(--font-lora)] text-sm font-semibold mb-4`}>
                  {division.subtitle}
                </p>

                {/* Description */}
                <p className="font-[family-name:var(--font-lora)] text-[var(--color-warm-gray)] leading-relaxed">
                  {division.description}
                </p>

                {/* Quick nav link */}
                <a
                  href={`#division-${division.id}`}
                  className={`inline-flex items-center gap-2 mt-5 ${colors.text} font-[family-name:var(--font-lora)] text-sm font-semibold hover:gap-3 transition-all duration-300`}
                >
                  Isi Struktur
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
