import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lineer',
  description: 'Lineer Free application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-white">{children}</main>
      </body>
    </html>
  );
}
