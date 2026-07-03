import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GooNortheast",
  description: "Hidden Meghalaya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <nav className="flex justify-between items-center px-8 py-4 border-b">
          <h1 className="text-2xl font-bold">GooNortheast</h1>

          <div className="flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/hidden-meghalaya">Hidden Meghalaya</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/editor">Editor</Link>
          </div>
        </nav>

        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
