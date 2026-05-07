"use client";

import { useCallback, useMemo, useRef, useState } from "react";

type UploadStatus = "queued" | "processing" | "uploading" | "uploaded" | "error";

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  outputName: string;
  status: UploadStatus;
  originalSize: number;
  compressedSize?: number;
  error?: string;
  publicUrl?: string;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const MAX_BATCH_SIZE = 20;
const MAX_DIMENSION = 1280;
const WEBP_QUALITY = 0.72;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function createUploadName(fileName: string) {
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 6);

  return `${baseName || "foto-makrab"}-${stamp}-${random}.webp`;
}

function fileToImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gambar tidak bisa dibaca."));
    };
    image.src = url;
  });
}

async function compressToWebP(file: File) {
  const image = await fileToImage(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Browser tidak mendukung kompresi gambar.");
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal membuat file WebP."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      WEBP_QUALITY,
    );
  });
}

export default function GalleryUploader() {
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadedCount = useMemo(
    () => items.filter((item) => item.status === "uploaded").length,
    [items],
  );

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    setNotice("");
    const files = Array.from(fileList);
    const availableSlots = Math.max(0, MAX_BATCH_SIZE - items.length);
    const nextItems: UploadItem[] = [];
    const rejected: string[] = [];

    files.slice(0, availableSlots).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejected.push(`${file.name}: format tidak didukung`);
        return;
      }

      if (file.size > MAX_INPUT_BYTES) {
        rejected.push(`${file.name}: lebih dari 15 MB`);
        return;
      }

      const id =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      nextItems.push({
        id,
        file,
        previewUrl: URL.createObjectURL(file),
        outputName: createUploadName(file.name),
        status: "queued",
        originalSize: file.size,
      });
    });

    if (files.length > availableSlots) {
      rejected.push(`Maksimal ${MAX_BATCH_SIZE} file dalam satu antrean.`);
    }

    if (rejected.length > 0) {
      setNotice(rejected.join(" • "));
    }

    if (nextItems.length > 0) {
      setItems((current) => [...current, ...nextItems]);
    }
  }, [items.length]);

  const clearItems = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setNotice("");
  };

  const uploadItems = async () => {
    if (!password.trim()) {
      setNotice("Masukkan password upload dulu.");
      return;
    }

    setIsUploading(true);
    setNotice("");

    for (const item of items) {
      if (item.status === "uploaded") {
        continue;
      }

      try {
        updateItem(item.id, { status: "processing", error: undefined });
        const webpBlob = await compressToWebP(item.file);
        updateItem(item.id, {
          compressedSize: webpBlob.size,
          status: "uploading",
        });

        const formData = new FormData();
        formData.append("password", password.trim());
        formData.append("fileName", item.outputName);
        formData.append("file", webpBlob, item.outputName);

        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json()) as {
          error?: string;
          url?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Upload gagal.");
        }

        updateItem(item.id, {
          status: "uploaded",
          publicUrl: payload.url,
        });
      } catch (error) {
        updateItem(item.id, {
          status: "error",
          error:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat upload.",
        });
      }
    }

    setIsUploading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            addFiles(event.dataTransfer.files);
          }}
          className={`flex min-h-72 flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${
            isDragging
              ? "border-[var(--color-terracotta)] bg-[var(--color-cream-dark)]"
              : "border-[var(--color-brown)] bg-[var(--color-warm-white)]"
          }`}
        >
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-cream-dark)] text-[var(--color-terracotta)]">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 16V4m0 0l-4 4m4-4l4 4M4 16.5V19a1 1 0 001 1h14a1 1 0 001-1v-2.5"
              />
            </svg>
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--color-brown-dark)]">
            Drop foto dokumentasi
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--color-warm-gray)]">
            JPG, PNG, atau WebP akan diubah menjadi WebP maksimal 1280px dengan
            kompresi ringan sebelum masuk bucket Supabase.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 rounded-lg bg-[var(--color-terracotta)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--color-terracotta-light)] disabled:opacity-50"
            disabled={isUploading}
          >
            Pilih gambar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files) {
                addFiles(event.target.files);
              }
              event.currentTarget.value = "";
            }}
          />
        </div>

        <aside className="rounded-xl border border-[var(--color-beige)] bg-[var(--color-warm-white)] p-5 shadow-sm">
          <label
            htmlFor="gallery-password"
            className="block text-sm font-semibold text-[var(--color-brown-dark)]"
          >
            Password upload
          </label>
          <input
            id="gallery-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[var(--color-beige)] bg-[var(--color-cream)] px-3 py-2 text-sm text-[var(--color-brown-dark)] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-[var(--color-gold)]"
            placeholder="Masukkan password"
            disabled={isUploading}
          />

          <div className="mt-5 space-y-2 text-sm text-[var(--color-warm-gray)]">
            <p>Antrean: {items.length}/{MAX_BATCH_SIZE}</p>
            <p>Terupload: {uploadedCount}</p>
            <p>Output: WebP quality 0.72</p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={uploadItems}
              disabled={isUploading || items.length === 0}
              className="rounded-lg bg-[var(--color-brown-dark)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-brown)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? "Mengupload..." : "Upload antrean"}
            </button>
            <button
              type="button"
              onClick={clearItems}
              disabled={isUploading || items.length === 0}
              className="rounded-lg border border-[var(--color-beige)] px-4 py-2.5 text-sm font-semibold text-[var(--color-warm-gray)] transition-all hover:bg-[var(--color-beige)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Bersihkan
            </button>
          </div>
        </aside>
      </div>

      {notice && (
        <div className="rounded-lg border border-[var(--color-terracotta)] bg-[var(--color-warm-white)] px-4 py-3 text-sm text-[var(--color-terracotta)]">
          {notice}
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="overflow-hidden rounded-xl border border-[var(--color-beige)] bg-[var(--color-warm-white)] shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-[var(--color-cream-dark)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute right-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
                  {item.status}
                </span>
              </div>
              <figcaption className="space-y-2 p-4 text-sm">
                <p className="truncate font-semibold text-[var(--color-brown-dark)]">
                  {item.file.name}
                </p>
                <p className="break-all text-xs text-[var(--color-warm-gray)]">
                  {item.outputName}
                </p>
                <p className="text-xs text-[var(--color-warm-gray)]">
                  {formatBytes(item.originalSize)}
                  {item.compressedSize
                    ? ` → ${formatBytes(item.compressedSize)}`
                    : ""}
                </p>
                {item.error && (
                  <p className="text-xs font-semibold text-[var(--color-terracotta)]">
                    {item.error}
                  </p>
                )}
                {item.publicUrl && (
                  <a
                    href={item.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex text-xs font-semibold text-[var(--color-olive)] hover:underline"
                  >
                    Lihat hasil upload
                  </a>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
