import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';
import './globals.css';
import { Playfair_Display, Oswald, Roboto } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-sans-condensed', display: 'swap' });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-sans', display: 'swap' });


export const metadata = {
  title: 'TheGolfPress - Live News & Leaderboard',
  description: 'Your ultimate source for real-time golf scores, news, and insights.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${oswald.variable} ${roboto.variable}`}>
        <Providers>
          <Header />
          <main style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
