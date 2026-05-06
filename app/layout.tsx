import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Makrab SI ITK 2023 - Struktur Kepanitiaan",
  description:
    "Website pendaftaran struktur kepanitiaan Makrab Sistem Informasi ITK Angkatan 2023. Bangun kebersamaan, isi peranmu, dan jadi bagian dari cerita kita.",
  keywords: ["makrab", "sistem informasi", "ITK", "2023", "kepanitiaan"],
  openGraph: {
    title: "Makrab SI ITK 2023 - Struktur Kepanitiaan",
    description:
      "Bangun kebersamaan, isi peranmu, dan jadi bagian dari cerita kita.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${lora.variable} antialiased`}
    >
      <body className="min-h-screen relative">{children}</body>
    </html>
  );
}
