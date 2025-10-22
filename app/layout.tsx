import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ScrollProgress from '../components/ui/ScrollProgress'
import { OnboardingProvider } from '../components/onboarding/OnboardingProvider'
import OnboardingTour from '../components/onboarding/OnboardingTour'
import { AuthProvider } from '../components/auth/AuthProvider'
import Navbar from '../components/ui/Navbar'
import StarfieldBackground from '../components/3d/StarfieldBackground'

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

export const metadata: Metadata = {
  title: "The Artisan’s Eye",
  description: "Mandala-inspired artifact minting experience",
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
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased h-full`}
      >
        <AuthProvider>
          <OnboardingProvider>
            <StarfieldBackground />
            <Navbar />
            <ScrollProgress />
            {children}
            <OnboardingTour />
          </OnboardingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
