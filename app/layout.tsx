import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const jost = localFont({
  src: './fonts/jost.woff2',
  variable: '--font-jost',
  weight: '100 900',
  display: 'swap',
})
const bodoni = localFont({
  src: './fonts/bodoni.woff2',
  variable: '--font-bodoni',
  weight: '400 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Eleven-Headed Avalokiteshvara Thangka | The Artisan's Eye",
  description:
    'A black-and-gold Thousand-Armed Avalokiteshvara thangka from the Himalayan painting tradition.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${bodoni.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
