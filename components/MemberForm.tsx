"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type MemberFormProps = {
  division: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function MemberForm({ division, onSuccess, onCancel }: MemberFormProps) {
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }

    if (!nim.trim()) {
      setError("NIM wajib diisi.");
      return;
    }

    if (!/^\d+$/.test(nim.trim())) {
      setError("NIM hanya boleh berisi angka.");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("committee_members")
        .insert({
          division,
          name: name.trim(),
          nim: nim.trim(),
          role: "anggota",
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("NIM ini sudah terdaftar di divisi ini.");
        } else {
          setError("Gagal menyimpan data. Silakan coba lagi.");
        }
        return;
      }

      onSuccess();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-scale-in bg-[var(--color-warm-white)] border border-[var(--color-beige)] rounded-xl p-5 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label
            htmlFor={`name-${division}`}
            className="block font-[family-name:var(--font-lora)] text-sm font-semibold text-[var(--color-brown-dark)] mb-1.5"
          >
            Nama Lengkap
          </label>
          <input
            id={`name-${division}`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-beige)] bg-[var(--color-cream)] text-[var(--color-brown-dark)] font-[family-name:var(--font-lora)] text-sm placeholder:text-[var(--color-warm-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
            disabled={loading}
          />
        </div>

        {/* NIM Input */}
        <div>
          <label
            htmlFor={`nim-${division}`}
            className="block font-[family-name:var(--font-lora)] text-sm font-semibold text-[var(--color-brown-dark)] mb-1.5"
          >
            NIM
          </label>
          <input
            id={`nim-${division}`}
            type="text"
            value={nim}
            onChange={(e) => {
              // Only allow numbers
              const val = e.target.value.replace(/\D/g, "");
              setNim(val);
            }}
            placeholder="Masukkan NIM (angka saja)"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-beige)] bg-[var(--color-cream)] text-[var(--color-brown-dark)] font-[family-name:var(--font-lora)] text-sm placeholder:text-[var(--color-warm-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:border-transparent transition-all"
            disabled={loading}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-[var(--color-terracotta)] text-sm font-[family-name:var(--font-lora)]">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-light)] text-white font-[family-name:var(--font-lora)] text-sm font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 border border-[var(--color-beige)] text-[var(--color-warm-gray)] font-[family-name:var(--font-lora)] text-sm font-semibold rounded-lg hover:bg-[var(--color-beige)] transition-all duration-300 disabled:opacity-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
