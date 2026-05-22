import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BikinKarya — Buktikan Kemampuanmu",
  description: "Simulasi pengalaman kerja nyata untuk fresh graduate Indonesia. Dapatkan brief, bangun portofolio, dan menangkan pekerjaan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-background text-foreground selection:bg-accent/20`}
      >
        {children}
      </body>
    </html>
  );
}
