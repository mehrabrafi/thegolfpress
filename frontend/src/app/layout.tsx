import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MaintenanceGuard from '@/components/MaintenanceGuard';
import { Providers } from '@/components/Providers';
import './globals.css';
import { Playfair_Display, Oswald, Roboto } from 'next/font/google';
import type { Metadata } from 'next';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-sans-condensed', display: 'swap' });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thegolfpress.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Golf Press — Live Scores, News & Course Reviews',
    template: '%s | The Golf Press',
  },
  description: 'The definitive voice in golf. Get real-time PGA Tour scores, expert instruction, in-depth course reviews, and premium golf news from around the world.',
  keywords: ['golf', 'PGA Tour', 'golf news', 'golf scores', 'golf courses', 'golf rankings', 'golf tips', 'leaderboard', 'golf instruction'],
  authors: [{ name: 'The Golf Press Editorial Team' }],
  creator: 'The Golf Press',
  publisher: 'The Golf Press',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'The Golf Press',
    title: 'The Golf Press — Live Scores, News & Course Reviews',
    description: 'The definitive voice in golf. Get real-time PGA Tour scores, expert instruction, in-depth course reviews, and premium golf news.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Golf Press - Live Golf News & Leaderboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Golf Press — Live Scores, News & Course Reviews',
    description: 'The definitive voice in golf. Real-time scores, expert instruction, and premium golf news.',
    images: ['/og-image.jpg'],
    creator: '@thegolfpress',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add these when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${oswald.variable} ${roboto.variable}`}>
        <Providers>
          <MaintenanceGuard>
            <Header />
            <main style={{ minHeight: '80vh' }}>
              {children}
            </main>
            <Footer />
          </MaintenanceGuard>
        </Providers>
      </body>
    </html>
  )
}
