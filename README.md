# Makrab SI ITK 2023

Website pendaftaran struktur kepanitiaan Makrab Sistem Informasi ITK Angkatan 2023. Aplikasi ini menampilkan informasi divisi, dokumentasi kegiatan, dan formulir pengisian anggota kepanitiaan per divisi.

## Fitur

- Hero page untuk Makrab SI ITK 2023 dengan navigasi ke bagian divisi dan struktur.
- Galeri dokumentasi dengan placeholder visual yang siap diganti dengan foto kegiatan.
- Informasi empat divisi kepanitiaan: Perkamjin, PDD, Acara, dan KESI.
- Kartu struktur kepanitiaan per divisi dengan PJ, slot anggota, progress pengisian, dan pencarian anggota.
- Form pendaftaran anggota yang menyimpan data ke Supabase.
- Validasi NIM angka-only dan pencegahan duplikasi NIM dalam divisi yang sama.

## Teknologi

- [Next.js](https://nextjs.org/) 16 dengan App Router
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Supabase](https://supabase.com/) untuk database dan client API
- TypeScript

## Prasyarat

- Node.js versi LTS terbaru yang kompatibel dengan Next.js 16
- npm
- Project Supabase dengan akses SQL editor dan anon public key

## Setup Lokal

1. Install dependency:

   ```bash
   npm install
   ```

2. Buat file `.env.local` di root project:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Jalankan schema database di Supabase SQL Editor:

   ```sql
   -- Lihat file supabase-schema.sql untuk schema lengkap.
   ```

4. Jalankan development server:

   ```bash
   npm run dev
   ```

5. Buka aplikasi di browser:

   ```text
   http://localhost:3000
   ```

## Konfigurasi Supabase

Schema database ada di `supabase-schema.sql`. File tersebut membuat tabel `committee_members` dengan kolom:

- `id`: UUID primary key.
- `division`: salah satu dari `perkamjin`, `pdd`, `acara`, atau `konkos`.
- `name`: nama anggota.
- `nim`: NIM anggota.
- `role`: `pj` atau `anggota`.
- `created_at`: waktu data dibuat.

Row Level Security sudah diaktifkan dengan policy untuk:

- Membaca semua data anggota.
- Menambahkan data baru hanya dengan role `anggota`.

Index unik `unique_member_per_division` mencegah NIM yang sama terdaftar dua kali di divisi yang sama.

## Script

```bash
npm run dev
```

Menjalankan development server.

```bash
npm run build
```

Membuat production build.

```bash
npm run start
```

Menjalankan production server setelah build.

```bash
npm run lint
```

Menjalankan ESLint.

## Struktur Project

```text
app/
  globals.css      Global style, token warna, animasi, dan Tailwind theme
  layout.tsx       Metadata, font, dan root layout
  page.tsx         Halaman utama
components/
  DivisionCard.tsx Kartu divisi, daftar anggota, progress slot, dan toast
  DivisionInfo.tsx Informasi tiap divisi
  GallerySection.tsx Galeri dokumentasi
  MemberForm.tsx   Form input anggota
lib/
  supabase.ts      Supabase client dan type CommitteeMember
supabase-schema.sql Schema database Supabase
```

## Catatan Pengembangan

- Daftar divisi utama didefinisikan di `app/page.tsx`, sedangkan deskripsi divisi ada di `components/DivisionInfo.tsx`.
- Kuota tampilan default per divisi ada di `components/DivisionCard.tsx` melalui konstanta `DEFAULT_QUOTA`.
- PJ divisi saat ini bersifat statis di `app/page.tsx`; anggota divisi diambil dari tabel Supabase.
- Galeri masih menggunakan placeholder. Ganti isi `galleryItems` dan markup gambar di `components/GallerySection.tsx` jika foto kegiatan sudah tersedia.

## Deployment

Aplikasi dapat dideploy ke Vercel atau platform lain yang mendukung Next.js. Pastikan environment variable berikut diset pada environment production:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
