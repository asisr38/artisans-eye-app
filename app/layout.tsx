import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Eleven-Headed Avalokiteshvara Thangka | The Artisan's Eye",
  description:
    "A black-and-gold Thousand-Armed Avalokiteshvara thangka from the Himalayan painting tradition.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${fraunces.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
