 
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
  description: "Blazing-fast file sharing powered by socket technology",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrains.variable} antialiased noise-overlay`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {/* Background layers */}
        <div className="mesh-bg" aria-hidden="true" />
        <div
          className="grid-pattern fixed inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        />

        {/* Content above backgrounds */}
        <div className="relative" style={{ zIndex: 10 }}>
          {children}
        </div>
 
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        {children}
 
      </body>
    </html>
  );
}
