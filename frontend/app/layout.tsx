import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShareVault — Instant Secure File Transfer",
  description:
    "Blazing-fast, peer-to-peer file sharing powered by socket technology",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased noise-overlay`}
      >
        {/* Mesh gradient background */}
        <div className="mesh-bg" />
        <div className="grid-pattern fixed inset-0 z-0 pointer-events-none" />
        {children}
      </body>
    </html>
  );
}