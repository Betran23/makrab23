# Makrab SI ITK 2023

Website pendaftaran struktur kepanitiaan Makrab Sistem Informasi ITK Angkatan 2023. Aplikasi ini menampilkan informasi divisi, dokumentasi kegiatan, dan formulir pengisian anggota kepanitiaan per divisi.

## Fitur

- Hero page untuk Makrab SI ITK 2023 dengan navigasi ke bagian divisi dan struktur.
- Galeri dokumentasi yang membaca foto dari bucket Supabase `gallery`.
- Halaman admin upload gallery dengan drag-and-drop, konversi WebP, dan kompresi otomatis.
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
- Project Supabase dengan akses SQL editor, anon public key, dan service role key

## Setup Lokal

1. Install dependency:

   ```bash
   npm install
   ```

2. Buat file `.env.local` di root project:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   GALLERY_UPLOAD_PASSWORD=your-gallery-upload-password
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

Bucket storage `gallery` dipakai untuk dokumentasi. Bucket harus bisa dibaca publik agar gambar dapat tampil dari public URL. Upload dilakukan lewat server route Next.js memakai `SUPABASE_SERVICE_ROLE_KEY`, jadi bucket tidak perlu diberi policy anon insert.

## Upload Gallery

Halaman upload ada di:

```text
http://localhost:3000/admin/gallery
```

Cara kerja:

- Drag-and-drop atau pilih beberapa file JPG, PNG, atau WebP.
- File diproses di browser menjadi WebP, sisi terpanjang maksimal 1280px, quality 0.72.
- Masukkan password sesuai `GALLERY_UPLOAD_PASSWORD`.
- Klik `Upload antrean`; setiap file akan diupload ke bucket `gallery`.
- Setelah upload, halaman utama akan membaca foto baru dari bucket untuk hero dan section dokumentasi.

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
  admin/gallery/   Halaman admin upload gallery
  api/gallery/     Route upload server-side ke Supabase Storage
  globals.css      Global style, token warna, animasi, dan Tailwind theme
  layout.tsx       Metadata, font, dan root layout
  page.tsx         Halaman utama
components/
  DivisionCard.tsx Kartu divisi, daftar anggota, progress slot, dan toast
  DivisionInfo.tsx Informasi tiap divisi
  GallerySection.tsx Galeri dokumentasi dari bucket Supabase
  GalleryUploader.tsx UI drag-and-drop, WebP compression, dan upload queue
  MemberForm.tsx   Form input anggota
lib/
  supabase-admin.ts Supabase service role client untuk server route
  supabase.ts      Supabase client dan type CommitteeMember
supabase-schema.sql Schema database Supabase
```

## Catatan Pengembangan

- Daftar divisi utama didefinisikan di `app/page.tsx`, sedangkan deskripsi divisi ada di `components/DivisionInfo.tsx`.
- Kuota tampilan default per divisi ada di `components/DivisionCard.tsx` melalui konstanta `DEFAULT_QUOTA`.
- PJ divisi saat ini bersifat statis di `app/page.tsx`; anggota divisi diambil dari tabel Supabase.
- `components/GallerySection.tsx` membaca daftar file langsung dari bucket `gallery`.

## Deployment

Aplikasi dapat dideploy ke Vercel atau platform lain yang mendukung Next.js. Pastikan environment variable berikut diset pada environment production:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GALLERY_UPLOAD_PASSWORD=your-gallery-upload-password
```
