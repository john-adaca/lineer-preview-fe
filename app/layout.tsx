import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Lineer - Demo',
  description: 'Lineer demo application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-white">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-64">
            <Header />
            <main className="flex-1 overflow-auto pt-16">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

