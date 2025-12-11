import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinkedIn Topics Generator - Streaming',
  description: 'Generate topics and perspectives from LinkedIn posts with real-time streaming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

