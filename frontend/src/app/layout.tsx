import Header from '@/components/Header';
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
        </Providers>
        <footer style={{ backgroundColor: '#121212', color: '#ffffff', padding: '60px 0', marginTop: '60px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', borderBottom: '1px solid #333', paddingBottom: '40px' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '20px', letterSpacing: '-0.5px' }}>TheGolfPress</h4>
                <p style={{ color: '#999', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  The definitive voice in golf, delivering real-time scores, expert instruction, and premium equipment reviews.
                </p>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sans-condensed)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px', color: '#666' }}>Scores</h4>
                <ul style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '2.2' }}>
                  <li><a href="#" className="footer-link">PGA TOUR</a></li>
                  <li><a href="#" className="footer-link">LIV GOLF</a></li>
                  <li><a href="#" className="footer-link">LPGA TOUR</a></li>
                  <li><a href="#" className="footer-link">DP WORLD TOUR</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sans-condensed)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px', color: '#666' }}>News & Features</h4>
                <ul style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '2.2' }}>
                  <li><a href="#" className="footer-link">LATEST HEADLINES</a></li>
                  <li><a href="#" className="footer-link">GEAR REVIEWS</a></li>
                  <li><a href="#" className="footer-link">INSTRUCTION</a></li>
                  <li><a href="#" className="footer-link">COURSE REVIEWS</a></li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-sans-condensed)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px', color: '#666' }}>Follow Us</h4>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>F</div>
                  <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>T</div>
                  <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>I</div>
                </div>
              </div>
            </div>
            <div style={{ paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#666', flexWrap: 'wrap', gap: '20px' }}>
              <span>&copy; {new Date().getFullYear()} TheGolfPress. All rights reserved. Do not sell my personal info.</span>
              <div style={{ display: 'flex', gap: '25px', fontFamily: 'var(--font-sans-condensed)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Preferences</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
