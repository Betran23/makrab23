"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, CommitteeMember } from "@/lib/supabase";
import MemberForm from "./MemberForm";

type PJData = {
  name: string;
  nim: string;
};

type DivisionCardProps = {
  divisionId: "perkamjin" | "pdd" | "acara" | "konkos";
  divisionName: string;
  pj: PJData;
  searchQuery: string;
};

const DEFAULT_QUOTA = 8;

export default function DivisionCard({
  divisionId,
  divisionName,
  pj,
  searchQuery,
}: DivisionCardProps) {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("committee_members")
        .select("*")
        .eq("division", divisionId)
        .eq("role", "anggota")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch {
      console.error("Error fetching members");
    } finally {
      setLoading(false);
    }
  }, [divisionId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSuccess = () => {
    setShowForm(false);
    fetchMembers();
    setToast({
      type: "success",
      message: "Data berhasil disimpan. Selamat bergabung di divisi ini!",
    });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredMembers = searchQuery
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.nim.includes(searchQuery)
      )
    : members;

  const pjMatchesSearch =
    !searchQuery ||
    pj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pj.nim.includes(searchQuery);

  const filledSlots = members.length;
  const progressPercent = Math.min((filledSlots / DEFAULT_QUOTA) * 100, 100);

  return (
    <div
      id={`division-${divisionId}`}
      className="bg-[var(--color-warm-white)] border border-[var(--color-beige)] rounded-2xl shadow-md hover:shadow-lg transition-all duration-500 overflow-hidden relative"
    >
      {/* Toast Notification */}
      {toast && (
        <div
          className={`absolute top-3 left-3 right-3 z-20 toast-enter rounded-lg px-4 py-3 text-sm font-[family-name:var(--font-lora)] shadow-lg ${
            toast.type === "success"
              ? "bg-[var(--color-olive)] text-white"
              : "bg-[var(--color-terracotta)] text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Division Header */}
      <div className="bg-gradient-to-r from-[var(--color-brown-dark)] to-[var(--color-brown)] p-5">
        <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
          {divisionName}
        </h3>
        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[var(--color-cream)] text-xs font-[family-name:var(--font-lora)]">
              {filledSlots} dari {DEFAULT_QUOTA} slot terisi
            </span>
            <span className="text-[var(--color-gold-light)] text-xs font-semibold font-[family-name:var(--font-lora)]">
              {filledSlots} anggota
            </span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="progress-bar h-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Penanggung Jawab Card */}
        {pjMatchesSearch && (
          <div className="bg-gradient-to-r from-[#FEF0EC] to-[#FDF8E8] border-2 border-[var(--color-gold)] rounded-xl p-4 relative overflow-hidden">
            {/* Gold corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16">
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-[var(--color-gold)] border-l-[40px] border-l-transparent opacity-20" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[var(--color-gold)] text-white text-xs font-semibold font-[family-name:var(--font-lora)] px-3 py-1 rounded-full mb-3">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Penanggung Jawab
            </div>

            {/* PJ Info */}
            <div>
              <p className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[var(--color-brown-dark)]">
                {pj.name}
              </p>
              <p className="font-[family-name:var(--font-lora)] text-sm text-[var(--color-warm-gray)]">
                NIM: {pj.nim}
              </p>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="space-y-2">
          {loading ? (
            // Loading skeleton
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-14 rounded-lg" />
              ))}
            </div>
          ) : filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <div
                key={member.id}
                className="flex items-center gap-3 bg-[var(--color-cream)] border border-[var(--color-beige)] rounded-lg px-4 py-3 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Number badge */}
                <div className="w-7 h-7 rounded-full bg-[var(--color-beige)] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[var(--color-brown)]">
                    {index + 1}
                  </span>
                </div>
                {/* Member info */}
                <div className="flex-1 min-w-0">
                  <p className="font-[family-name:var(--font-lora)] text-sm font-semibold text-[var(--color-brown-dark)] truncate">
                    {member.name}
                  </p>
                  <p className="font-[family-name:var(--font-lora)] text-xs text-[var(--color-warm-gray)]">
                    NIM: {member.nim}
                  </p>
                </div>
              </div>
            ))
          ) : !searchQuery ? (
            // Empty state
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--color-beige)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--color-warm-gray)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-[family-name:var(--font-lora)] text-sm text-[var(--color-warm-gray)]">
                Belum ada anggota. Jadilah yang pertama!
              </p>
            </div>
          ) : (
            // No search results
            <div className="text-center py-4">
              <p className="font-[family-name:var(--font-lora)] text-sm text-[var(--color-warm-gray)]">
                Tidak ditemukan anggota yang cocok.
              </p>
            </div>
          )}
        </div>

        {/* Empty slots indicator */}
        {!loading && !searchQuery && members.length < DEFAULT_QUOTA && (
          <div className="space-y-2">
            {Array.from({ length: Math.min(DEFAULT_QUOTA - members.length, 3) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border-2 border-dashed border-[var(--color-beige)] rounded-lg px-4 py-3 flex items-center justify-center"
              >
                <span className="text-xs text-[var(--color-warm-gray)] font-[family-name:var(--font-lora)]">
                  Slot kosong
                </span>
              </div>
            ))}
            {DEFAULT_QUOTA - members.length > 3 && (
              <p className="text-center text-xs text-[var(--color-warm-gray)] font-[family-name:var(--font-lora)]">
                +{DEFAULT_QUOTA - members.length - 3} slot lainnya
              </p>
            )}
          </div>
        )}

        {/* Form or Button */}
        {showForm ? (
          <MemberForm
            division={divisionId}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-[var(--color-terracotta-light)] text-[var(--color-terracotta)] font-[family-name:var(--font-lora)] text-sm font-semibold rounded-xl hover:bg-[#FEF0EC] hover:border-[var(--color-terracotta)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {members.length >= DEFAULT_QUOTA ? "+ Tambah Anggota" : "Isi Slot Ini"}
          </button>
        )}
      </div>
    </div>
  );
}
