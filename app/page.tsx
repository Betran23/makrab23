"use client";

import { useState } from "react";
import GallerySection from "@/components/GallerySection";
import DivisionInfo from "@/components/DivisionInfo";
import DivisionCard from "@/components/DivisionCard";

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
    pj: { name: "Micka Mayulia Utama", nim: "-" },
  },
  {
    id: "konkos" as const,
    name: "Konkos",
    pj: { name: "Tiya Mitra Ayu", nim: "10231088" },
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="relative z-10">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-left ornament */}
          <svg
            className="absolute top-10 left-10 w-32 h-32 text-[var(--color-gold)] opacity-10"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="3" />
          </svg>

          {/* Bottom-right ornament */}
          <svg
            className="absolute bottom-20 right-10 w-40 h-40 text-[var(--color-terracotta)] opacity-[0.07]"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 5 L61 39 L97 39 L68 61 L79 95 L50 73 L21 95 L32 61 L3 39 L39 39 Z" />
          </svg>

          {/* Scattered dots */}
          <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-[var(--color-gold)] opacity-20" />
          <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-[var(--color-terracotta)] opacity-15" />
          <div className="absolute bottom-1/3 left-1/4 w-2.5 h-2.5 rounded-full bg-[var(--color-olive)] opacity-15" />
          <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-[var(--color-brown)] opacity-20" />
        </div>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto relative">
          {/* Decorative line above */}
          <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
            <div className="w-16 h-px bg-[var(--color-gold)]" />
            <svg className="w-5 h-5 text-[var(--color-gold)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="w-16 h-px bg-[var(--color-gold)]" />
          </div>

          {/* Main Title */}
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--color-brown-dark)] leading-tight mb-6 animate-fade-in-up">
            Makrab{" "}
            <span className="text-[var(--color-terracotta)]">Sistem Informasi</span>
            <br />
            <span className="text-[var(--color-gold)]">ITK</span> Angkatan 2023
          </h1>

          {/* Subtitle */}
          <p className="font-[family-name:var(--font-lora)] text-lg sm:text-xl text-[var(--color-warm-gray)] max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            Bangun kebersamaan, isi peranmu, dan jadi bagian dari cerita kita.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-400">
            <a
              href="#divisi"
              className="px-8 py-3.5 bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-light)] text-white font-[family-name:var(--font-lora)] font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Lihat Divisi
            </a>
            <a
              href="#struktur"
              className="px-8 py-3.5 border-2 border-[var(--color-gold)] text-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-white font-[family-name:var(--font-lora)] font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Isi Struktur Kepanitiaan
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-[var(--color-warm-gray)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <GallerySection />

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
              Pilih divisi, isi namamu, dan ambil bagian dalam cerita Makrab SI 2023.
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                  <div key={i} className="w-px h-8 bg-[var(--color-brown)]" style={{ marginLeft: i === 0 ? '0' : 'auto', marginRight: i === divisions.length - 1 ? '0' : 'auto' }} />
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
